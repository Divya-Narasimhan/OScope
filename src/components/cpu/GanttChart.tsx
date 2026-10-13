import React from "react";
import { GanttSegment } from "@/lib/cpu/types";

interface GanttChartProps {
  segments: GanttSegment[];
  totalTime: number;
  currentPlaybackTime?: number;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  segments,
  totalTime,
  currentPlaybackTime,
}) => {
  if (segments.length === 0 || totalTime === 0) {
    return (
      <div className="h-28 rounded-xl border border-dashed border-slate-800 flex items-center justify-center text-xs text-slate-500 font-mono">
        No execution timeline available. Add processes and execute simulation.
      </div>
    );
  }

  // Generate unique colors for processes
  const colorPalette = [
    "#06b6d4", // cyan
    "#8b5cf6", // violet
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ec4899", // pink
    "#3b82f6", // blue
    "#14b8a6", // teal
    "#f97316", // orange
  ];

  const getProcessColor = (procId: string, index: number) => {
    if (procId === "IDLE") return "#334155";
    return colorPalette[index % colorPalette.length];
  };

  return (
    <div className="w-full space-y-2 select-none">
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          CPU Timeline (0 → {totalTime} units)
        </span>
        {currentPlaybackTime !== undefined && (
          <span className="text-cyan-400 font-bold">
            Current Scrubber Time: t = {currentPlaybackTime}
          </span>
        )}
      </div>

      {/* Main Gantt Timeline Bar */}
      <div className="relative w-full h-14 bg-slate-950 rounded-xl border border-slate-800 flex overflow-hidden shadow-inner p-1">
        {segments.map((seg, idx) => {
          const duration = seg.endTime - seg.startTime;
          const widthPercent = (duration / totalTime) * 100;
          const isIdle = seg.processId === "IDLE";
          const bgColor = seg.color || getProcessColor(seg.processId, idx);
          
          const isCurrentActive =
            currentPlaybackTime !== undefined &&
            currentPlaybackTime >= seg.startTime &&
            currentPlaybackTime < seg.endTime;

          return (
            <div
              key={`${seg.processId}-${seg.startTime}-${idx}`}
              style={{
                width: `${widthPercent}%`,
                backgroundColor: isIdle ? "#1e293b" : bgColor,
              }}
              title={`${seg.processName} [${seg.startTime} - ${seg.endTime}] (Duration: ${duration})`}
              className={`relative h-full flex flex-col items-center justify-center text-white transition-all border-r border-slate-900/60 group hover:brightness-110 ${
                isCurrentActive ? "ring-2 ring-white ring-inset brightness-125 z-10" : ""
              }`}
            >
              <span
                className={`font-mono text-xs font-bold tracking-wider truncate px-1 ${
                  isIdle ? "text-slate-400 italic" : "text-slate-950 drop-shadow-sm font-extrabold"
                }`}
              >
                {seg.processName}
              </span>
              <span
                className={`text-[10px] font-mono leading-none ${
                  isIdle ? "text-slate-500" : "text-slate-900/80 font-medium"
                }`}
              >
                Δ{duration}
              </span>

              {/* Hover Tooltip Card */}
              <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-slate-900 border border-slate-700 p-2 rounded-lg text-[11px] font-mono text-slate-200 z-30 shadow-xl whitespace-nowrap pointer-events-none">
                <span className="font-bold text-cyan-400">{seg.processName}</span>
                <span>Interval: {seg.startTime} → {seg.endTime}</span>
                <span>Burst Duration: {duration} time units</span>
              </div>
            </div>
          );
        })}

        {/* Playback Scrubber Line */}
        {currentPlaybackTime !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-20 pointer-events-none shadow-lg transition-all"
            style={{
              left: `${Math.min(100, (currentPlaybackTime / totalTime) * 100)}%`,
            }}
          >
            <div className="w-2.5 h-2.5 bg-rose-500 rounded-full -ml-1 -mt-1 shadow-md shadow-rose-500/50" />
          </div>
        )}
      </div>

      {/* Time axis marks */}
      <div className="relative w-full h-5 flex font-mono text-[10px] text-slate-500">
        <span className="absolute left-0">0</span>
        {segments.map((seg, idx) => {
          const rightPercent = (seg.endTime / totalTime) * 100;
          return (
            <span
              key={`mark-${idx}`}
              className="absolute -translate-x-1/2"
              style={{ left: `${rightPercent}%` }}
            >
              {seg.endTime}
            </span>
          );
        })}
      </div>
    </div>
  );
};
