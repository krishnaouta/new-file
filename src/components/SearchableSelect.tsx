import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X, Plus, Check } from 'lucide-react';
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
    allowCreate?: boolean;
}

export function SearchableSelect({ options, value, onChange, placeholder = "Select...", className, allowCreate = false }: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useLayoutEffect(() => {
        if (isOpen && wrapperRef.current && menuRef.current) {
            const updatePosition = () => {
                if (!wrapperRef.current || !menuRef.current) return;
                const rect = wrapperRef.current.getBoundingClientRect();

                const spaceBelow = window.innerHeight - rect.bottom;
                const spaceAbove = rect.top;
                const menuHeight = 260;

                const showAbove = spaceBelow < menuHeight && spaceAbove > spaceBelow;

                menuRef.current.style.position = 'fixed';
                menuRef.current.style.top = showAbove ? 'auto' : `${rect.bottom + 4}px`;
                menuRef.current.style.bottom = showAbove ? `${window.innerHeight - rect.top + 4}px` : 'auto';
                menuRef.current.style.left = `${rect.left}px`;
                menuRef.current.style.width = `${rect.width}px`;
                menuRef.current.style.zIndex = '99999';
            };

            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);

            if (inputRef.current) {
                inputRef.current.focus({ preventScroll: true });
            }

            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            const clickedInsideWrapper = wrapperRef.current?.contains(target);
            const clickedInsideMenu = menuRef.current?.contains(target);

            if (!clickedInsideWrapper && !clickedInsideMenu) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside, true);
        return () => document.removeEventListener("mousedown", handleClickOutside, true);
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        (opt.subLabel && opt.subLabel.toLowerCase().includes(search.toLowerCase()))
    );

    const selectedOption = options.find(o => o.value === value) || (allowCreate && value ? { label: value, value: value } : undefined);

    const exactMatch = options.some(opt => opt.label.toLowerCase() === search.toLowerCase());
    const showCreateOption = allowCreate && search.trim() !== "" && !exactMatch;

    return (
        <div className={clsx("relative", className)} ref={wrapperRef}>
            {/* Trigger Button */}
            <div
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setSearch("");
                }}
                className={clsx(
                    "w-full flex items-center justify-between px-3 py-2 bg-white border rounded-lg text-sm cursor-pointer transition-all duration-150 select-none",
                    isOpen
                        ? "border-[#E52D1D] ring-2 ring-[#E52D1D]/15 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-sm",
                    !selectedOption && "text-slate-400"
                )}
            >
                <div className="truncate font-medium">
                    {selectedOption ? (
                        <span className="text-slate-800">
                            {selectedOption.label}
                            {selectedOption.subLabel && (
                                <span className="text-slate-400 ml-1.5 text-xs font-normal">· {selectedOption.subLabel}</span>
                            )}
                        </span>
                    ) : (
                        <span className="text-slate-400 font-normal">{placeholder}</span>
                    )}
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                    {value && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange("");
                            }}
                            className="p-0.5 hover:bg-slate-100 rounded-full text-slate-300 hover:text-[#B4142D] transition-colors"
                            title="Clear selection"
                        >
                            <X className="w-3 h-3" />
                        </div>
                    )}
                    <ChevronDown
                        className={clsx(
                            "w-4 h-4 text-slate-400 transition-transform duration-200",
                            isOpen && "rotate-180 text-[#E52D1D]"
                        )}
                    />
                </div>
            </div>

            {/* Dropdown Menu — Portalled */}
            {isOpen && createPortal(
                <div
                    ref={menuRef}
                    style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}
                    className="bg-white border border-slate-200 rounded-xl shadow-2xl shadow-black/10 max-h-64 flex flex-col overflow-hidden"
                >
                    {/* Search Input */}
                    <div className="px-3 py-2.5 border-b border-slate-100 flex items-center gap-2 sticky top-0 bg-white z-10 shrink-0">
                        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={allowCreate ? "Search or create..." : "Search..."}
                            className="w-full text-sm outline-none placeholder:text-slate-400 bg-transparent text-slate-700"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="shrink-0">
                                <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                            </button>
                        )}
                    </div>

                    {/* Options List */}
                    <div className="overflow-y-auto flex-1 p-1.5">
                        {showCreateOption && (
                            <div
                                onClick={() => {
                                    onChange(search);
                                    setIsOpen(false);
                                    setSearch("");
                                }}
                                className="px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center gap-2 text-[#E52D1D] hover:bg-[#FDECEA] border-b border-slate-50 mb-1 font-medium transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5 shrink-0" />
                                <span>Create &ldquo;{search}&rdquo;</span>
                            </div>
                        )}

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
                                        "px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between gap-2 transition-colors",
                                        value === opt.value
                                            ? "bg-[#E52D1D] text-white font-medium"
                                            : "hover:bg-slate-50 text-slate-700"
                                    )}
                                >
                                    <span className="truncate">
                                        {opt.label}
                                        {opt.subLabel && (
                                            <span className={clsx("ml-1.5 text-xs", value === opt.value ? "text-white/60" : "text-slate-400")}>
                                                · {opt.subLabel}
                                            </span>
                                        )}
                                    </span>
                                    {value === opt.value && (
                                        <Check className="w-3.5 h-3.5 shrink-0 text-white" />
                                    )}
                                </div>
                            ))
                        ) : !showCreateOption && (
                            <div className="px-3 py-5 text-center text-xs text-slate-400 font-medium">
                                No matches found
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
