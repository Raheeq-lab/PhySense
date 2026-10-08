'use client';

import React, { useState } from 'react';
import { X, Calculator, Search } from 'lucide-react';
import { SYLLABUS_DATA } from '@/data/syllabus';

interface FormulaSheetModalProps {
  onClose: () => void;
}

const FORMULA_SECTIONS = SYLLABUS_DATA[0].subtopics.map((subtopic) => ({
  category: `${subtopic.code} · ${subtopic.title}`,
  formulas: subtopic.formulas.map((equation, index) => ({
    name: index === 0 ? 'Core relation' : `Relation ${index + 1}`,
    eq: equation,
    notes: subtopic.summary,
  })),
}));

export default function FormulaSheetModal({ onClose }: FormulaSheetModalProps) {
  const [query, setQuery] = useState('');

  const filtered = FORMULA_SECTIONS
    .map((sec) => ({
      ...sec,
      formulas: sec.formulas.filter(
        (f) =>
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.eq.toLowerCase().includes(query.toLowerCase()) ||
          f.notes.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((sec) => sec.formulas.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(10px)' }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border p-6 sm:p-8 shadow-2xl"
        style={{
          background: 'var(--panel)',
          borderColor: 'var(--line)',
          color: 'var(--ink)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl border transition-all"
          style={{ background: 'var(--bg)', borderColor: 'var(--line)', color: 'var(--muted)' }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className="p-1.5 rounded-lg border"
            style={{ background: 'var(--sage-tint)', color: 'var(--sage)', borderColor: 'var(--line)' }}
          >
            <Calculator className="w-4 h-4" />
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-newsreader), Georgia, serif',
              fontSize: '26px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
            }}
          >
            Formula Reference Booklet
          </h2>
        </div>
        <p className="text-xs mb-5" style={{ color: 'var(--muted)' }}>
          The essential equations for Block 1, introduced after the physical intuition.
        </p>

        {/* Search */}
        <div
          className="flex items-center gap-2 h-[34px] px-3 rounded-xl border mb-6 transition-all"
          style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            placeholder="Search equations, symbols, topics…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
            style={{ color: 'var(--ink)', fontFamily: 'var(--font-nunito-sans)' }}
          />
        </div>

        {/* Formula Sections */}
        <div className="space-y-6">
          {filtered.map((section, si) => (
            <div key={si}>
              <div
                className="text-[10px] font-bold uppercase tracking-wider pb-1.5 mb-3 border-b"
                style={{ color: 'var(--sage)', borderColor: 'var(--line)', letterSpacing: '0.15em' }}
              >
                {section.category}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {section.formulas.map((item, fi) => (
                  <div
                    key={fi}
                    className="p-3.5 rounded-xl border transition-all hover:border-[var(--sage)]"
                    style={{
                      background: 'var(--bg)',
                      borderColor: 'var(--line)',
                    }}
                  >
                    <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{item.name}</div>
                    <div
                      className="font-mono font-bold text-base mb-1"
                      style={{ color: 'var(--sage)' }}
                    >
                      {item.eq}
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--muted)' }}>{item.notes}</div>
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
