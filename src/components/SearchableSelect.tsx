
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { clsx } from 'clsx';

interface Option {
    label: string;
    value: string;
    subLabel?: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchableSelect({ options, value, onChange, placeholder = "Select...", className }: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter options
    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        (opt.subLabel && opt.subLabel.toLowerCase().includes(search.toLowerCase()))
    );

    const selectedOption = options.find(o => o.value === value);

    return (
        <div className={clsx("relative", className)} ref={wrapperRef}>
            {/* Trigger Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "w-full flex items-center justify-between px-3 py-2 bg-white border rounded-md text-sm cursor-pointer hover:border-slate-400 transition-colors",
                    isOpen ? "border-primary ring-1 ring-primary" : "border-slate-300",
                    !selectedOption && "text-slate-500"
                )}
            >
                <div className="truncate">
                    {selectedOption ? (
                        <span>
                            {selectedOption.label}
                            {selectedOption.subLabel && <span className="text-slate-400 ml-1 text-xs">({selectedOption.subLabel})</span>}
                        </span>
                    ) : (
                        placeholder
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {value && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange("");
                            }}
                            className="p-0.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500"
                        >
                            <X className="w-3 h-3" />
                        </div>
                    )}
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 flex flex-col">
                    {/* Search Input */}
                    <div className="p-2 border-b border-slate-100 flex items-center gap-2 sticky top-0 bg-white z-10">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search..."
                            className="w-full text-sm outline-none placeholder:text-slate-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Options List */}
                    <div className="overflow-y-auto flex-1 p-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(opt => (
                                <div
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                    className={clsx(
                                        "px-3 py-2 text-sm rounded cursor-pointer flex items-center justify-between group",
                                        value === opt.value ? "bg-primary-light text-primary font-medium" : "hover:bg-slate-50 text-slate-700"
                                    )}
                                >
                                    <span>
                                        {opt.label}
                                        {opt.subLabel && <span className="text-slate-400 ml-1 text-xs">({opt.subLabel})</span>}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-center text-xs text-slate-400">
                                No matches found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
