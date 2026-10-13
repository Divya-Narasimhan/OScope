import {
  SystemProcess,
  ProcessLifecycleState,
  StateTransitionEvent,
} from "./types";

export const INITIAL_SYSTEM_PROCESSES: SystemProcess[] = [
  {
    pid: 101,
    name: "init_system",
    state: "RUNNING",
    priority: 1,
    burstTime: 20,
    remainingTime: 12,
    memorySize: 64,
    resourcesAllocated: ["MEM_BASE", "CPU_CORE_0"],
    createdAt: 0,
    lastStateChange: 0,
  },
  {
    pid: 102,
    name: "db_postgres",
    state: "READY",
    priority: 2,
    burstTime: 15,
    remainingTime: 15,
    memorySize: 256,
    resourcesAllocated: ["MEM_BLOCK_1", "DISK_I_O"],
    createdAt: 10,
    lastStateChange: 10,
  },
  {
    pid: 103,
    name: "nginx_proxy",
    state: "WAITING",
    priority: 3,
    burstTime: 10,
    remainingTime: 6,
    memorySize: 128,
    resourcesAllocated: ["PORT_80"],
    createdAt: 15,
    lastStateChange: 25,
  },
  {
    pid: 104,
    name: "rust_compiler",
    state: "READY",
    priority: 5,
    burstTime: 30,
    remainingTime: 28,
    memorySize: 512,
    resourcesAllocated: [],
    createdAt: 20,
    lastStateChange: 20,
  },
  {
    pid: 105,
    name: "syslog_daemon",
    state: "TERMINATED",
    priority: 8,
    burstTime: 8,
    remainingTime: 0,
    memorySize: 32,
    resourcesAllocated: [],
    createdAt: 0,
    lastStateChange: 35,
  },
];

export function canTransition(
  from: ProcessLifecycleState,
  to: ProcessLifecycleState
): boolean {
  if (to === "TERMINATED") return from !== "TERMINATED";
  switch (from) {
    case "NEW":
      return to === "READY";
    case "READY":
      return to === "RUNNING";
    case "RUNNING":
      return to === "READY" || to === "WAITING";
    case "WAITING":
      return to === "READY";
    case "TERMINATED":
      return false;
    default:
      return false;
  }
}

export function getTransitionReason(
  from: ProcessLifecycleState,
  to: ProcessLifecycleState
): string {
  if (to === "TERMINATED") return "Process exited or killed by administrator";
  if (from === "NEW" && to === "READY") return "Admitted to ready queue by long-term scheduler";
  if (from === "READY" && to === "RUNNING") return "Dispatched to CPU core by short-term scheduler";
  if (from === "RUNNING" && to === "READY") return "Preempted due to timer interrupt / quantum expiration";
  if (from === "RUNNING" && to === "WAITING") return "Blocked waiting for I/O event or resource lock";
  if (from === "WAITING" && to === "READY") return "I/O operation completed, moved back to ready queue";
  return "State transition";
}
