import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  Map,
  Send,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { Page } from '../types';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: Page;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard',   id: 'dashboard' },
  { icon: Upload,          label: 'File Upload',  id: 'upload'    },
  { icon: Map,             label: 'Mapping',      id: 'mapping'   },
  { icon: Send,            label: 'Migration',    id: 'migration' },
  { icon: ShieldCheck,     label: 'Admin',        id: 'admin'     },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ collapsed, onToggle, currentPage, onNavigate }: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      initial={false}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen bg-[#111111] flex flex-col z-40 border-r border-white/[0.07] overflow-hidden"
      aria-label="Main navigation"
      role="navigation"
    >
      {/* ── Logo / Brand Area ── */}
      <div
        className="border-b border-white/[0.07] shrink-0 overflow-hidden"
        style={{ height: '76px' }}
      >
        {collapsed ? (
          /* Collapsed: only the gear-icon (leftmost ~32 px of the wordmark) */
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 overflow-hidden flex items-center">
              <img
                src="/outamation-logo.png"
                alt="Outamation"
                className="h-7 w-auto max-w-none select-none"
                draggable={false}
              />
            </div>
          </div>
        ) : (
          /* Expanded: full wordmark + product name stacked */
          <div className="flex flex-col justify-center h-full px-5">
            <img
              src="/outamation-logo.png"
              alt="Outamation"
              className="h-7 w-auto select-none"
              style={{ maxWidth: '100%' }}
              draggable={false}
            />
            <div className="text-white font-black text-xs tracking-tight leading-none mt-2">
              DataProcessor
            </div>
          </div>
        )}
      </div>

      {/* ── Main Navigation ── */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden" aria-label="Main">
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="nav-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="px-4 mb-2"
            >
              <span className="text-[9px] font-bold tracking-[0.20em] text-white/20 uppercase select-none">
                Navigation
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-0.5 px-2">
          {navItems.map(item => (
            <NavButton
              key={item.id}
              item={item}
              collapsed={collapsed}
              active={currentPage === item.id}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      {/* ── Collapse Toggle ── */}
      <div className="pb-4 pt-2 border-t border-white/[0.07] px-2">
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                     text-white/25 hover:text-white/60 hover:bg-white/[0.06]
                     transition-all duration-150"
        >
          {collapsed ? (
            <Menu className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
          ) : (
            <>
              <X className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
              <span className="text-xs font-semibold whitespace-nowrap select-none">
                Collapse
              </span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}

/* ─────────────────────────────────────────
   NavButton
───────────────────────────────────────── */
function NavButton({
  item,
  collapsed,
  active,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  onNavigate: (page: Page) => void;
}) {
  const Icon = item.icon;

  return (
    <div className="relative group">
      <button
        onClick={() => onNavigate(item.id)}
        aria-label={item.label}
        aria-current={active ? 'page' : undefined}
        className={[
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left',
          active
            ? 'bg-[#E52D1D] text-white shadow-lg shadow-[#E52D1D]/20'
            : 'text-white/50 hover:text-white hover:bg-white/[0.08]',
        ].join(' ')}
      >
        <Icon className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />

        {!collapsed && (
          <span className="text-sm font-semibold whitespace-nowrap overflow-hidden flex-1 select-none">
            {item.label}
          </span>
        )}
      </button>

      {/* Tooltip in collapsed mode */}
      {collapsed && (
        <div
          role="tooltip"
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3
                     px-3 py-2 bg-[#1C1C1C] border border-white/[0.10]
                     text-white text-xs font-semibold rounded-lg whitespace-nowrap
                     opacity-0 group-hover:opacity-100 pointer-events-none
                     transition-opacity duration-150 shadow-2xl z-50
                     flex items-center gap-2"
        >
          {/* Arrow */}
          <div
            className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-[#1C1C1C]"
            aria-hidden="true"
          />
          {item.label}
        </div>
      )}
    </div>
  );
}
