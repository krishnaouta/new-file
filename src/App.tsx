import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataProcessor } from './components/DataProcessor';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { MigrationPage } from './pages/MigrationPage';
import { AdminPage } from './pages/AdminPage';
import { parseFile, ParsedData } from './utils/fileParser';
import { Loader2, FileSpreadsheet, X, ChevronRight, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { InternalField, internalFields as defaultInternalFields } from './utils/dataMapper';
import { useHistory } from './hooks/useHistory';
import { Page, ProcessorTemplate } from './types';

/* ── Page meta (used for breadcrumb) ── */
const PAGE_LABEL: Record<Page, string> = {
  dashboard: 'Dashboard',
  upload:    'File Upload',
  mapping:   'Mapping',
  migration: 'Migration',
  admin:     'Admin',
};

function App() {
  /* ── Navigation ── */
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    return (localStorage.getItem('currentPage') as Page) || 'dashboard';
  });

  const navigate = (page: Page) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Scroll-to-top (shown on mapping page after scrolling down) ── */
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Sidebar collapse ── */
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => {
      localStorage.setItem('sidebarCollapsed', String(!prev));
      return !prev;
    });
  };

  /* ── File + data state ── */
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [labelsFile, setLabelsFile] = useState<File | null>(null);
  const [customFields, setCustomFields] = useState<InternalField[] | null>(null);
  // Incremented each time a new data file is loaded — forces DataProcessor to remount
  // and discard any configs/mappings from the previous file.
  const [fileKey, setFileKey] = useState(0);

  /* ── Structural history ── */
  const dataHistory = useHistory<ParsedData | null>(null);
  const data = dataHistory.state;

  const handleDataUpdate = (newData: Record<string, unknown>[], newHeaders: string[]) => {
    dataHistory.set({ data: newData as any[], headers: newHeaders });
  };

  const setData = (parsed: ParsedData | null) => {
    dataHistory.clear(parsed);
  };

  /* ── Preload template (set from Admin "Load" button) ── */
  const [preloadTemplate, setPreloadTemplate] = useState<ProcessorTemplate | null>(null);

  const handleLoadTemplate = (template: ProcessorTemplate) => {
    setPreloadTemplate(template);
    // navigate is called by AdminPage after this
  };

  /* ── Labels file ── */
  const handleLabelsFileSelect = async (file: File) => {
    setLabelsFile(file);
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseFile(file);
      const hasLabels = parsed.headers.some(h => h.trim().toLowerCase().includes('internal label'));
      const hasTypes  = parsed.headers.some(h => h.trim().toLowerCase() === 'datatype');

      if (!hasLabels || !hasTypes) {
        throw new Error("Labels file must contain 'Internal labels' and 'DataType' columns.");
      }

      const labelCol = parsed.headers.find(h => h.trim().toLowerCase().includes('internal label'))!;
      const typeCol  = parsed.headers.find(h => h.trim().toLowerCase() === 'datatype')!;

      const fields: InternalField[] = parsed.data
        .map(row => ({ key: row[labelCol], label: row[labelCol], type: row[typeCol] }))
        .filter(f => f.key && f.type);

      setCustomFields(fields);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to parse labels file.');
      setLabelsFile(null);
    } finally {
      setLoading(false);
    }
  };

  /* ── Data file ── */
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseFile(file);
      setData(parsed);
      setFileKey(k => k + 1); // force DataProcessor remount → clears old configs/mappings
      // Auto-navigate to Mapping once file is loaded
      navigate('mapping');
    } catch (err: unknown) {
      setError('Failed to parse file. Please ensure it is a valid CSV or Excel file.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setData(null);
    setError(null);
  };

  const handleClearLabels = () => {
    setLabelsFile(null);
    setCustomFields(null);
    handleClear();
  };

  /* ── Layout widths ── */
  const SIDEBAR_W = sidebarCollapsed ? 64 : 240;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black font-sans flex">
      <a href="#main-content" className="skip-to-main">Skip to main content</a>

      {/* ── Sidebar (fixed) ── */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        currentPage={currentPage}
        onNavigate={navigate}
      />

      {/* Spacer mirrors sidebar width */}
      <motion.div
        animate={{ width: SIDEBAR_W }}
        initial={false}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="shrink-0"
        aria-hidden="true"
      />

      {/* ── Content Shell ── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* ── Header ── */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-sm" role="banner">
          <div className="h-1 w-full bg-gradient-to-r from-[#B4142D] via-[#E52D1D] to-[#E67E4E]" aria-hidden="true" />
          <div className="px-6 lg:px-8">
            <div className="h-[72px] flex items-center justify-between gap-4">

              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-medium text-slate-400 select-none whitespace-nowrap">
                  DataProcessor
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" aria-hidden="true" />
                <span className="text-sm font-bold text-slate-800 whitespace-nowrap truncate">
                  {PAGE_LABEL[currentPage]}
                </span>
              </nav>

              {/* Right: file chips */}
              <div className="flex items-center gap-3 shrink-0">
                {labelsFile && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    role="status"
                    aria-label={`Labels template: ${labelsFile.name}`}
                    className="flex items-center gap-2.5 bg-[#FDF0E8] border border-[#E67E4E]/30 rounded-xl px-3.5 py-2"
                  >
                    <div className="p-1.5 bg-[#FDF0E8] rounded-lg border border-[#E67E4E]/30" aria-hidden="true">
                      <FileSpreadsheet className="w-4 h-4 text-[#E67E4E]" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 max-w-[140px] truncate" title={labelsFile.name}>
                      {labelsFile.name}
                    </span>
                    <span className="text-[10px] font-bold text-[#E67E4E] bg-[#E67E4E]/15 px-1.5 py-0.5 rounded uppercase tracking-wide">
                      Labels
                    </span>
                    <button onClick={handleClearLabels} aria-label="Remove labels file"
                      className="p-1 hover:bg-[#E67E4E]/20 rounded-full text-[#E67E4E]/50 hover:text-[#E67E4E] transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}

                {selectedFile && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    role="status"
                    aria-label={`Data file: ${selectedFile.name}`}
                    className="flex items-center gap-2.5 bg-[#FDECEA] border border-[#E52D1D]/20 rounded-xl px-3.5 py-2"
                  >
                    <div className="p-1.5 bg-[#FDECEA] rounded-lg border border-[#E52D1D]/20" aria-hidden="true">
                      <FileSpreadsheet className="w-4 h-4 text-[#E52D1D]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-800 max-w-[180px] truncate" title={selectedFile.name}>
                        {selectedFile.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                    <button onClick={handleClear} aria-label="Remove data file"
                      className="p-1 hover:bg-[#E52D1D]/10 rounded-full text-[#E52D1D]/40 hover:text-[#E52D1D] transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ═══════════════ MAIN ═══════════════ */}
        <main id="main-content" className="flex-1 px-6 lg:px-8 py-8">

          {/* ── Loading overlay ── */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                role="status" aria-live="polite"
                className="flex flex-col items-center justify-center py-16"
              >
                <Loader2 className="w-8 h-8 text-[#E52D1D] animate-spin" />
                <p className="mt-4 text-slate-600 font-semibold">Processing your file…</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Error banner ── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                role="alert" aria-live="assertive"
                className="p-4 bg-[#F9E0E4] text-[#8E0D22] rounded-xl text-center font-semibold
                           border border-[#B4142D]/20 mb-6 flex items-center justify-center gap-2"
              >
                <span aria-hidden="true">⚠</span> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Page content (only shown when not loading) ── */}
          {!loading && (
            <>
              {/* DASHBOARD */}
              {currentPage === 'dashboard' && (
                <DashboardPage
                  currentFile={selectedFile}
                  rowCount={data?.data.length ?? 0}
                  onNavigate={navigate}
                />
              )}

              {/* FILE UPLOAD */}
              {currentPage === 'upload' && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-[#FDECEA] border border-[#E52D1D]/20 rounded-full px-4 py-1.5 mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E52D1D] animate-pulse" />
                      <span className="text-xs font-bold text-[#E52D1D] tracking-widest uppercase">
                        Step 1 of 3
                      </span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                      Upload Your Files
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
                      Upload a data file to process. Add a labels template to auto-map columns.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Labels Upload Card */}
                    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-200 overflow-hidden flex flex-col
                                    group hover:shadow-xl hover:border-[#E67E4E]/30 transition-all duration-300">
                      <div className="bg-gradient-to-r from-[#FDF0E8]/80 to-white border-b border-[#E67E4E]/15 px-6 py-4">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2.5 uppercase tracking-wider">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E67E4E] text-white text-xs font-extrabold">1</span>
                          Labels Template
                          <span className="ml-auto text-[10px] font-semibold text-[#E67E4E]/60 bg-[#FDF0E8] px-2 py-0.5 rounded-full border border-[#E67E4E]/20 normal-case tracking-normal">
                            Optional
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 pl-8">
                          Excel with{' '}
                          <span className="font-semibold text-[#D06B38] bg-[#FDF0E8] px-1 py-0.5 rounded">'Internal labels'</span>
                          {' '}&amp;{' '}
                          <span className="font-semibold text-[#D06B38] bg-[#FDF0E8] px-1 py-0.5 rounded">'DataType'</span>
                          {' '}columns
                        </p>
                      </div>
                      <div className="p-6 flex-1">
                        <FileUpload
                          onFileSelect={handleLabelsFileSelect}
                          selectedFile={labelsFile}
                          onClear={handleClearLabels}
                          variant="orange"
                          className="h-52 border-[#E67E4E]/30 bg-[#FDF0E8]/30 hover:bg-[#FDF0E8]/50"
                        />
                      </div>
                    </div>

                    {/* Data Upload Card */}
                    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-200 overflow-hidden flex flex-col
                                    group hover:shadow-xl hover:border-[#E52D1D]/30 transition-all duration-300">
                      <div className="bg-gradient-to-r from-[#FDECEA]/70 to-white border-b border-[#E52D1D]/10 px-6 py-4">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2.5 uppercase tracking-wider">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E52D1D] text-white text-xs font-extrabold shadow-md shadow-[#E52D1D]/25">2</span>
                          Upload Data File
                          <span className="ml-auto text-[10px] font-semibold text-[#E52D1D]/60 bg-[#FDECEA] px-2 py-0.5 rounded-full border border-[#E52D1D]/15 normal-case tracking-normal">
                            Required
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 pl-8">
                          CSV or Excel file to clean and process.
                        </p>
                      </div>
                      <div className="p-6 flex-1">
                        <FileUpload
                          onFileSelect={handleFileSelect}
                          selectedFile={selectedFile}
                          onClear={handleClear}
                          variant="default"
                          className="h-52 border-[#E52D1D]/25 bg-[#FDECEA]/20 hover:bg-[#FDECEA]/40"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* MAPPING */}
              {currentPage === 'mapping' && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  {data ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                            Data Workspace
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                              {data.data.length.toLocaleString()} rows
                            </span>
                          </h2>
                          <p className="text-sm text-slate-500 mt-0.5">
                            Map, transform and validate your columns below.
                          </p>
                        </div>
                        <button
                          onClick={handleClear}
                          aria-label="Clear and start over"
                          className="px-5 py-2.5 text-sm font-bold text-[#E52D1D] bg-white border-2 border-[#E52D1D]
                                     rounded-xl hover:bg-[#E52D1D] hover:text-white transition-all shadow-sm"
                        >
                          ↩ Start Over
                        </button>
                      </div>
                      <DataProcessor
                        key={`${fileKey}-${preloadTemplate?.timestamp ?? 'default'}`}
                        data={data.data}
                        headers={data.headers}
                        onDataUpdate={handleDataUpdate}
                        internalFields={customFields || defaultInternalFields}
                        onStructureUndo={dataHistory.undo}
                        onStructureRedo={dataHistory.redo}
                        canStructureUndo={dataHistory.canUndo}
                        canStructureRedo={dataHistory.canRedo}
                        preloadTemplate={preloadTemplate ?? undefined}
                      />
                    </>
                  ) : (
                    /* Empty state — no file loaded */
                    <div className="max-w-md mx-auto text-center py-20">
                      <div className="w-16 h-16 rounded-2xl bg-[#FDECEA] flex items-center justify-center mx-auto mb-5">
                        <FileSpreadsheet className="w-8 h-8 text-[#E52D1D]" aria-hidden="true" />
                      </div>
                      <h2 className="text-lg font-extrabold text-slate-800 mb-2">No file loaded</h2>
                      <p className="text-sm text-slate-500 mb-6">
                        Upload a data file first to start mapping and processing columns.
                      </p>
                      <button
                        onClick={() => navigate('upload')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#E52D1D] text-white text-sm font-bold rounded-xl hover:bg-[#C4220F] transition-colors shadow-md shadow-[#E52D1D]/20"
                      >
                        <ChevronRight className="w-4 h-4" />
                        Go to File Upload
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* MIGRATION */}
              {currentPage === 'migration' && (
                <MigrationPage
                  data={data?.data ?? null}
                  headers={data?.headers ?? []}
                  selectedFile={selectedFile}
                  onNavigate={navigate}
                />
              )}

              {/* ADMIN */}
              {currentPage === 'admin' && (
                <AdminPage
                  onNavigate={navigate}
                  onLoadTemplate={handleLoadTemplate}
                />
              )}
            </>
          )}
        </main>
      </div>
    {/* ── Jump to Top (mapping page only) ── */}
    <AnimatePresence>
      {showScrollTop && currentPage === 'mapping' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.18 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-[#E52D1D] text-white rounded-full shadow-lg shadow-[#E52D1D]/30
                     hover:bg-[#C4220F] transition-colors flex items-center justify-center"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
    </div>
  );
}

export default App;
