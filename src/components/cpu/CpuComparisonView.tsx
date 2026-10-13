import React from "react";
import { Process } from "@/lib/cpu/types";
import { compareAllCpuAlgorithms, ComparisonResult } from "@/lib/cpu/scheduler";
import { Badge } from "../common/Badge";
import { Trophy, Zap, Clock, Activity } from "lucide-react";

interface CpuComparisonViewProps {
  processes: Process[];
  timeQuantum: number;
}

export const CpuComparisonView: React.FC<CpuComparisonViewProps> = ({
  processes,
  timeQuantum,
}) => {
  const comparisons: ComparisonResult[] = compareAllCpuAlgorithms(processes, timeQuantum);

  // Find the algorithm with lowest average waiting time
  const bestWT = [...comparisons].sort(
    (a, b) => a.result.avgWaitingTime - b.result.avgWaitingTime
  )[0];

  // Find the algorithm with lowest average turnaround time
  const bestTAT = [...comparisons].sort(
    (a, b) => a.result.avgTurnaroundTime - b.result.avgTurnaroundTime
  )[0];

  // Maximum average turnaround time for scaling bar graphs
  const maxTAT = Math.max(...comparisons.map((c) => c.result.avgTurnaroundTime), 1);
  const maxWT = Math.max(...comparisons.map((c) => c.result.avgWaitingTime), 1);

  return (
    <div className="space-y-6">
      {/* Top Academic Recommendation Banner */}
      <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
          <Trophy className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-100">
              Workload Performance Analysis & Optimal Scheduler
            </h4>
            <Badge variant="emerald">Optimal: {bestWT.algorithmName}</Badge>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            For this specific workload, <span className="text-emerald-400 font-semibold">{bestWT.algorithmName}</span> achieves the minimal Average Waiting Time of{" "}
            <span className="font-mono text-emerald-400 font-bold">{bestWT.result.avgWaitingTime} units</span> and Average Turnaround Time of{" "}
            <span className="font-mono text-emerald-400 font-bold">{bestWT.result.avgTurnaroundTime} units</span>.
            Shortest Remaining Time First (SRTF) is provably optimal for minimizing average waiting time in single-CPU preemptive models.
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[11px]">
              <th className="py-3 px-4">Algorithm</th>
              <th className="py-3 px-4">Avg Waiting Time (AWT)</th>
              <th className="py-3 px-4">Avg Turnaround Time (ATAT)</th>
              <th className="py-3 px-4">Avg Response Time (ART)</th>
              <th className="py-3 px-4">CPU Utilization</th>
              <th className="py-3 px-4">Throughput</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {comparisons.map((item) => {
              const isBest = item.algorithm === bestWT.algorithm;
              return (
                <tr
                  key={item.algorithm}
                  className={`hover:bg-slate-900/40 transition-colors ${
                    isBest ? "bg-emerald-950/20 font-semibold text-slate-100" : "text-slate-300"
                  }`}
                >
                  <td className="py-3 px-4 flex items-center gap-2">
                    {isBest && <Zap className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{item.algorithmName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={isBest ? "text-emerald-400 font-bold" : ""}>
                      {item.result.avgWaitingTime}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={item.algorithm === bestTAT.algorithm ? "text-cyan-400 font-bold" : ""}>
                      {item.result.avgTurnaroundTime}
                    </span>
                  </td>
                  <td className="py-3 px-4">{item.result.avgResponseTime}</td>
                  <td className="py-3 px-4">
                    <span className="text-slate-200">{item.result.cpuUtilization}%</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {item.result.throughput.toFixed(3)} proc/unit
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Visual Bar Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Waiting Time Bars */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Average Waiting Time (Lower is better)
            </span>
          </div>
          <div className="space-y-2.5 pt-1">
            {comparisons.map((item) => {
              const pct = (item.result.avgWaitingTime / maxWT) * 100;
              const isBest = item.algorithm === bestWT.algorithm;
              return (
                <div key={`wt-${item.algorithm}`} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">{item.algorithmName}</span>
                    <span className={isBest ? "text-emerald-400 font-bold" : "text-slate-300"}>
                      {item.result.avgWaitingTime}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isBest ? "bg-emerald-500" : "bg-cyan-600/70"
                      }`}
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Turnaround Time Bars */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-violet-400" /> Average Turnaround Time (Lower is better)
            </span>
          </div>
          <div className="space-y-2.5 pt-1">
            {comparisons.map((item) => {
              const pct = (item.result.avgTurnaroundTime / maxTAT) * 100;
              const isBest = item.algorithm === bestTAT.algorithm;
              return (
                <div key={`tat-${item.algorithm}`} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">{item.algorithmName}</span>
                    <span className={isBest ? "text-violet-400 font-bold" : "text-slate-300"}>
                      {item.result.avgTurnaroundTime}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isBest ? "bg-violet-500" : "bg-indigo-600/70"
                      }`}
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
