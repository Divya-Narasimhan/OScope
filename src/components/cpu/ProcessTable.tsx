import React, { useState } from "react";
import { Process } from "@/lib/cpu/types";
import { Plus, Trash2, Shuffle, RotateCcw } from "lucide-react";
import { Button } from "../common/Button";

interface ProcessTableProps {
  processes: Process[];
  onChange: (processes: Process[]) => void;
  onReset: () => void;
}

export const ProcessTable: React.FC<ProcessTableProps> = ({
  processes,
  onChange,
  onReset,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpdate = (
    index: number,
    field: keyof Process,
    value: string | number
  ) => {
    setErrorMsg(null);
    const updated = [...processes];
    const proc = { ...updated[index] };

    if (field === "name") {
      proc.name = String(value);
      proc.id = String(value);
    } else {
      const num = parseInt(String(value), 10);
      if (isNaN(num) || num < 0) {
        setErrorMsg("Values must be non-negative integers.");
        return;
      }
      if (field === "burstTime" && num <= 0) {
        setErrorMsg("Burst time must be greater than zero.");
        return;
      }
      (proc[field] as number) = num;
    }

    updated[index] = proc;
    onChange(updated);
  };

  const handleAddProcess = () => {
    const nextNum = processes.length + 1;
    const colors = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#3b82f6"];
    const newProc: Process = {
      id: `P${nextNum}`,
      name: `P${nextNum}`,
      arrivalTime: processes.length > 0 ? Math.max(...processes.map((p) => p.arrivalTime)) + 1 : 0,
      burstTime: Math.floor(Math.random() * 6) + 2,
      priority: Math.floor(Math.random() * 4) + 1,
      color: colors[processes.length % colors.length],
    };
    onChange([...processes, newProc]);
  };

  const handleDeleteProcess = (index: number) => {
    if (processes.length <= 1) {
      setErrorMsg("At least one process must remain in the workload.");
      return;
    }
    const updated = processes.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleRandomize = () => {
    const colors = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#3b82f6"];
    const count = Math.floor(Math.random() * 3) + 4; // 4 to 6 processes
    const randomProcs: Process[] = Array.from({ length: count }, (_, i) => ({
      id: `P${i + 1}`,
      name: `P${i + 1}`,
      arrivalTime: Math.floor(Math.random() * 8),
      burstTime: Math.floor(Math.random() * 8) + 1,
      priority: Math.floor(Math.random() * 5) + 1,
      color: colors[i % colors.length],
    }));
    // sort arrivals slightly for sensible starting state
    randomProcs.sort((a, b) => a.arrivalTime - b.arrivalTime);
    onChange(randomProcs);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Workload Configuration ({processes.length} Processes)
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRandomize}
            icon={<Shuffle className="w-3.5 h-3.5 text-cyan-400" />}
          >
            Randomize
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onReset}
            icon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
          >
            Reset
          </Button>
          <Button
            variant="emerald"
            size="sm"
            onClick={handleAddProcess}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Process
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-mono">
          ⚠ {errorMsg}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase font-mono text-[11px]">
              <th className="py-2.5 px-4 font-semibold">PID / Name</th>
              <th className="py-2.5 px-4 font-semibold">Arrival Time (AT)</th>
              <th className="py-2.5 px-4 font-semibold">Burst Time (BT)</th>
              <th className="py-2.5 px-4 font-semibold">
                Priority <span className="text-[10px] lowercase text-slate-500">(1=Highest)</span>
              </th>
              <th className="py-2.5 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {processes.map((proc, idx) => (
              <tr key={proc.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: proc.color || "#06b6d4" }}
                    />
                    <input
                      type="text"
                      value={proc.name}
                      onChange={(e) => handleUpdate(idx, "name", e.target.value)}
                      className="w-20 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-semibold focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </td>
                <td className="py-2 px-4">
                  <input
                    type="number"
                    min="0"
                    value={proc.arrivalTime}
                    onChange={(e) => handleUpdate(idx, "arrivalTime", e.target.value)}
                    className="w-20 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    type="number"
                    min="1"
                    value={proc.burstTime}
                    onChange={(e) => handleUpdate(idx, "burstTime", e.target.value)}
                    className="w-20 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    type="number"
                    min="1"
                    value={proc.priority}
                    onChange={(e) => handleUpdate(idx, "priority", e.target.value)}
                    className="w-20 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </td>
                <td className="py-2 px-4 text-right">
                  <button
                    onClick={() => handleDeleteProcess(idx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                    title="Remove process"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
