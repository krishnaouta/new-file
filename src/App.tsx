import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataProcessor } from './components/DataProcessor';
import { parseFile, ParsedData } from './utils/fileParser';
import { Sparkles, ArrowRight, Loader2, Download } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [data, setData] = useState<ParsedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDataUpdate = (newData: any[], newHeaders: string[]) => {
    setData(prev => prev ? { ...prev, data: newData, headers: newHeaders } : null);
  };




  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseFile(file);
      setData(parsed);
    } catch (err: any) {
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

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-primary-light selection:text-primary">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1
              className="text-xl font-bold text-[#E52D1D] tracking-tight"
              style={{ color: '#E52D1D' }}
            >
              CleanData.ai
            </h1>
          </div>
          <a href="#" className="text-sm font-medium text-primary hover:text-primary-hover">
            Documentation
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 space-y-4">
          <h2
            className="text-4xl md:text-5xl font-extrabold text-[#E52D1D] tracking-tight"
            style={{ color: '#E52D1D' }}
          >
            Transform Your Data <span className="text-[#E52D1D]" style={{ color: '#E52D1D' }}>Instantly</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your messy Excel or CSV files and let our powerful engine clean, validate, and format them for you.
          </p>
        </div>

        <section className="mb-8">
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onClear={handleClear}
          />
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
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

export default App;
