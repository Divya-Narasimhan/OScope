import React from "react";
import { Button } from "./common/Button";
import {
  Cpu,
  HardDrive,
  ShieldCheck,
  Activity,
  BarChart2,
  Terminal,
  Home,
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const navItems = [
    { key: "OVERVIEW", label: "Overview", icon: <Home className="w-4 h-4" /> },
    { key: "CPU", label: "CPU Scheduler", icon: <Cpu className="w-4 h-4" /> },
    { key: "MEMORY", label: "Memory & Paging", icon: <HardDrive className="w-4 h-4" /> },
    { key: "DEADLOCK", label: "Deadlock & Banker's", icon: <ShieldCheck className="w-4 h-4" /> },
    { key: "PROCESS", label: "Process Control", icon: <Activity className="w-4 h-4" /> },
    { key: "ANALYTICS", label: "Analytics & Theory", icon: <BarChart2 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-900/50 shadow-lg shadow-emerald-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onTabChange("OVERVIEW")}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-green-500 to-emerald-300 p-0.5 shadow-md shadow-emerald-950">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Terminal className="w-4 h-4 text-emerald-300 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white font-mono">
                  OS<span className="text-emerald-300">cope</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono -mt-0.5">
                OS Resource Management & Analysis Platform
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-emerald-900/50">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onTabChange(item.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-950"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2" />
        </div>

        {/* Mobile Nav row */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto pb-2.5 pt-1 text-xs">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap font-mono ${
                activeTab === item.key
                  ? "bg-cyan-600 text-white font-bold"
                  : "text-slate-400 hover:bg-slate-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
