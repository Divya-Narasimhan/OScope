export interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number; // lower number = higher priority OR configurable
  color?: string;
}

export interface GanttSegment {
  processId: string | "IDLE";
  processName: string;
  startTime: number;
  endTime: number;
  color?: string;
}

export interface ProcessMetric {
  processId: string;
  processName: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  completionTime: number;
  turnaroundTime: number; // CT - AT
  waitingTime: number;    // TAT - BT
  responseTime: number;   // First execution time - AT
}

export interface SimulationResult {
  algorithm: string;
  gantt: GanttSegment[];
  metrics: ProcessMetric[];
  avgTurnaroundTime: number;
  avgWaitingTime: number;
  avgResponseTime: number;
  cpuUtilization: number; // (busyTime / totalTime) * 100
  throughput: number;     // processes / totalTime
  totalTime: number;
  idleTime: number;
  logs: string[];
}

export type SchedulingAlgorithm =
  | "FCFS"
  | "SJF_NON_PREEMPTIVE"
  | "SRTF_PREEMPTIVE"
  | "PRIORITY_NON_PREEMPTIVE"
  | "PRIORITY_PREEMPTIVE"
  | "ROUND_ROBIN";
