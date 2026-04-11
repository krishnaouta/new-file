import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileSpreadsheet,
  Database,
  BarChart3,
  Upload,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Page } from '../types';

interface MigrationRun {
  fileName: string;
  rows: number;
  cols: number;
  timestamp: number;
  id: string;
}

interface MigrationPageProps {
  data: any[] | null;
  headers: string[];
  selectedFile: File | null;
  onNavigate: (page: Page) => void;
}

export function MigrationPage({ data, headers, selectedFile, onNavigate }: MigrationPageProps) {
  const [runs, setRuns] = useState<MigrationRun[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('migrationHistory') || '[]');
    } catch {
      return [];
    }
  });
  const [exporting, setExporting] = useState(false);
  const [lastExported, setLastExported] = useState<string | null>(null);

  const hasData = data && data.length > 0;

  const handleExport = async () => {
    if (!hasData) return;
    setExporting(true);

    // Small delay for UX feedback
    await new Promise(r => setTimeout(r, 400));

    try {
      const ws = XLSX.utils.json_to_sheet(data, { header: headers });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Processed Data');
      const fileName = selectedFile
        ? `migrated_${selectedFile.name.replace(/\.[^/.]+$/, '')}_${Date.now()}.xlsx`
        : `migrated_data_${Date.now()}.xlsx`;
      XLSX.writeFile(wb, fileName);

      // Log to history
      const newRun: MigrationRun = {
        id: String(Date.now()),
        fileName: selectedFile?.name || 'Unknown',
        rows: data.length,
        cols: headers.length,
        timestamp: Date.now(),
      };
      const updated = [newRun, ...runs].slice(0, 20);
      setRuns(updated);
      localStorage.setItem('migrationHistory', JSON.stringify(updated));
      setLastExported(fileName);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteRun = (id: string) => {
    const updated = runs.filter(r => r.id !== id);
    setRuns(updated);
    localStorage.setItem('migrationHistory', JSON.stringify(updated));
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-7 max-w-4xl"
    >
      {/* ── Page Header ── */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Migration Hub</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your processed dataset and export it as Excel.
        </p>
      </motion.div>

      {/* ── Workflow Progress ── */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-4">
          Workflow Progress
        </p>
        <div className="flex items-center gap-2">
          <StepBadge
            label="File Upload"
            done={!!selectedFile}
            onClick={() => onNavigate('upload')}
          />
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <StepBadge
            label="Mapping"
            done={hasData ?? false}
            onClick={() => onNavigate('mapping')}
          />
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <StepBadge
            label="Migration"
            done={runs.length > 0}
            active
            onClick={() => {}}
          />
        </div>
      </motion.div>

      {/* ── Data Summary + Export ── */}
      {hasData ? (
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#FDECEA]/60 to-white border-b border-[#E52D1D]/10 px-6 py-4">
            <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#E52D1D]" aria-hidden="true" />
              Ready to Migrate
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dataset is loaded and ready for export.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
            <MetricCard
              label="File"
              value={selectedFile?.name ?? 'Untitled'}
              icon={FileSpreadsheet}
              color="#E67E4E"
              bg="#FDF0E8"
              truncate
            />
            <MetricCard
              label="Total Rows"
              value={data.length.toLocaleString()}
              icon={Database}
              color="#E52D1D"
              bg="#FDECEA"
            />
            <MetricCard
              label="Columns"
              value={String(headers.length)}
              icon={BarChart3}
              color="#B4142D"
              bg="#F9E0E4"
            />
          </div>

          {lastExported && (
            <div className="mx-6 mb-4 flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              Exported as <span className="font-bold truncate max-w-[200px]">{lastExported}</span>
            </div>
          )}

          <div className="px-6 pb-6">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2.5 px-6 py-3 bg-[#E52D1D] text-white text-sm font-bold
                         rounded-xl hover:bg-[#C4220F] disabled:opacity-60 disabled:cursor-not-allowed
                         transition-colors shadow-md shadow-[#E52D1D]/20"
            >
              {exporting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  Exporting…
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Export as Excel (.xlsx)
                </>
              )}
            </button>
            <p className="text-xs text-slate-400 mt-2">
              Exports the current structural dataset. Run validation in Mapping for fully processed data.
            </p>
          </div>
        </motion.div>
      ) : (
        /* ── Empty State ── */
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#FDECEA] flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7 text-[#E52D1D]" aria-hidden="true" />
          </div>
          <p className="text-base font-extrabold text-slate-800 mb-1">No data loaded</p>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-5">
            Upload a file and map your columns first. Then come here to export the processed data.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-4 py-2 bg-[#E67E4E] text-white text-sm font-bold rounded-xl hover:bg-[#D06B38] transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload File
            </button>
            <button
              onClick={() => onNavigate('mapping')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-colors"
            >
              Go to Mapping
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Migration History ── */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Migration History
          </p>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {runs.length} run{runs.length !== 1 ? 's' : ''}
          </span>
        </div>

        {runs.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <Clock className="w-8 h-8 text-slate-200 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-slate-400 font-medium">No migrations yet</p>
            <p className="text-xs text-slate-300 mt-0.5">Runs will appear here after you export.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {runs.map(run => (
              <div
                key={run.id}
                className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{run.fileName}</p>
                    <p className="text-xs text-slate-400">
                      {run.rows.toLocaleString()} rows · {run.cols} cols ·{' '}
                      {new Date(run.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteRun(run.id)}
                  aria-label="Remove from history"
                  className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Note about full processed export */}
      {hasData && (
        <motion.div
          variants={fadeUp}
          className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-xl"
        >
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <span className="font-bold">Tip:</span> The export here captures the structurally mapped
            data. To export fully validated &amp; transformed data, use the{' '}
            <button
              onClick={() => onNavigate('mapping')}
              className="font-bold underline hover:text-amber-900 transition-colors"
            >
              Export button inside Mapping
            </button>
            .
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ── Sub-components ── */

function StepBadge({
  label,
  done,
  active,
  onClick,
}: {
  label: string;
  done: boolean;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors',
        active
          ? 'bg-[#E52D1D] text-white'
          : done
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-slate-100 text-slate-400',
      ].join(' ')}
    >
      {done ? (
        <CheckCircle2 className="w-3 h-3 shrink-0" aria-hidden="true" />
      ) : (
        <span className="w-3 h-3 rounded-full border-2 border-current shrink-0" aria-hidden="true" />
      )}
      {label}
    </button>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  truncate,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  bg: string;
  truncate?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: bg }}
      >
        <Icon className="w-4 h-4" style={{ color }} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className={`text-sm font-extrabold text-slate-800 mt-0.5 ${truncate ? 'truncate' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
