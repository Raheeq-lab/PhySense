'use client';

import React from 'react';
import { Atom, Database, Sparkles, BookMarked, Search, Sliders, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onOpenFormulas?: () => void;
  supabaseConnected?: boolean;
}

export default function Navbar({ onOpenFormulas, supabaseConnected = true }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 shadow-lg shadow-cyan-500/20 text-white font-black text-xl">
            <Atom className="w-6 h-6 animate-spin [animation-duration:12s]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white">
                Phy<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Sense</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Structured Interactive Physics Syllabus &amp; Visual Laboratory
            </p>
          </div>
        </div>

        {/* Center Syllabus selector */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs">
          <button className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm">
            IB Physics 2025/2026
          </button>
          <button className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
            AP Physics C
          </button>
          <button className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
            Cambridge A-Level
          </button>
        </div>

        {/* Right side status & action buttons */}
        <div className="flex items-center gap-3">
          {/* Supabase connection indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-slate-300 text-[11px]">
              Supabase <span className="text-emerald-400">Connected</span>
            </span>
          </div>

          {/* Formula Sheet Trigger */}
          {onOpenFormulas && (
            <button
              onClick={onOpenFormulas}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
            >
              <BookMarked className="w-3.5 h-3.5 text-cyan-400" />
              <span>Data Booklet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
