'use client';

import React, { useState } from 'react';
import { X, Search, Calculator, BookOpen, Layers } from 'lucide-react';

interface FormulaSheetModalProps {
  onClose: () => void;
}

const FORMULA_SECTIONS = [
  {
    category: 'Kinematics & Dynamics',
    formulas: [
      { name: 'Velocity', eq: 'v = u + at', notes: 'Uniform linear acceleration' },
      { name: 'Displacement', eq: 's = ut + ½at²', notes: 'Kinematic equation' },
      { name: 'Displacement (V)', eq: 'v² = u² + 2as', notes: 'Independent of time' },
      { name: 'Newton 2nd Law', eq: 'F_net = ma = Δp/Δt', notes: 'Net force and momentum rate' },
      { name: 'Centripetal Force', eq: 'F_c = m v² / r = m ω² r', notes: 'Directed toward curvature center' },
    ],
  },
  {
    category: 'Gravitation & Astrophysics',
    formulas: [
      { name: 'Newton’s Gravitation', eq: 'F = G (M m) / r²', notes: 'Universal gravitational constant G' },
      { name: 'Gravitational Field', eq: 'g = G M / r²', notes: 'Radial gravitational strength' },
      { name: 'Orbital Speed', eq: 'v = √(G M / r)', notes: 'Circular orbit equilibrium' },
      { name: 'Escape Velocity', eq: 'v_esc = √(2 G M / r)', notes: 'Zero total mechanical energy' },
    ],
  },
  {
    category: 'Fields & Electricity',
    formulas: [
      { name: 'Coulomb’s Law', eq: 'F = k (q₁ q₂) / r²', notes: 'k = 1 / (4πε₀) ≈ 8.99×10⁹ N·m²/C²' },
      { name: 'Electric Field', eq: 'E = F / q = k Q / r²', notes: 'Force per unit positive test charge' },
      { name: 'Ohm’s Law & Power', eq: 'V = I R | P = V I = I² R', notes: 'Joule dissipation heating' },
      { name: 'Magnetic Force', eq: 'F = q v B sinθ = B I L sinθ', notes: 'Lorentz deflection force' },
      { name: 'Faraday’s Induction', eq: 'ε = -N (ΔΦ / Δt)', notes: 'Lenz opposition negative sign' },
    ],
  },
  {
    category: 'Waves & Oscillations',
    formulas: [
      { name: 'SHM Acceleration', eq: 'a = -ω² x', notes: 'Restoring condition definition' },
      { name: 'Wave Speed', eq: 'v = f λ', notes: 'Fundamental wave relation' },
      { name: 'Snell’s Law', eq: 'n₁ sinθ₁ = n₂ sinθ₂', notes: 'Refraction across optical interfaces' },
      { name: 'Diffraction Limit', eq: 'θ = 1.22 λ / b', notes: 'Rayleigh criterion circular aperture' },
    ],
  },
];

export default function FormulaSheetModal({ onClose }: FormulaSheetModalProps) {
  const [query, setQuery] = useState('');

  const filtered = FORMULA_SECTIONS.map((sec) => ({
    ...sec,
    formulas: sec.formulas.filter(
      (f) =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.eq.toLowerCase().includes(query.toLowerCase()) ||
        f.notes.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((sec) => sec.formulas.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Calculator className="w-4 h-4" />
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Physics Formula Reference Booklet
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Curated quick reference equations formatted for high-school &amp; university curricula.
        </p>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search equations (e.g. F=ma, Snell, Escape, v=u+at)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
          />
        </div>

        {/* Formula Cards */}
        <div className="space-y-6">
          {filtered.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
                {section.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section.formulas.map((item, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="text-xs font-medium text-slate-400 mb-1">{item.name}</div>
                    <div className="font-mono text-cyan-300 font-bold text-base mb-1">{item.eq}</div>
                    <div className="text-[11px] text-slate-500">{item.notes}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
