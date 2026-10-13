import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "emerald" | "amber";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      "bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-950 border border-cyan-500/30 active:translate-y-0.5",
    secondary:
      "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 active:translate-y-0.5",
    emerald:
      "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-950 border border-emerald-500/30 active:translate-y-0.5",
    amber:
      "bg-amber-600 hover:bg-amber-500 text-white shadow-sm shadow-amber-950 border border-amber-500/30 active:translate-y-0.5",
    danger:
      "bg-rose-600/80 hover:bg-rose-500 text-white border border-rose-500/40 active:translate-y-0.5",
    ghost:
      "bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs gap-1.5 rounded-md",
    md: "px-3.5 py-1.5 text-sm gap-2 rounded-lg font-medium",
    lg: "px-5 py-2.5 text-base gap-2.5 rounded-lg font-medium",
  };

  return (
    <button
      className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
