import { Process } from "../cpu/types";

export interface CpuPreset {
  id: string;
  title: string;
  description: string;
  timeQuantum?: number;
  processes: Process[];
}

export const CPU_PRESETS: CpuPreset[] = [
  {
    id: "galvin_standard",
    title: "Galvin Benchmark (4 Processes with Arrivals)",
    description: "Classic textbook example demonstrating preemption and arrival order differences.",
    timeQuantum: 2,
    processes: [
      { id: "P1", name: "P1", arrivalTime: 0, burstTime: 8, priority: 3, color: "#06b6d4" },
      { id: "P2", name: "P2", arrivalTime: 1, burstTime: 4, priority: 1, color: "#8b5cf6" },
      { id: "P3", name: "P3", arrivalTime: 2, burstTime: 9, priority: 4, color: "#10b981" },
      { id: "P4", name: "P4", arrivalTime: 3, burstTime: 5, priority: 2, color: "#f59e0b" },
    ],
  },
  {
    id: "idle_periods",
    title: "Sparse Arrivals with CPU Idle Gaps",
    description: "Evaluates scheduler behavior when the CPU must idle between process arrivals.",
    timeQuantum: 3,
    processes: [
      { id: "P1", name: "P1", arrivalTime: 0, burstTime: 3, priority: 2, color: "#06b6d4" },
      { id: "P2", name: "P2", arrivalTime: 6, burstTime: 4, priority: 1, color: "#8b5cf6" },
      { id: "P3", name: "P3", arrivalTime: 13, burstTime: 2, priority: 3, color: "#10b981" },
    ],
  },
  {
    id: "convoy_effect",
    title: "Convoy Effect Demonstration",
    description: "A huge CPU burst job arrives first, causing long waiting times in FCFS.",
    timeQuantum: 4,
    processes: [
      { id: "P1", name: "P1 (Heavy)", arrivalTime: 0, burstTime: 24, priority: 3, color: "#f43f5e" },
      { id: "P2", name: "P2 (Quick)", arrivalTime: 1, burstTime: 3, priority: 1, color: "#10b981" },
      { id: "P3", name: "P3 (Quick)", arrivalTime: 2, burstTime: 3, priority: 2, color: "#06b6d4" },
    ],
  },
  {
    id: "priority_stress",
    title: "Priority Preemption & Starvation",
    description: "High priority jobs arrive dynamically, demonstrating preemption against lower priority jobs.",
    timeQuantum: 2,
    processes: [
      { id: "P1", name: "P1 (Low)", arrivalTime: 0, burstTime: 10, priority: 5, color: "#64748b" },
      { id: "P2", name: "P2 (High)", arrivalTime: 2, burstTime: 3, priority: 1, color: "#8b5cf6" },
      { id: "P3", name: "P3 (Med)", arrivalTime: 4, burstTime: 4, priority: 2, color: "#06b6d4" },
      { id: "P4", name: "P4 (Highest)", arrivalTime: 5, burstTime: 2, priority: 1, color: "#10b981" },
    ],
  },
];
