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
        estimateSize: () => 38,
        overscan: 20,
    });

    if (data.length === 0) return null;

    return (
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm h-[580px]">
            <div ref={parentRef} className="overflow-auto h-full w-full relative bg-white">
                {/* Sticky Header — Brand Black */}
                <div className="sticky top-0 z-20 flex bg-black border-b border-white/10 font-semibold text-white text-xs w-fit min-w-full">
                    {headers.map((header, i) => (
                        <div
                            key={i}
                            className="px-4 py-3 w-[220px] shrink-0 border-r border-white/10 last:border-r-0 flex flex-col justify-center"
                        >
                            {headerRenderer ? headerRenderer(header, i) : (
                                <span className="font-bold text-white uppercase tracking-wider text-[11px] truncate">
                                    {header}
                                </span>
                            )}
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
                        const hasRowError = rowErrors && Object.keys(rowErrors).length > 0;
                        return (
                            <div
                                key={virtualRow.key}
                                className={clsx(
                                    "absolute top-0 left-0 flex border-b transition-colors text-sm w-full group",
                                    hasRowError
                                        ? "bg-[#F9E0E4]/40 border-[#B4142D]/10 hover:bg-[#F9E0E4]/70"
                                        : virtualRow.index % 2 === 0
                                            ? "bg-white border-slate-100 hover:bg-[#FDECEA]/20"
                                            : "bg-slate-50/60 border-slate-100 hover:bg-[#FDECEA]/20"
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
                                                "px-4 py-2 w-[220px] shrink-0 truncate border-r border-slate-100 last:border-r-0 flex items-center text-slate-700 text-sm",
                                                hasError && "bg-[#F9E0E4]/60 text-[#B4142D] font-semibold ring-1 ring-inset ring-[#B4142D]/20"
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
