import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { clsx } from 'clsx';

interface DataTableProps {
    data: any[];
    headers: string[];
    errors?: Record<number, Record<string, string>>;
}

export function DataTable({ data, headers }: DataTableProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 40, // Height of a row in pixels
        overscan: 5,
    });

    if (data.length === 0) {
        return <div className="p-4 text-center text-slate-500">No data to display</div>;
    }

    return (
        <div className="border border-slate-200 rounded-lg shadow-sm bg-white overflow-hidden">
            <div className="overflow-x-auto">
                <div
                    ref={parentRef}
                    className="max-h-[600px] overflow-auto w-full"
                    style={{
                        contain: 'strict',
                    }}
                >
                    <div
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {/* Headers are sticky, but here we can just put them in a separate header if we want sticky headers in a simple way for virtual list we need slightly more complex setup for table. 
                For now, I'll render the header as the first "item" or just outside of the virtualizer if I want true sticky headers. 
                However, to keep column widths aligned, a grid is often better than a table for virtualization.
                Let's try a table but with the virtual wrapper ONLY on the tbody.
             */}

                        {/* Actually @tanstack/react-virtual works best with div structures for simple implementation. Let's use a grid-like structure. */}

                        <table className="w-full text-sm text-left text-slate-500 relative" style={{ display: 'grid', gridTemplateColumns: `repeat(${headers.length}, minmax(150px, 1fr))` }}>
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0 z-10" style={{ display: 'contents' }}>
                                <tr style={{ display: 'contents' }}>
                                    {headers.map((header) => (
                                        <th key={header} className="px-6 py-3 border-b flex items-center bg-slate-50 font-semibold sticky top-0 z-10 border-slate-200">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody style={{ display: 'contents' }}>
                                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                    const row = data[virtualRow.index];
                                    return (
                                        <tr
                                            key={virtualRow.key}
                                            className="bg-white border-b hover:bg-slate-50 transition-colors"
                                            style={{
                                                display: 'contents',
                                                // We don't need absolute positioning if we use display: contents and handle the spacer with padding? 
                                                // No, virtualizer gives us absolute positioning usually.
                                            }}
                                        >
                                            {/* Wait, display: contents removes the element from formatting structure. 
                                Trying to make a virtualized table with sticky headers is tricky.
                                Let's revert to a simpler DIV based approach or just use the absolute positioning provided by virtualizer.
                            */}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* 
                Let's pivot to a pure DIV implementation for reliability with virtualizer. 
             */}

                    </div>
                </div>
            </div>
        </div>
    );
}

// Redoing the component to be a proper virtual list using divs
interface DataTableProps {
    data: any[];
    headers: string[];
    errors?: Record<number, Record<string, string>>;
}

export function DataTableVirtual({ data, headers, errors }: DataTableProps) {
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
                        <div key={i} className="px-4 py-3 w-[150px] shrink-0 truncate border-r border-slate-200 last:border-r-0">
                            {header}
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
                                                "px-4 py-2 w-[150px] shrink-0 truncate border-r border-slate-100 last:border-r-0 flex items-center",
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
