import React, { useState } from "react";
import { ContiguousAllocationView } from "./ContiguousAllocationView";
import { PageReplacementView } from "./PageReplacementView";
import { Badge } from "../common/Badge";
import { HardDrive, Layers } from "lucide-react";

export const MemoryLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"CONTIGUOUS" | "PAGING">("CONTIGUOUS");

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              Memory Management & Paging Laboratory
            </h2>
            <Badge variant="emerald">Simulated MMU & RAM</Badge>
          </div>
          <p className="text-xs text-slate-400">
            Contiguous partition placement strategies (First/Best/Worst Fit) and Virtual Memory Page Replacement (FIFO, LRU, Optimal).
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab("CONTIGUOUS")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === "CONTIGUOUS"
                ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            Contiguous Partition Allocation
          </button>
          <button
            onClick={() => setActiveTab("PAGING")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === "PAGING"
                ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Paging & Page Replacement
          </button>
        </div>
      </div>

      {/* Render Active Sub-Lab */}
      {activeTab === "CONTIGUOUS" ? (
        <ContiguousAllocationView />
      ) : (
        <PageReplacementView />
      )}
    </div>
  );
};
