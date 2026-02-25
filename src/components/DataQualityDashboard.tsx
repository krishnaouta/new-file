import React from 'react';
import { AlertCircle, CheckCircle, Database } from 'lucide-react';
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

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Data Quality Overview
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">Show Errors Only</span>
                    <button
                        onClick={() => onToggleShowErrors(!showErrorsOnly)}
                        className={clsx(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            showErrorsOnly ? "bg-red-500" : "bg-slate-200"
                        )}
                    >
                        <span
                            className={clsx(
                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                showErrorsOnly ? "translate-x-6" : "translate-x-1"
                            )}
                        />
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Total Records</div>
                    <div className="text-2xl font-bold text-blue-900">{totalRecords.toLocaleString()}</div>
                    <div className="text-xs text-blue-500 mt-1">Rows in dataset</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Valid Records</div>
                    <div className="text-2xl font-bold text-green-900">{validRecords.toLocaleString()}</div>
                    <div className="text-xs text-green-500 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Ready for export
                    </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <div className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Critical Errors</div>
                    <div className="text-2xl font-bold text-red-900">{errorCount.toLocaleString()}</div>
                    <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Rows needing attention
                    </div>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 relative overflow-hidden">
                    <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">Health Score</div>
                    <div className="text-2xl font-bold text-teal-900">{healthScore}%</div>
                    {/* Simple circular progress visualization background */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-16 h-16 opacity-20">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-teal-600"
                                strokeDasharray={`${healthScore}, 100`}
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Error Distribution Chart */}
            {errorsByColumn.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-semibold text-slate-600 mb-3">Top Errors by Column</h4>
                    <div className="space-y-3">
                        {errorsByColumn.map(([column, count]) => (
                            <div key={column} className="flex items-center gap-3">
                                <div className="w-32 text-xs font-medium text-slate-500 truncate text-right" title={column}>{column}</div>
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(count / maxErrorCount) * 100}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="h-full bg-red-400 rounded-full"
                                    />
                                </div>
                                <div className="w-8 text-xs font-semibold text-red-600 text-right">{count}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
