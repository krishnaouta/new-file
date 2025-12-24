import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileSpreadsheet, X, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
    className?: string;
    onClear: () => void;
}

export function FileUpload({ onFileSelect, selectedFile, className, onClear }: FileUploadProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        maxFiles: 1,
        disabled: !!selectedFile
    });

    return (
        <div className={twMerge("w-full max-w-2xl mx-auto", className)}>
            <AnimatePresence mode='wait'>
                {!selectedFile ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        {...(getRootProps() as any)}
                        className={clsx(
                            "cursor-pointer border-2 border-dashed rounded-xl p-10 text-center transition-colors duration-200 ease-in-out",
                            isDragActive ? "border-primary bg-primary-light" : "border-slate-300 hover:border-primary hover:bg-slate-50",
                            "flex flex-col items-center justify-center gap-4 group h-64"
                        )}
                    >
                        <input {...getInputProps()} />
                        <div className="p-4 bg-primary-light rounded-full group-hover:bg-red-100 transition-colors">
                            <UploadCloud className="w-10 h-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg font-medium text-black">
                                {isDragActive ? "Drop the file here" : "Drag & drop your file here"}
                            </p>
                            <p className="text-sm text-slate-500">
                                Supports CSV, Excel (.xlsx, .xls)
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white border rounded-xl p-6 shadow-sm flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FileSpreadsheet className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">{selectedFile.name}</p>
                                <p className="text-sm text-slate-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear();
                            }}
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
