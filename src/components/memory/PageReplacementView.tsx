import React, { useState, useEffect } from "react";
import {
  PageReplacementAlgorithm,
  PageReplacementResult,
} from "@/lib/memory/types";
import {
  simulateFIFO,
  simulateLRU,
  simulateOptimal,
  compareAllPageReplacement,
} from "@/lib/memory/pageReplacement";
import { PAGE_PRESETS } from "@/lib/presets/memoryPresets";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { MetricStat } from "../common/MetricStat";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle,
  XCircle,
  HelpCircle,
  TrendingDown,
  Layers,
} from "lucide-react";

export const PageReplacementView: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<PageReplacementAlgorithm | "COMPARE">("FIFO");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("galvin_pages");
  const [frameCount, setFrameCount] = useState<number>(3);
  const [refStringInput, setRefStringInput] = useState<string>(
    PAGE_PRESETS[0].referenceString.join(", ")
  );

  // Stepper playback state
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Parse reference string safely
  const parsedRefString: number[] = refStringInput
    .split(/[\s,]+/)
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n >= 0);

  const safeRefs = parsedRefString.length > 0 ? parsedRefString : [7, 0, 1, 2, 0, 3];

  const currentResult: PageReplacementResult = (() => {
    switch (algorithm) {
      case "FIFO":
        return simulateFIFO(safeRefs, frameCount);
      case "LRU":
        return simulateLRU(safeRefs, frameCount);
      case "OPTIMAL":
        return simulateOptimal(safeRefs, frameCount);
      default:
        return simulateFIFO(safeRefs, frameCount);
    }
  })();

  const comparisons: PageReplacementResult[] =
    algorithm === "COMPARE" ? compareAllPageReplacement(safeRefs, frameCount) : [];

  // Playback loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= currentResult.steps.length - 1) {
            setIsPlaying(false);
            return currentResult.steps.length - 1;
          }
          return prev + 1;
        });
      }, 700 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, currentResult.steps.length]);

  const handlePresetChange = (id: string) => {
    const preset = PAGE_PRESETS.find((p) => p.id === id);
    if (preset) {
      setSelectedPresetId(id);
      setFrameCount(preset.frameCount);
      setRefStringInput(preset.referenceString.join(", "));
      setCurrentStep(0);
      setIsPlaying(false);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(currentResult.steps.length - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-panel-subtle border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Preset:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {PAGE_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800">
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              Frame Capacity (Frames):
            </span>
            <input
              type="number"
              min="1"
              max="10"
              value={frameCount}
              onChange={(e) => {
                setFrameCount(Math.max(1, parseInt(e.target.value, 10) || 1));
                setCurrentStep(0);
              }}
              className="w-14 bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs font-mono text-white text-center focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[
              { key: "FIFO", label: "FIFO" },
              { key: "LRU", label: "LRU" },
              { key: "OPTIMAL", label: "Optimal (Belady)" },
              { key: "COMPARE", label: "⚡ Compare All" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setAlgorithm(tab.key as any);
                  setCurrentStep(0);
                  setIsPlaying(false);
                }}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                  algorithm === tab.key
                    ? "bg-cyan-600 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reference String Input Box */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono text-slate-300 font-semibold">
            Page Reference String ({safeRefs.length} References):
          </label>
          <span className="text-[11px] text-slate-500 font-mono">
            Separate numbers with commas or spaces
          </span>
        </div>
        <input
          type="text"
          value={refStringInput}
          onChange={(e) => {
            setRefStringInput(e.target.value);
            setCurrentStep(0);
          }}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
          placeholder="e.g. 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1"
        />
      </div>

      {algorithm === "COMPARE" ? (
        /* Multi-algorithm comparison */
        <Card
          title="Page Replacement Algorithms Comparison"
          subtitle="Direct comparison of FIFO, LRU, and Optimal on identical page reference stream"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparisons.map((res) => {
              const isOptimal = res.algorithm === "OPTIMAL";
              return (
                <div
                  key={res.algorithm}
                  className={`p-4 rounded-xl border bg-slate-950/60 space-y-4 ${
                    isOptimal ? "border-emerald-500/40 bg-emerald-950/10" : "border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-slate-100">{res.algorithmName}</h4>
                    {isOptimal && <Badge variant="emerald">Theoretical Minimum</Badge>}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-900/40">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Page Faults</span>
                      <p className="text-xl font-bold font-mono text-rose-400">{res.totalFaults}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Page Hits</span>
                      <p className="text-xl font-bold font-mono text-emerald-400">{res.totalHits}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fault Rate:</span>
                      <span className="text-rose-400 font-bold">{res.faultRatio}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hit Rate:</span>
                      <span className="text-emerald-400 font-bold">{res.hitRatio}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        /* Single Strategy Step-by-Step View */
        <div className="space-y-6">
          {/* Stepper Controls & Frame Matrix Card */}
          <Card
            title={`${currentResult.algorithmName} — Interactive Frame Allocation Matrix`}
            subtitle="Rows represent physical page frames in memory; Columns represent arrival of reference requests"
            badge={
              <Badge variant="cyan">
                Step {currentStep + 1} of {currentResult.steps.length}
              </Badge>
            }
            actions={
              <div className="flex items-center gap-2">
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
                  title="Next step"
                >
                  Step
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleReset}
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                  title="Reset to step 1"
                >
                  Reset
                </Button>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 ml-1 font-mono text-[11px]">
                  {[0.5, 1, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-1.5 py-0.5 rounded ${
                        playbackSpeed === spd ? "bg-cyan-600 text-white font-bold" : "text-slate-400"
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
              {/* Frame State Grid */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <table className="border-collapse font-mono text-xs select-none">
                  <thead>
                    <tr>
                      <th className="py-2 px-3 text-left text-slate-500 text-[11px] sticky left-0 bg-slate-950 z-10">
                        Ref Page:
                      </th>
                      {currentResult.steps.map((step, idx) => (
                        <th
                          key={idx}
                          className={`py-2 px-3 text-center border-b border-slate-800 transition-colors ${
                            idx === currentStep
                              ? "bg-cyan-950/60 text-cyan-300 font-bold border-cyan-500"
                              : "text-slate-200"
                          }`}
                        >
                          {step.page}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Frame Rows */}
                    {Array.from({ length: frameCount }).map((_, fIdx) => (
                      <tr key={`frame-${fIdx}`} className="border-b border-slate-900">
                        <td className="py-2 px-3 font-semibold text-slate-400 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                          Frame {fIdx}
                        </td>
                        {currentResult.steps.map((step, sIdx) => {
                          const pageInFrame = step.frames[fIdx];
                          const isCurrentActiveCol = sIdx === currentStep;
                          const isJustLoaded =
                            !step.isHit &&
                            pageInFrame === step.page;

                          return (
                            <td
                              key={`cell-${fIdx}-${sIdx}`}
                              className={`py-2 px-3 text-center transition-all ${
                                isCurrentActiveCol ? "bg-slate-900/80 font-bold" : ""
                              } ${
                                isJustLoaded
                                  ? "text-cyan-400 font-bold bg-cyan-950/30"
                                  : "text-slate-300"
                              }`}
                            >
                              {pageInFrame !== null ? pageInFrame : "—"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* Result Row (Hit vs Fault) */}
                    <tr className="border-t border-slate-800/80 bg-slate-900/30 font-bold">
                      <td className="py-2 px-3 text-slate-400 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                        Status:
                      </td>
                      {currentResult.steps.map((step, sIdx) => (
                        <td
                          key={`status-${sIdx}`}
                          className={`py-2 px-3 text-center ${
                            sIdx === currentStep ? "bg-slate-900/80" : ""
                          }`}
                        >
                          {step.isHit ? (
                            <span className="inline-flex text-emerald-400" title="Page Hit">
                              <CheckCircle className="w-4 h-4 mx-auto" />
                            </span>
                          ) : (
                            <span className="inline-flex text-rose-500" title="Page Fault">
                              <XCircle className="w-4 h-4 mx-auto" />
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Evicted Page Row */}
                    <tr className="border-t border-slate-900 text-[10px] text-slate-400">
                      <td className="py-2 px-3 text-slate-500 sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                        Evicted:
                      </td>
                      {currentResult.steps.map((step, sIdx) => (
                        <td
                          key={`evict-${sIdx}`}
                          className={`py-1.5 px-3 text-center ${
                            sIdx === currentStep ? "bg-slate-900/80" : ""
                          }`}
                        >
                          {step.evictedPage !== null ? (
                            <span className="text-amber-400 font-mono">P{step.evictedPage}</span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Current Step Explanatory Card */}
              {currentResult.steps[currentStep] && (
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-xs font-mono">
                    <span className="font-bold text-slate-200">
                      Step {currentStep + 1} Diagnostic Explanation:
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      {currentResult.steps[currentStep].explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricStat
              label="Total Page Faults"
              value={currentResult.totalFaults}
              unit="faults"
              color="rose"
              helper={`Fault Ratio: ${currentResult.faultRatio}%`}
            />
            <MetricStat
              label="Total Page Hits"
              value={currentResult.totalHits}
              unit="hits"
              color="emerald"
              helper={`Hit Ratio: ${currentResult.hitRatio}%`}
            />
            <MetricStat
              label="Frame Allocation"
              value={frameCount}
              unit="physical frames"
              color="cyan"
              helper="Working set buffer"
            />
            <MetricStat
              label="Reference Count"
              value={safeRefs.length}
              unit="requests"
              color="slate"
              helper="Total memory accesses"
            />
          </div>

          {/* Theoretical Note for Belady's Optimal */}
          {algorithm === "OPTIMAL" && (
            <div className="p-4 rounded-xl border border-violet-500/30 bg-violet-950/20 flex items-start gap-3">
              <Layers className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h5 className="font-bold text-slate-200">
                  Academic Note on Belady's Optimal Algorithm:
                </h5>
                <p className="text-slate-400 leading-relaxed">
                  Belady's Optimal algorithm has theoretical omniscience: it looks into the future to replace the page that will not be used for the longest period of time. Because general-purpose operating systems cannot know future memory access patterns in advance, Optimal cannot be implemented in real kernels. It serves as an upper benchmark against which online heuristic algorithms (FIFO, LRU, LFU, Clock) are measured.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
