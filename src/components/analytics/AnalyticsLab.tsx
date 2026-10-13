import React from "react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { MetricStat } from "../common/MetricStat";
import {
  BarChart3,
  Cpu,
  Layers,
  ShieldCheck,
  Download,
  BookOpen,
  Zap,
  TrendingUp,
} from "lucide-react";

export const AnalyticsLab: React.FC = () => {
  const handleExportFullReport = () => {
    const reportData = {
      project: "OScope — Operating System Resource Management & Performance Analysis Platform",
      university_level: "B.Tech Operating Systems Lab (40 Marks)",
      timestamp: new Date().toISOString(),
      formula_reference: {
        turnaround_time: "Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)",
        waiting_time: "Waiting Time (WT) = Turnaround Time (TAT) - Burst Time (BT)",
        response_time: "Response Time (RT) = First Start Time - Arrival Time (AT)",
        cpu_utilization: "CPU Utilization (%) = (Total Busy Time / Total Timeline) * 100",
        throughput: "Throughput = Total Completed Processes / Total Observation Time",
        page_fault_rate: "Page Fault Rate (%) = (Total Faults / Total References) * 100",
        page_hit_rate: "Page Hit Rate (%) = (Total Hits / Total References) * 100",
      },
      algorithms_implemented: [
        "CPU Scheduling: FCFS, SJF (Non-Preemptive), SRTF (Preemptive), Priority (Preemptive & Non-Preemptive), Round Robin",
        "Memory Management: Contiguous Allocation (First Fit, Best Fit, Worst Fit)",
        "Virtual Memory: Page Replacement (FIFO, LRU, Optimal)",
        "Deadlock Management: Banker's Algorithm (Safety Check & Resource Request)",
        "Process Lifecycle: 5-State Model (New, Ready, Running, Waiting, Terminated)",
      ],
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `oscope-complete-lab-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              Performance Analytics & Operating Systems Theory
            </h2>
            <Badge variant="cyan">Unified Analytical Engine</Badge>
          </div>
          <p className="text-xs text-slate-400">
            System performance evaluation, algorithmic complexity trade-offs, and mathematical formulas.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleExportFullReport}
          icon={<Download className="w-4 h-4" />}
        >
          Export Full Laboratory Report
        </Button>
      </div>

      {/* Mathematical Formulas & Rigorous Definitions */}
      <Card
        title="Operating Systems Metrics & Mathematical Definitions"
        subtitle="Standard academic formulation according to Silberschatz, Galvin & Gagne (10th Edition)"
        badge={<Badge variant="violet">Textbook Standard</Badge>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-1.5">
            <span className="text-cyan-400 font-bold uppercase">Turnaround Time (TAT)</span>
            <p className="text-slate-200 text-sm font-semibold">TAT = CT - AT</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Interval from the time of process submission (Arrival Time) to the time of completion.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-1.5">
            <span className="text-emerald-400 font-bold uppercase">Waiting Time (WT)</span>
            <p className="text-slate-200 text-sm font-semibold">WT = TAT - BT</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Total amount of time spent waiting in the ready queue. Does not include execution time.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-1.5">
            <span className="text-violet-400 font-bold uppercase">Response Time (RT)</span>
            <p className="text-slate-200 text-sm font-semibold">RT = First CPU Run - AT</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Time from submission until the first response is produced (crucial in interactive time-sharing systems).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-1.5">
            <span className="text-amber-400 font-bold uppercase">CPU Utilization</span>
            <p className="text-slate-200 text-sm font-semibold">
              Util = (Busy Time / Total Time) × 100%
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Percentage of observation time that the CPU is executing user or system processes rather than idling.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-1.5">
            <span className="text-rose-400 font-bold uppercase">Page Fault Rate</span>
            <p className="text-slate-200 text-sm font-semibold">PFR = (Faults / Total Refs) × 100%</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Frequency with which referenced virtual memory pages must be brought from secondary storage into RAM.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-1.5">
            <span className="text-blue-400 font-bold uppercase">Throughput</span>
            <p className="text-slate-200 text-sm font-semibold">Throughput = N / Total Time</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Number of processes completed per unit of time across the scheduling horizon.
            </p>
          </div>
        </div>
      </Card>

      {/* Algorithmic Trade-offs Matrix */}
      <Card
        title="Comprehensive Algorithmic Complexity & Trade-Off Matrix"
        subtitle="Theoretical advantages, limitations, and vulnerability to anomalies"
      >
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[11px]">
                <th className="py-3 px-4">Algorithm / Strategy</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Time Complexity</th>
                <th className="py-3 px-4">Primary Advantage</th>
                <th className="py-3 px-4">Known Vulnerability / Anomaly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-cyan-400">First Come First Served (FCFS)</td>
                <td className="py-2.5 px-4 text-slate-400">CPU Non-Preemptive</td>
                <td className="py-2.5 px-4">O(N log N)</td>
                <td className="py-2.5 px-4 text-emerald-400">Simple, zero scheduling overhead</td>
                <td className="py-2.5 px-4 text-rose-400">Convoy Effect (long bursts stall short jobs)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-cyan-400">Shortest Job First (SJF)</td>
                <td className="py-2.5 px-4">CPU Non-Preemptive</td>
                <td className="py-2.5 px-4">O(N log N)</td>
                <td className="py-2.5 px-4 text-emerald-400">Minimizes average waiting time</td>
                <td className="py-2.5 px-4 text-rose-400">Starvation of long burst jobs</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-cyan-400">Shortest Remaining Time (SRTF)</td>
                <td className="py-2.5 px-4">CPU Preemptive</td>
                <td className="py-2.5 px-4">O(N log N)</td>
                <td className="py-2.5 px-4 text-emerald-400">Provably optimal average waiting time</td>
                <td className="py-2.5 px-4 text-rose-400">Frequent context-switch overhead</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-cyan-400">Round Robin (RR)</td>
                <td className="py-2.5 px-4">CPU Preemptive</td>
                <td className="py-2.5 px-4">O(N)</td>
                <td className="py-2.5 px-4 text-emerald-400">Fair responsiveness, starvation-free</td>
                <td className="py-2.5 px-4 text-rose-400">Sensitive to quantum size selection</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-emerald-400">Best Fit Allocation</td>
                <td className="py-2.5 px-4">Contiguous Memory</td>
                <td className="py-2.5 px-4">O(M)</td>
                <td className="py-2.5 px-4 text-emerald-400">Minimizes internal fragmentation</td>
                <td className="py-2.5 px-4 text-rose-400">Creates tiny unusable slivers (external frag)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-emerald-400">Worst Fit Allocation</td>
                <td className="py-2.5 px-4">Contiguous Memory</td>
                <td className="py-2.5 px-4">O(M)</td>
                <td className="py-2.5 px-4 text-emerald-400">Leaves largest leftover fragment</td>
                <td className="py-2.5 px-4 text-rose-400">Breaks large blocks early</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-violet-400">FIFO Page Replacement</td>
                <td className="py-2.5 px-4">Virtual Memory</td>
                <td className="py-2.5 px-4">O(1) per ref</td>
                <td className="py-2.5 px-4 text-emerald-400">Minimal hardware support required</td>
                <td className="py-2.5 px-4 text-rose-400">Belady's Anomaly (more frames = more faults)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-violet-400">LRU Page Replacement</td>
                <td className="py-2.5 px-4">Virtual Memory</td>
                <td className="py-2.5 px-4">O(1) to O(F)</td>
                <td className="py-2.5 px-4 text-emerald-400">Approximates optimal behavior via recency</td>
                <td className="py-2.5 px-4 text-rose-400">Requires hardware timestamp/stack support</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-violet-400">Optimal Page Replacement</td>
                <td className="py-2.5 px-4">Virtual Memory</td>
                <td className="py-2.5 px-4">O(F × L)</td>
                <td className="py-2.5 px-4 text-emerald-400">Guarantees lowest possible page faults</td>
                <td className="py-2.5 px-4 text-rose-400">Unimplementable online (offline benchmark only)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-2.5 px-4 font-bold text-amber-400">Banker's Algorithm</td>
                <td className="py-2.5 px-4">Deadlock Avoidance</td>
                <td className="py-2.5 px-4">O(M × N²)</td>
                <td className="py-2.5 px-4 text-emerald-400">Guarantees system remains in safe states</td>
                <td className="py-2.5 px-4 text-rose-400">Requires prior declaration of maximum claims</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
