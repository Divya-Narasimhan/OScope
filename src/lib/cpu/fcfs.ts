import { Process, SimulationResult, GanttSegment, ProcessMetric } from "./types";

export function simulateFCFS(processes: Process[]): SimulationResult {
  if (processes.length === 0) {
    return {
      algorithm: "First Come First Served (FCFS)",
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

  // Sort processes primarily by arrival time; tie-breaker is original index/name
  const sorted = [...processes].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    }
    return a.id.localeCompare(b.id);
  });

  const gantt: GanttSegment[] = [];
  const metrics: ProcessMetric[] = [];
  const logs: string[] = ["Starting FCFS scheduling..."];

  let currentTime = 0;
  let totalIdleTime = 0;

  for (const proc of sorted) {
    if (currentTime < proc.arrivalTime) {
      const idleDuration = proc.arrivalTime - currentTime;
      gantt.push({
        processId: "IDLE",
        processName: "IDLE",
        startTime: currentTime,
        endTime: proc.arrivalTime,
        color: "#374151",
      });
      logs.push(`Time ${currentTime}-${proc.arrivalTime}: CPU is IDLE waiting for ${proc.name}`);
      totalIdleTime += idleDuration;
      currentTime = proc.arrivalTime;
    }

    const startTime = currentTime;
    const completionTime = startTime + proc.burstTime;
    currentTime = completionTime;

    gantt.push({
      processId: proc.id,
      processName: proc.name,
      startTime,
      endTime: completionTime,
      color: proc.color,
    });

    const turnaroundTime = completionTime - proc.arrivalTime;
    const waitingTime = turnaroundTime - proc.burstTime;
    const responseTime = startTime - proc.arrivalTime;

    metrics.push({
      processId: proc.id,
      processName: proc.name,
      arrivalTime: proc.arrivalTime,
      burstTime: proc.burstTime,
      priority: proc.priority,
      completionTime,
      turnaroundTime,
      waitingTime,
      responseTime,
    });

    logs.push(
      `Time ${startTime}-${completionTime}: Process ${proc.name} executed (CT: ${completionTime}, TAT: ${turnaroundTime}, WT: ${waitingTime})`
    );
  }

  const totalTime = currentTime;
  const totalTAT = metrics.reduce((acc, m) => acc + m.turnaroundTime, 0);
  const totalWT = metrics.reduce((acc, m) => acc + m.waitingTime, 0);
  const totalRT = metrics.reduce((acc, m) => acc + m.responseTime, 0);
  const totalBusy = totalTime - totalIdleTime;

  return {
    algorithm: "First Come First Served (FCFS)",
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
