import { Process, SchedulingAlgorithm, SimulationResult } from "./types";
import { simulateFCFS } from "./fcfs";
import { simulateSJFNonPreemptive } from "./sjf";
import { simulateSRTFPreemptive } from "./srtf";
import { simulatePriorityNonPreemptive, simulatePriorityPreemptive } from "./priority";
import { simulateRoundRobin } from "./roundRobin";

export function runCpuSimulation(
  algorithm: SchedulingAlgorithm,
  processes: Process[],
  options?: { timeQuantum?: number }
): SimulationResult {
  switch (algorithm) {
    case "FCFS":
      return simulateFCFS(processes);
    case "SJF_NON_PREEMPTIVE":
      return simulateSJFNonPreemptive(processes);
    case "SRTF_PREEMPTIVE":
      return simulateSRTFPreemptive(processes);
    case "PRIORITY_NON_PREEMPTIVE":
      return simulatePriorityNonPreemptive(processes);
    case "PRIORITY_PREEMPTIVE":
      return simulatePriorityPreemptive(processes);
    case "ROUND_ROBIN":
      return simulateRoundRobin(processes, options?.timeQuantum ?? 2);
    default:
      return simulateFCFS(processes);
  }
}

export interface ComparisonResult {
  algorithm: SchedulingAlgorithm;
  algorithmName: string;
  result: SimulationResult;
}

export function compareAllCpuAlgorithms(
  processes: Process[],
  timeQuantum: number = 2
): ComparisonResult[] {
  const algorithms: { key: SchedulingAlgorithm; name: string }[] = [
    { key: "FCFS", name: "First Come First Served" },
    { key: "SJF_NON_PREEMPTIVE", name: "Shortest Job First (Non-Preemptive)" },
    { key: "SRTF_PREEMPTIVE", name: "Shortest Remaining Time First" },
    { key: "PRIORITY_NON_PREEMPTIVE", name: "Priority (Non-Preemptive)" },
    { key: "PRIORITY_PREEMPTIVE", name: "Priority (Preemptive)" },
    { key: "ROUND_ROBIN", name: `Round Robin (Q = ${timeQuantum})` },
  ];

  return algorithms.map((algo) => ({
    algorithm: algo.key,
    algorithmName: algo.name,
    result: runCpuSimulation(algo.key, processes, { timeQuantum }),
  }));
}
