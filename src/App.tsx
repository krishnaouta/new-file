import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataProcessor } from './components/DataProcessor';
import { parseFile, ParsedData } from './utils/fileParser';
import { Sparkles, Loader2, FileSpreadsheet, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { InternalField, internalFields as defaultInternalFields } from './utils/dataMapper';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [data, setData] = useState<ParsedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [labelsFile, setLabelsFile] = useState<File | null>(null);
  const [customFields, setCustomFields] = useState<InternalField[] | null>(null);

  const handleDataUpdate = (newData: Record<string, unknown>[], newHeaders: string[]) => {
    setData(prev => prev ? { ...prev, data: newData, headers: newHeaders } : null);
  };




  const handleLabelsFileSelect = async (file: File) => {
    setLabelsFile(file);
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseFile(file);
      // Validate headers
      const hasLabels = parsed.headers.some(h => h.trim().toLowerCase().includes('internal label'));
      const hasTypes = parsed.headers.some(h => h.trim().toLowerCase() === 'datatype');

      if (!hasLabels || !hasTypes) {
        throw new Error("Labels file must contain 'Internal labels' and 'DataType' columns.");
      }

      // Map to InternalField
      const labelCol = parsed.headers.find(h => h.trim().toLowerCase().includes('internal label'))!;
      const typeCol = parsed.headers.find(h => h.trim().toLowerCase() === 'datatype')!;

      const fields: InternalField[] = parsed.data.map(row => ({
        key: row[labelCol], // Use label as key for now, or clean it? keeping it simple as per current usage
        label: row[labelCol],
        type: row[typeCol]
      })).filter(f => f.key && f.type); // Filter out empty rows

      setCustomFields(fields);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to parse labels file.");
      } else {
        setError("Failed to parse labels file.");
      }
      setLabelsFile(null); // Reset if failed
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseFile(file);
      setData(parsed);
    } catch (err: unknown) {
      setError("Failed to parse file. Please ensure it is a valid CSV or Excel file.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setData(null);
    setError(null);
  }

  const handleClearLabels = () => {
    setLabelsFile(null);
    setCustomFields(null);
    handleClear();
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-primary-light selection:text-primary">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div
              className="text-xl font-bold text-[#E52D1D] tracking-tight"
              style={{ color: '#E52D1D' }}
            >
              DataProcessor
            </div>
          </div>
          <div className="flex items-center gap-4">
            {labelsFile && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5"
              >
                <div className="p-1.5 bg-blue-100 rounded-md">
                  <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-700 max-w-[150px] truncate" title={labelsFile.name}>
                    {labelsFile.name} (Labels)
                  </span>
                </div>
                <button
                  onClick={handleClearLabels}
                  className="p-1 hover:bg-blue-200 rounded-full text-blue-400 hover:text-blue-600 transition-colors ml-2"
                  title="Clear Labels and Start Over"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5"
              >
                <div className="p-1.5 bg-green-100 rounded-md">
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-700 max-w-[200px] truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </span>
                </div>
                <button
                  onClick={handleClear}
                  className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
            {!selectedFile && !labelsFile && (
              <a href="#" className="text-sm font-medium text-primary hover:text-primary-hover">
                Documentation
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">


        <section className={!selectedFile ? "min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center p-8" : "mb-8 transition-all duration-500 ease-in-out"}>
          {!selectedFile && (
            <div className="text-center mb-12 space-y-4 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                Data Processing <span className="text-[#E52D1D]">Workflow</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                {!labelsFile && (
                  <>
                    Step 1: Upload your Labels File to define data types.<br />
                  </>
                )}
                Step 2: Upload your Data File to clean and process.
              </p>
            </div>
          )}

          {!labelsFile ? (
            <div className="w-full max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">1</span>
                    Upload Labels File
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 pl-8">
                    Upload excel containing <span className="font-semibold text-blue-700 bg-blue-50 px-1 rounded">'Internal labels'</span> and <span className="font-semibold text-blue-700 bg-blue-50 px-1 rounded">'DataType'</span> columns
                  </p>
                </div>
                <div className="p-8">
                  <FileUpload
                    onFileSelect={handleLabelsFileSelect}
                    selectedFile={labelsFile}
                    onClear={handleClearLabels}
                    variant="blue"
                    className="h-64 border-blue-200 bg-blue-50/30 hover:bg-blue-50/50"
                  />
                </div>
              </div>
            </div>
          ) : (
            !selectedFile && (
              <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold">2</span>
                        Upload Data File
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 pl-8">Step 2: Upload your Data File to clean and process.</p>
                    </div>
                    <button
                      onClick={handleClearLabels}
                      className="text-xs text-slate-400 hover:text-red-500 underline"
                    >
                      Reselect Labels
                    </button>
                  </div>
                  <div className="p-8">
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      selectedFile={selectedFile}
                      onClear={handleClear}
                      variant="green"
                      className="h-64 border-green-200 bg-green-50/30 hover:bg-green-50/50"
                    />
                  </div>
                </div>
              </div>
            )
          )}

          {/* Hidden original logic to preserve layout if needed, effectively validating if layout logic remains consistent */}
          {selectedFile && (
            <div className="hidden">
              <FileUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onClear={handleClear}
              />
            </div>
          )}
        </section>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="mt-4 text-slate-500 font-medium">Processing your file...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 text-red-600 rounded-lg text-center font-medium border border-red-100 mb-8"
            >
              {error}
            </motion.div>
          )}

          {data && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-xl font-bold text-[#E52D1D] flex items-center gap-2"
                  style={{ color: '#E52D1D' }}
                >
                  Data Workspace
                  <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {data.data.length} rows
                  </span>
                </h3>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-sm font-medium text-[#E52D1D] bg-white border border-[#E52D1D] rounded-lg hover:bg-[#E52D1D] hover:text-white transition-all shadow-sm"
                  style={{ borderColor: '#E52D1D', color: '#E52D1D' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E52D1D';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#E52D1D';
                  }}
                >
                  Start Over
                </button>
              </div>

              <DataProcessor
                data={data.data}
                headers={data.headers}
                onDataUpdate={handleDataUpdate}
                internalFields={customFields || defaultInternalFields}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

export default App;
