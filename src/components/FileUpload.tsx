/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
    className?: string;
    onClear: () => void;
    variant?: 'default' | 'blue' | 'green';
}

export function FileUpload({ onFileSelect, selectedFile, className, onClear, variant = 'default' }: FileUploadProps) {
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

    const styles = {
        default: {
            activeBorder: "border-[#E52D1D]",
            activeBg: "bg-[#E52D1D]/5",
            hoverBorder: "hover:border-[#E52D1D]/50",
            hoverBg: "group-hover:bg-[#E52D1D]/10",
            iconColor: "text-[#E52D1D]",
            hoverText: "group-hover:text-[#E52D1D]",
            accentText: "text-[#E52D1D]",
            dragText: "text-[#E52D1D]",
            gradientFrom: "from-red-50/50"
        },
        blue: {
            activeBorder: "border-blue-500",
            activeBg: "bg-blue-50",
            hoverBorder: "hover:border-blue-400",
            hoverBg: "group-hover:bg-blue-100",
            iconColor: "text-blue-500",
            hoverText: "group-hover:text-blue-600",
            accentText: "text-blue-600",
            dragText: "text-blue-600",
            gradientFrom: "from-blue-50/50"
        },
        green: {
            activeBorder: "border-green-500",
            activeBg: "bg-green-50",
            hoverBorder: "hover:border-green-400",
            hoverBg: "group-hover:bg-green-100",
            iconColor: "text-green-500",
            hoverText: "group-hover:text-green-600",
            accentText: "text-green-600",
            dragText: "text-green-600",
            gradientFrom: "from-green-50/50"
        }
    };

    const currentStyle = styles[variant];

    return (
        <div className={twMerge("w-full max-w-2xl mx-auto", className)}>
            <AnimatePresence mode='wait'>
                {!selectedFile ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        {...(getRootProps() as any)}
                        className={clsx(
                            "relative overflow-hidden cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out",
                            isDragActive
                                ? `${currentStyle.activeBorder} ${currentStyle.activeBg} scale-[1.02]`
                                : `border-slate-300 ${currentStyle.hoverBorder} hover:bg-slate-50 hover:shadow-xl hover:shadow-slate-200/50`,
                            "flex flex-col items-center justify-center gap-4 group h-full w-full bg-white/50 backdrop-blur-sm"
                        )}
                    >
                        {/* Background Gradients */}
                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            <div className={`absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br ${currentStyle.gradientFrom} to-transparent blur-3xl transform rotate-12`} />
                            <div className={`absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl ${currentStyle.gradientFrom} to-transparent blur-3xl transform -rotate-12`} />
                        </div>

                        <input {...getInputProps()} />

                        <div className={clsx(
                            "relative z-10 p-6 rounded-full transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3",
                            isDragActive ? currentStyle.activeBg : `bg-slate-100 ${currentStyle.hoverBg}`
                        )}>
                            {isDragActive ? (
                                <UploadCloud className={`w-12 h-12 ${currentStyle.iconColor} animate-bounce`} />
                            ) : (
                                <FileSpreadsheet className={`w-12 h-12 text-slate-400 ${currentStyle.hoverText} transition-colors`} />
                            )}
                        </div>

                        <div className="relative z-10 space-y-3 text-center px-4">
                            <div className="space-y-1">
                                <p className={`text-xl font-semibold text-slate-700 ${currentStyle.hoverText} transition-colors`}>
                                    {isDragActive ? "Drop it like it's hot!" : "Drag & drop your file here"}
                                </p>
                                <p className="text-sm text-slate-500 font-medium">
                                    or <span className={`${currentStyle.accentText} border-b border-current pb-0.5 opacity-80 hover:opacity-100`}>browse from your computer</span>
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-3 text-xs text-slate-400 font-medium bg-slate-50 py-2 px-4 rounded-full border border-slate-100">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    CSV
                                </span>
                                <span className="w-px h-3 bg-slate-200" />
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Excel (XLSX, XLS)
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className={clsx(
                            "relative rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 h-full w-full",
                            variant === 'blue' ? "border-blue-200 bg-blue-50/50" :
                            variant === 'green' ? "border-green-200 bg-green-50/50" :
                            "border-slate-200 bg-slate-50/50"
                        )}
                    >
                        <FileSpreadsheet className={clsx("w-10 h-10", currentStyle.iconColor)} />
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-700 truncate max-w-[200px]" title={selectedFile.name}>{selectedFile.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onClear(); }}
                            className="mt-1 px-3 py-1 text-xs font-medium text-slate-500 hover:text-red-500 border border-slate-200 hover:border-red-200 rounded-full transition-colors bg-white"
                        >
                            Remove file
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
