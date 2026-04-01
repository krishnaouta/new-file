/* eslint-disable */
import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { clsx } from 'clsx';

interface DataTableProps {
    data: any[];
    headers: string[];
    errors?: Record<number, Record<string, string>>;
    headerRenderer?: (header: string, index: number) => React.ReactNode;
}

export function DataTableVirtual({ data, headers, errors, headerRenderer }: DataTableProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35,
        overscan: 20,
    });

    if (data.length === 0) return null;

    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm h-[600px]">
            <div ref={parentRef} className="overflow-auto h-full w-full relative">
                {/* Sticky Header */}
                <div className="sticky top-0 z-20 flex bg-slate-100 border-b border-slate-200 font-semibold text-slate-700 text-sm w-fit min-w-full">
                    {headers.map((header, i) => (
                        <div key={i} className="px-4 py-3 w-[250px] shrink-0 border-r border-slate-200 last:border-r-0 flex flex-col justify-end">
                            {headerRenderer ? headerRenderer(header, i) : header}
                        </div>
                    ))}
                </div>

                {/* Virtual List Container */}
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: 'fit-content',
                        minWidth: '100%',
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const row = data[virtualRow.index];
                        const rowErrors = row.__errors || errors?.[virtualRow.index];
                        return (
                            <div
                                key={virtualRow.key}
                                className={clsx(
                                    "absolute top-0 left-0 flex border-b border-slate-100 hover:bg-slate-50 transition-colors text-sm text-slate-600 w-full",
                                    virtualRow.index % 2 === 0 ? "bg-white" : "bg-slate-50/50",
                                    rowErrors && Object.keys(rowErrors).length > 0 && "bg-red-50/30"
                                )}
                                style={{
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                {headers.map((header, colIndex) => {
                                    const hasError = rowErrors?.[header];
                                    return (
                                        <div
                                            key={`${virtualRow.index}-${colIndex}`}
                                            className={clsx(
                                                "px-4 py-2 w-[250px] shrink-0 truncate border-r border-slate-100 last:border-r-0 flex items-center",
                                                hasError && "bg-red-50 text-red-600 font-medium ring-1 ring-inset ring-red-200"
                                            )}
                                            title={hasError || undefined}
                                        >
                                            {row[header]?.toString() || ''}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
