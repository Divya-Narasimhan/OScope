import { Process, SimulationResult, GanttSegment, ProcessMetric } from "./types";

/**
 * Priority Scheduling (Lower integer = Higher priority)
 * Tie-breaker: Earliest arrival time, then process ID
 */
export function simulatePriorityNonPreemptive(processes: Process[]): SimulationResult {
  if (processes.length === 0) {
    return {
      algorithm: "Priority Scheduling (Non-Preemptive)",
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
  const logs: string[] = ["Starting Priority (Non-Preemptive) scheduling [Lower integer = Higher Priority]..."];

  let currentTime = 0;
  let totalIdleTime = 0;

  while (completed.length < processes.length) {
    const available = remaining.filter((p) => p.arrivalTime <= currentTime);

    if (available.length === 0) {
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

    // Sort by priority (ascending: lower number = higher priority), then arrival time, then id
    available.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
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
      `Time ${startTime}-${completionTime}: Process ${selected.name} executed (Priority: ${selected.priority}, Burst: ${selected.burstTime}, TAT: ${turnaroundTime}, WT: ${waitingTime})`
    );

    const idx = remaining.findIndex((p) => p.id === selected.id);
    if (idx !== -1) remaining.splice(idx, 1);
  }

  const metrics = processes.map((p) => completed.find((c) => c.processId === p.id)!);
  const totalTime = currentTime;
  const totalTAT = metrics.reduce((acc, m) => acc + m.turnaroundTime, 0);
  const totalWT = metrics.reduce((acc, m) => acc + m.waitingTime, 0);
  const totalRT = metrics.reduce((acc, m) => acc + m.responseTime, 0);
  const totalBusy = totalTime - totalIdleTime;

  return {
    algorithm: "Priority Scheduling (Non-Preemptive)",
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

export function simulatePriorityPreemptive(processes: Process[]): SimulationResult {
  if (processes.length === 0) {
    return {
      algorithm: "Priority Scheduling (Preemptive)",
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

  interface PriorityTracker {
    id: string;
    name: string;
    arrivalTime: number;
    burstTime: number;
    priority: number;
    remainingTime: number;
    firstStartTime: number | null;
    completionTime: number | null;
    color?: string;
  }

  const tracker: PriorityTracker[] = processes.map((p) => ({
    ...p,
    remainingTime: p.burstTime,
    firstStartTime: null,
    completionTime: null,
  }));

  const logs: string[] = ["Starting Priority (Preemptive) scheduling [Lower integer = Higher Priority]..."];
  const rawTimeline: { time: number; processId: string | "IDLE"; name: string; color?: string }[] = [];

  let currentTime = 0;
  let completedCount = 0;
  let totalIdleTime = 0;
  const n = processes.length;

  while (completedCount < n) {
    const available = tracker.filter((p) => p.arrivalTime <= currentTime && p.remainingTime > 0);

    if (available.length === 0) {
      const unarrived = tracker.filter((p) => p.remainingTime > 0);
      const nextArrival = Math.min(...unarrived.map((p) => p.arrivalTime));

      for (let t = currentTime; t < nextArrival; t++) {
        rawTimeline.push({ time: t, processId: "IDLE", name: "IDLE", color: "#374151" });
        totalIdleTime++;
      }
      logs.push(`Time ${currentTime}-${nextArrival}: CPU is IDLE waiting for arrival`);
      currentTime = nextArrival;
      continue;
    }

    // Sort by priority (ascending), then arrival, then id
    available.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return a.id.localeCompare(b.id);
    });

    const current = available[0];

    if (current.firstStartTime === null) {
      current.firstStartTime = currentTime;
      logs.push(`Time ${currentTime}: Process ${current.name} (Priority ${current.priority}) started execution`);
    }

    rawTimeline.push({
      time: currentTime,
      processId: current.id,
      name: current.name,
      color: current.color,
    });

    current.remainingTime--;
    currentTime++;

    if (current.remainingTime === 0) {
      current.completionTime = currentTime;
      completedCount++;
      const tat = current.completionTime - current.arrivalTime;
      const wt = tat - current.burstTime;
      logs.push(`Time ${currentTime}: Process ${current.name} completed (CT: ${currentTime}, TAT: ${tat}, WT: ${wt})`);
    }
  }

  // Compress into Gantt segments
  const gantt: GanttSegment[] = [];
  if (rawTimeline.length > 0) {
    let currentSeg: GanttSegment = {
      processId: rawTimeline[0].processId,
      processName: rawTimeline[0].name,
      startTime: rawTimeline[0].time,
      endTime: rawTimeline[0].time + 1,
      color: rawTimeline[0].color,
    };

    for (let i = 1; i < rawTimeline.length; i++) {
      const unit = rawTimeline[i];
      if (unit.processId === currentSeg.processId) {
        currentSeg.endTime = unit.time + 1;
      } else {
        gantt.push({ ...currentSeg });
        currentSeg = {
          processId: unit.processId,
          processName: unit.name,
          startTime: unit.time,
          endTime: unit.time + 1,
          color: unit.color,
        };
      }
    }
    gantt.push({ ...currentSeg });
  }

  const metrics: ProcessMetric[] = tracker.map((t) => {
    const ct = t.completionTime ?? currentTime;
    const tat = ct - t.arrivalTime;
    const wt = tat - t.burstTime;
    const rt = (t.firstStartTime ?? t.arrivalTime) - t.arrivalTime;

    return {
      processId: t.id,
      processName: t.name,
      arrivalTime: t.arrivalTime,
      burstTime: t.burstTime,
      priority: t.priority,
      completionTime: ct,
      turnaroundTime: tat,
      waitingTime: wt,
      responseTime: rt,
    };
  });

  const totalTime = currentTime;
  const totalTAT = metrics.reduce((acc, m) => acc + m.turnaroundTime, 0);
  const totalWT = metrics.reduce((acc, m) => acc + m.waitingTime, 0);
  const totalRT = metrics.reduce((acc, m) => acc + m.responseTime, 0);
  const totalBusy = totalTime - totalIdleTime;

  return {
    algorithm: "Priority Scheduling (Preemptive)",
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
