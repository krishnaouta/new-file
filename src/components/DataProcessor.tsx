import React, { useState, useMemo } from 'react';
import { ColumnConfig, processRow, TransformationType, ValidationRule, schemas, transformations, inferColumnTypes, InferredType, smartClean, suggestRules } from '../utils/validators';
import { internalFields, splitColumn, ColumnMapping, combineColumns, getBestMatch } from '../utils/dataMapper';
import { DataTableVirtual } from './DataTable';
import { Settings, Save, Download, Play, AlertCircle, ArrowRightLeft, Split, Plus, Trash2, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { clsx } from 'clsx';
import { SearchableSelect } from './SearchableSelect';

interface DataProcessorProps {
    data: any[];
    headers: string[];
    onDataUpdate: (data: any[], headers: string[]) => void;
}

export function DataProcessor({ data: initialData, headers, onDataUpdate }: DataProcessorProps) {
    const [configs, setConfigs] = useState<ColumnConfig[]>([]);
    const [processedData, setProcessedData] = useState<{ data: any[], errors: Record<number, Record<string, string>> }>({ data: initialData, errors: {} });
    const [processing, setProcessing] = useState(false);

    // Inferred Types State - memoized directly to avoid useEffect + setState loop or stale closures if just using state
    const inferredTypes = useMemo(() => inferColumnTypes(initialData, headers), [initialData, headers]);

    // Split State
    const [showSplit, setShowSplit] = useState(false);
    const [splitConfig, setSplitConfig] = useState({ column: '', delimiter: ' ', target1: '', target2: '', strategy: 'first' as 'first' | 'last', keepOriginal: true });

    // Mapping State
    const [showMapping, setShowMapping] = useState(false);
    const [columnMappings, setColumnMappings] = useState<Record<string, string>>({}); // Header -> InternalKey

    const handleConfigChange = (column: string, field: 'validation' | 'transformations', value: any) => {
        setConfigs(prev => {
            const existing = prev.find(c => c.column === column);
            if (existing) {
                return prev.map(c => c.column === column ? { ...c, [field]: value } : c);
            }
            return [...prev, { column, [field]: value }];
        });
    };

    // Sync state when props change (e.g. after split)
    React.useEffect(() => {
        setProcessedData({ data: initialData, errors: {} });
    }, [initialData]);

    const handleSplit = () => {
        if (!splitConfig.column || !splitConfig.target1 || !splitConfig.target2) return;

        const newData = initialData.map(row =>
            splitColumn(row, splitConfig.column, splitConfig.delimiter, [splitConfig.target1, splitConfig.target2], splitConfig.strategy)
        );

        // Replace source column with new columns
        const sourceIndex = headers.indexOf(splitConfig.column);
        let newHeaders = [...headers];

        if (sourceIndex !== -1) {
            if (splitConfig.keepOriginal) {
                // Insert after source
                newHeaders.splice(sourceIndex + 1, 0, splitConfig.target1, splitConfig.target2);
            } else {
                // Remove source and insert targets
                newHeaders.splice(sourceIndex, 1, splitConfig.target1, splitConfig.target2);
            }
        } else {
            // Fallback: just append if source not found (shouldn't happen)
            const uniqueHeaders = new Set([...headers, splitConfig.target1, splitConfig.target2]);
            onDataUpdate(newData, Array.from(uniqueHeaders));
            setShowSplit(false);
            return;
        }

        onDataUpdate(newData, newHeaders);
        setShowSplit(false);
    };



    const handleApplyMapping = () => {
        const mappings: ColumnMapping[] = Object.entries(columnMappings).map(([source, target]) => ({
            sourceColumn: source,
            targetField: target
        })).filter(m => m.targetField);

        if (mappings.length === 0) return;

        const newData = initialData.map(row => {
            const mapped: any = {};
            mappings.forEach(m => {
                if (m.targetField) mapped[m.targetField] = row[m.sourceColumn];
            });
            return mapped;
        });

        const newHeaders = mappings.map(m => m.targetField!).filter(Boolean);

        onDataUpdate(newData, newHeaders);
        setShowMapping(false);
        setConfigs([]);
    };

    // Automatic Processing when configs change
    React.useEffect(() => {
        setProcessing(true);
        const timer = setTimeout(() => {
            const results = initialData.map(row => processRow(row, configs));
            const newData = results.map(r => r.row);
            const newErrors = results.reduce((acc, r, i) => {
                if (Object.keys(r.errors).length > 0) {
                    acc[i] = r.errors;
                }
                return acc;
            }, {} as Record<number, Record<string, string>>);

            setProcessedData({ data: newData, errors: newErrors });
            setProcessing(false);
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [configs, initialData]);

    // Manual triggers (like Split/Combine) still use this implicitly via initialData updates
    // Removing the manual runProcessing function as it's now reactive


    // Combine State
    const [showCombine, setShowCombine] = useState(false);
    const [combineConfig, setCombineConfig] = useState({ col1: '', col2: '', delimiter: ' ', target: '', keepOriginal: true });

    const handleCombine = () => {
        if (!combineConfig.col1 || !combineConfig.col2 || !combineConfig.target) return;

        const newData = initialData.map(row =>
            combineColumns(row, combineConfig.col1, combineConfig.col2, combineConfig.delimiter, combineConfig.target)
        );

        let newHeaders = [...headers];

        const idx1 = headers.indexOf(combineConfig.col1);
        const idx2 = headers.indexOf(combineConfig.col2);

        if (combineConfig.keepOriginal) {
            // Insert after the later of the two columns so it sits next to them
            const insertIndex = Math.max(idx1, idx2);
            if (insertIndex !== -1) {
                newHeaders.splice(insertIndex + 1, 0, combineConfig.target);
            } else {
                newHeaders.push(combineConfig.target);
            }
        } else {
            // Remove source columns
            newHeaders = newHeaders.filter(h => h !== combineConfig.col1 && h !== combineConfig.col2);

            // Insert at the position of the earlier column to maintain logical flow
            const insertIndex = Math.min(idx1, idx2);
            if (insertIndex !== -1) {
                newHeaders.splice(insertIndex, 0, combineConfig.target);
            } else {
                newHeaders.push(combineConfig.target);
            }
        }

        onDataUpdate(newData, newHeaders);
        setShowCombine(false);
        setCombineConfig({ col1: '', col2: '', delimiter: ' ', target: '', keepOriginal: true });
    };

    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(processedData.data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Cleaned Data");
        XLSX.writeFile(wb, "cleaned_data.xlsx");
    };

    const handleSmartClean = () => {
        // Dynamic import to avoid circular dependencies if any, or just use the imported one
        const cleaned = smartClean(initialData, headers);
        onDataUpdate(cleaned, headers);
    };

    const errorCount = Object.keys(processedData.errors).length;

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');

    // Derived State for Filtering
    const filteredData = useMemo(() => {
        let processed = processedData.data.map((row, index) => ({
            ...row,
            __errors: processedData.errors[index]
        }));

        if (!searchTerm) return processed;

        const lowerTerm = searchTerm.toLowerCase();
        return processed.filter(row =>
            headers.some(header =>
                String(row[header] || '').toLowerCase().includes(lowerTerm)
            )
        );
    }, [processedData, searchTerm, headers]);

    return (
        <div className="space-y-8">
            {/* Configuration Toolbar */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">

                {/* Combine Panel */}
                <AnimatePresence>
                    {showCombine && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden mb-4"
                        >
                            <div className="p-4 flex items-end gap-4">
                                <div className="flex-1 max-w-xs">
                                    <label className="block text-xs text-slate-500 mb-1">Column 1</label>
                                    <select
                                        className="w-full text-sm border-slate-300 rounded-md"
                                        value={combineConfig.col1}
                                        onChange={e => setCombineConfig({ ...combineConfig, col1: e.target.value })}
                                    >
                                        <option value="">Select Column...</option>
                                        {[...headers].sort().map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                                <div className="w-12 flex justify-center pb-2 text-slate-400">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <div className="flex-1 max-w-xs">
                                    <label className="block text-xs text-slate-500 mb-1">Column 2</label>
                                    <select
                                        className="w-full text-sm border-slate-300 rounded-md"
                                        value={combineConfig.col2}
                                        onChange={e => setCombineConfig({ ...combineConfig, col2: e.target.value })}
                                    >
                                        <option value="">Select Column...</option>
                                        {[...headers].sort().map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                                <div className="w-24">
                                    <label className="block text-xs text-slate-500 mb-1">Separator</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm border-slate-300 rounded-md"
                                        value={combineConfig.delimiter}
                                        onChange={e => setCombineConfig({ ...combineConfig, delimiter: e.target.value })}
                                        placeholder="Space"
                                    />
                                </div>
                                <div className="w-8 flex justify-center pb-2 text-slate-400">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                                <div className="flex-1 max-w-xs">
                                    <label className="block text-xs text-slate-500 mb-1">Result Column</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm border-slate-300 rounded-md"
                                        value={combineConfig.target}
                                        onChange={e => setCombineConfig({ ...combineConfig, target: e.target.value })}
                                        placeholder="New Column Name"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer pt-6">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-primary focus:ring-primary"
                                            checked={combineConfig.keepOriginal}
                                            onChange={e => setCombineConfig({ ...combineConfig, keepOriginal: e.target.checked })}
                                        />
                                        Keep original
                                    </label>
                                </div>
                                <button
                                    onClick={handleCombine}
                                    disabled={!combineConfig.col1 || !combineConfig.col2 || !combineConfig.target}
                                    className="px-4 py-2 bg-[#E52D1D] text-white rounded-md hover:bg-[#B4142D] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                                    style={{ backgroundColor: '#E52D1D' }}
                                >
                                    Combine
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <h3
                            className="text-lg font-semibold text-[#E52D1D] flex items-center gap-2 shrink-0"
                            style={{ color: '#E52D1D' }}
                        >
                            <Settings
                                className="w-5 h-5 text-[#E52D1D]"
                                style={{ color: '#E52D1D' }}
                            />
                            Processing Rules
                        </h3>
                        {/* Search Bar */}
                        <div className="relative max-w-md w-full">
                            <input
                                type="text"
                                placeholder="Search rows..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <div className="absolute left-3 top-2.5 text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={handleSmartClean}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary-light text-primary rounded-lg hover:bg-red-100 transition font-medium text-sm border border-red-100"
                            title="Auto-trim whitespace and fix formatting"
                        >
                            <Sparkles className="w-4 h-4" />
                            Smart Clean
                        </button>
                        <button
                            onClick={() => setShowCombine(!showCombine)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Combine
                        </button>
                        <button
                            onClick={() => {
                                if (!showMapping && Object.keys(columnMappings).length === 0) {
                                    const autoMappings: Record<string, string> = {};
                                    headers.forEach(header => {
                                        const match = getBestMatch(header, internalFields);
                                        if (match) autoMappings[header] = match;
                                    });
                                    setColumnMappings(autoMappings);
                                }
                                setShowMapping(!showMapping);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-sm"
                        >
                            <ArrowRightLeft className="w-4 h-4" />
                            Map Columns
                        </button>
                        <button
                            onClick={() => setShowSplit(!showSplit)}
                            className="flex mt-1 items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-sm"
                        >
                            <Split className="w-4 h-4" />
                            Split Column
                        </button>

                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Mapping Panel */}
                <AnimatePresence>
                    {showMapping && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h4
                                    className="text-sm font-semibold text-[#E52D1D]"
                                    style={{ color: '#E52D1D' }}
                                >
                                    Map Source Columns to Internal Fields
                                </h4>
                                <button
                                    onClick={handleApplyMapping}
                                    className="px-4 py-2 bg-[#E52D1D] text-white rounded-md text-sm hover:bg-[#B4142D] transition-colors"
                                    style={{ backgroundColor: '#E52D1D' }}
                                >
                                    Apply Mapping
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {headers.map(header => (
                                    <div key={header} className="flex flex-col gap-1 p-3 bg-white border border-slate-200 rounded-md">
                                        <div className="text-xs font-semibold text-slate-500 uppercase">Source File</div>
                                        <div className="text-sm font-medium text-slate-800 truncate" title={header}>{header}</div>

                                        <ArrowRightLeft className="w-3 h-3 text-slate-400 my-1 self-center rotate-90" />

                                        <div className="text-xs font-semibold text-slate-500 uppercase">Map To</div>
                                        <SearchableSelect
                                            options={[
                                                { label: "(Ignore)", value: "" },
                                                ...internalFields.sort((a, b) => a.label.localeCompare(b.label)).map(f => ({
                                                    label: f.label,
                                                    value: f.key,
                                                    subLabel: f.key !== f.label ? f.key : undefined
                                                }))
                                            ]}
                                            value={columnMappings[header] || ''}
                                            onChange={(val) => setColumnMappings(prev => ({ ...prev, [header]: val }))}
                                            placeholder="Select Field..."
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Split Tool Panel */}
                <AnimatePresence>
                    {showSplit && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4"
                        >
                            <h4
                                className="text-sm font-semibold text-[#E52D1D] mb-3 block"
                                style={{ color: '#E52D1D' }}
                            >
                                Split Column Strategy
                            </h4>
                            <div className="flex items-end gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs text-slate-500 mb-1">Column to Split</label>
                                    <select
                                        className="w-full text-sm border-slate-300 rounded-md"
                                        value={splitConfig.column}
                                        onChange={e => setSplitConfig({ ...splitConfig, column: e.target.value })}
                                    >
                                        <option value="">Select Column...</option>
                                        {[...headers].sort().map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                                <div className="w-32">
                                    <label className="block text-xs text-slate-500 mb-1">Split At</label>
                                    <select
                                        className="w-full text-sm border-slate-300 rounded-md"
                                        value={splitConfig.strategy}
                                        onChange={e => setSplitConfig({ ...splitConfig, strategy: e.target.value as 'first' | 'last' })}
                                    >
                                        <option value="first">First Match</option>
                                        <option value="last">Last Match</option>
                                    </select>
                                </div>
                                <div className="w-24">
                                    <label className="block text-xs text-slate-500 mb-1">Delimiter</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm border-slate-300 rounded-md"
                                        value={splitConfig.delimiter}
                                        onChange={e => setSplitConfig({ ...splitConfig, delimiter: e.target.value })}
                                        placeholder="e.g. ' '"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs text-slate-500 mb-1">New Column 1</label>
                                    <select
                                        className="w-full text-sm border-slate-300 rounded-md"
                                        value={splitConfig.target1}
                                        onChange={e => setSplitConfig({ ...splitConfig, target1: e.target.value })}
                                    >
                                        <option value="">Select Internal Field...</option>
                                        {internalFields.sort((a, b) => a.label.localeCompare(b.label)).map(f => (
                                            <option key={`t1-${f.key}`} value={f.key}>{f.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs text-slate-500 mb-1">New Column 2</label>
                                    <select
                                        className="w-full text-sm border-slate-300 rounded-md"
                                        value={splitConfig.target2}
                                        onChange={e => setSplitConfig({ ...splitConfig, target2: e.target.value })}
                                    >
                                        {internalFields.sort((a, b) => a.label.localeCompare(b.label)).map(f => (
                                            <option key={`t2-${f.key}`} value={f.key}>{f.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer pt-6">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-primary focus:ring-primary"
                                            checked={splitConfig.keepOriginal}
                                            onChange={e => setSplitConfig({ ...splitConfig, keepOriginal: e.target.checked })}
                                        />
                                        Keep original
                                    </label>
                                </div>
                                <button
                                    onClick={handleSplit}
                                    disabled={!splitConfig.column || !splitConfig.target1 || !splitConfig.target2}
                                    className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-slate-800 disabled:opacity-50"
                                >
                                    Apply Split
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="overflow-x-auto pb-2">
                    <div className="flex gap-4 min-w-max">
                        {headers.map(header => {
                            const config = configs.find(c => c.column === header) || { column: header };
                            return (
                                <div key={header} className="w-64 bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3 shrink-0">
                                    <div className="font-medium text-black truncate flex items-center gap-2">
                                        <span title={header}>{header}</span>
                                        {inferredTypes[header] && (
                                            <span
                                                className={clsx(
                                                    "text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider",
                                                    inferredTypes[header] === 'number' ? "bg-blue-100 text-blue-700" :
                                                        inferredTypes[header] === 'boolean' ? "bg-purple-100 text-purple-700" :
                                                            inferredTypes[header] === 'date' ? "bg-orange-100 text-orange-700" :
                                                                inferredTypes[header] === 'email' ? "bg-teal-100 text-teal-700" :
                                                                    "bg-slate-100 text-slate-600"
                                                )}
                                                title={`Detected Type: ${inferredTypes[header]}`}
                                            >
                                                {inferredTypes[header]}
                                            </span>
                                        )}
                                    </div>

                                    {/* Validation */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="block text-xs font-semibold text-slate-500">Validation</label>
                                            {inferredTypes[header] && (() => {
                                                const suggestion = suggestRules(inferredTypes[header]);
                                                if (suggestion.validation && config.validation !== suggestion.validation) {
                                                    return (
                                                        <button
                                                            onClick={() => handleConfigChange(header, 'validation', suggestion.validation)}
                                                            className="flex items-center gap-1 text-[10px] bg-primary-light text-primary px-1.5 py-0.5 rounded cursor-pointer hover:bg-red-100 transition"
                                                            title={`Apply suggested ${suggestion.validation} validation`}
                                                        >
                                                            <Sparkles className="w-3 h-3" />
                                                            Suggest: {suggestion.validation}
                                                        </button>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </div>
                                        <select
                                            className="w-full text-sm border-slate-300 rounded-md focus:border-primary focus:ring-primary"
                                            value={config.validation || ''}
                                            onChange={(e) => handleConfigChange(header, 'validation', e.target.value || undefined)}
                                        >
                                            <option value="">None</option>
                                            {Object.keys(schemas).sort().map(k => (
                                                <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Transformations - Multi-select */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Transformations</label>
                                        <div className="space-y-2">
                                            {(config.transformations || []).map((t, idx) => (
                                                <div key={idx} className="flex items-center gap-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs">
                                                    <span className="flex-1">{t}</span>
                                                    <button
                                                        onClick={() => {
                                                            const newT = (config.transformations || []).filter((_, i) => i !== idx);
                                                            handleConfigChange(header, 'transformations', newT);
                                                        }}
                                                        className="text-slate-400 hover:text-red-500"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <select
                                                className="w-full text-sm border-slate-300 rounded-md focus:border-primary focus:ring-primary"
                                                value=""
                                                onChange={(e) => {
                                                    if (!e.target.value) return;
                                                    const current = config.transformations || [];
                                                    if (!current.includes(e.target.value as any)) {
                                                        handleConfigChange(header, 'transformations', [...current, e.target.value]);
                                                    }
                                                }}
                                            >
                                                <option value="">+ Add...</option>
                                                {Object.keys(transformations).sort().map(k => (
                                                    <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {errorCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100"
                >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="font-medium">Found errors in {errorCount} rows.</p>
                </motion.div>
            )}

            <div>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                        Preview ({filteredData.length} rows)
                    </h4>
                </div>
                <DataTableVirtual
                    data={filteredData}
                    headers={headers}
                // errors prop is optional now as we embed them
                />
            </div>
        </div>
    );
}
