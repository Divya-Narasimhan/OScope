import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "cyan" | "violet" | "emerald" | "amber" | "rose" | "slate" | "blue";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "cyan",
  size = "sm",
  className = "",
}) => {
  const variantStyles = {
    cyan: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
    violet: "bg-slate-800/60 text-slate-200 border-slate-700/60",
    emerald: "bg-emerald-950/60 text-emerald-400 border-emerald-800/60",
    amber: "bg-amber-950/60 text-amber-400 border-amber-800/60",
    rose: "bg-rose-950/60 text-rose-400 border-rose-800/60",
    slate: "bg-slate-800/60 text-slate-300 border-slate-700/60",
    blue: "bg-slate-800/60 text-emerald-200 border-slate-700/60",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-mono tracking-tight transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
