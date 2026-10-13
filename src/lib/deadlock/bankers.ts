import {
  BankersState,
  SafetyCheckResult,
  SafetyStep,
  ResourceRequestResult,
} from "./types";

export function calculateNeedMatrix(
  max: number[][],
  allocation: number[][]
): number[][] {
  return max.map((row, i) =>
    row.map((maxVal, j) => Math.max(0, maxVal - (allocation[i]?.[j] ?? 0)))
  );
}

export function validateBankersState(
  state: BankersState
): { valid: boolean; error?: string } {
  const n = state.processes.length;
  const m = state.resourceTypes.length;

  if (n === 0) return { valid: false, error: "At least one process must be defined." };
  if (m === 0) return { valid: false, error: "At least one resource type must be defined." };
  if (state.available.length !== m) {
    return { valid: false, error: `Available vector length (${state.available.length}) must match resource count (${m}).` };
  }
  if (state.max.length !== n || state.allocation.length !== n) {
    return { valid: false, error: "Matrix row count must match process count." };
  }

  for (let i = 0; i < n; i++) {
    if (state.max[i].length !== m || state.allocation[i].length !== m) {
      return { valid: false, error: `Row ${i} length must match resource count (${m}).` };
    }
    for (let j = 0; j < m; j++) {
      if (state.allocation[i][j] < 0 || state.max[i][j] < 0) {
        return { valid: false, error: `Negative values not allowed at process ${state.processes[i]}, resource ${state.resourceTypes[j]}.` };
      }
      if (state.allocation[i][j] > state.max[i][j]) {
        return {
          valid: false,
          error: `Inconsistent state: Process ${state.processes[i]} has Allocation[${state.resourceTypes[j]}]=${state.allocation[i][j]} which exceeds Max claim=${state.max[i][j]}.`,
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Banker's Safety Algorithm
 * Finds if system is in a safe state and returns safe sequence.
 */
export function checkSafety(state: BankersState): SafetyCheckResult {
  const validation = validateBankersState(state);
  if (!validation.valid) {
    return {
      isSafe: false,
      safeSequence: [],
      steps: [],
      finalWork: [...state.available],
      unfinishedProcesses: [...state.processes],
      logs: [`Validation Error: ${validation.error}`],
    };
  }

  const n = state.processes.length;
  const m = state.resourceTypes.length;
  const need = calculateNeedMatrix(state.max, state.allocation);

  const work = [...state.available];
  const finish = Array(n).fill(false);
  const safeSequence: string[] = [];
  const steps: SafetyStep[] = [];
  const logs: string[] = [
    `Initiating Safety Algorithm with Available Work = [${work.join(", ")}]`,
  ];

  let foundEligible = true;
  let stepIndex = 1;

  while (foundEligible && safeSequence.length < n) {
    foundEligible = false;

    for (let i = 0; i < n; i++) {
      if (!finish[i]) {
        // Check if Need[i] <= Work
        const canFinish = need[i].every((needVal, j) => needVal <= work[j]);

        if (canFinish) {
          const workBefore = [...work];
          // Work = Work + Allocation[i]
          for (let j = 0; j < m; j++) {
            work[j] += state.allocation[i][j];
          }
          finish[i] = true;
          safeSequence.push(state.processes[i]);
          foundEligible = true;

          const explanation = `Process ${state.processes[i]} can be satisfied: Need [${need[i].join(", ")}] <= Work [${workBefore.join(", ")}]. After running, releases allocated [${state.allocation[i].join(", ")}]. New Work = [${work.join(", ")}].`;

          steps.push({
            stepIndex: stepIndex++,
            processId: state.processes[i],
            processIndex: i,
            workBefore,
            need: [...need[i]],
            allocation: [...state.allocation[i]],
            workAfter: [...work],
            explanation,
          });

          logs.push(`Step ${stepIndex - 1}: ${explanation}`);
          break; // restart scan to find next eligible
        }
      }
    }
  }

  const isSafe = safeSequence.length === n;
  const unfinishedProcesses = state.processes.filter((_, idx) => !finish[idx]);

  if (isSafe) {
    logs.push(
      `✓ System is in a SAFE STATE! Safe Sequence: < ${safeSequence.join(" -> ")} >`
    );
  } else {
    logs.push(
      `✗ System is in an UNSAFE STATE! No complete safe sequence found. Unfinished processes: ${unfinishedProcesses.join(", ")}.`
    );
  }

  return {
    isSafe,
    safeSequence,
    steps,
    finalWork: work,
    unfinishedProcesses,
    logs,
  };
}

/**
 * Banker's Resource-Request Algorithm
 */
export function processResourceRequest(
  state: BankersState,
  processIndex: number,
  request: number[]
): ResourceRequestResult {
  const pName = state.processes[processIndex];
  const m = state.resourceTypes.length;
  const need = calculateNeedMatrix(state.max, state.allocation);

  // 1. Condition: Request <= Need
  for (let j = 0; j < m; j++) {
    if (request[j] > need[processIndex][j]) {
      return {
        status: "REJECTED_EXCEEDS_NEED",
        processId: pName,
        request,
        message: `Error: Process ${pName} requested ${request[j]} of Resource ${state.resourceTypes[j]}, which exceeds its declared remaining Need (${need[processIndex][j]}).`,
      };
    }
  }

  // 2. Condition: Request <= Available
  for (let j = 0; j < m; j++) {
    if (request[j] > state.available[j]) {
      return {
        status: "WAIT_UNAVAILABLE",
        processId: pName,
        request,
        message: `Process ${pName} must wait: Resource ${state.resourceTypes[j]} requested (${request[j]}) exceeds currently Available (${state.available[j]}).`,
      };
    }
  }

  // 3. Tentative Allocation
  const tentativeAvailable = state.available.map((av, j) => av - request[j]);
  const tentativeAllocation = state.allocation.map((row, i) =>
    i === processIndex ? row.map((alloc, j) => alloc + request[j]) : [...row]
  );
  const tentativeMax = state.max.map((row) => [...row]);
  const tentativeNeed = calculateNeedMatrix(tentativeMax, tentativeAllocation);

  const tentativeState: BankersState = {
    processes: [...state.processes],
    resourceTypes: [...state.resourceTypes],
    available: tentativeAvailable,
    allocation: tentativeAllocation,
    max: tentativeMax,
    need: tentativeNeed,
  };

  // 4. Safety Check on Tentative State
  const safetyResult = checkSafety(tentativeState);

  if (safetyResult.isSafe) {
    return {
      status: "GRANTED",
      processId: pName,
      request,
      message: `✓ Request GRANTED! Tentative allocation yields a SAFE state. New Safe Sequence: < ${safetyResult.safeSequence.join(" -> ")} >.`,
      safetyCheck: safetyResult,
      updatedState: tentativeState,
    };
  } else {
    return {
      status: "REJECTED_UNSAFE",
      processId: pName,
      request,
      message: `✗ Request REJECTED: Granting request would transition system into an UNSAFE state. Allocation rolled back. Process ${pName} must wait.`,
      safetyCheck: safetyResult,
    };
  }
}
