/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import { ColumnConfig, processRow, schemas, transformations, TRANSFORMATION_LABELS, inferColumnTypes, smartClean, rulesFromInternalType } from '../utils/validators';
import { splitColumn, ColumnMapping, combineColumns, InternalField } from '../utils/dataMapper';
import { DataTableVirtual } from './DataTable';
import { Save, Download, AlertCircle, ArrowRightLeft, Split, Plus, Trash2, Sparkles, ArrowRight, Undo, Redo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { clsx } from 'clsx';
import { SearchableSelect } from './SearchableSelect';
import { DataQualityDashboard } from './DataQualityDashboard';
import { useHistory } from '../hooks/useHistory';

interface DataProcessorProps {
    data: any[];
    headers: string[];
    onDataUpdate: (data: any[], headers: string[]) => void;
    internalFields: InternalField[];
    // Structural undo/redo for Split and Combine (managed in App.tsx)
    onStructureUndo: () => void;
    onStructureRedo: () => void;
    canStructureUndo: boolean;
    canStructureRedo: boolean;
}

interface ProcessorTemplate {
    name: string;
    mappings: Record<string, string>;
    configs: ColumnConfig[];
    timestamp: number;
}

export function DataProcessor({ data: initialData, headers, onDataUpdate, internalFields, onStructureUndo, onStructureRedo, canStructureUndo, canStructureRedo }: DataProcessorProps) {

    const [processedData, setProcessedData] = useState<{ data: any[], errors: Record<number, Record<string, string>> }>({ data: initialData, errors: {} });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [processing, setProcessing] = useState(false);

    // Inferred Types State - memoized directly to avoid useEffect + setState loop or stale closures if just using state
    const inferredTypes = useMemo(() => inferColumnTypes(initialData, headers), [initialData, headers]);

    // Split State
    const [showSplit, setShowSplit] = useState(false);
    const [splitConfig, setSplitConfig] = useState({ column: '', delimiter: ' ', target1: '', target2: '', strategy: 'first' as 'first' | 'last', keepOriginal: true });

    // History State for Configs and Mappings
    const configsHistory = useHistory<ColumnConfig[]>([]);
    const mappingHistory = useHistory<Record<string, string>>({});

    // Derived values for compatibility
    const configs = configsHistory.state;
    const columnMappings = mappingHistory.state;

    // Mapping State UI
    const [keepUnmapped, setKeepUnmapped] = useState(false);

    // Dashboard State
    const [showErrorsOnly, setShowErrorsOnly] = useState(false);

    // Wizard State
    const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);

    // Template State
    const [templates, setTemplates] = useState<ProcessorTemplate[]>(() => {
        try {
            const saved = localStorage.getItem('processorTemplates');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [showLoadTemplate, setShowLoadTemplate] = useState(false);
    const [showSaveTemplate, setShowSaveTemplate] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');

    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    const handleSaveTemplate = () => {
        if (!newTemplateName.trim()) return;

        const newTemplate: ProcessorTemplate = {
            name: newTemplateName,
            mappings: columnMappings,
            configs,
            timestamp: Date.now()
        };

        const existingIndex = templates.findIndex(t => t.name.toLowerCase() === newTemplateName.trim().toLowerCase());
        let updated;

        if (existingIndex >= 0) {
            updated = [...templates];
            updated[existingIndex] = newTemplate;
        } else {
            updated = [...templates, newTemplate];
        }

        setTemplates(updated);
        localStorage.setItem('processorTemplates', JSON.stringify(updated));

        // Show success message
        setSaveMessage("Template saved!");
        setTimeout(() => {
            setSaveMessage(null);
            setShowSaveTemplate(false);
            setNewTemplateName('');
        }, 1500);
    };

    const handleLoadTemplate = (template: ProcessorTemplate) => {
        if (Object.keys(template.mappings).length > 0) {
            mappingHistory.set(template.mappings);
            if (wizardStep === 1) setWizardStep(2);
        }
        if (template.configs.length > 0) {
            configsHistory.set(template.configs);
        }
    };

    const handleDeleteTemplate = (index: number) => {
        const updated = templates.filter((_, i) => i !== index);
        setTemplates(updated);
        localStorage.setItem('processorTemplates', JSON.stringify(updated));
    };

    const handleConfigChange = (column: string, field: 'validation' | 'transformations', value: any) => {
        const existing = configs.find(c => c.column === column);
        let newConfigs: ColumnConfig[];

        if (existing) {
            newConfigs = configs.map(c => {
                if (c.column === column) {
                    return { ...c, [field]: value };
                }
                return c;
            });
        } else {
            newConfigs = [...configs, { column, [field]: value }];
        }

        configsHistory.set(newConfigs);
    };

    // Sync state when props change (e.g. after split)
    React.useEffect(() => {
        setProcessedData({ data: initialData, errors: {} });
    }, [initialData]);

    // Track if we've already run the auto-detect, so undo doesn't re-trigger it
    const hasAutoDetected = React.useRef(false);

    // Auto-detect configs on load if internalFields are present (runs only once per data load)
    React.useEffect(() => {
        // Reset flag when headers change (new file loaded)
        hasAutoDetected.current = false;
    }, [headers]);

    React.useEffect(() => {
        // Only run once per data load — do NOT re-run when undo empties configs
        if (hasAutoDetected.current) return;
        if (!internalFields || internalFields.length === 0) return;

        const newConfigs: ColumnConfig[] = [];
        const newMappings: Record<string, string> = {};

        headers.forEach(header => {
            // Find match - check key and label
            const field = internalFields.find(f =>
                f.key.toLowerCase() === header.toLowerCase() ||
                f.label.toLowerCase() === header.toLowerCase()
            );

            if (field) {
                // Auto-map UI
                newMappings[header] = field.key;

                if (field.type) {
                    const rules = rulesFromInternalType(field.type);
                    if (rules.validation || rules.transformation) {
                        newConfigs.push({
                            column: header,
                            validation: rules.validation,
                            transformations: rules.transformation ? [rules.transformation] : []
                        });
                    }
                }
            }
        });

        if (newConfigs.length > 0 || Object.keys(newMappings).length > 0) {
            hasAutoDetected.current = true; // Mark as done before calling set() to avoid loops
            if (newConfigs.length > 0) configsHistory.set(newConfigs);
            if (Object.keys(newMappings).length > 0) mappingHistory.set(newMappings);
        }
    }, [headers, internalFields, configsHistory, mappingHistory]);


    const handleSplit = () => {
        if (!splitConfig.column || !splitConfig.target1 || !splitConfig.target2) return;

        // Fallback to space if delimiter was left empty
        const delimiter = splitConfig.delimiter || ' ';

        const newData = initialData.map(row =>
            splitColumn(row, splitConfig.column, delimiter, [splitConfig.target1, splitConfig.target2], splitConfig.strategy)
        );

        // Replace source column with new columns
        const sourceIndex = headers.indexOf(splitConfig.column);
        const newHeaders = [...headers];

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

        // Auto-generate configs based on mapping rules
        // Filter out configs for source columns that are being mapped to prevent ghost errors
        const mappedSourceColumns = mappings.map(m => m.sourceColumn);
        const newConfigs: ColumnConfig[] = configs.filter(c => !mappedSourceColumns.includes(c.column));

        const addOrUpdateConfig = (config: ColumnConfig) => {
            const existingIdx = newConfigs.findIndex(c => c.column === config.column);
            if (existingIdx !== -1) {
                newConfigs[existingIdx] = config;
            } else {
                newConfigs.push(config);
            }
        };

        mappings.forEach(m => {
            // Priority 1: Preserve existing manual config for the source column
            const existingSourceConfig = configs.find(c => c.column === m.sourceColumn);

            if (existingSourceConfig) {
                const newConfig: ColumnConfig = {
                    ...existingSourceConfig,
                    column: m.targetField!
                };
                addOrUpdateConfig(newConfig);
                return;
            }

            // Priority 2: Auto-generate from Internal Field Definition
            const internalField = internalFields.find(f => f.key === m.targetField);
            if (internalField && internalField.type) {
                const rules = rulesFromInternalType(internalField.type);
                if (rules.validation || rules.transformation) {
                    const newConfig: ColumnConfig = {
                        column: m.targetField!,
                        validation: rules.validation,
                        transformations: rules.transformation ? [rules.transformation] : []
                    };
                    addOrUpdateConfig(newConfig);
                }
            }
        });

        const newData = initialData.map(row => {
            const mapped: any = {};

            // Map defined fields
            mappings.forEach(m => {
                if (m.targetField) mapped[m.targetField] = row[m.sourceColumn];
            });

            // If keepUnmapped is true, copy over columns that were NOT mapped
            if (keepUnmapped) {
                headers.forEach(header => {
                    // If this header was NOT used as a source column in mappings, keep it
                    if (!mappedSourceColumns.includes(header)) {
                        mapped[header] = row[header];
                    }
                });
            }

            return mapped;
        });

        // Calculate new headers
        let newHeaders = mappings.map(m => m.targetField!).filter(Boolean);

        if (keepUnmapped) {
            const unmappedHeaders = headers.filter(h => !mappedSourceColumns.includes(h));
            newHeaders = [...newHeaders, ...unmappedHeaders];
        }

        onDataUpdate(newData, newHeaders);
        setWizardStep(3);
        configsHistory.set(newConfigs); // Update configs instead of clearing
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
        // processedData.data already has the correct column names:
        // - If mapping was applied (Step 3), columns are already renamed to target field names.
        // - If no mapping, columns retain their original source names.
        // Exporting directly avoids double-remapping which would produce blank columns.
        const ws = XLSX.utils.json_to_sheet(processedData.data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Cleaned Data");
        XLSX.writeFile(wb, "cleaned_data.xlsx");
    };

    const [smartCleanDone, setSmartCleanDone] = useState(false);

    const handleSmartClean = () => {
        // Clean the current working data (processedData), not the raw initialData,
        // so any prior transforms/splits/combines are preserved
        const cleaned = smartClean(processedData.data, headers);
        onDataUpdate(cleaned, headers);
        // Brief toast feedback
        setSmartCleanDone(true);
        setTimeout(() => setSmartCleanDone(false), 2000);
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

        // Filter by Errors
        if (showErrorsOnly) {
            processed = processed.filter(row => row.__errors && Object.keys(row.__errors).length > 0);
        }

        if (!searchTerm) return processed;

        const lowerTerm = searchTerm.toLowerCase();
        return processed.filter(row =>
            headers.some(header =>
                String(row[header] || '').toLowerCase().includes(lowerTerm)
            )
        );
    }, [processedData, searchTerm, headers, showErrorsOnly]);

    return (
        <div className="space-y-8">
            {/* Wizard Navigation */}
            <div className="flex items-center justify-between border-b border-slate-200 mb-6 pb-4">
                <div className="flex items-center gap-8 w-full max-w-3xl mx-auto">
                    <div className={clsx("flex flex-col items-center gap-2 font-medium text-sm flex-1", wizardStep >= 1 ? "text-[#E52D1D]" : "text-slate-400")}>
                        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-sm text-white font-bold transition-colors shadow-sm", wizardStep >= 1 ? "bg-[#E52D1D]" : "bg-slate-300")}>1</div>
                        Transform Data
                    </div>
                    <div className={clsx("h-px flex-1 hidden md:block", wizardStep >= 2 ? "bg-[#E52D1D]" : "bg-slate-200")} />
                    <div className={clsx("flex flex-col items-center gap-2 font-medium text-sm flex-1", wizardStep >= 2 ? "text-[#E52D1D]" : "text-slate-400")}>
                        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-sm text-white font-bold transition-colors shadow-sm", wizardStep >= 2 ? "bg-[#E52D1D]" : "bg-slate-300")}>2</div>
                        Map Columns
                    </div>
                    <div className={clsx("h-px flex-1 hidden md:block", wizardStep >= 3 ? "bg-[#E52D1D]" : "bg-slate-200")} />
                    <div className={clsx("flex flex-col items-center gap-2 font-medium text-sm flex-1", wizardStep === 3 ? "text-[#E52D1D]" : "text-slate-400")}>
                        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-sm text-white font-bold transition-colors shadow-sm", wizardStep === 3 ? "bg-[#E52D1D]" : "bg-slate-300")}>3</div>
                        Review & Export
                    </div>
                </div>
            </div>

            {(wizardStep === 1 || wizardStep === 3) && (
                <DataQualityDashboard
                    totalRecords={initialData.length}
                    validRecords={initialData.length - Object.keys(processedData.errors).length}
                    errors={processedData.errors}
                    showErrorsOnly={showErrorsOnly}
                    onToggleShowErrors={setShowErrorsOnly}
                />
            )}

            {/* Configuration Toolbar */}
            {wizardStep !== 2 && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">

                {/* Combine Panel */}
                <AnimatePresence>
                    {(wizardStep === 1 && showCombine) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden mb-4"
                        >
                            <div className="p-4 flex flex-col gap-4">
                                <div className="flex items-end gap-4 flex-wrap">
                                    <div className="flex-1 min-w-[160px]">
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
                                    <div className="w-8 flex justify-center pb-2 text-slate-400">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-[160px]">
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
                                    <div className="w-8 flex justify-center pb-2 text-slate-400">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-[160px]">
                                        <label className="block text-xs text-slate-500 mb-1">Result Column Name</label>
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

                                {/* Separator Picker Row */}
                                <div className="border-t border-slate-200 pt-3">
                                    <label className="block text-xs text-slate-500 mb-2">Separator between values</label>
                                    {(() => {
                                        const presets = [
                                            { label: 'Space', value: ' ' },
                                            { label: 'None', value: '' },
                                            { label: ',', value: ',' },
                                            { label: '-', value: '-' },
                                            { label: '_', value: '_' },
                                            { label: '|', value: '|' },
                                            { label: '.', value: '.' },
                                            { label: ';', value: ';' },
                                            { label: '/', value: '/' },
                                            { label: ', ', value: ', ' },
                                            { label: ' - ', value: ' - ' },
                                            { label: 'Tab', value: '\t' },
                                        ];
                                        return (
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {presets.map(p => (
                                                        <button
                                                            key={p.label}
                                                            type="button"
                                                            onClick={() => setCombineConfig({ ...combineConfig, delimiter: p.value })}
                                                            className={clsx(
                                                                'px-2 py-0.5 rounded text-xs font-mono font-semibold border transition-all',
                                                                combineConfig.delimiter === p.value
                                                                    ? 'bg-[#E52D1D] text-white border-[#E52D1D] shadow-sm'
                                                                    : 'bg-white text-slate-600 border-slate-300 hover:border-[#E52D1D] hover:text-[#E52D1D]'
                                                            )}
                                                        >
                                                            {p.label}
                                                        </button>
                                                    ))}
                                                </div>
                                                <input
                                                    type="text"
                                                    className="text-sm border-slate-300 rounded-md font-mono w-36"
                                                    value={combineConfig.delimiter === '\t' ? '\\t' : combineConfig.delimiter}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        setCombineConfig({ ...combineConfig, delimiter: val === '\\t' ? '\t' : val });
                                                    }}
                                                    placeholder="Or type custom…"
                                                />
                                                {/* Live preview */}
                                                {combineConfig.col1 && combineConfig.col2 && (() => {
                                                    const sampleRow = initialData.find(r =>
                                                        (r[combineConfig.col1] !== undefined && r[combineConfig.col1] !== null && r[combineConfig.col1] !== '') ||
                                                        (r[combineConfig.col2] !== undefined && r[combineConfig.col2] !== null && r[combineConfig.col2] !== '')
                                                    );
                                                    if (!sampleRow) return null;
                                                    const v1 = sampleRow[combineConfig.col1] !== undefined && sampleRow[combineConfig.col1] !== null ? String(sampleRow[combineConfig.col1]) : '';
                                                    const v2 = sampleRow[combineConfig.col2] !== undefined && sampleRow[combineConfig.col2] !== null ? String(sampleRow[combineConfig.col2]) : '';
                                                    const sep = combineConfig.delimiter;
                                                    const result = (v1 && v2) ? `${v1}${sep}${v2}` : (v1 || v2);
                                                    return (
                                                        <div className="text-[10px] text-slate-500 bg-white border border-slate-200 rounded px-2 py-1 font-mono flex items-center gap-1">
                                                            <span className="text-slate-400">e.g. </span>
                                                            <span className="text-blue-600 font-semibold">&ldquo;{v1}&rdquo;</span>
                                                            <span className="text-slate-300">+</span>
                                                            <span className="text-green-600 font-semibold">&ldquo;{v2}&rdquo;</span>
                                                            <span className="text-slate-300">=</span>
                                                            <span className="text-purple-600 font-semibold">&ldquo;{result}&rdquo;</span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col gap-4 mb-4">
                    {/* Row 1: Search & Configuration */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search rows..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                            />
                            <div className="absolute left-3 top-2.5 text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            {/* Undo/Redo: Structure (Split / Combine) */}
                            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
                                <span className="text-[10px] text-slate-400 font-medium px-1 hidden sm:block">Structure</span>
                                <button
                                    onClick={onStructureUndo}
                                    disabled={!canStructureUndo}
                                    className="p-1.5 text-slate-600 hover:text-black hover:bg-white rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                    title="Undo Split / Combine"
                                >
                                    <Undo className="w-4 h-4" />
                                </button>
                                <div className="w-px h-4 bg-slate-300 mx-0.5" />
                                <button
                                    onClick={onStructureRedo}
                                    disabled={!canStructureRedo}
                                    className="p-1.5 text-slate-600 hover:text-black hover:bg-white rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                    title="Redo Split / Combine"
                                >
                                    <Redo className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Undo/Redo Controls for Configs */}
                            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
                                <span className="text-[10px] text-slate-400 font-medium px-1 hidden sm:block">Rules</span>
                                <button
                                    onClick={configsHistory.undo}
                                    disabled={!configsHistory.canUndo}
                                    className="p-1.5 text-slate-600 hover:text-black hover:bg-white rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                    title="Undo Validation/Transform Change"
                                >
                                    <Undo className="w-4 h-4" />
                                </button>
                                <div className="w-px h-4 bg-slate-300 mx-0.5" />
                                <button
                                    onClick={configsHistory.redo}
                                    disabled={!configsHistory.canRedo}
                                    className="p-1.5 text-slate-600 hover:text-black hover:bg-white rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                    title="Redo Validation/Transform Change"
                                >
                                    <Redo className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Undo/Redo Controls for Mappings */}
                            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200 mr-2">
                                <span className="text-[10px] text-slate-400 font-medium px-1 hidden sm:block">Map</span>
                                <button
                                    onClick={mappingHistory.undo}
                                    disabled={!mappingHistory.canUndo}
                                    className="p-1.5 text-slate-600 hover:text-black hover:bg-white rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                    title="Undo Mapping Change"
                                >
                                    <Undo className="w-4 h-4" />
                                </button>
                                <div className="w-px h-4 bg-slate-300 mx-0.5" />
                                <button
                                    onClick={mappingHistory.redo}
                                    disabled={!mappingHistory.canRedo}
                                    className="p-1.5 text-slate-600 hover:text-black hover:bg-white rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                    title="Redo Mapping Change"
                                >
                                    <Redo className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Templates UI */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLoadTemplate(!showLoadTemplate)}
                                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-sm border border-slate-200"
                                    title="Load Configuration"
                                >
                                    <Save className="w-4 h-4" />
                                    Select Template
                                </button>

                                <AnimatePresence>
                                    {showLoadTemplate && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                            className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-4"
                                        >
                                            <div className="">
                                                <h4 className="font-semibold text-sm mb-2 text-slate-500">Saved Templates</h4>
                                                <div className="max-h-48 overflow-y-auto space-y-1">
                                                    {templates.length === 0 ? (
                                                        <p className="text-xs text-slate-400 italic">No saved templates</p>
                                                    ) : (
                                                        templates.map((t, i) => (
                                                            <div key={i} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-md">
                                                                <button
                                                                    onClick={() => {
                                                                        handleLoadTemplate(t);
                                                                        setShowLoadTemplate(false);
                                                                    }}
                                                                    className="text-left text-sm font-medium text-slate-700 hover:text-primary flex-1"
                                                                >
                                                                    {t.name}
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteTemplate(i);
                                                                    }}
                                                                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {wizardStep === 1 && (
                                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                                    <button
                                        onClick={() => setShowCombine(!showCombine)}
                                        className={clsx(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-md transition font-medium text-sm",
                                            showCombine ? "bg-white shadow-sm text-primary" : "text-slate-600 hover:bg-white hover:shadow-sm"
                                        )}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Combine
                                    </button>
                                    <button
                                        onClick={() => setShowSplit(!showSplit)}
                                        className={clsx(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-md transition font-medium text-sm",
                                            showSplit ? "bg-white shadow-sm text-primary" : "text-slate-600 hover:bg-white hover:shadow-sm"
                                        )}
                                    >
                                        <Split className="w-4 h-4" />
                                        Split
                                    </button>
                                    <div className="w-px h-5 bg-slate-200 mx-0.5" />
                                    <button
                                        onClick={handleSmartClean}
                                        className={clsx(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-md transition font-medium text-sm",
                                            smartCleanDone
                                                ? "bg-green-100 text-green-700 border border-green-200"
                                                : "text-slate-600 hover:bg-white hover:shadow-sm"
                                        )}
                                        title="Auto-trim whitespace and collapse double-spaces across all text cells"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {smartCleanDone ? 'Cleaned!' : 'Smart Clean'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {wizardStep === 3 && (
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-sm"
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        )}
                    </div>
                </div>

                {/* Old Mapping Panel removed to make way for Step 2 UI */}

                {/* Split Tool Panel */}
                <AnimatePresence>
                    {(wizardStep === 1 && showSplit) && (
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
                            <div className="flex items-end gap-4 flex-wrap">
                                <div className="flex-1 min-w-[160px]">
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
                                <div className="w-64">
                                    <label className="block text-xs text-slate-500 mb-1">Delimiter</label>
                                    {/* Quick-select preset chips */}
                                    {(() => {
                                        const presets = [
                                            { label: 'Space', value: ' ' },
                                            { label: ',', value: ',' },
                                            { label: '-', value: '-' },
                                            { label: '_', value: '_' },
                                            { label: '|', value: '|' },
                                            { label: '.', value: '.' },
                                            { label: ';', value: ';' },
                                            { label: '/', value: '/' },
                                            { label: 'Tab', value: '\t' },
                                        ];
                                        return (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {presets.map(p => (
                                                    <button
                                                        key={p.label}
                                                        type="button"
                                                        onClick={() => setSplitConfig({ ...splitConfig, delimiter: p.value })}
                                                        className={clsx(
                                                            'px-2 py-0.5 rounded text-xs font-mono font-semibold border transition-all',
                                                            splitConfig.delimiter === p.value
                                                                ? 'bg-[#E52D1D] text-white border-[#E52D1D] shadow-sm'
                                                                : 'bg-white text-slate-600 border-slate-300 hover:border-[#E52D1D] hover:text-[#E52D1D]'
                                                        )}
                                                    >
                                                        {p.label}
                                                    </button>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                    {/* Custom delimiter input */}
                                    <input
                                        type="text"
                                        className="w-full text-sm border-slate-300 rounded-md font-mono"
                                        value={splitConfig.delimiter === '\t' ? '\\t' : splitConfig.delimiter}
                                        onChange={e => {
                                            const val = e.target.value;
                                            // Support typing \t to mean tab
                                            setSplitConfig({ ...splitConfig, delimiter: val === '\\t' ? '\t' : val });
                                        }}
                                        onBlur={e => {
                                            if (e.target.value === '') {
                                                setSplitConfig({ ...splitConfig, delimiter: ' ' });
                                            }
                                        }}
                                        placeholder="Or type a custom delimiter…"
                                    />
                                    {/* Live preview of the split */}
                                    {splitConfig.column && (() => {
                                        const sampleRow = initialData.find(r => r[splitConfig.column] !== undefined && r[splitConfig.column] !== null && r[splitConfig.column] !== '');
                                        const sampleVal = sampleRow ? String(sampleRow[splitConfig.column]) : null;
                                        if (!sampleVal) return null;
                                        const delim = splitConfig.delimiter || ' ';
                                        const parts = sampleVal.split(delim);
                                        if (parts.length < 2) return (
                                            <div className="mt-1.5 text-[10px] bg-amber-50 border border-amber-200 text-amber-700 rounded px-2 py-1">
                                                ⚠ Delimiter not found in sample value
                                            </div>
                                        );
                                        const part1 = splitConfig.strategy === 'first'
                                            ? parts[0]
                                            : parts.slice(0, -1).join(delim);
                                        const part2 = splitConfig.strategy === 'first'
                                            ? parts.slice(1).join(delim)
                                            : parts[parts.length - 1];
                                        return (
                                            <div className="mt-1.5 text-[10px] text-slate-500 bg-white border border-slate-200 rounded px-2 py-1 font-mono">
                                                <span className="text-slate-400">e.g. </span>
                                                <span className="text-blue-600 font-semibold">&ldquo;{part1}&rdquo;</span>
                                                <span className="text-slate-300 mx-1">|</span>
                                                <span className="text-green-600 font-semibold">&ldquo;{part2}&rdquo;</span>
                                                {parts.length > 2 && (
                                                    <span className="text-slate-400 ml-1">({parts.length} parts found)</span>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                                <div className="flex-1 min-w-[160px]">
                                    <label className="block text-xs text-slate-500 mb-1">New Column 1 (First Part)</label>
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
                                <div className="flex-1 min-w-[160px]">
                                    <label className="block text-xs text-slate-500 mb-1">New Column 2 (Remaining)</label>
                                    <select
                                        className="w-full text-sm border-slate-300 rounded-md"
                                        value={splitConfig.target2}
                                        onChange={e => setSplitConfig({ ...splitConfig, target2: e.target.value })}
                                    >
                                        <option value="">Select Internal Field...</option>
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

                <div className="flex justify-end pt-4 border-t border-slate-100 relative">
                    <button
                        onClick={() => setShowSaveTemplate(!showSaveTemplate)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition font-medium text-sm shadow-sm"
                    >
                        <Save className="w-4 h-4" />
                        Save Template
                    </button>

                    <AnimatePresence>
                        {showSaveTemplate && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: -14 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 bottom-full mb-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-4"
                            >
                                <h4 className="font-semibold text-sm mb-3">Save Current Config</h4>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newTemplateName}
                                        onChange={e => setNewTemplateName(e.target.value)}
                                        placeholder="Template Name..."
                                        className="flex-1 text-sm border-slate-300 rounded-md"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleSaveTemplate}
                                        disabled={!newTemplateName.trim()}
                                        className={clsx(
                                            "p-2 rounded-md disabled:opacity-50 transition-colors",
                                            saveMessage ? "bg-green-600 hover:bg-green-700 text-white" : "bg-[#E52D1D] text-white hover:bg-[#c42519]"
                                        )}
                                    >
                                        {saveMessage ? <Sparkles className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                    </button>
                                </div>
                                {saveMessage && (
                                    <p className="text-xs text-green-600 mt-2 font-medium text-center">{saveMessage}</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            )}

            {/* Step 2: Mapping Configuration (Vertical List) */}
            {wizardStep === 2 && (
                <div className="max-w-5xl mx-auto space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 shadow-sm">
                        <div>
                            <h3 className="font-semibold text-slate-800 text-lg">Map Source Data to Internal Fields</h3>
                            <p className="text-sm text-slate-500">Each row below represents a column from your uploaded file.</p>
                        </div>
                        <div className="flex items-center gap-6">
                             <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer font-medium border border-slate-200 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                                 <input
                                     type="checkbox"
                                     className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4"
                                     checked={keepUnmapped}
                                     onChange={e => setKeepUnmapped(e.target.checked)}
                                 />
                                 Keep Unmapped
                             </label>
                            <button
                                onClick={handleApplyMapping}
                                disabled={Object.keys(columnMappings).length === 0}
                                className="px-6 py-2.5 bg-[#E52D1D] hover:bg-[#B4142D] text-white rounded-lg font-medium shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <ArrowRightLeft className="w-4 h-4" />
                                Apply {Object.keys(columnMappings).length} Mappings
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {headers.map(header => {
                            const config = configs.find(c => c.column === header) || { column: header };
                            const mappedFieldKey = columnMappings[header];

                            return (
                                <div key={header} className="flex flex-col md:flex-row gap-6 p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-colors">
                                    <div className="md:w-1/3 flex flex-col justify-center border-r border-slate-100 pr-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Source Column</label>
                                        <div className="flex flex-col items-start gap-2">
                                            <span className="font-bold text-slate-800 text-lg break-all leading-tight" title={header}>{header}</span>
                                            {inferredTypes[header] && (
                                                <span className={clsx(
                                                    "text-[10px] px-2 py-0.5 rounded-md uppercase font-bold tracking-wider",
                                                    inferredTypes[header] === 'number' ? "bg-blue-100 text-blue-700" :
                                                    inferredTypes[header] === 'boolean' ? "bg-purple-100 text-purple-700" :
                                                    inferredTypes[header] === 'date' ? "bg-orange-100 text-orange-700" :
                                                    "bg-slate-100 text-slate-600"
                                                )}>
                                                    Type: {inferredTypes[header]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="md:w-1/3 flex flex-col justify-center border-r border-slate-100 pr-4">
                                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Map To Internal Field</label>
                                         <SearchableSelect
                                            options={[
                                                { label: "(Ignore / Keep Original)", value: "" },
                                                ...internalFields.sort((a, b) => a.label.localeCompare(b.label)).map(f => ({
                                                    label: f.label,
                                                    value: f.key,
                                                    subLabel: f.key !== f.label ? f.key : undefined
                                                }))
                                            ]}
                                            value={mappedFieldKey || ''}
                                            onChange={(val) => {
                                                const newMappings = { ...columnMappings, [header]: val };
                                                if (!val) delete newMappings[header];
                                                mappingHistory.set(newMappings);

                                                if (val) {
                                                    const field = internalFields.find(f => f.key === val);
                                                    if (field && field.type) {
                                                        const rules = rulesFromInternalType(field.type);
                                                        if (rules.validation || rules.transformation) {
                                                            const newConfig: ColumnConfig = {
                                                                column: header,
                                                                validation: rules.validation,
                                                                transformations: rules.transformation ? [rules.transformation] : []
                                                            };
                                                            const existingIdx = configs.findIndex(c => c.column === header);
                                                            const newConfigsArgs = [...configs];
                                                            if (existingIdx !== -1) {
                                                                newConfigsArgs[existingIdx] = newConfig;
                                                            } else {
                                                                newConfigsArgs.push(newConfig);
                                                            }
                                                            configsHistory.set(newConfigsArgs);
                                                        }
                                                    }
                                                }
                                            }}
                                            placeholder="Search mapping fields..."
                                            allowCreate={true}
                                        />
                                    </div>

                                    <div className="md:w-1/3 flex flex-col justify-center gap-4">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Validation Rule</label>
                                                {(config.validation || (config.transformations && config.transformations.length > 0)) && (
                                                    <button
                                                        onClick={() => {
                                                            const newConfigs = configs.filter(c => c.column !== header);
                                                            configsHistory.set(newConfigs);
                                                        }}
                                                        className="text-[10px] text-slate-400 hover:text-red-500 underline decoration-dotted font-medium"
                                                    >
                                                        Clear Rules
                                                    </button>
                                                )}
                                            </div>
                                            <select
                                                className="w-full text-sm border-slate-300 rounded-lg focus:border-primary focus:ring-primary shadow-sm"
                                                value={config.validation || ''}
                                                onChange={(e) => handleConfigChange(header, 'validation', e.target.value || undefined)}
                                            >
                                                <option value="">None</option>
                                                {Object.keys(schemas).sort().map(k => (
                                                    <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transformations</label>
                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                {(config.transformations || []).map((t, idx) => (
                                                    <span key={idx} className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 font-medium">
                                                        {TRANSFORMATION_LABELS[t] ?? t}
                                                        <button onClick={() => {
                                                            const newT = (config.transformations || []).filter((_, i) => i !== idx);
                                                            handleConfigChange(header, 'transformations', newT);
                                                        }} className="hover:text-red-500 text-slate-400 bg-white rounded-full w-4 h-4 flex items-center justify-center">×</button>
                                                    </span>
                                                ))}
                                            </div>
                                            <select
                                                className="w-full text-sm border-slate-300 rounded-lg focus:border-primary focus:ring-primary shadow-sm"
                                                value=""
                                                onChange={(e) => {
                                                    if (!e.target.value) return;
                                                    const current = config.transformations || [];
                                                    if (!current.includes(e.target.value as any)) {
                                                        handleConfigChange(header, 'transformations', [...current, e.target.value]);
                                                    }
                                                }}
                                            >
                                                <option value="">+ Add Transformation...</option>
                                                {Object.keys(transformations).sort().map(k => (
                                                    <option key={k} value={k}>{TRANSFORMATION_LABELS[k as keyof typeof TRANSFORMATION_LABELS] ?? k}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {(wizardStep === 1 || wizardStep === 3) && (
                <div className="space-y-4">
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
                            headerRenderer={(header) => (
                                <div className="flex flex-col gap-1 w-full text-left">
                                    <div className="flex items-center justify-between">
                                        <span className="truncate font-bold text-slate-700" title={header}>{header}</span>
                                        {wizardStep === 1 && inferredTypes[header] && (
                                            <span className={clsx(
                                                "text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider",
                                                inferredTypes[header] === 'number' ? "bg-blue-100 text-blue-700" :
                                                inferredTypes[header] === 'boolean' ? "bg-purple-100 text-purple-700" :
                                                inferredTypes[header] === 'date' ? "bg-orange-100 text-orange-700" :
                                                "bg-slate-100 text-slate-600"
                                            )}>
                                                {inferredTypes[header]}
                                            </span>
                                        )}
                                    </div>
                                    {wizardStep === 3 && columnMappings[header] && (
                                         <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Mapped: {columnMappings[header]}</div>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </div>
            )}

            {/* Bottom Wizard Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-8 mb-4">
                <button
                    onClick={() => setWizardStep(prev => Math.max(1, prev - 1) as any)}
                    disabled={wizardStep === 1}
                    className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-medium shadow-sm hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Back
                </button>
                <div className="flex gap-4">
                    {wizardStep < 3 ? (
                        <button
                            onClick={() => setWizardStep(prev => prev + 1 as any)}
                            className="px-8 py-2.5 bg-slate-800 text-white rounded-lg font-medium shadow-sm hover:bg-slate-900 transition-colors flex items-center gap-2"
                        >
                            Next Step <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleExport}
                            className="px-8 py-2.5 bg-green-600 text-white rounded-lg font-medium shadow-md hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" /> Export Transformed Data
                        </button>
                    )}
                </div>
            </div>
        </div >
    );
}
