import React from "react";

interface MetricStatProps {
  label: string;
  value: string | number;
  unit?: string;
  helper?: string;
  trend?: "up" | "down" | "neutral";
  color?: "cyan" | "violet" | "emerald" | "amber" | "rose" | "slate";
}

export const MetricStat: React.FC<MetricStatProps> = ({
  label,
  value,
  unit,
  helper,
  color = "cyan",
}) => {
  const colorMap = {
    cyan: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20",
    violet: "text-violet-400 border-violet-500/20 bg-violet-950/20",
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-950/20",
    amber: "text-amber-400 border-amber-500/20 bg-amber-950/20",
    rose: "text-rose-400 border-rose-500/20 bg-rose-950/20",
    slate: "text-slate-300 border-slate-700/40 bg-slate-800/30",
  };

  return (
    <div
      className={`rounded-lg border p-3.5 flex flex-col justify-between transition-all ${colorMap[color]}`}
    >
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5 mt-1.5">
        <span className="text-2xl font-bold font-mono tracking-tight text-slate-100">
          {value}
        </span>
        {unit && <span className="text-xs text-slate-400 font-mono">{unit}</span>}
      </div>
      {helper && <p className="text-[11px] text-slate-500 mt-1">{helper}</p>}
    </div>
  );
};
