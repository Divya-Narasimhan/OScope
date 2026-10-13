export type ProcessLifecycleState =
  | "NEW"
  | "READY"
  | "RUNNING"
  | "WAITING"
  | "TERMINATED";

export interface SystemProcess {
  pid: number;
  name: string;
  state: ProcessLifecycleState;
  priority: number;
  burstTime: number;
  remainingTime: number;
  memorySize: number; // in KB
  resourcesAllocated: string[];
  createdAt: number;
  lastStateChange: number;
}

export interface StateTransitionEvent {
  timestamp: number;
  pid: number;
  processName: string;
  fromState: ProcessLifecycleState;
  toState: ProcessLifecycleState;
  reason: string;
}
