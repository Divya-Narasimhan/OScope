import React from "react";
import { SafetyCheckResult } from "@/lib/deadlock/types";
import { Badge } from "../common/Badge";
import { CheckCircle2, AlertOctagon, ArrowRight, ShieldCheck, ShieldAlert } from "lucide-react";

interface BankersSafetyVisualizerProps {
  safetyResult: SafetyCheckResult;
  resourceTypes: string[];
}

export const BankersSafetyVisualizer: React.FC<BankersSafetyVisualizerProps> = ({
  safetyResult,
  resourceTypes,
}) => {
  return (
    <div className="space-y-4">
      {/* Safety Status Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
          safetyResult.isSafe
            ? "border-emerald-500/40 bg-emerald-950/20"
            : "border-rose-500/40 bg-rose-950/20"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg shrink-0 mt-0.5 ${
              safetyResult.isSafe ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
            }`}
          >
            {safetyResult.isSafe ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <ShieldAlert className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-100">
                {safetyResult.isSafe ? "System is in a SAFE STATE" : "System is in an UNSAFE STATE"}
              </h4>
              <Badge variant={safetyResult.isSafe ? "emerald" : "rose"}>
                {safetyResult.isSafe ? "Safe Execution Guaranteed" : "Potential Deadlock Hazard"}
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {safetyResult.isSafe
                ? "A valid sequence of process allocations exists where every process can acquire its maximum claim and complete without deadlock."
                : `No safe sequence exists! The available resources cannot satisfy remaining process demands. Note: An unsafe state does NOT mean a deadlock has occurred yet; it means the OS cannot guarantee avoiding one.`}
            </p>
          </div>
        </div>

        {/* Safe Sequence Display */}
        {safetyResult.isSafe && (
          <div className="flex items-center gap-1.5 flex-wrap bg-slate-950/70 p-2 rounded-lg border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold mr-1">
              Sequence:
            </span>
            {safetyResult.safeSequence.map((proc, idx) => (
              <React.Fragment key={proc}>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-mono text-xs font-bold">
                  {proc}
                </span>
                {idx < safetyResult.safeSequence.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Step-by-Step Work Vector Trace */}
      {safetyResult.steps.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[11px]">
                <th className="py-2.5 px-4">Step</th>
                <th className="py-2.5 px-4">Selected Proc</th>
                <th className="py-2.5 px-4">Work Before</th>
                <th className="py-2.5 px-4">Need</th>
                <th className="py-2.5 px-4">Allocated (Released)</th>
                <th className="py-2.5 px-4 text-emerald-400">Work After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {safetyResult.steps.map((step) => (
                <tr key={step.stepIndex} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-4 font-bold text-slate-400">#{step.stepIndex}</td>
                  <td className="py-2.5 px-4 font-bold text-cyan-400">{step.processId}</td>
                  <td className="py-2.5 px-4 text-slate-300">[{step.workBefore.join(", ")}]</td>
                  <td className="py-2.5 px-4 text-amber-400">[{step.need.join(", ")}]</td>
                  <td className="py-2.5 px-4 text-slate-400">[{step.allocation.join(", ")}]</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-400">
                    [{step.workAfter.join(", ")}]
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
