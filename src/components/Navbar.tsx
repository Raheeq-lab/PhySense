'use client';

import { Atom, BookOpen, Moon, Search, Sun, User } from 'lucide-react';

interface NavbarProps {
  onOpenFormulas?: () => void;
  onToggleTheme?: () => void;
  isDusk?: boolean;
}

export default function Navbar({ onOpenFormulas, onToggleTheme, isDusk = false }: NavbarProps) {
  return (
    <header className="site-header">
      <a className="brand" href="#" aria-label="PhySense home">
        <span className="brand-symbol"><Atom /></span>
        <span><strong>PhySense</strong><small>Physics, made visible</small></span>
      </a>

      <nav className="curriculum-tabs" aria-label="Curriculum">
        <button aria-current="page">IB Physics</button>
        <button>AP Physics C</button>
        <button>A-Level</button>
      </nav>

      <div className="header-actions">
        <button className="header-search" aria-label="Search"><Search /><span>Search topics…</span><kbd>⌘ K</kbd></button>
        <button className="icon-button formula-button" onClick={onOpenFormulas} aria-label="Open formula booklet"><BookOpen /></button>
        <button className="icon-button" onClick={onToggleTheme} aria-label={isDusk ? 'Use day theme' : 'Use dusk theme'}>{isDusk ? <Sun /> : <Moon />}</button>
        <button className="account-button" aria-label="Account"><User /></button>
      </div>
    </header>
  );
}
