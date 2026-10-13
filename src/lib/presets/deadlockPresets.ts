import { BankersState } from "../deadlock/types";

export interface DeadlockPreset {
  id: string;
  title: string;
  description: string;
  state: BankersState;
  suggestedRequest?: {
    processIndex: number;
    request: number[];
    description: string;
  };
}

export const DEADLOCK_PRESETS: DeadlockPreset[] = [
  {
    id: "galvin_bankers_safe",
    title: "Galvin Benchmark (5 Processes, 3 Resource Types) - Safe State",
    description: "Standard OS textbook scenario with Resources A(10), B(5), C(7). Initial state has Available [3, 3, 2].",
    state: {
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
    },
    suggestedRequest: {
      processIndex: 1, // P1
      request: [1, 0, 2],
      description: "P1 requests [1, 0, 2] -> Safe! Request can be immediately granted.",
    },
  },
  {
    id: "unsafe_state_demo",
    title: "Unsafe State / Resource Exhaustion",
    description: "Scenario where Available resources are too low to satisfy any process's remaining Need, leading to an Unsafe State.",
    state: {
      processes: ["P0", "P1", "P2"],
      resourceTypes: ["R1", "R2"],
      available: [1, 0],
      allocation: [
        [2, 1], // P0
        [1, 2], // P1
        [1, 1], // P2
      ],
      max: [
        [4, 3], // P0
        [3, 4], // P1
        [3, 2], // P2
      ],
      need: [
        [2, 2], // P0
        [2, 2], // P1
        [2, 1], // P2
      ],
    },
    suggestedRequest: {
      processIndex: 0,
      request: [1, 0],
      description: "P0 requests [1, 0] -> Leads directly to Unsafe state! Must be denied.",
    },
  },
];
