import React, { useState, useEffect, useRef } from "react";
import {
  Process,
  SchedulingAlgorithm,
  SimulationResult,
} from "@/lib/cpu/types";
import { runCpuSimulation } from "@/lib/cpu/scheduler";
import { CPU_PRESETS } from "@/lib/presets/cpuPresets";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { MetricStat } from "../common/MetricStat";
import { GanttChart } from "./GanttChart";
import { ProcessTable } from "./ProcessTable";
import { CpuComparisonView } from "./CpuComparisonView";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Download,
  Info,
  Settings2,
  BarChart2,
  ListOrdered,
} from "lucide-react";

export const CpuSchedulerLab: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<SchedulingAlgorithm | "COMPARE">("FCFS");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("galvin_standard");
  const [processes, setProcesses] = useState<Process[]>(CPU_PRESETS[0].processes);
  const [timeQuantum, setTimeQuantum] = useState<number>(2);

  // Playback / Timeline state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x, 4x
  const [showLogs, setShowLogs] = useState<boolean>(false);

  const simulationRef = useRef<SimulationResult | null>(null);

  // Re-run simulation whenever inputs change
  const currentResult: SimulationResult =
    selectedAlgo !== "COMPARE"
      ? runCpuSimulation(selectedAlgo, processes, { timeQuantum })
      : runCpuSimulation("FCFS", processes, { timeQuantum });

  simulationRef.current = currentResult;

  // Animation timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= currentResult.totalTime) {
            setIsPlaying(false);
            return currentResult.totalTime;
          }
          return prev + 1;
        });
      }, 800 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, currentResult.totalTime]);

  const handlePresetChange = (presetId: string) => {
    const found = CPU_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setSelectedPresetId(presetId);
      setProcesses(found.processes.map((p) => ({ ...p })));
      if (found.timeQuantum) setTimeQuantum(found.timeQuantum);
      setPlaybackTime(0);
      setIsPlaying(false);
    }
  };

  const handleResetPlayback = () => {
    setIsPlaying(false);
    setPlaybackTime(0);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setPlaybackTime((prev) => Math.min(currentResult.totalTime, prev + 1));
  };

  const handleExportData = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            algorithm: selectedAlgo,
            processes,
            timeQuantum,
            simulationResult: currentResult,
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `oscope-cpu-${selectedAlgo.toLowerCase()}-workload.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Configuration & Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              CPU Scheduling Laboratory
            </h2>
            <Badge variant="cyan">Simulated Kernel Scheduler</Badge>
          </div>
          <p className="text-xs text-slate-400">
            Interactive multi-process dispatching, preemptive context-switches, and comparative time analysis.
          </p>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800/80">
          {[
            { key: "FCFS", label: "FCFS" },
            { key: "SJF_NON_PREEMPTIVE", label: "SJF (Non-Preempt)" },
            { key: "SRTF_PREEMPTIVE", label: "SRTF (Preempt)" },
            { key: "PRIORITY_NON_PREEMPTIVE", label: "Priority" },
            { key: "PRIORITY_PREEMPTIVE", label: "Priority (Preempt)" },
            { key: "ROUND_ROBIN", label: "Round Robin" },
            { key: "COMPARE", label: "⚡ Compare All" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setSelectedAlgo(tab.key as any);
                setPlaybackTime(0);
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
                selectedAlgo === tab.key
                  ? "bg-cyan-600 text-white font-bold shadow-md shadow-cyan-950"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preset and Settings Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl glass-panel-subtle border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Workload Preset:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {CPU_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.title}
                </option>
              ))}
            </select>
          </div>

          {selectedAlgo === "ROUND_ROBIN" && (
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800">
              <span className="text-xs font-mono text-amber-400 font-semibold">
                Time Quantum (q):
              </span>
              <input
                type="number"
                min="1"
                max="20"
                value={timeQuantum}
                onChange={(e) => {
                  setTimeQuantum(Math.max(1, parseInt(e.target.value, 10) || 1));
                  setPlaybackTime(0);
                }}
                className="w-14 bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs font-mono text-white text-center focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportData}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export JSON
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLogs(!showLogs)}
            icon={<ListOrdered className="w-3.5 h-3.5 text-cyan-400" />}
          >
            {showLogs ? "Hide Logs" : "Execution Logs"}
          </Button>
        </div>
      </div>

      {/* Main Workspace: Single Algorithm Execution OR Full Comparison Mode */}
      {selectedAlgo === "COMPARE" ? (
        <Card
          title="Cross-Algorithm Comparative Evaluation"
          subtitle="Simulates all 6 algorithms concurrently over the identical process workload"
          badge={<Badge variant="violet">Holistic Benchmark</Badge>}
        >
          <CpuComparisonView processes={processes} timeQuantum={timeQuantum} />
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Gantt Chart & Playback Controls Card */}
          <Card
            title="CPU Dispatch Timeline (Gantt Chart)"
            subtitle={`${currentResult.algorithm} — Preemption boundaries and idle intervals`}
            badge={<Badge variant="cyan">{processes.length} Processes Active</Badge>}
            actions={
              <div className="flex items-center gap-2">
                {/* Play / Pause Controls */}
                <Button
                  variant={isPlaying ? "amber" : "emerald"}
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  icon={isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                >
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleStepForward}
                  icon={<SkipForward className="w-3.5 h-3.5" />}
                  title="Step 1 unit forward"
                >
                  Step
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleResetPlayback}
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                  title="Reset scrubber"
                >
                  Reset
                </Button>

                {/* Speed Selector */}
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 ml-2 font-mono text-[11px]">
                  {[0.5, 1, 2, 4].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded ${
                        playbackSpeed === spd
                          ? "bg-cyan-600 text-white font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            }
          >
            <div className="space-y-4">
              <GanttChart
                segments={currentResult.gantt}
                totalTime={currentResult.totalTime}
                currentPlaybackTime={playbackTime}
              />
            </div>
          </Card>

          {/* Performance Metrics Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <MetricStat
              label="Avg Waiting Time"
              value={currentResult.avgWaitingTime}
              unit="units"
              helper="WT = TAT - Burst"
              color="cyan"
            />
            <MetricStat
              label="Avg Turnaround Time"
              value={currentResult.avgTurnaroundTime}
              unit="units"
              helper="TAT = CT - Arrival"
              color="violet"
            />
            <MetricStat
              label="Avg Response Time"
              value={currentResult.avgResponseTime}
              unit="units"
              helper="RT = 1st Run - Arrival"
              color="emerald"
            />
            <MetricStat
              label="CPU Utilization"
              value={currentResult.cpuUtilization}
              unit="%"
              helper="Busy Time / Total Time"
              color="amber"
            />
            <MetricStat
              label="Throughput"
              value={currentResult.throughput.toFixed(3)}
              unit="proc/t"
              helper="Processes / Total Time"
              color="slate"
            />
            <MetricStat
              label="CPU Idle Time"
              value={currentResult.idleTime}
              unit="units"
              helper={currentResult.idleTime > 0 ? "Gaps in arrivals" : "Continuous Load"}
              color={currentResult.idleTime > 0 ? "rose" : "slate"}
            />
          </div>

          {/* Process Metrics Table */}
          <Card
            title="Individual Process Metrics Breakdown"
            subtitle="Mathematical verification: Turnaround = CT - AT, Waiting = TAT - BT, Response = 1st Start - AT"
          >
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[11px]">
                    <th className="py-2.5 px-4">PID</th>
                    <th className="py-2.5 px-4">Arrival Time (AT)</th>
                    <th className="py-2.5 px-4">Burst Time (BT)</th>
                    <th className="py-2.5 px-4">Priority</th>
                    <th className="py-2.5 px-4">Completion (CT)</th>
                    <th className="py-2.5 px-4 text-cyan-400">Turnaround (TAT)</th>
                    <th className="py-2.5 px-4 text-emerald-400">Waiting (WT)</th>
                    <th className="py-2.5 px-4 text-violet-400">Response (RT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentResult.metrics.map((m) => (
                    <tr key={m.processId} className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-4 font-bold text-slate-200">{m.processName}</td>
                      <td className="py-2.5 px-4 text-slate-400">{m.arrivalTime}</td>
                      <td className="py-2.5 px-4 text-slate-400">{m.burstTime}</td>
                      <td className="py-2.5 px-4 text-slate-400">{m.priority}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-300">{m.completionTime}</td>
                      <td className="py-2.5 px-4 font-bold text-cyan-400">{m.turnaroundTime}</td>
                      <td className="py-2.5 px-4 font-bold text-emerald-400">{m.waitingTime}</td>
                      <td className="py-2.5 px-4 font-bold text-violet-400">{m.responseTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Interactive Workload Editor */}
          <Card
            title="Workload Editor & Process Configuration"
            subtitle="Modify arrival times, burst times, or priorities to observe real-time scheduler reactions"
          >
            <ProcessTable
              processes={processes}
              onChange={(updated) => {
                setProcesses(updated);
                setPlaybackTime(0);
              }}
              onReset={() => handlePresetChange(selectedPresetId)}
            />
          </Card>

          {/* Step-by-Step Execution Audit Log */}
          {showLogs && (
            <Card
              title="Execution Audit Log"
              subtitle="Step-by-step kernel trace of scheduling decisions and context-switches"
              badge={<Badge variant="slate">{currentResult.logs.length} Events</Badge>}
            >
              <div className="max-h-60 overflow-y-auto font-mono text-xs text-slate-300 space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-800">
                {currentResult.logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed hover:text-cyan-400 transition-colors">
                    {log}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
