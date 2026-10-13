import React from "react";

interface MatrixGridProps {
  title: string;
  subtitle?: string;
  processes: string[];
  resourceTypes: string[];
  matrix: number[][];
  readOnly?: boolean;
  onChange?: (newMatrix: number[][]) => void;
  highlightClass?: string;
}

export const MatrixGrid: React.FC<MatrixGridProps> = ({
  title,
  subtitle,
  processes,
  resourceTypes,
  matrix,
  readOnly = false,
  onChange,
  highlightClass = "text-slate-200",
}) => {
  const handleCellChange = (rIdx: number, cIdx: number, val: string) => {
    if (!onChange || readOnly) return;
    const num = Math.max(0, parseInt(val, 10) || 0);
    const updated = matrix.map((row, i) =>
      i === rIdx ? row.map((c, j) => (j === cIdx ? num : c)) : [...row]
    );
    onChange(updated);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          {title}
        </h4>
        {subtitle && (
          <span className="text-[11px] text-slate-500 font-mono">{subtitle}</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
              <th className="py-1.5 px-2 text-left">Proc</th>
              {resourceTypes.map((res) => (
                <th key={res} className="py-1.5 px-2">
                  {res}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {processes.map((proc, rIdx) => (
              <tr key={proc} className="hover:bg-slate-900/30">
                <td className="py-1.5 px-2 text-left font-bold text-slate-400">
                  {proc}
                </td>
                {resourceTypes.map((_, cIdx) => {
                  const val = matrix[rIdx]?.[cIdx] ?? 0;
                  return (
                    <td key={cIdx} className="py-1 px-1.5">
                      {readOnly ? (
                        <span className={`font-semibold ${highlightClass}`}>
                          {val}
                        </span>
                      ) : (
                        <input
                          type="number"
                          min="0"
                          value={val}
                          onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                          className="w-12 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-center text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
