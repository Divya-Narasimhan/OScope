import { Process, SimulationResult, GanttSegment, ProcessMetric } from "./types";

interface RRTracker {
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

export function simulateRoundRobin(processes: Process[], timeQuantum: number): SimulationResult {
  if (processes.length === 0) {
    return {
      algorithm: `Round Robin (Quantum = ${timeQuantum})`,
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

  const quantum = Math.max(1, timeQuantum);
  const tracker: RRTracker[] = processes.map((p) => ({
    ...p,
    remainingTime: p.burstTime,
    firstStartTime: null,
    completionTime: null,
  }));

  // Sort initial arrival candidates to maintain deterministic queue order
  const arrivalList = [...tracker].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    return a.id.localeCompare(b.id);
  });

  const readyQueue: RRTracker[] = [];
  const arrivedSet = new Set<string>();
  const gantt: GanttSegment[] = [];
  const logs: string[] = [`Starting Round Robin scheduling with Time Quantum = ${quantum}...`];

  let currentTime = 0;
  let completedCount = 0;
  let totalIdleTime = 0;
  const n = processes.length;

  // Add initial arrivals at currentTime
  function checkArrivals(uptoTime: number) {
    for (const p of arrivalList) {
      if (!arrivedSet.has(p.id) && p.arrivalTime <= uptoTime) {
        readyQueue.push(p);
        arrivedSet.add(p.id);
        logs.push(`Time ${p.arrivalTime}: Process ${p.name} arrived and entered Ready Queue`);
      }
    }
  }

  checkArrivals(currentTime);

  while (completedCount < n) {
    if (readyQueue.length === 0) {
      // Find the next arrival
      const unarrived = arrivalList.filter((p) => !arrivedSet.has(p.id));
      if (unarrived.length > 0) {
        const nextArrival = Math.min(...unarrived.map((p) => p.arrivalTime));
        const idleDuration = nextArrival - currentTime;
        gantt.push({
          processId: "IDLE",
          processName: "IDLE",
          startTime: currentTime,
          endTime: nextArrival,
          color: "#374151",
        });
        logs.push(`Time ${currentTime}-${nextArrival}: CPU is IDLE waiting for arrival`);
        totalIdleTime += idleDuration;
        currentTime = nextArrival;
        checkArrivals(currentTime);
        continue;
      } else {
        break; // All processes finished
      }
    }

    const current = readyQueue.shift()!;

    if (current.firstStartTime === null) {
      current.firstStartTime = currentTime;
      logs.push(`Time ${currentTime}: Process ${current.name} first allocated CPU (Response Time: ${currentTime - current.arrivalTime})`);
    }

    const executionTime = Math.min(quantum, current.remainingTime);
    const startTime = currentTime;
    const endTime = currentTime + executionTime;
    currentTime = endTime;
    current.remainingTime -= executionTime;

    gantt.push({
      processId: current.id,
      processName: current.name,
      startTime,
      endTime,
      color: current.color,
    });

    // Check for processes that arrived during this quantum slice BEFORE re-queuing current
    checkArrivals(currentTime);

    if (current.remainingTime === 0) {
      current.completionTime = currentTime;
      completedCount++;
      const tat = current.completionTime - current.arrivalTime;
      const wt = tat - current.burstTime;
      logs.push(`Time ${currentTime}: Process ${current.name} completed (CT: ${currentTime}, TAT: ${tat}, WT: ${wt})`);
    } else {
      // Re-enqueue preempted process
      readyQueue.push(current);
      logs.push(`Time ${currentTime}: Quantum expired for ${current.name} (Remaining burst: ${current.remainingTime}), re-enqueued`);
    }
  }

  // Merge consecutive segments of the same process if any (e.g. if single process in queue)
  const consolidatedGantt: GanttSegment[] = [];
  for (const seg of gantt) {
    if (
      consolidatedGantt.length > 0 &&
      consolidatedGantt[consolidatedGantt.length - 1].processId === seg.processId &&
      consolidatedGantt[consolidatedGantt.length - 1].endTime === seg.startTime
    ) {
      consolidatedGantt[consolidatedGantt.length - 1].endTime = seg.endTime;
    } else {
      consolidatedGantt.push({ ...seg });
    }
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
    algorithm: `Round Robin (Quantum = ${quantum})`,
    gantt: consolidatedGantt,
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
