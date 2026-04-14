import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutTemplate,
  Trash2,
  ArrowRight,
  FolderOpen,
  Clock,
  Columns3,
  Search,
  Settings2,
  ShieldCheck,
  Database,
  Download,
  Upload,
  ChevronDown,
  ChevronRight,
  Pencil,
  Check,
  X,
  AlertTriangle,
  Info,
  ToggleLeft,
  ToggleRight,
  ArrowRightLeft,
  FileJson,
  History,
  Layers,
} from 'lucide-react';
import { Page, ProcessorTemplate } from '../types';

interface AdminPageProps {
  onNavigate: (page: Page) => void;
  onLoadTemplate: (template: ProcessorTemplate) => void;
}

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function getStorageUsage(): string {
  let total = 0;
  for (const key of Object.keys(localStorage)) {
    total += (localStorage.getItem(key) || '').length * 2; // UTF-16 bytes
  }
  if (total < 1024) return `${total} B`;
  if (total < 1024 * 1024) return `${(total / 1024).toFixed(1)} KB`;
  return `${(total / 1024 / 1024).toFixed(2)} MB`;
}

function getMigrationCount(): number {
  try {
    return JSON.parse(localStorage.getItem('migrationHistory') || '[]').length;
  } catch {
    return 0;
  }
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function AdminPage({ onNavigate, onLoadTemplate }: AdminPageProps) {
  /* ── Template state ── */
  const [templates, setTemplates] = useState<ProcessorTemplate[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('processorTemplates') || '[]');
    } catch {
      return [];
    }
  });
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [renaming, setRenaming] = useState<number | null>(null);
  const [renameVal, setRenameVal] = useState('');

  /* ── Data management state ── */
  const [migrationCount, setMigrationCount] = useState(getMigrationCount);
  const [storageUsage, setStorageUsage] = useState(getStorageUsage);
  const [clearHistoryConfirm, setClearHistoryConfirm] = useState(false);
  const [clearAllConfirm, setClearAllConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  /* ── Settings state (persisted to localStorage) ── */
  const [sidebarDefault, setSidebarDefault] = useState(
    () => localStorage.getItem('sidebarCollapsed') === 'true'
  );

  /* ── Import ref ── */
  const importRef = useRef<HTMLInputElement>(null);

  /* ── Template helpers ── */
  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const saveTemplates = (updated: ProcessorTemplate[]) => {
    setTemplates(updated);
    localStorage.setItem('processorTemplates', JSON.stringify(updated));
    setStorageUsage(getStorageUsage());
  };

  const handleDelete = (index: number) => {
    if (deleteConfirm === index) {
      saveTemplates(templates.filter((_, i) => i !== index));
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(index);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleLoad = (template: ProcessorTemplate) => {
    onLoadTemplate(template);
    onNavigate('mapping');
  };

  const handleDuplicate = (index: number) => {
    const copy: ProcessorTemplate = {
      ...templates[index],
      name: `${templates[index].name} (copy)`,
      timestamp: Date.now(),
    };
    saveTemplates([...templates, copy]);
  };

  const startRename = (index: number) => {
    setRenaming(index);
    setRenameVal(templates[index].name);
  };

  const commitRename = (index: number) => {
    if (renameVal.trim()) {
      const updated = templates.map((t, i) =>
        i === index ? { ...t, name: renameVal.trim() } : t
      );
      saveTemplates(updated);
    }
    setRenaming(null);
  };

  const toggleExpanded = (index: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  /* ── Export all templates ── */
  const handleExportTemplates = () => {
    const blob = new Blob(
      [JSON.stringify(templates, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dataprocessor_templates_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Import templates from JSON ── */
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!Array.isArray(parsed)) throw new Error('File must be a JSON array of templates.');
        // Validate shape
        const valid = parsed.filter(
          (t: any) =>
            t &&
            typeof t.name === 'string' &&
            typeof t.mappings === 'object' &&
            Array.isArray(t.configs)
        );
        if (valid.length === 0) throw new Error('No valid templates found in file.');
        // Merge: add templates not already present by name
        const existingNames = new Set(templates.map(t => t.name.toLowerCase()));
        const incoming = valid.map((t: ProcessorTemplate) => ({
          ...t,
          // Ensure unique names by appending "(imported)" if needed
          name: existingNames.has(t.name.toLowerCase()) ? `${t.name} (imported)` : t.name,
          timestamp: t.timestamp || Date.now(),
        }));
        saveTemplates([...templates, ...incoming]);
        setImportSuccess(`Imported ${incoming.length} template${incoming.length !== 1 ? 's' : ''}.`);
        setTimeout(() => setImportSuccess(null), 4000);
      } catch (err: unknown) {
        setImportError(err instanceof Error ? err.message : 'Failed to parse file.');
      }
      // Reset input so the same file can be re-imported
      if (importRef.current) importRef.current.value = '';
    };
    reader.readAsText(file);
  };

  /* ── Data management ── */
  const clearMigrationHistory = () => {
    localStorage.removeItem('migrationHistory');
    setMigrationCount(0);
    setClearHistoryConfirm(false);
    setStorageUsage(getStorageUsage());
  };

  const clearAllTemplates = () => {
    saveTemplates([]);
    setClearAllConfirm(false);
  };

  /* ── Settings ── */
  const toggleSidebarDefault = () => {
    const next = !sidebarDefault;
    setSidebarDefault(next);
    localStorage.setItem('sidebarCollapsed', String(next));
  };

  /* ── Animation variants ── */
  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.27 } },
  };
  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6 w-full"
    >
      {/* ── Page Header ── */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage templates, review history and configure app preferences.
        </p>
      </motion.div>

      {/* ══════════════════════════════════
          TEMPLATES LIBRARY
      ══════════════════════════════════ */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-[#E52D1D]" aria-hidden="true" />
              Templates Library
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {templates.length} saved template{templates.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            {templates.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search templates…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-4 py-2 text-xs font-medium border border-slate-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-[#E52D1D]/30 focus:border-[#E52D1D]/50
                             bg-slate-50 text-slate-700 placeholder:text-slate-400 w-48"
                />
              </div>
            )}

            {/* Import */}
            <label
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100
                         hover:bg-slate-200 rounded-lg cursor-pointer transition-colors border border-slate-200"
              title="Import templates from JSON"
            >
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              Import
              <input
                ref={importRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportFile}
              />
            </label>

            {/* Export */}
            {templates.length > 0 && (
              <button
                onClick={handleExportTemplates}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#E52D1D] bg-[#FDECEA]
                           hover:bg-[#E52D1D] hover:text-white rounded-lg transition-colors"
                title="Export all templates as JSON"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                Export All
              </button>
            )}
          </div>
        </div>

        {/* Import feedback */}
        <AnimatePresence>
          {(importError || importSuccess) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className={`px-6 py-2.5 flex items-center gap-2 text-xs font-semibold border-b ${
                importError
                  ? 'bg-red-50 text-red-700 border-red-100'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}>
                {importError ? (
                  <><AlertTriangle className="w-3.5 h-3.5 shrink-0" />{importError}</>
                ) : (
                  <><Check className="w-3.5 h-3.5 shrink-0" />{importSuccess}</>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Template List */}
        {templates.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FDECEA] flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-7 h-7 text-[#E52D1D]" aria-hidden="true" />
            </div>
            <p className="text-sm font-bold text-slate-700 mb-1">No templates saved yet</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mb-5">
              Go to Mapping, configure your column setup and use Save Template to create one.
            </p>
            <button
              onClick={() => onNavigate('mapping')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#E52D1D] hover:text-[#C4220F] transition-colors"
            >
              Go to Mapping <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-slate-400 font-medium">
            No templates match "<span className="font-bold text-slate-600">{search}</span>"
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 items-center">
              <div className="w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Name</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 w-20 text-center">Columns</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 w-24 text-center">Saved</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 w-40 text-right">Actions</span>
            </div>

            <div className="divide-y divide-slate-100">
              {filtered.map((t) => {
                const realIndex = templates.indexOf(t);
                const isConfirming = deleteConfirm === realIndex;
                const isExpanded = expanded.has(realIndex);
                const isRenaming = renaming === realIndex;
                const mappingEntries = Object.entries(t.mappings || {});

                return (
                  <React.Fragment key={`${t.name}-${t.timestamp}`}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-6 py-3.5 grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 items-center
                                 hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Expand toggle */}
                      <button
                        onClick={() => toggleExpanded(realIndex)}
                        aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                        className="w-4 h-4 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-colors"
                      >
                        {isExpanded
                          ? <ChevronDown className="w-3.5 h-3.5" />
                          : <ChevronRight className="w-3.5 h-3.5" />
                        }
                      </button>

                      {/* Name (inline rename) */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#FDECEA] flex items-center justify-center shrink-0">
                          <LayoutTemplate className="w-3.5 h-3.5 text-[#E52D1D]" aria-hidden="true" />
                        </div>
                        {isRenaming ? (
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <input
                              autoFocus
                              value={renameVal}
                              onChange={e => setRenameVal(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') commitRename(realIndex);
                                if (e.key === 'Escape') setRenaming(null);
                              }}
                              className="flex-1 min-w-0 text-sm font-semibold border border-[#E52D1D]/40 rounded-md px-2 py-0.5
                                         focus:outline-none focus:ring-1 focus:ring-[#E52D1D]/40 text-slate-800"
                            />
                            <button onClick={() => commitRename(realIndex)} className="p-1 text-emerald-600 hover:text-emerald-700">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setRenaming(null)} className="p-1 text-slate-400 hover:text-slate-600">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="min-w-0 group/rename flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-slate-800 truncate">{t.name}</p>
                            <button
                              onClick={() => startRename(realIndex)}
                              aria-label="Rename template"
                              className="opacity-0 group-hover/rename:opacity-100 p-0.5 text-slate-300
                                         hover:text-slate-600 transition-all rounded"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Mapped column count */}
                      <div className="w-20 flex items-center justify-center gap-1 text-xs font-semibold text-slate-500">
                        <Columns3 className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
                        {t.configs?.length || 0}
                      </div>

                      {/* Timestamp */}
                      <div className="w-24 flex items-center justify-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3 text-slate-300 shrink-0" aria-hidden="true" />
                        <span className="truncate">{new Date(t.timestamp).toLocaleDateString()}</span>
                      </div>

                      {/* Actions */}
                      <div className="w-40 flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleLoad(t)}
                          className="px-2.5 py-1.5 text-xs font-bold text-[#E52D1D] bg-[#FDECEA]
                                     hover:bg-[#E52D1D] hover:text-white rounded-lg transition-colors"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDuplicate(realIndex)}
                          aria-label="Duplicate template"
                          title="Duplicate"
                          className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(realIndex)}
                          aria-label={isConfirming ? 'Confirm delete' : 'Delete template'}
                          title={isConfirming ? 'Click again to confirm' : 'Delete'}
                          className={[
                            'p-1.5 rounded-lg transition-colors',
                            isConfirming
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'text-slate-300 hover:text-red-400 hover:bg-red-50',
                          ].join(' ')}
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </motion.div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-2 bg-slate-50/60 border-t border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
                              {/* Mappings */}
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                                  <ArrowRightLeft className="w-3 h-3" aria-hidden="true" />
                                  Column Mappings ({mappingEntries.length})
                                </p>
                                {mappingEntries.length === 0 ? (
                                  <p className="text-xs text-slate-400 italic">No mappings defined</p>
                                ) : (
                                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                                    {mappingEntries.map(([src, target]) => (
                                      <div key={src} className="flex items-center gap-2 text-xs">
                                        <span className="font-mono text-slate-600 bg-white border border-slate-200 rounded px-1.5 py-0.5 truncate max-w-[120px]" title={src}>{src}</span>
                                        <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" aria-hidden="true" />
                                        <span className="font-mono text-[#E52D1D] bg-[#FDECEA] border border-[#E52D1D]/15 rounded px-1.5 py-0.5 truncate max-w-[120px]" title={target}>{target}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Configs */}
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                                  <Settings2 className="w-3 h-3" aria-hidden="true" />
                                  Column Rules ({t.configs?.length || 0})
                                </p>
                                {(!t.configs || t.configs.length === 0) ? (
                                  <p className="text-xs text-slate-400 italic">No validation / transformation rules</p>
                                ) : (
                                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                                    {t.configs.map((c: any, ci: number) => (
                                      <div key={ci} className="text-xs flex items-start gap-2">
                                        <span className="font-mono text-slate-600 bg-white border border-slate-200 rounded px-1.5 py-0.5 shrink-0 truncate max-w-[100px]" title={c.column}>{c.column}</span>
                                        <div className="flex flex-wrap gap-1">
                                          {c.validation && (
                                            <span className="bg-slate-100 text-slate-600 rounded px-1.5 py-0.5 text-[10px] font-semibold">{c.validation}</span>
                                          )}
                                          {(c.transformations || []).map((tx: string, ti: number) => (
                                            <span key={ti} className="bg-[#FDECEA] text-[#E52D1D] rounded px-1.5 py-0.5 text-[10px] font-semibold border border-[#E52D1D]/15">{tx}</span>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </div>

            {deleteConfirm !== null && (
              <div className="px-6 py-2.5 bg-red-50 border-t border-red-100">
                <p className="text-xs text-red-600 font-semibold">
                  Click the delete icon again to confirm deletion.
                </p>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* ══════════════════════════════════
          DATA MANAGEMENT
      ══════════════════════════════════ */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-500" aria-hidden="true" />
            Data Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage locally stored data — all processing stays in your browser.
          </p>
        </div>

        {/* Storage indicator */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <p className="text-xs text-slate-500">
            Browser storage used by this app: <span className="font-bold text-slate-700">{storageUsage}</span>
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Migration history */}
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <History className="w-4 h-4 text-slate-500" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Migration History</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {migrationCount} export run{migrationCount !== 1 ? 's' : ''} stored locally.
                </p>
              </div>
            </div>
            {clearHistoryConfirm ? (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-red-600 font-semibold">Confirm?</span>
                <button
                  onClick={clearMigrationHistory}
                  className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, clear
                </button>
                <button
                  onClick={() => setClearHistoryConfirm(false)}
                  className="px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setClearHistoryConfirm(true)}
                disabled={migrationCount === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600
                           bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors
                           disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                Clear History
              </button>
            )}
          </div>

          {/* Clear all templates */}
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <FileJson className="w-4 h-4 text-slate-500" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">All Templates</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {templates.length} saved template{templates.length !== 1 ? 's' : ''} in your library.
                  <span className="text-amber-500 font-semibold ml-1">Export before clearing.</span>
                </p>
              </div>
            </div>
            {clearAllConfirm ? (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-red-600 font-semibold">Delete all templates?</span>
                <button
                  onClick={clearAllTemplates}
                  className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, delete all
                </button>
                <button
                  onClick={() => setClearAllConfirm(false)}
                  className="px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setClearAllConfirm(true)}
                disabled={templates.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600
                           bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors
                           disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                Delete All
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════
          SETTINGS
      ══════════════════════════════════ */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-slate-500" aria-hidden="true" />
            Preferences
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">App behaviour settings saved to your browser.</p>
        </div>
        <div className="divide-y divide-slate-100">
          {/* Sidebar default */}
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <Layers className="w-4 h-4 text-slate-500" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Sidebar — Start Collapsed</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed max-w-md">
                  When enabled, the sidebar launches in icon-only mode. Takes effect on next page load.
                </p>
              </div>
            </div>
            <button
              onClick={toggleSidebarDefault}
              aria-label={sidebarDefault ? 'Disable collapsed sidebar' : 'Enable collapsed sidebar'}
              className="shrink-0 transition-colors"
            >
              {sidebarDefault
                ? <ToggleRight className="w-9 h-9 text-[#E52D1D]" aria-hidden="true" />
                : <ToggleLeft className="w-9 h-9 text-slate-300" aria-hidden="true" />
              }
            </button>
          </div>

          {/* Data Privacy — static info */}
          <div className="px-6 py-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-slate-500" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Data Privacy</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed max-w-md">
                  All files and data are processed entirely in your browser. Nothing is uploaded or sent to any server.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 bg-emerald-100 text-emerald-700">
              Active
            </span>
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════
          ABOUT
      ══════════════════════════════════ */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-500" aria-hidden="true" />
            About DataProcessor
          </h2>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <InfoTile label="Version" value="1.0.0" />
          <InfoTile label="Build" value="Production" />
          <InfoTile label="Platform" value="Browser (local)" />
        </div>
        <div className="px-6 pb-5">
          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
            DataProcessor is a browser-based data mapping and transformation tool by{' '}
            <span className="font-semibold text-slate-600">Outamation</span>.
            It processes CSV and Excel files locally — no data ever leaves your machine.
            Templates are stored in your browser's local storage.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Sub-components ── */

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}
