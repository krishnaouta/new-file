import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X, Plus } from 'lucide-react';
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

                // Calculate space above and below
                const spaceBelow = window.innerHeight - rect.bottom;
                const spaceAbove = rect.top;
                const menuHeight = 250; // Max height approximately

                // Decide whether to show above or below
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

            // Focus input safely without snapping the page
            if (inputRef.current) {
                inputRef.current.focus({ preventScroll: true });
            }

            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [isOpen]);

    // Close when clicking outside
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

    // Filter options
    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        (opt.subLabel && opt.subLabel.toLowerCase().includes(search.toLowerCase()))
    );

    const selectedOption = options.find(o => o.value === value) || (allowCreate && value ? { label: value, value: value } : undefined);

    // Check if exactly matching option exists
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

            {/* Dropdown Menu Portalled */}
            {isOpen && createPortal(
                <div
                    ref={menuRef}
                    style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}
                    className="bg-white border border-slate-200 rounded-md shadow-lg max-h-60 flex flex-col overflow-hidden"
                >
                    {/* Search Input */}
                    <div className="p-2 border-b border-slate-100 flex items-center gap-2 sticky top-0 bg-white z-10 shrink-0">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={allowCreate ? "Search or create..." : "Search..."}
                            className="w-full text-sm outline-none placeholder:text-slate-400 bg-transparent"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Options List */}
                    <div className="overflow-y-auto flex-1 p-1">
                        {showCreateOption && (
                            <div
                                onClick={() => {
                                    onChange(search);
                                    setIsOpen(false);
                                    setSearch("");
                                }}
                                className="px-3 py-2 text-sm rounded cursor-pointer flex items-center gap-2 text-primary hover:bg-slate-50 border-b border-slate-100 mb-1"
                            >
                                <Plus className="w-3 h-3" />
                                <span>Create "{search}"</span>
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
                        ) : !showCreateOption && (
                            <div className="px-3 py-4 text-center text-xs text-slate-400">
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
