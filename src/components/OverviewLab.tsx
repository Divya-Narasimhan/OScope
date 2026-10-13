import React from "react";
import { Card } from "./common/Card";
import { Badge } from "./common/Badge";
import { Button } from "./common/Button";
import { MetricStat } from "./common/MetricStat";
import {
  Cpu,
  HardDrive,
  ShieldCheck,
  Activity,
  BarChart2,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Zap,
  BookOpen,
} from "lucide-react";

interface OverviewLabProps {
  onNavigateToTab: (tab: string) => void;
  onOpenDemo: () => void;
}

export const OverviewLab: React.FC<OverviewLabProps> = ({
  onNavigateToTab,
  onOpenDemo,
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="cyan" size="md">
              B.Tech Operating Systems Lab Project
            </Badge>
            <Badge variant="emerald" size="md">
              Review I & II Ready (40 Marks)
            </Badge>
            <Badge variant="violet" size="md">
              100% Offline Simulation
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            OS<span className="text-cyan-400">cope</span> — Interactive Operating System Resource Management & Performance Analysis Platform
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            A comprehensive, mathematically rigorous laboratory simulator designed for university engineering project demonstrations. Explore CPU dispatching, contiguous and paged memory allocation, Banker's deadlock avoidance, and kernel process lifecycles through step-by-step visualizations and analytics.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigateToTab("CPU")}
              icon={<Zap className="w-4 h-4" />}
            >
              Launch CPU Scheduling Lab
            </Button>
            <Button
              variant="emerald"
              size="lg"
              onClick={onOpenDemo}
              icon={<GraduationCap className="w-4 h-4" />}
            >
              Faculty Guided Viva Mode
            </Button>
          </div>
        </div>
      </div>

      {/* Top Architecture Metric Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricStat
          label="Core Modules"
          value="5"
          unit="workspaces"
          helper="CPU, Memory, Paging, Deadlock, PCB"
          color="cyan"
        />
        <MetricStat
          label="OS Algorithms"
          value="14"
          unit="implemented"
          helper="FCFS, SJF, SRTF, RR, FIFO, LRU..."
          color="emerald"
        />
        <MetricStat
          label="Automated Tests"
          value="19 / 19"
          unit="passing"
          helper="Verified against Galvin benchmarks"
          color="violet"
        />
        <MetricStat
          label="Execution Mode"
          value="Client-Side"
          unit="zero cloud"
          helper="Deterministic local simulation"
          color="slate"
        />
      </div>

      {/* Interactive Module Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
            Laboratory Workspaces & Simulation Modules
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Select a module to begin interactive experimentation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Module A: CPU Scheduling */}
          <div
            onClick={() => onNavigateToTab("CPU")}
            className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:-translate-y-1 group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <Badge variant="cyan">Module A</Badge>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
              CPU Scheduling Laboratory
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              First Come First Served (FCFS), Shortest Job First (SJF), Shortest Remaining Time First (SRTF Preemptive), Priority (Preemptive & Non-Preemptive), and Round Robin with configurable quantum. Features animated Gantt timeline, idle gap handling, and multi-algorithm comparative benchmarks.
            </p>
            <div className="pt-2 flex items-center text-xs font-mono text-cyan-400 font-semibold group-hover:underline">
              Enter CPU Lab <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Module B: Memory Management */}
          <div
            onClick={() => onNavigateToTab("MEMORY")}
            className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:-translate-y-1 group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <Badge variant="emerald">Module B</Badge>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
              Memory Management & Paging Lab
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Contiguous partition placement (First Fit, Best Fit, Worst Fit) with internal and external fragmentation visualizers. Virtual memory paging workspace implementing FIFO, LRU, and Belady's Optimal replacement with frame matrices and Belady's Anomaly analysis.
            </p>
            <div className="pt-2 flex items-center text-xs font-mono text-emerald-400 font-semibold group-hover:underline">
              Enter Memory Lab <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Module C: Deadlock & Banker's */}
          <div
            onClick={() => onNavigateToTab("DEADLOCK")}
            className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-violet-500/50 cursor-pointer transition-all hover:-translate-y-1 group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-violet-950/80 border border-violet-800/80 text-violet-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <Badge variant="violet">Module C</Badge>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-violet-400 transition-colors">
              Resource Allocation & Deadlock Lab
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full Banker's Algorithm safety simulator: Available vector, Allocation matrix, Max claim matrix, and computed Need matrix. Step-by-step Work vector expansion trace and dynamic tentative resource request validation with rollback on unsafe detection.
            </p>
            <div className="pt-2 flex items-center text-xs font-mono text-violet-400 font-semibold group-hover:underline">
              Enter Deadlock Lab <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Module D: Process Control */}
          <div
            onClick={() => onNavigateToTab("PROCESS")}
            className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:-translate-y-1 group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-800/80 text-amber-400">
                <Activity className="w-5 h-5" />
              </div>
              <Badge variant="amber">Module D</Badge>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Process Lifecycle & Control Workspace
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Operating system 5-state process lifecycle simulation (New, Ready, Running, Waiting, Terminated). Searchable, sortable, and filterable Process Control Block (PCB) table with interactive dispatch, preemption, I/O wait, wakeup, and process creation controls.
            </p>
            <div className="pt-2 flex items-center text-xs font-mono text-amber-400 font-semibold group-hover:underline">
              Enter Process Lab <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Guidelines Alignment Card */}
      <Card
        title="Faculty Project Rubric Alignment (40 Marks Framework)"
        subtitle="Direct mapping to course guidelines for Review I, Review II, and Final Evaluation"
        badge={<Badge variant="slate">VTOP Rubric Compliance</Badge>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
            <span className="text-cyan-400 font-bold uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Review I Deliverables (60-70% Prototype)
            </span>
            <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              <li>• System architecture and modular engine contracts defined.</li>
              <li>• Core scheduling and memory algorithms executable.</li>
              <li>• Interactive prototype demonstrating mathematical calculations.</li>
              <li>• Modular division between Team Member 1 & Team Member 2.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
            <span className="text-emerald-400 font-bold uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Review II Deliverables (Final Working Platform)
            </span>
            <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              <li>• 100% complete working implementation with zero dummy stubs.</li>
              <li>• Automated test suite with 19 passing unit tests in Vitest.</li>
              <li>• Error handling for negative values, ties, and unsafe states.</li>
              <li>• Integrated Faculty Guided Viva Mode with talking points.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
