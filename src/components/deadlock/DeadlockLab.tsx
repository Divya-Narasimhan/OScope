import React, { useState } from "react";
import { BankersState, ResourceRequestResult } from "@/lib/deadlock/types";
import {
  calculateNeedMatrix,
  checkSafety,
  processResourceRequest,
} from "@/lib/deadlock/bankers";
import { DEADLOCK_PRESETS } from "@/lib/presets/deadlockPresets";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { MetricStat } from "../common/MetricStat";
import { MatrixGrid } from "./MatrixGrid";
import { BankersSafetyVisualizer } from "./BankersSafetyVisualizer";
import {
  ShieldAlert,
  ShieldCheck,
  Send,
  RotateCcw,
  Info,
  HelpCircle,
  FileCheck2,
} from "lucide-react";

export const DeadlockLab: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("galvin_bankers_safe");
  const [state, setState] = useState<BankersState>(DEADLOCK_PRESETS[0].state);

  // Resource Request test inputs
  const [requestProcessIdx, setRequestProcessIdx] = useState<number>(1);
  const [requestVector, setRequestVector] = useState<number[]>([1, 0, 2]);
  const [requestFeedback, setRequestFeedback] = useState<ResourceRequestResult | null>(null);

  const handlePresetChange = (id: string) => {
    const preset = DEADLOCK_PRESETS.find((p) => p.id === id);
    if (preset) {
      setSelectedPresetId(id);
      setState({
        processes: [...preset.state.processes],
        resourceTypes: [...preset.state.resourceTypes],
        available: [...preset.state.available],
        allocation: preset.state.allocation.map((r) => [...r]),
        max: preset.state.max.map((r) => [...r]),
        need: preset.state.need.map((r) => [...r]),
      });
      setRequestFeedback(null);
      if (preset.suggestedRequest) {
        setRequestProcessIdx(preset.suggestedRequest.processIndex);
        setRequestVector([...preset.suggestedRequest.request]);
      } else {
        setRequestVector(Array(preset.state.resourceTypes.length).fill(0));
      }
    }
  };

  // Re-compute Need dynamically
  const computedNeed = calculateNeedMatrix(state.max, state.allocation);
  const currentState: BankersState = {
    ...state,
    need: computedNeed,
  };

  const safetyResult = checkSafety(currentState);

  const handleAvailableChange = (index: number, val: string) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    const updated = [...state.available];
    updated[index] = num;
    setState({ ...state, available: updated });
    setRequestFeedback(null);
  };

  const handleAllocationChange = (newAlloc: number[][]) => {
    setState({ ...state, allocation: newAlloc });
    setRequestFeedback(null);
  };

  const handleMaxChange = (newMax: number[][]) => {
    setState({ ...state, max: newMax });
    setRequestFeedback(null);
  };

  const handleRequestSubmit = () => {
    const result = processResourceRequest(
      currentState,
      requestProcessIdx,
      requestVector
    );
    setRequestFeedback(result);
    if (result.status === "GRANTED" && result.updatedState) {
      setState(result.updatedState);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400"></span>
              Resource Allocation & Deadlock Laboratory
            </h2>
            <Badge variant="violet">Banker's Avoidance Algorithm</Badge>
          </div>
          <p className="text-xs text-slate-400">
            Multi-resource safety check, dynamic Need matrix calculation, tentative allocations, and deadlock avoidance.
          </p>
        </div>

        {/* Presets & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Preset:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {DEADLOCK_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handlePresetChange(selectedPresetId)}
            icon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Safety Evaluation Visualizer Card */}
      <Card
        title="Current System State & Safety Verification"
        subtitle="Evaluates if available resources can satisfy remaining process claims without deadlock hazard"
        badge={
          <Badge variant={safetyResult.isSafe ? "emerald" : "rose"}>
            {safetyResult.isSafe ? "Safe Sequence Available" : "Unsafe State"}
          </Badge>
        }
      >
        <BankersSafetyVisualizer
          safetyResult={safetyResult}
          resourceTypes={state.resourceTypes}
        />
      </Card>

      {/* Available Vector Configuration */}
      <Card
        title="Available Resource Vector"
        subtitle="Current unallocated instances of each resource type in the system"
      >
        <div className="flex items-center gap-4 flex-wrap font-mono text-xs">
          {state.resourceTypes.map((res, idx) => (
            <div
              key={res}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800"
            >
              <span className="font-bold text-cyan-400">Resource {res}:</span>
              <input
                type="number"
                min="0"
                value={state.available[idx]}
                onChange={(e) => handleAvailableChange(idx, e.target.value)}
                className="w-14 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-center font-bold text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Matrices Grid: Allocation, Max, and Need */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Allocation Matrix */}
        <MatrixGrid
          title="Allocation Matrix"
          subtitle="Resources currently held"
          processes={state.processes}
          resourceTypes={state.resourceTypes}
          matrix={state.allocation}
          onChange={handleAllocationChange}
        />

        {/* Max Demand Matrix */}
        <MatrixGrid
          title="Maximum Claim Matrix"
          subtitle="Declared maximum demand"
          processes={state.processes}
          resourceTypes={state.resourceTypes}
          matrix={state.max}
          onChange={handleMaxChange}
        />

        {/* Need Matrix (Read Only, Computed) */}
        <MatrixGrid
          title="Need Matrix (Need = Max - Alloc)"
          subtitle="Remaining resources needed"
          processes={state.processes}
          resourceTypes={state.resourceTypes}
          matrix={computedNeed}
          readOnly={true}
          highlightClass="text-amber-400"
        />
      </div>

      {/* Interactive Resource Request Simulator */}
      <Card
        title="Resource-Request Algorithm Simulator"
        subtitle="Simulates a dynamic runtime request from a process with tentative allocation and safety check"
        badge={<Badge variant="cyan">Tentative Allocator</Badge>}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Requesting Process:</span>
              <select
                value={requestProcessIdx}
                onChange={(e) => {
                  setRequestProcessIdx(parseInt(e.target.value, 10));
                  setRequestFeedback(null);
                }}
                className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
              >
                {state.processes.map((proc, idx) => (
                  <option key={proc} value={idx}>
                    {proc} (Remaining Need: [{computedNeed[idx]?.join(", ")}])
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 font-semibold">Request Vector:</span>
              {state.resourceTypes.map((res, rIdx) => (
                <div key={res} className="flex items-center gap-1">
                  <span className="text-slate-500 text-[11px]">{res}:</span>
                  <input
                    type="number"
                    min="0"
                    value={requestVector[rIdx] ?? 0}
                    onChange={(e) => {
                      const num = Math.max(0, parseInt(e.target.value, 10) || 0);
                      const updated = [...requestVector];
                      updated[rIdx] = num;
                      setRequestVector(updated);
                      setRequestFeedback(null);
                    }}
                    className="w-12 bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-center font-bold text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              ))}
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleRequestSubmit}
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Evaluate Request
            </Button>
          </div>

          {/* Request Result Alert */}
          {requestFeedback && (
            <div
              className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 ${
                requestFeedback.status === "GRANTED"
                  ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
                  : requestFeedback.status === "WAIT_UNAVAILABLE"
                  ? "border-amber-500/40 bg-amber-950/20 text-amber-300"
                  : "border-rose-500/40 bg-rose-950/20 text-rose-300"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>Result: {requestFeedback.status}</span>
              </div>
              <p className="leading-relaxed">{requestFeedback.message}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Academic OS Concepts Guide */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-300">
          <h5 className="font-bold text-slate-100">
            Operating Systems Note: Deadlock Avoidance vs Deadlock Detection
          </h5>
          <p className="text-slate-400 leading-relaxed">
            Banker's Algorithm is a <strong>Deadlock Avoidance</strong> algorithm. It requires each process to declare its maximum possible resource claim in advance. The OS then never grants a request if doing so would lead to an <em>unsafe state</em>. An <strong>unsafe state is not deadlock</strong>, but rather an unstable state from which a deadlock could occur if processes subsequently request their declared maximums. In contrast, <strong>Deadlock Detection</strong> does not require maximum claims; it periodically inspects wait-for graphs or allocation/request matrices to locate circular wait cycles.
          </p>
        </div>
      </div>
    </div>
  );
};
