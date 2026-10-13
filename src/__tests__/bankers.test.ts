import { describe, it, expect } from "vitest";
import { checkSafety, processResourceRequest, calculateNeedMatrix } from "../lib/deadlock/bankers";
import { BankersState } from "../lib/deadlock/types";

describe("Banker's Algorithm & Resource Allocation", () => {
  const galvinSafeState: BankersState = {
    processes: ["P0", "P1", "P2", "P3", "P4"],
    resourceTypes: ["A", "B", "C"],
    available: [3, 3, 2],
    allocation: [
      [0, 1, 0], // P0
      [2, 0, 0], // P1
      [3, 0, 2], // P2
      [2, 1, 1], // P3
      [0, 0, 2], // P4
    ],
    max: [
      [7, 5, 3], // P0
      [3, 2, 2], // P1
      [9, 0, 2], // P2
      [2, 2, 2], // P3
      [4, 3, 3], // P4
    ],
    need: [
      [7, 4, 3], // P0
      [1, 2, 2], // P1
      [6, 0, 0], // P2
      [0, 1, 1], // P3
      [4, 3, 1], // P4
    ],
  };

  it("calculates Need Matrix correctly as Max - Allocation", () => {
    const computedNeed = calculateNeedMatrix(galvinSafeState.max, galvinSafeState.allocation);
    expect(computedNeed).toEqual(galvinSafeState.need);
  });

  it("identifies Safe State and generates complete Safe Sequence", () => {
    const res = checkSafety(galvinSafeState);
    expect(res.isSafe).toBe(true);
    expect(res.safeSequence.length).toBe(5);
    // P1 must be able to run first since Need [1, 2, 2] <= Work [3, 3, 2]
    expect(res.safeSequence[0]).toBe("P1");
    expect(res.unfinishedProcesses.length).toBe(0);
  });

  it("grants valid request when tentative state remains safe", () => {
    // P1 requests [1, 0, 2]
    const res = processResourceRequest(galvinSafeState, 1, [1, 0, 2]);
    expect(res.status).toBe("GRANTED");
    expect(res.updatedState).toBeDefined();
    // After granting: available should be [3-1, 3-0, 2-2] = [2, 3, 0]
    expect(res.updatedState?.available).toEqual([2, 3, 0]);
  });

  it("rejects request that exceeds process maximum claim Need", () => {
    // P0 remaining need is [7, 4, 3]. Request [8, 0, 0] should be rejected.
    const res = processResourceRequest(galvinSafeState, 0, [8, 0, 0]);
    expect(res.status).toBe("REJECTED_EXCEEDS_NEED");
  });

  it("forces process to wait if request exceeds currently available resources", () => {
    // Available is [3, 3, 2]. P0 requests [4, 0, 0] (<= need [7, 4, 3] but > available).
    const res = processResourceRequest(galvinSafeState, 0, [4, 0, 0]);
    expect(res.status).toBe("WAIT_UNAVAILABLE");
  });

  it("detects unsafe state when Available resources cannot satisfy any remaining processes", () => {
    const unsafeState: BankersState = {
      processes: ["P0", "P1"],
      resourceTypes: ["R1", "R2"],
      available: [0, 0],
      allocation: [
        [2, 1],
        [1, 2],
      ],
      max: [
        [3, 2],
        [2, 3],
      ],
      need: [
        [1, 1],
        [1, 1],
      ],
    };
    const res = checkSafety(unsafeState);
    expect(res.isSafe).toBe(false);
    expect(res.safeSequence.length).toBe(0);
    expect(res.unfinishedProcesses.length).toBe(2);
  });
});
