export interface BankersState {
  processes: string[];        // e.g. ["P0", "P1", "P2", "P3", "P4"]
  resourceTypes: string[];    // e.g. ["A", "B", "C"]
  available: number[];        // [3, 3, 2]
  max: number[][];            // n x m
  allocation: number[][];     // n x m
  need: number[][];           // n x m: Max[i][j] - Allocation[i][j]
}

export interface SafetyStep {
  stepIndex: number;
  processId: string;
  processIndex: number;
  workBefore: number[];
  need: number[];
  allocation: number[];
  workAfter: number[];
  explanation: string;
}

export interface SafetyCheckResult {
  isSafe: boolean;
  safeSequence: string[];
  steps: SafetyStep[];
  finalWork: number[];
  unfinishedProcesses: string[];
  logs: string[];
}

export type RequestStatus =
  | "GRANTED"
  | "WAIT_UNAVAILABLE"
  | "REJECTED_EXCEEDS_NEED"
  | "REJECTED_UNSAFE";

export interface ResourceRequestResult {
  status: RequestStatus;
  processId: string;
  request: number[];
  message: string;
  safetyCheck?: SafetyCheckResult;
  updatedState?: BankersState;
}
