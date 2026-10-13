import { describe, it, expect } from "vitest";
import { simulateFCFS } from "../lib/cpu/fcfs";
import { simulateSJFNonPreemptive } from "../lib/cpu/sjf";
import { simulateSRTFPreemptive } from "../lib/cpu/srtf";
import { simulatePriorityNonPreemptive, simulatePriorityPreemptive } from "../lib/cpu/priority";
import { simulateRoundRobin } from "../lib/cpu/roundRobin";
import { Process } from "../lib/cpu/types";

describe("CPU Scheduling Algorithms", () => {
  const benchmarkProcesses: Process[] = [
    { id: "P1", name: "P1", arrivalTime: 0, burstTime: 8, priority: 3 },
    { id: "P2", name: "P2", arrivalTime: 1, burstTime: 4, priority: 1 },
    { id: "P3", name: "P3", arrivalTime: 2, burstTime: 9, priority: 4 },
    { id: "P4", name: "P4", arrivalTime: 3, burstTime: 5, priority: 2 },
  ];

  it("FCFS calculates correct completion, turnaround and waiting times", () => {
    const res = simulateFCFS(benchmarkProcesses);
    expect(res.gantt.length).toBe(4);
    // P1: starts 0, ends 8. TAT = 8 - 0 = 8. WT = 0.
    // P2: starts 8, ends 12. TAT = 12 - 1 = 11. WT = 11 - 4 = 7.
    // P3: starts 12, ends 21. TAT = 21 - 2 = 19. WT = 19 - 9 = 10.
    // P4: starts 21, ends 26. TAT = 26 - 3 = 23. WT = 23 - 5 = 18.
    const p1 = res.metrics.find((m) => m.processId === "P1")!;
    const p2 = res.metrics.find((m) => m.processId === "P2")!;
    const p3 = res.metrics.find((m) => m.processId === "P3")!;
    const p4 = res.metrics.find((m) => m.processId === "P4")!;

    expect(p1.completionTime).toBe(8);
    expect(p1.waitingTime).toBe(0);

    expect(p2.completionTime).toBe(12);
    expect(p2.waitingTime).toBe(7);

    expect(p3.completionTime).toBe(21);
    expect(p3.waitingTime).toBe(10);

    expect(p4.completionTime).toBe(26);
    expect(p4.waitingTime).toBe(18);

    expect(res.totalTime).toBe(26);
    expect(res.idleTime).toBe(0);
    expect(res.avgWaitingTime).toBe(parseFloat(((0 + 7 + 10 + 18) / 4).toFixed(2)));
  });

  it("FCFS handles CPU idle intervals properly", () => {
    const idleProcs: Process[] = [
      { id: "P1", name: "P1", arrivalTime: 0, burstTime: 2, priority: 1 },
      { id: "P2", name: "P2", arrivalTime: 5, burstTime: 3, priority: 1 },
    ];
    const res = simulateFCFS(idleProcs);
    expect(res.idleTime).toBe(3); // from time 2 to 5
    expect(res.totalTime).toBe(8);
    expect(res.gantt.some((g) => g.processId === "IDLE")).toBe(true);
    expect(res.cpuUtilization).toBe(62.5); // 5 busy / 8 total * 100
  });

  it("SJF Non-Preemptive prioritizes shortest burst among arrived processes", () => {
    const res = simulateSJFNonPreemptive(benchmarkProcesses);
    // At t=0: only P1 arrived. P1 runs 0..8.
    // At t=8: P2(BT 4), P3(BT 9), P4(BT 5) are available.
    // Smallest is P2. Runs 8..12.
    // At t=12: P4(BT 5) vs P3(BT 9). P4 runs 12..17.
    // Finally P3 runs 17..26.
    const p2 = res.metrics.find((m) => m.processId === "P2")!;
    const p4 = res.metrics.find((m) => m.processId === "P4")!;
    const p3 = res.metrics.find((m) => m.processId === "P3")!;

    expect(p2.completionTime).toBe(12);
    expect(p4.completionTime).toBe(17);
    expect(p3.completionTime).toBe(26);
  });

  it("SRTF Preemptive preempts when a shorter remaining time process arrives", () => {
    const srtfProcs: Process[] = [
      { id: "P1", name: "P1", arrivalTime: 0, burstTime: 8, priority: 1 },
      { id: "P2", name: "P2", arrivalTime: 1, burstTime: 4, priority: 1 },
      { id: "P3", name: "P3", arrivalTime: 2, burstTime: 2, priority: 1 },
    ];
    const res = simulateSRTFPreemptive(srtfProcs);
    // t=0: P1 runs (remaining 8 -> 7)
    // t=1: P2 arrives (BT 4 < P1 rem 7), P2 preempts P1!
    // t=2: P3 arrives (BT 2 < P2 rem 3), P3 preempts P2!
    // P3 finishes at 4.
    // Then P2 finishes at 4 + 3 = 7.
    // Then P1 finishes at 7 + 7 = 14.
    const p3 = res.metrics.find((m) => m.processId === "P3")!;
    const p2 = res.metrics.find((m) => m.processId === "P2")!;
    const p1 = res.metrics.find((m) => m.processId === "P1")!;

    expect(p3.completionTime).toBe(4);
    expect(p2.completionTime).toBe(7);
    expect(p1.completionTime).toBe(14);
  });

  it("Round Robin cycles processes according to time quantum", () => {
    const rrProcs: Process[] = [
      { id: "P1", name: "P1", arrivalTime: 0, burstTime: 5, priority: 1 },
      { id: "P2", name: "P2", arrivalTime: 0, burstTime: 3, priority: 1 },
    ];
    // Quantum = 2:
    // P1: 0..2 (rem 3)
    // P2: 2..4 (rem 1)
    // P1: 4..6 (rem 1)
    // P2: 6..7 (completes at 7!)
    // P1: 7..8 (completes at 8!)
    const res = simulateRoundRobin(rrProcs, 2);
    const p2 = res.metrics.find((m) => m.processId === "P2")!;
    const p1 = res.metrics.find((m) => m.processId === "P1")!;

    expect(p2.completionTime).toBe(7);
    expect(p1.completionTime).toBe(8);
    expect(res.totalTime).toBe(8);
  });

  it("Priority Preemptive selects process with higher priority (lower integer)", () => {
    const prioProcs: Process[] = [
      { id: "P1", name: "P1", arrivalTime: 0, burstTime: 10, priority: 3 },
      { id: "P2", name: "P2", arrivalTime: 2, burstTime: 4, priority: 1 }, // P2 higher priority
    ];
    const res = simulatePriorityPreemptive(prioProcs);
    // t=0..2: P1 runs
    // t=2: P2 preempts P1 and runs for 4 units (2..6)
    // t=6: P1 resumes and finishes at 6 + 8 = 14
    const p2 = res.metrics.find((m) => m.processId === "P2")!;
    const p1 = res.metrics.find((m) => m.processId === "P1")!;

    expect(p2.completionTime).toBe(6);
    expect(p1.completionTime).toBe(14);
  });
});
