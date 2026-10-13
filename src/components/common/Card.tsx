import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  title,
  subtitle,
  badge,
  actions,
  footer,
}) => {
  return (
    <div
      className={`glass-panel rounded-xl overflow-hidden shadow-xl transition-all ${className}`}
    >
      {(title || actions || badge) && (
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between gap-3 bg-slate-900/40">
          <div>
            <div className="flex items-center gap-2.5">
              {title && (
                <h3 className="text-sm font-semibold text-slate-100 tracking-wide uppercase">
                  {title}
                </h3>
              )}
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-900/30 text-xs text-slate-400">
          {footer}
        </div>
      )}
    </div>
  );
};
