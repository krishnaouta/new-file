import React from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  ArrowRight,
  ArrowRightCircle,
  FileSpreadsheet,
  Database,
  LayoutTemplate,
  Map,
  Send,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { Page, ProcessorTemplate } from '../types';

interface DashboardPageProps {
  currentFile: File | null;
  rowCount: number;
  onNavigate: (page: Page) => void;
}

const workflowSteps = [
  {
    num: '01',
    icon: Upload,
    label: 'File Upload',
    desc: 'Load your CSV or Excel data file and an optional labels template.',
    page: 'upload' as Page,
    color: '#E67E4E',
    bg: '#FDF0E8',
    border: '#E67E4E30',
  },
  {
    num: '02',
    icon: Map,
    label: 'Mapping',
    desc: 'Assign source columns to internal fields, validate and transform.',
    page: 'mapping' as Page,
    color: '#E52D1D',
    bg: '#FDECEA',
    border: '#E52D1D25',
  },
  {
    num: '03',
    icon: Send,
    label: 'Migration',
    desc: 'Review processed results and export the final data as Excel.',
    page: 'migration' as Page,
    color: '#B4142D',
    bg: '#F9E0E4',
    border: '#B4142D25',
  },
];

export function DashboardPage({ currentFile, rowCount, onNavigate }: DashboardPageProps) {
  const templates: ProcessorTemplate[] = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('processorTemplates') || '[]');
    } catch {
      return [];
    }
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-7 max-w-5xl"
    >
      {/* ── Welcome ── */}
      <motion.div variants={fadeUp} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">
            {today}
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your DataProcessor overview — pick up where you left off.
          </p>
        </div>
        <button
          onClick={() => onNavigate('upload')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E52D1D] text-white text-sm font-bold rounded-xl
                     hover:bg-[#C4220F] transition-colors shadow-md shadow-[#E52D1D]/20 shrink-0"
        >
          <Upload className="w-4 h-4" aria-hidden="true" />
          New Job
        </button>
      </motion.div>

      {/* ── Stats Row ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Saved Templates"
          value={String(templates.length)}
          sub="in your library"
          icon={LayoutTemplate}
          iconColor="#E67E4E"
          iconBg="#FDF0E8"
          onClick={() => onNavigate('admin')}
        />
        <StatCard
          label="Active File"
          value={currentFile ? currentFile.name : '—'}
          sub={
            currentFile
              ? `${(currentFile.size / 1024).toFixed(1)} KB`
              : 'No file loaded'
          }
          icon={FileSpreadsheet}
          iconColor="#E52D1D"
          iconBg="#FDECEA"
          truncate
          onClick={() => onNavigate(currentFile ? 'mapping' : 'upload')}
        />
        <StatCard
          label="Loaded Rows"
          value={rowCount > 0 ? rowCount.toLocaleString() : '—'}
          sub={rowCount > 0 ? 'rows in workspace' : 'upload a file to begin'}
          icon={Database}
          iconColor="#B4142D"
          iconBg="#F9E0E4"
          onClick={() => onNavigate(rowCount > 0 ? 'mapping' : 'upload')}
        />
      </motion.div>

      {/* ── Quick Actions ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionCard
          title="Start Processing"
          desc="Upload a new CSV or Excel file, apply a labels template and begin mapping columns."
          cta="Upload File"
          icon={Upload}
          gradient="from-[#FDF0E8] to-white"
          borderColor="border-[#E67E4E]/25"
          ctaClass="bg-[#E67E4E] hover:bg-[#D06B38] text-white"
          onClick={() => onNavigate('upload')}
        />
        <ActionCard
          title="Load a Template"
          desc="Reuse a saved column mapping configuration to process recurring file formats faster."
          cta="Manage Templates"
          icon={LayoutTemplate}
          gradient="from-[#FDECEA] to-white"
          borderColor="border-[#E52D1D]/20"
          ctaClass="bg-[#E52D1D] hover:bg-[#C4220F] text-white"
          onClick={() => onNavigate('admin')}
        />
      </motion.div>

      {/* ── Workflow Steps ── */}
      <motion.div
        variants={fadeUp}
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-6">
          How It Works
        </p>
        <div className="flex items-start gap-3">
          {workflowSteps.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === workflowSteps.length - 1;
            // Determine completion status
            const isDone =
              (step.page === 'upload' && !!currentFile) ||
              (step.page === 'mapping' && rowCount > 0) ||
              false;

            return (
              <React.Fragment key={step.page}>
                <button
                  onClick={() => onNavigate(step.page)}
                  className="flex-1 flex flex-col items-center gap-3 group text-center min-w-0"
                >
                  <div
                    className="relative w-14 h-14 rounded-2xl flex items-center justify-center
                               group-hover:scale-105 transition-transform duration-150 shadow-sm"
                    style={{
                      backgroundColor: step.bg,
                      border: `1.5px solid ${step.border}`,
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: step.color }}
                      aria-hidden="true"
                    />
                    {isDone && (
                      <CheckCircle2
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 text-emerald-500 bg-white rounded-full"
                        aria-hidden="true"
                      />
                    )}
                    {!isDone && (
                      <Circle
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 text-slate-300 bg-white rounded-full"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-400 mb-0.5">{step.num}</p>
                    <p className="text-sm font-extrabold text-slate-800">{step.label}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">{step.desc}</p>
                  </div>
                </button>

                {!isLast && (
                  <div className="pt-6 shrink-0">
                    <ArrowRight className="w-4 h-4 text-slate-300" aria-hidden="true" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      {/* ── Recent Templates ── */}
      {templates.length > 0 && (
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Recent Templates
            </p>
            <button
              onClick={() => onNavigate('admin')}
              className="text-xs font-bold text-[#E52D1D] hover:text-[#C4220F] flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {templates.slice(0, 4).map((t, i) => (
              <div
                key={i}
                className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#FDECEA] flex items-center justify-center shrink-0">
                    <LayoutTemplate className="w-4 h-4 text-[#E52D1D]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{t.name}</p>
                    <p className="text-xs text-slate-400">
                      {t.configs?.length || 0} columns ·{' '}
                      {new Date(t.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-xs font-bold text-[#E52D1D] bg-[#FDECEA] hover:bg-[#E52D1D] hover:text-white
                             px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty-state prompt when no templates */}
      {templates.length === 0 && (
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FDECEA] flex items-center justify-center mx-auto mb-3">
            <LayoutTemplate className="w-6 h-6 text-[#E52D1D]" aria-hidden="true" />
          </div>
          <p className="text-sm font-bold text-slate-700 mb-1">No templates yet</p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Map columns in the Mapping section and save a template to reuse it for future jobs.
          </p>
          <button
            onClick={() => onNavigate('mapping')}
            className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#E52D1D] hover:text-[#C4220F]"
          >
            Go to Mapping <ArrowRightCircle className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ── Sub-components ── */

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  iconBg,
  onClick,
  truncate,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconColor: string;
  iconBg: string;
  onClick?: () => void;
  truncate?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-left w-full
                 hover:shadow-md hover:border-slate-300 transition-all duration-150"
    >
      <div className="mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} aria-hidden="true" />
        </div>
      </div>
      <p
        className={`text-lg font-extrabold text-slate-900 leading-tight ${
          truncate ? 'truncate' : ''
        }`}
      >
        {value}
      </p>
      <p className="text-xs font-semibold text-slate-500 mt-1">{label}</p>
      <p className="text-[11px] text-slate-300 mt-0.5">{sub}</p>
    </motion.button>
  );
}

function ActionCard({
  title,
  desc,
  cta,
  icon: Icon,
  gradient,
  borderColor,
  ctaClass,
  onClick,
}: {
  title: string;
  desc: string;
  cta: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  borderColor: string;
  ctaClass: string;
  onClick: () => void;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl border ${borderColor} p-6 flex flex-col gap-4`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/80 shadow-sm flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-slate-600" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
        </div>
      </div>
      <button
        onClick={onClick}
        className={`self-start flex items-center gap-2 ${ctaClass} text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm`}
      >
        {cta}
        <ArrowRightCircle className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
