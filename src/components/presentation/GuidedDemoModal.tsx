import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import {
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Cpu,
  HardDrive,
  ShieldCheck,
  Activity,
  Layers,
} from "lucide-react";

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
}

interface DemoStep {
  id: string;
  module: string;
  tabKey: string;
  title: string;
  objective: string;
  talkingPoints: string[];
  vivaQuestion: string;
  vivaAnswer: string;
  icon: React.ReactNode;
}

const DEMO_STEPS: DemoStep[] = [
  {
    id: "step-1",
    module: "CPU Scheduling",
    tabKey: "CPU",
    title: "Step 1: CPU Scheduling, Idle Periods & Preemption",
    objective: "Demonstrate FCFS, SJF, SRTF, Priority, and Round Robin on benchmark workloads with idle intervals.",
    talkingPoints: [
      "Show Gantt chart with arrival times; point out idle intervals where CPU waits for incoming processes.",
      "Compare FCFS Convoy Effect against Shortest Remaining Time First (SRTF Preemptive).",
      "Explain the exact formulas: Turnaround Time = Completion - Arrival, Waiting Time = Turnaround - Burst.",
      "Click 'Compare All' to show simultaneous multi-algorithm benchmark with optimal scheduler recommendation.",
    ],
    vivaQuestion: "Why does SRTF achieve minimal average waiting time compared to FCFS?",
    vivaAnswer: "By always scheduling the process with the shortest remaining burst time, shorter jobs finish immediately and leave the ready queue, keeping the denominator of waiting processes smaller on average across time.",
    icon: <Cpu className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: "step-2",
    module: "Memory Allocation",
    tabKey: "MEMORY",
    title: "Step 2: Contiguous Partition Allocation & Fragmentation",
    objective: "Demonstrate First Fit, Best Fit, and Worst Fit allocation strategies, internal fragmentation, and external fragmentation traps.",
    talkingPoints: [
      "Switch to 'Contiguous Partition Allocation' tab in Memory Lab.",
      "Load the Galvin 5-partition benchmark (100K, 500K, 200K, 300K, 600K) with 4 requests (212K, 417K, 112K, 426K).",
      "Show how First Fit leaves 288K internal fragmentation in Block 2 and fails on Request 4, whereas Best Fit successfully satisfies all 4 requests!",
      "Explain External Fragmentation: sufficient total free memory exists, but no single contiguous block fits the request.",
    ],
    vivaQuestion: "What is the key difference between internal and external fragmentation?",
    vivaAnswer: "Internal fragmentation occurs when allocated storage is larger than requested memory inside a fixed partition. External fragmentation occurs when total free memory is sufficient to satisfy a request, but storage is fragmented into non-contiguous slices.",
    icon: <HardDrive className="w-5 h-5 text-emerald-400" />,
  },
  {
    id: "step-3",
    module: "Virtual Memory Paging",
    tabKey: "MEMORY",
    title: "Step 3: Paging & Page Replacement (FIFO, LRU, Optimal)",
    objective: "Demonstrate page hits, page faults, evicted pages, and compare FIFO vs LRU against Belady's Optimal benchmark.",
    talkingPoints: [
      "Switch to 'Paging & Page Replacement' tab in Memory Lab.",
      "Run the textbook 20-page reference string [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1] with 3 frames.",
      "Verify exact textbook results: FIFO yields 15 faults, LRU yields 12 faults, and Optimal yields 9 faults.",
      "Step through using the 'Step' scrubber to show frame contents, hit indicators, and evicted victim pages.",
      "Highlight the academic note: Optimal is an offline benchmark requiring future knowledge, while FIFO/LRU are online heuristics.",
    ],
    vivaQuestion: "What is Belady's Anomaly?",
    vivaAnswer: "Belady's Anomaly is a phenomenon in FIFO page replacement where increasing the number of physical frames allocated to a process can paradoxically increase the total number of page faults.",
    icon: <Layers className="w-5 h-5 text-violet-400" />,
  },
  {
    id: "step-4",
    module: "Deadlock Avoidance",
    tabKey: "DEADLOCK",
    title: "Step 4: Banker's Algorithm & Tentative Resource Requests",
    objective: "Demonstrate Banker's Safety Algorithm, Need matrix calculation (Max - Alloc), and dynamic tentative requests.",
    talkingPoints: [
      "Open the Deadlock Lab; observe Available vector [3, 3, 2], Allocation, Max, and auto-computed Need matrix.",
      "Verify system is in a Safe State with sequence < P1 -> P3 -> P4 -> P0 -> P2 >.",
      "Test resource request: Process P1 requests [1, 0, 2]. Show how OS performs tentative allocation, confirms safety, and grants the request.",
      "Switch to 'Unsafe State Demo' preset to demonstrate how the OS detects an unsafe hazard and refuses requests that could trap the system in deadlock.",
    ],
    vivaQuestion: "Does an unsafe state automatically mean the system is deadlocked?",
    vivaAnswer: "No. An unsafe state only means that the OS can no longer guarantee avoiding deadlock if all processes simultaneously demand their maximum resource claims. If processes terminate without demanding their maximums, deadlock might not occur.",
    icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
  },
  {
    id: "step-5",
    module: "Process Lifecycle",
    tabKey: "PROCESS",
    title: "Step 5: Process Control Block (PCB) & 5-State Lifecycle",
    objective: "Demonstrate simulated process state transitions (New -> Ready <-> Running <-> Waiting -> Terminated).",
    talkingPoints: [
      "Open the Process Lifecycle Workspace.",
      "Spawn a new process with custom PID, burst time, and memory footprint; watch it enter the Ready queue.",
      "Demonstrate scheduler dispatching to Running, timer preemption back to Ready, I/O blocking to Waiting, and Wakeup.",
      "Inspect the live kernel audit log recording timestamps and architectural reasons for each transition.",
    ],
    vivaQuestion: "What is the difference between the Long-Term, Short-Term, and Medium-Term schedulers?",
    vivaAnswer: "Long-term (job scheduler) controls the degree of multiprogramming by admitting processes from New to Ready. Short-term (CPU scheduler) selects which ready process executes on the CPU core. Medium-term scheduler swaps processes between main memory and disk.",
    icon: <Activity className="w-5 h-5 text-cyan-400" />,
  },
];

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const step = DEMO_STEPS[currentIdx];

  const handleGoToModule = () => {
    onNavigateToTab(step.tabKey);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Faculty Evaluation & Viva Demonstration Guide"
      subtitle="Interactive step-by-step walkthrough covering every rubric requirement for Review I and Review II"
      maxWidth="2xl"
    >
      <div className="space-y-5 font-mono text-xs">
        {/* Step Progress Pills */}
        <div className="flex items-center justify-between gap-1.5 p-2 rounded-xl bg-slate-950 border border-slate-800">
          {DEMO_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIdx(idx)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold transition-all ${
                idx === currentIdx
                  ? "bg-cyan-600 text-white shadow-sm shadow-cyan-950"
                  : idx < currentIdx
                  ? "bg-slate-900 text-cyan-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Step {idx + 1}
            </button>
          ))}
        </div>

        {/* Step Header */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {step.icon}
              <h3 className="text-sm font-bold text-slate-100">{step.title}</h3>
            </div>
            <Badge variant="cyan">{step.module}</Badge>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{step.objective}</p>
        </div>

        {/* Evaluation Demonstration Talking Points */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Demonstration Talking Points for Evaluators:
          </h4>
          <ul className="space-y-1.5 pl-2">
            {step.talkingPoints.map((pt, pIdx) => (
              <li key={pIdx} className="flex items-start gap-2 text-slate-300 leading-relaxed">
                <span className="text-cyan-400 font-bold shrink-0">•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expected Viva Question & Model Answer */}
        <div className="p-3.5 rounded-xl border border-violet-800/60 bg-violet-950/20 space-y-1.5">
          <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" /> Likely Faculty Viva Question:
          </span>
          <p className="text-slate-200 font-bold italic">"{step.vivaQuestion}"</p>
          <div className="pt-1 border-t border-violet-800/40 text-slate-300 leading-relaxed text-[11px]">
            <strong className="text-violet-300">Model Answer: </strong>
            {step.vivaAnswer}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              icon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentIdx === DEMO_STEPS.length - 1}
              onClick={() => setCurrentIdx((prev) => Math.min(DEMO_STEPS.length - 1, prev + 1))}
            >
              Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <Button
            variant="emerald"
            size="sm"
            onClick={handleGoToModule}
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            Launch {step.module} Lab View
          </Button>
        </div>
      </div>
    </Modal>
  );
};
