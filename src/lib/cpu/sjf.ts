import { Process, SimulationResult, GanttSegment, ProcessMetric } from "./types";

export function simulateSJFNonPreemptive(processes: Process[]): SimulationResult {
  if (processes.length === 0) {
    return {
      algorithm: "Shortest Job First (Non-Preemptive)",
      gantt: [],
      metrics: [],
      avgTurnaroundTime: 0,
      avgWaitingTime: 0,
      avgResponseTime: 0,
      cpuUtilization: 0,
      throughput: 0,
      totalTime: 0,
      idleTime: 0,
      logs: ["No processes provided to schedule."],
    };
  }

  const remaining = processes.map((p) => ({ ...p }));
  const completed: ProcessMetric[] = [];
  const gantt: GanttSegment[] = [];
  const logs: string[] = ["Starting SJF (Non-Preemptive) scheduling..."];

  let currentTime = 0;
  let totalIdleTime = 0;

  while (completed.length < processes.length) {
    // Filter processes that have arrived by currentTime
    const available = remaining.filter((p) => p.arrivalTime <= currentTime);

    if (available.length === 0) {
      // Find the next closest arrival time
      const nextArrival = Math.min(...remaining.map((p) => p.arrivalTime));
      gantt.push({
        processId: "IDLE",
        processName: "IDLE",
        startTime: currentTime,
        endTime: nextArrival,
        color: "#374151",
      });
      logs.push(`Time ${currentTime}-${nextArrival}: CPU is IDLE waiting for arrival`);
      totalIdleTime += nextArrival - currentTime;
      currentTime = nextArrival;
      continue;
    }

    // Pick process with shortest burst time; tie breaker: arrival time, then id
    available.sort((a, b) => {
      if (a.burstTime !== b.burstTime) return a.burstTime - b.burstTime;
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return a.id.localeCompare(b.id);
    });

    const selected = available[0];
    const startTime = currentTime;
    const completionTime = startTime + selected.burstTime;
    currentTime = completionTime;

    gantt.push({
      processId: selected.id,
      processName: selected.name,
      startTime,
      endTime: completionTime,
      color: selected.color,
    });

    const turnaroundTime = completionTime - selected.arrivalTime;
    const waitingTime = turnaroundTime - selected.burstTime;
    const responseTime = startTime - selected.arrivalTime;

    completed.push({
      processId: selected.id,
      processName: selected.name,
      arrivalTime: selected.arrivalTime,
      burstTime: selected.burstTime,
      priority: selected.priority,
      completionTime,
      turnaroundTime,
      waitingTime,
      responseTime,
    });

    logs.push(
      `Time ${startTime}-${completionTime}: Process ${selected.name} executed (Burst: ${selected.burstTime}, TAT: ${turnaroundTime}, WT: ${waitingTime})`
    );

    // Remove from remaining
    const idx = remaining.findIndex((p) => p.id === selected.id);
    if (idx !== -1) remaining.splice(idx, 1);
  }

  // Sort metrics according to original input order for consistent table display
  const metrics = processes.map((p) => completed.find((c) => c.processId === p.id)!);

  const totalTime = currentTime;
  const totalTAT = metrics.reduce((acc, m) => acc + m.turnaroundTime, 0);
  const totalWT = metrics.reduce((acc, m) => acc + m.waitingTime, 0);
  const totalRT = metrics.reduce((acc, m) => acc + m.responseTime, 0);
  const totalBusy = totalTime - totalIdleTime;

  return {
    algorithm: "Shortest Job First (Non-Preemptive)",
    gantt,
    metrics,
    avgTurnaroundTime: parseFloat((totalTAT / processes.length).toFixed(2)),
    avgWaitingTime: parseFloat((totalWT / processes.length).toFixed(2)),
    avgResponseTime: parseFloat((totalRT / processes.length).toFixed(2)),
    cpuUtilization: totalTime > 0 ? parseFloat(((totalBusy / totalTime) * 100).toFixed(2)) : 0,
    throughput: totalTime > 0 ? parseFloat((processes.length / totalTime).toFixed(4)) : 0,
    totalTime,
    idleTime: totalIdleTime,
    logs,
  };
}
