"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { OverviewLab } from "@/components/OverviewLab";
import { CpuSchedulerLab } from "@/components/cpu/CpuSchedulerLab";
import { MemoryLab } from "@/components/memory/MemoryLab";
import { DeadlockLab } from "@/components/deadlock/DeadlockLab";
import { ProcessMonitorLab } from "@/components/process/ProcessMonitorLab";
import { AnalyticsLab } from "@/components/analytics/AnalyticsLab";
import { GuidedDemoModal } from "@/components/presentation/GuidedDemoModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("OVERVIEW");
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-100">
      {/* Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenDemo={() => setIsDemoModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "OVERVIEW" && (
          <OverviewLab
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenDemo={() => setIsDemoModalOpen(true)}
          />
        )}
        {activeTab === "CPU" && <CpuSchedulerLab />}
        {activeTab === "MEMORY" && <MemoryLab />}
        {activeTab === "DEADLOCK" && <DeadlockLab />}
        {activeTab === "PROCESS" && <ProcessMonitorLab />}
        {activeTab === "ANALYTICS" && <AnalyticsLab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/70 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <div>
            <span className="text-slate-400 font-bold">OScope Platform</span> — Interactive OS Resource Management & Performance Analysis Lab
          </div>
          <div>
            B.Tech Computer Science & Engineering • Operating Systems Lab Project (40 Marks)
          </div>
        </div>
      </footer>

      {/* Faculty Guided Demo Mode Modal */}
      <GuidedDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          setIsDemoModalOpen(false);
        }}
      />
    </div>
  );
}
