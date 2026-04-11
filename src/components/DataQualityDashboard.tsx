import React from 'react';
import { AlertCircle, CheckCircle, Database, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface DataQualityDashboardProps {
    totalRecords: number;
    validRecords: number;
    errors: Record<number, Record<string, string>>;
    showErrorsOnly: boolean;
    onToggleShowErrors: (show: boolean) => void;
}

export function DataQualityDashboard({
    totalRecords,
    validRecords,
    errors,
    showErrorsOnly,
    onToggleShowErrors
}: DataQualityDashboardProps) {
    const errorCount = Object.keys(errors).length;
    const healthScore = totalRecords > 0 ? Math.round((validRecords / totalRecords) * 100) : 100;

    // Calculate errors by column
    const errorsByColumn = React.useMemo(() => {
        const counts: Record<string, number> = {};
        Object.values(errors).forEach(rowErrors => {
            Object.keys(rowErrors).forEach(col => {
                counts[col] = (counts[col] || 0) + 1;
            });
        });
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5); // Top 5
    }, [errors]);

    const maxErrorCount = Math.max(...errorsByColumn.map(([, c]) => c), 1);

    const scoreColor =
        healthScore >= 90 ? '#E52D1D' :   // tangerine — excellent
        healthScore >= 70 ? '#E67E4E' :   // orange — good
        '#B4142D';                         // crimson — needs attention

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2.5 tracking-tight">
                    <span className="flex items-center justify-center w-7 h-7 bg-[#E52D1D]/10 rounded-lg">
                        <Database className="w-4 h-4 text-[#E52D1D]" />
                    </span>
                    Data Quality Overview
                </h3>
                <label
                    className="flex items-center gap-3 cursor-pointer select-none group"
                    htmlFor="errors-only-toggle"
                >
                    <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
                        Errors only
                    </span>
                    {/* Accessible toggle switch */}
                    <button
                        id="errors-only-toggle"
                        role="switch"
                        aria-checked={showErrorsOnly}
                        aria-label={showErrorsOnly ? 'Showing errors only — click to show all rows' : 'Showing all rows — click to show errors only'}
                        onClick={() => onToggleShowErrors(!showErrorsOnly)}
                        className={clsx(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2",
                            showErrorsOnly
                                ? "bg-[#B4142D] focus-visible:outline-[#B4142D]"
                                : "bg-slate-200 focus-visible:outline-slate-400"
                        )}
                    >
                        <span
                            aria-hidden="true"
                            className={clsx(
                                "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-all duration-300",
                                showErrorsOnly ? "translate-x-6" : "translate-x-1"
                            )}
                        />
                    </button>
                </label>
            </div>

            <div className="p-6 space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Total Records — Brand Black */}
                    <div className="relative overflow-hidden bg-black rounded-xl p-4 text-white">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Total Records</div>
                        <div className="text-2xl font-extrabold tracking-tight">{totalRecords.toLocaleString()}</div>
                        <div className="text-[11px] text-white/40 mt-1">Rows in dataset</div>
                        <div className="absolute -right-2 -bottom-2 w-16 h-16 rounded-full bg-white/5" />
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/5" />
                    </div>

                    {/* Valid Records — Tangerine tint */}
                    <div
                        className="relative overflow-hidden bg-[#FDECEA] rounded-xl p-4 border border-[#E52D1D]/15"
                        role="figure"
                        aria-label={`Valid records: ${validRecords.toLocaleString()}`}
                    >
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#E52D1D]/60 mb-1" aria-hidden="true">Valid Records</div>
                        <div className="text-2xl font-extrabold tracking-tight text-[#E52D1D]" aria-hidden="true">{validRecords.toLocaleString()}</div>
                        <div className="text-[11px] text-[#E52D1D]/50 mt-1 flex items-center gap-1" aria-hidden="true">
                            <CheckCircle className="w-3 h-3" />
                            Ready for export
                        </div>
                        <div className="absolute -right-2 -bottom-2 w-16 h-16 rounded-full bg-[#E52D1D]/5" aria-hidden="true" />
                    </div>

                    {/* Critical Errors — Crimson tint */}
                    <div
                        className="relative overflow-hidden bg-[#F9E0E4] rounded-xl p-4 border border-[#B4142D]/15"
                        role="figure"
                        aria-label={`Critical errors: ${errorCount.toLocaleString()} rows needing attention`}
                    >
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#B4142D]/60 mb-1" aria-hidden="true">Critical Errors</div>
                        <div className="text-2xl font-extrabold tracking-tight text-[#B4142D]" aria-hidden="true">{errorCount.toLocaleString()}</div>
                        <div className="text-[11px] text-[#B4142D]/50 mt-1 flex items-center gap-1" aria-hidden="true">
                            <AlertCircle className="w-3 h-3" />
                            Rows needing attention
                        </div>
                        <div className="absolute -right-2 -bottom-2 w-16 h-16 rounded-full bg-[#B4142D]/5" aria-hidden="true" />
                    </div>

                    {/* Health Score — Dynamic brand color */}
                    <div
                        className="relative overflow-hidden bg-white rounded-xl p-4 border-2 border-slate-100"
                        role="figure"
                        aria-label={`Health score: ${healthScore}% — ${healthScore >= 90 ? 'Excellent' : healthScore >= 70 ? 'Good' : 'Needs work'}`}
                    >
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1" aria-hidden="true">Health Score</div>
                        <div className="text-2xl font-extrabold tracking-tight" style={{ color: scoreColor }} aria-hidden="true">
                            {healthScore}%
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1" aria-hidden="true">
                            <TrendingUp className="w-3 h-3" />
                            {healthScore >= 90 ? 'Excellent' : healthScore >= 70 ? 'Good' : 'Needs work'}
                        </div>
                        {/* Decorative arc progress — aria-hidden */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14" aria-hidden="true">
                            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90" focusable="false">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#f1f5f9"
                                    strokeWidth="4"
                                />
                                <motion.path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={scoreColor}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    initial={{ strokeDasharray: '0, 100' }}
                                    animate={{ strokeDasharray: `${healthScore}, 100` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Error Distribution Chart */}
                {errorsByColumn.length > 0 && (
                    <div className="pt-2" role="region" aria-label="Top validation errors by column">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                            Top Errors by Column
                        </h4>
                        <div className="space-y-2.5">
                            {errorsByColumn.map(([column, count], idx) => (
                                <div key={column} className="flex items-center gap-3 group">
                                    <div
                                        className="w-28 text-xs font-semibold text-slate-500 truncate text-right shrink-0"
                                        title={column}
                                    >
                                        {column}
                                    </div>
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(count / maxErrorCount) * 100}%` }}
                                            transition={{ duration: 0.5, delay: idx * 0.06, ease: 'easeOut' }}
                                            className="h-full rounded-full"
                                            style={{
                                                background: `linear-gradient(90deg, #B4142D, #E52D1D)`
                                            }}
                                        />
                                    </div>
                                    <div className="w-6 text-xs font-bold text-[#B4142D] text-right shrink-0">
                                        {count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
