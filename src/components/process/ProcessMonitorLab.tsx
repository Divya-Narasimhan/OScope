import React, { useState } from "react";
import {
  SystemProcess,
  ProcessLifecycleState,
  StateTransitionEvent,
} from "@/lib/process/types";
import {
  INITIAL_SYSTEM_PROCESSES,
  canTransition,
  getTransitionReason,
} from "@/lib/process/processManager";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { MetricStat } from "../common/MetricStat";
import { Modal } from "../common/Modal";
import {
  Activity,
  Plus,
  Play,
  Pause,
  AlertCircle,
  Square,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Terminal,
  Cpu,
} from "lucide-react";

export const ProcessMonitorLab: React.FC = () => {
  const [processes, setProcesses] = useState<SystemProcess[]>(INITIAL_SYSTEM_PROCESSES);
  const [events, setEvents] = useState<StateTransitionEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterState, setFilterState] = useState<string>("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // New process form
  const [newName, setNewName] = useState<string>("worker_task");
  const [newPriority, setNewPriority] = useState<number>(3);
  const [newBurst, setNewBurst] = useState<number>(15);
  const [newMemory, setNewMemory] = useState<number>(128);

  const handleStateChange = (
    pid: number,
    targetState: ProcessLifecycleState
  ) => {
    const proc = processes.find((p) => p.pid === pid);
    if (!proc) return;

    if (!canTransition(proc.state, targetState)) {
      alert(`Invalid OS transition: Cannot move from ${proc.state} to ${targetState}.`);
      return;
    }

    const reason = getTransitionReason(proc.state, targetState);
    const now = Date.now();

    const updated = processes.map((p) => {
      if (p.pid === pid) {
        return {
          ...p,
          state: targetState,
          lastStateChange: now,
          remainingTime: targetState === "TERMINATED" ? 0 : p.remainingTime,
        };
      }
      return p;
    });

    setProcesses(updated);
    setEvents((prev) => [
      {
        timestamp: now,
        pid,
        processName: proc.name,
        fromState: proc.state,
        toState: targetState,
        reason,
      },
      ...prev.slice(0, 19),
    ]);
  };

  const handleCreateProcess = () => {
    const nextPid =
      processes.length > 0 ? Math.max(...processes.map((p) => p.pid)) + 1 : 101;
    const newProc: SystemProcess = {
      pid: nextPid,
      name: newName.trim() || `task_${nextPid}`,
      state: "READY",
      priority: newPriority,
      burstTime: newBurst,
      remainingTime: newBurst,
      memorySize: newMemory,
      resourcesAllocated: ["MEM_BLOCK_TEMP"],
      createdAt: Date.now(),
      lastStateChange: Date.now(),
    };

    setProcesses([...processes, newProc]);
    setEvents((prev) => [
      {
        timestamp: Date.now(),
        pid: nextPid,
        processName: newProc.name,
        fromState: "NEW",
        toState: "READY",
        reason: "New process created and admitted to Ready queue",
      },
      ...prev,
    ]);
    setIsCreateModalOpen(false);
  };

  // Filter processes
  const filteredProcesses = processes.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pid.toString().includes(searchQuery);
    const matchesState = filterState === "ALL" || p.state === filterState;
    return matchesSearch && matchesState;
  });

  // State Counts
  const runningCount = processes.filter((p) => p.state === "RUNNING").length;
  const readyCount = processes.filter((p) => p.state === "READY").length;
  const waitingCount = processes.filter((p) => p.state === "WAITING").length;
  const terminatedCount = processes.filter((p) => p.state === "TERMINATED").length;

  const stateBadges: Record<ProcessLifecycleState, React.ReactNode> = {
    NEW: <Badge variant="slate">NEW</Badge>,
    READY: <Badge variant="cyan">READY</Badge>,
    RUNNING: <Badge variant="emerald">RUNNING</Badge>,
    WAITING: <Badge variant="amber">WAITING</Badge>,
    TERMINATED: <Badge variant="rose">TERMINATED</Badge>,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              Process Lifecycle & Control Workspace
            </h2>
            <Badge variant="cyan">Simulated Kernel Process Manager</Badge>
          </div>
          <p className="text-xs text-slate-400">
            Lifecycle state transitions (New → Ready ↔ Running ↔ Waiting → Terminated), short-term dispatching, and PCB metadata.
          </p>
        </div>

        <Button
          variant="emerald"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Create Process
        </Button>
      </div>

      {/* State Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricStat
          label="Running (CPU)"
          value={runningCount}
          unit="active core"
          color="emerald"
          helper="Actively executing instructions"
        />
        <MetricStat
          label="Ready Queue"
          value={readyCount}
          unit="processes"
          color="cyan"
          helper="Waiting for CPU scheduler"
        />
        <MetricStat
          label="Blocked / Waiting"
          value={waitingCount}
          unit="processes"
          color="amber"
          helper="Waiting for I/O completion"
        />
        <MetricStat
          label="Terminated"
          value={terminatedCount}
          unit="processes"
          color="rose"
          helper="Execution finished"
        />
      </div>

      {/* Process Lifecycle State Diagram */}
      <Card
        title="OS Five-State Process Lifecycle Model"
        subtitle="Visual distribution of resident processes across operating system lifecycle queues"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          {/* Ready Queue Box */}
          <div className="p-3.5 rounded-xl border border-cyan-800/60 bg-cyan-950/20 space-y-2">
            <div className="flex items-center justify-between border-b border-cyan-800/40 pb-1.5">
              <span className="font-bold text-cyan-400">READY QUEUE</span>
              <Badge variant="cyan">{readyCount}</Badge>
            </div>
            <div className="space-y-1 min-h-[60px]">
              {processes
                .filter((p) => p.state === "READY")
                .map((p) => (
                  <div
                    key={p.pid}
                    className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px]"
                  >
                    <span className="font-bold">{p.name}</span>
                    <button
                      onClick={() => handleStateChange(p.pid, "RUNNING")}
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" /> Dispatch
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Running State Box */}
          <div className="p-3.5 rounded-xl border border-emerald-800/60 bg-emerald-950/20 space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-1.5">
              <span className="font-bold text-emerald-400">RUNNING (CPU)</span>
              <Badge variant="emerald">{runningCount}</Badge>
            </div>
            <div className="space-y-1 min-h-[60px]">
              {processes
                .filter((p) => p.state === "RUNNING")
                .map((p) => (
                  <div
                    key={p.pid}
                    className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{p.name} (PID: {p.pid})</span>
                      <span className="text-emerald-400">ACTIVE</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-[10px]">
                      <button
                        onClick={() => handleStateChange(p.pid, "READY")}
                        className="text-cyan-400 hover:underline"
                        title="Timer interrupt preemption"
                      >
                        Preempt
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handleStateChange(p.pid, "WAITING")}
                        className="text-amber-400 hover:underline"
                        title="I/O Request"
                      >
                        I/O Wait
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handleStateChange(p.pid, "TERMINATED")}
                        className="text-rose-400 hover:underline"
                        title="Exit"
                      >
                        Exit
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Waiting Box */}
          <div className="p-3.5 rounded-xl border border-amber-800/60 bg-amber-950/20 space-y-2">
            <div className="flex items-center justify-between border-b border-amber-800/40 pb-1.5">
              <span className="font-bold text-amber-400">BLOCKED / WAITING</span>
              <Badge variant="amber">{waitingCount}</Badge>
            </div>
            <div className="space-y-1 min-h-[60px]">
              {processes
                .filter((p) => p.state === "WAITING")
                .map((p) => (
                  <div
                    key={p.pid}
                    className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px]"
                  >
                    <span>{p.name}</span>
                    <button
                      onClick={() => handleStateChange(p.pid, "READY")}
                      className="text-cyan-400 hover:underline"
                    >
                      I/O Done
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Terminated Box */}
          <div className="p-3.5 rounded-xl border border-rose-800/60 bg-rose-950/20 space-y-2">
            <div className="flex items-center justify-between border-b border-rose-800/40 pb-1.5">
              <span className="font-bold text-rose-400">TERMINATED</span>
              <Badge variant="rose">{terminatedCount}</Badge>
            </div>
            <div className="space-y-1 min-h-[60px] max-h-24 overflow-y-auto">
              {processes
                .filter((p) => p.state === "TERMINATED")
                .map((p) => (
                  <div
                    key={p.pid}
                    className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-500"
                  >
                    <span className="line-through">{p.name}</span>
                    <span>Dead</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Process Control Table */}
      <Card
        title="Process Control Block (PCB) Table"
        subtitle="Detailed register of resident system processes, priority levels, memory allocation, and lifecycle controls"
      >
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search PID or process name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none w-full font-mono"
              />
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-slate-400">Filter:</span>
              {["ALL", "RUNNING", "READY", "WAITING", "TERMINATED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterState(st)}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                    filterState === st
                      ? "bg-slate-700 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[11px]">
                  <th className="py-2.5 px-4">PID</th>
                  <th className="py-2.5 px-4">Name</th>
                  <th className="py-2.5 px-4">State</th>
                  <th className="py-2.5 px-4">Priority</th>
                  <th className="py-2.5 px-4">Memory</th>
                  <th className="py-2.5 px-4">Burst / Rem</th>
                  <th className="py-2.5 px-4">Allocated Resources</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProcesses.map((p) => (
                  <tr key={p.pid} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-bold text-slate-300">#{p.pid}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-100">{p.name}</td>
                    <td className="py-2.5 px-4">{stateBadges[p.state]}</td>
                    <td className="py-2.5 px-4 text-slate-300">{p.priority}</td>
                    <td className="py-2.5 px-4 text-slate-300">{p.memorySize} KB</td>
                    <td className="py-2.5 px-4 text-slate-300">
                      {p.burstTime} / {p.remainingTime}
                    </td>
                    <td className="py-2.5 px-4 text-[11px] text-slate-400">
                      {p.resourcesAllocated.join(", ") || "None"}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {p.state !== "TERMINATED" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {p.state === "READY" && (
                            <button
                              onClick={() => handleStateChange(p.pid, "RUNNING")}
                              className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 hover:bg-emerald-900 text-[11px]"
                            >
                              Dispatch
                            </button>
                          )}
                          {p.state === "RUNNING" && (
                            <button
                              onClick={() => handleStateChange(p.pid, "WAITING")}
                              className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-400 hover:bg-amber-900 text-[11px]"
                            >
                              Block
                            </button>
                          )}
                          {p.state === "WAITING" && (
                            <button
                              onClick={() => handleStateChange(p.pid, "READY")}
                              className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 hover:bg-cyan-900 text-[11px]"
                            >
                              Wakeup
                            </button>
                          )}
                          <button
                            onClick={() => handleStateChange(p.pid, "TERMINATED")}
                            className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-400 hover:bg-rose-900 text-[11px]"
                          >
                            Kill
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* State Transition Event Log */}
      {events.length > 0 && (
        <Card
          title="Kernel Process Event Log"
          subtitle="Real-time log of dispatcher events, preemption interrupts, and state transitions"
        >
          <div className="max-h-48 overflow-y-auto space-y-1 font-mono text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
            {events.map((evt, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-300 leading-relaxed">
                <span className="text-slate-500">
                  [{new Date(evt.timestamp).toLocaleTimeString()}]
                </span>
                <span className="font-bold text-cyan-400">#{evt.pid} ({evt.processName})</span>
                <span className="text-slate-400">: {evt.fromState} → {evt.toState}</span>
                <span className="text-slate-500 text-[11px]">({evt.reason})</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Create Process Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Spawn New Simulated Process"
        subtitle="Configure PCB parameters for the newly created process"
      >
        <div className="space-y-4 font-mono text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Process Name:</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Priority:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={newPriority}
                onChange={(e) => setNewPriority(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">CPU Burst:</label>
              <input
                type="number"
                min="1"
                value={newBurst}
                onChange={(e) => setNewBurst(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Memory (KB):</label>
              <input
                type="number"
                min="16"
                step="16"
                value={newMemory}
                onChange={(e) => setNewMemory(parseInt(e.target.value, 10) || 16)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button variant="secondary" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="emerald" size="sm" onClick={handleCreateProcess}>
              Create Process
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
