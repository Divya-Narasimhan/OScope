import React, { useState } from "react";
import {
  ContiguousStrategy,
  MemoryRequest,
  ContiguousResult,
} from "@/lib/memory/types";
import {
  simulateContiguousAllocation,
  compareAllContiguousStrategies,
} from "@/lib/memory/contiguous";
import { CONTIGUOUS_PRESETS } from "@/lib/presets/memoryPresets";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { MetricStat } from "../common/MetricStat";
import { CheckCircle2, XCircle, AlertTriangle, Shuffle, Plus, Trash2 } from "lucide-react";

export const ContiguousAllocationView: React.FC = () => {
  const [strategy, setStrategy] = useState<ContiguousStrategy | "COMPARE">("FIRST_FIT");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("galvin_allocation");

  const [blocks, setBlocks] = useState<{ id: string; size: number }[]>(
    CONTIGUOUS_PRESETS[0].blocks
  );
  const [requests, setRequests] = useState<MemoryRequest[]>(
    CONTIGUOUS_PRESETS[0].requests
  );

  const handlePresetChange = (id: string) => {
    const preset = CONTIGUOUS_PRESETS.find((p) => p.id === id);
    if (preset) {
      setSelectedPresetId(id);
      setBlocks(preset.blocks.map((b) => ({ ...b })));
      setRequests(preset.requests.map((r) => ({ ...r })));
    }
  };

  const currentResult: ContiguousResult =
    strategy !== "COMPARE"
      ? simulateContiguousAllocation(blocks, requests, strategy)
      : simulateContiguousAllocation(blocks, requests, "FIRST_FIT");

  const comparisons: ContiguousResult[] =
    strategy === "COMPARE" ? compareAllContiguousStrategies(blocks, requests) : [];

  // Update block size
  const handleBlockChange = (index: number, newSize: number) => {
    const updated = [...blocks];
    updated[index].size = Math.max(10, newSize);
    setBlocks(updated);
  };

  // Update request size
  const handleRequestChange = (index: number, newSize: number) => {
    const updated = [...requests];
    updated[index].size = Math.max(5, newSize);
    setRequests(updated);
  };

  const handleAddBlock = () => {
    const nextNum = blocks.length + 1;
    setBlocks([...blocks, { id: `B${nextNum}`, size: 250 }]);
  };

  const handleAddRequest = () => {
    const nextNum = requests.length + 1;
    setRequests([...requests, { id: `P${nextNum}`, processName: `P${nextNum}`, size: 150 }]);
  };

  return (
    <div className="space-y-6">
      {/* Strategy Selector & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-panel-subtle border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Preset:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {CONTIGUOUS_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[
              { key: "FIRST_FIT", label: "First Fit" },
              { key: "BEST_FIT", label: "Best Fit" },
              { key: "WORST_FIT", label: "Worst Fit" },
              { key: "COMPARE", label: "⚡ Compare All" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStrategy(tab.key as any)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                  strategy === tab.key
                    ? "bg-cyan-600 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleAddBlock} icon={<Plus className="w-3.5 h-3.5" />}>
            Add Block
          </Button>
          <Button variant="secondary" size="sm" onClick={handleAddRequest} icon={<Plus className="w-3.5 h-3.5" />}>
            Add Request
          </Button>
        </div>
      </div>

      {strategy === "COMPARE" ? (
        /* Multi-strategy side-by-side comparison */
        <Card
          title="Contiguous Allocation Strategy Comparison"
          subtitle="Direct comparison of First Fit vs Best Fit vs Worst Fit on identical memory partitions"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparisons.map((res) => (
              <div
                key={res.strategy}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-slate-200">{res.strategyName}</h4>
                  <Badge variant={res.failureCount === 0 ? "emerald" : "rose"}>
                    {res.successCount} / {requests.length} Allocated
                  </Badge>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Allocated:</span>
                    <span className="text-cyan-400 font-bold">{res.totalAllocated} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Internal Frag:</span>
                    <span className="text-amber-400 font-bold">{res.totalInternalFrag} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Remaining Free:</span>
                    <span className="text-slate-300 font-bold">{res.totalFree} KB</span>
                  </div>
                </div>

                {/* Event summary badges */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  {res.events.map((evt) => (
                    <div
                      key={evt.requestId}
                      className="flex items-center justify-between text-[11px] font-mono px-2 py-1 rounded bg-slate-900"
                    >
                      <span>{evt.processName} ({evt.size} KB)</span>
                      {evt.status === "SUCCESS" ? (
                        <span className="text-emerald-400 font-bold">→ {evt.allocatedBlockId}</span>
                      ) : (
                        <span className="text-rose-400 font-bold">FAILED</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        /* Single Strategy View */
        <div className="space-y-6">
          {/* Physical Memory Partition Map Visualizer */}
          <Card
            title="Physical Memory Partition Map (RAM Blocks)"
            subtitle="Visual distribution of allocated process footprints, internal fragmentation, and free space"
          >
            <div className="space-y-4">
              <div className="w-full flex flex-col md:flex-row gap-3">
                {currentResult.finalBlocks.map((blk) => {
                  const isAllocated = blk.allocatedProcessId !== null;
                  const allocPercent = isAllocated
                    ? Math.round(((blk.allocatedSize || 0) / blk.size) * 100)
                    : 0;

                  return (
                    <div
                      key={blk.id}
                      className="flex-1 rounded-xl border border-slate-800 bg-slate-950 p-3.5 flex flex-col justify-between space-y-3 min-w-[130px] shadow-sm"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                        <span className="font-mono text-xs font-bold text-slate-300">
                          {blk.id}
                        </span>
                        <Badge variant={isAllocated ? "emerald" : "slate"}>
                          {blk.size} KB
                        </Badge>
                      </div>

                      {/* Visual Sub-Block representation */}
                      <div className="h-20 w-full rounded-lg overflow-hidden border border-slate-800/80 flex flex-col justify-end bg-slate-900/60 relative">
                        {isAllocated ? (
                          <>
                            {/* Internal fragmentation top slice */}
                            {blk.internalFrag > 0 && (
                              <div
                                style={{ height: `${100 - allocPercent}%` }}
                                className="w-full bg-amber-500/20 border-b border-dashed border-amber-500/40 flex items-center justify-center text-[10px] font-mono text-amber-300"
                                title={`Internal Fragmentation: ${blk.internalFrag} KB`}
                              >
                                Frag: {blk.internalFrag}K
                              </div>
                            )}
                            {/* Allocated process space */}
                            <div
                              style={{ height: `${allocPercent}%` }}
                              className="w-full bg-emerald-600/80 flex flex-col items-center justify-center text-white text-xs font-bold font-mono shadow-inner"
                            >
                              <span>{blk.processName}</span>
                              <span className="text-[10px] opacity-80">{blk.allocatedSize} KB</span>
                            </div>
                          </>
                        ) : (
                          <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500 italic">
                            Free Block
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                        <span>Status:</span>
                        <span className={isAllocated ? "text-emerald-400 font-semibold" : "text-slate-400"}>
                          {isAllocated ? `In Use (${blk.processName})` : "Available"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Memory Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                <MetricStat
                  label="Total RAM"
                  value={currentResult.totalMemory}
                  unit="KB"
                  color="slate"
                />
                <MetricStat
                  label="Allocated RAM"
                  value={currentResult.totalAllocated}
                  unit="KB"
                  color="emerald"
                />
                <MetricStat
                  label="Free RAM"
                  value={currentResult.totalFree}
                  unit="KB"
                  color="cyan"
                />
                <MetricStat
                  label="Internal Frag"
                  value={currentResult.totalInternalFrag}
                  unit="KB"
                  color="amber"
                  helper="Wasted inside blocks"
                />
                <MetricStat
                  label="Allocation Rate"
                  value={`${currentResult.successCount}/${requests.length}`}
                  unit="succeeded"
                  color={currentResult.failureCount > 0 ? "rose" : "emerald"}
                />
              </div>
            </div>
          </Card>

          {/* Allocation Trace Events Table */}
          <Card
            title="Allocation Event Trace"
            subtitle="Step-by-step resolution of incoming process memory requests"
          >
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[11px]">
                    <th className="py-2.5 px-4">Request</th>
                    <th className="py-2.5 px-4">Size Required</th>
                    <th className="py-2.5 px-4">Allocated Block</th>
                    <th className="py-2.5 px-4">Internal Frag</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Diagnostic Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentResult.events.map((evt) => (
                    <tr key={evt.requestId} className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-4 font-bold text-slate-200">{evt.processName}</td>
                      <td className="py-2.5 px-4 text-slate-300">{evt.size} KB</td>
                      <td className="py-2.5 px-4">
                        {evt.allocatedBlockId ? (
                          <Badge variant="cyan">{evt.allocatedBlockId}</Badge>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        {evt.status === "SUCCESS" ? (
                          <span className="text-amber-400">{evt.internalFrag} KB</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        {evt.status === "SUCCESS" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Allocated
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                            <XCircle className="w-3.5 h-3.5" /> Failed
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-[11px] text-slate-400 max-w-xs truncate">
                        {evt.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Interactive Block & Request Editors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Memory Blocks Configuration */}
            <Card title="Configure Memory Blocks">
              <div className="space-y-2">
                {blocks.map((blk, idx) => (
                  <div key={blk.id} className="flex items-center justify-between gap-3 font-mono text-xs">
                    <span className="text-slate-300 font-semibold">{blk.id}:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="10"
                        step="10"
                        value={blk.size}
                        onChange={(e) => handleBlockChange(idx, parseInt(e.target.value, 10) || 10)}
                        className="w-24 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                      <span className="text-slate-500">KB</span>
                      <button
                        onClick={() => setBlocks(blocks.filter((_, i) => i !== idx))}
                        className="text-slate-600 hover:text-rose-400 p-1"
                        title="Delete block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Memory Requests Configuration */}
            <Card title="Configure Process Requests">
              <div className="space-y-2">
                {requests.map((req, idx) => (
                  <div key={req.id} className="flex items-center justify-between gap-3 font-mono text-xs">
                    <span className="text-slate-300 font-semibold">{req.processName}:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="5"
                        step="5"
                        value={req.size}
                        onChange={(e) => handleRequestChange(idx, parseInt(e.target.value, 10) || 5)}
                        className="w-24 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                      <span className="text-slate-500">KB</span>
                      <button
                        onClick={() => setRequests(requests.filter((_, i) => i !== idx))}
                        className="text-slate-600 hover:text-rose-400 p-1"
                        title="Delete request"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
