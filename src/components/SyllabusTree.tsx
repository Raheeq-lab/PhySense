'use client';

import React, { useState } from 'react';
import { SYLLABUS_DATA, Topic, SubTopic } from '@/data/syllabus';
import {
  Sparkles,
  ChevronDown, ChevronRight, BookOpen, Layers,
  Calculator, ArrowRight, Search,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
};

interface SyllabusTreeProps {
  onSelectSubTopic?: (subtopic: SubTopic, topic: Topic) => void;
  selectedSubTopicId?: string;
}

export default function SyllabusTree({ onSelectSubTopic, selectedSubTopicId }: SyllabusTreeProps) {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    'block-1-intuition-calculus-spark': true,
  });
  const [filterMode, setFilterMode] = useState<'all' | 'foundation' | 'advanced'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTopic = (id: string) =>
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));

  const filteredTopics = SYLLABUS_DATA
    .map((topic) => ({
      ...topic,
      subtopics: topic.subtopics.filter((sub) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          sub.title.toLowerCase().includes(q) ||
          sub.summary.toLowerCase().includes(q) ||
          sub.code.toLowerCase().includes(q);
        if (!matchesSearch) return false;
        if (filterMode === 'foundation') return sub.difficulty === 'Foundation';
        if (filterMode === 'advanced') return sub.difficulty === 'Advanced';
        return true;
      }),
    }))
    .filter((t) => t.subtopics.length > 0 || !searchQuery);

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: 'var(--panel)', borderColor: 'var(--line)' }}
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b"
        style={{ borderColor: 'var(--line)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-lg"
              style={{ background: 'var(--sage-tint)', color: 'var(--sage)' }}
            >
              <Layers className="w-4 h-4" />
            </div>
            <h2
              className="text-xl font-semibold tracking-tight"
              style={{
                fontFamily: 'var(--font-newsreader), Georgia, serif',
                color: 'var(--ink)',
                letterSpacing: '-0.015em',
              }}
            >
              Block 1
            </h2>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Intuition first · Calculus unlocked
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          {(['all', 'foundation', 'advanced'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
              style={
                filterMode === mode
                  ? { background: 'var(--sage-tint)', color: 'var(--sage)', borderColor: 'var(--sage)' }
                  : { background: 'var(--bg)', color: 'var(--muted)', borderColor: 'var(--line)' }
              }
            >
              {mode === 'all' ? 'All' : mode === 'foundation' ? 'Start Here' : 'Math Spark'}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-5 pt-4 pb-3">
        <div
          className="flex items-center gap-2 h-[34px] px-3 rounded-xl border text-xs transition-all"
          style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            placeholder="Search topics, formulas, concepts…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none"
            style={{
              color: 'var(--ink)',
              fontFamily: 'var(--font-nunito-sans)',
            }}
          />
        </div>
      </div>

      {/* Topic List */}
      <div className="px-3 pb-4 space-y-2">
        {filteredTopics.map((topic) => {
          const isExpanded = !!expandedTopics[topic.id];
          const IconComponent = ICON_MAP[topic.icon] || BookOpen;

          return (
            <div
              key={topic.id}
              className="rounded-xl border overflow-hidden transition-all"
              style={{
                background: 'var(--bg)',
                borderColor: 'var(--line)',
              }}
            >
              {/* Topic Header */}
              <button
                onClick={() => toggleTopic(topic.id)}
                className="w-full flex items-center justify-between p-3.5 text-left group hover:bg-[var(--chip)] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl border"
                    style={{
                      background: 'var(--sage-tint)',
                      color: 'var(--sage)',
                      borderColor: 'var(--line)',
                    }}
                  >
                    <IconComponent className="w-4.5 h-4.5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-mono font-semibold uppercase tracking-widest"
                        style={{ color: 'var(--muted)' }}
                      >
                        Learning Block {topic.number}
                      </span>
                    </div>
                    <h3
                      className="text-sm font-semibold group-hover:text-[var(--sage)] transition-colors"
                      style={{
                        fontFamily: 'var(--font-newsreader), serif',
                        color: 'var(--ink)',
                        fontSize: '15px',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {topic.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] hidden sm:inline" style={{ color: 'var(--muted)' }}>
                    {topic.subtopics.length} modules
                  </span>
                  <span style={{ color: 'var(--muted)' }}>
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </span>
                </div>
              </button>

              {/* Subtopics */}
              {isExpanded && (
                <div className="p-2 pt-0 space-y-1.5 border-t" style={{ borderColor: 'var(--line)' }}>
                  {topic.subtopics.map((sub) => {
                    const isSelected = selectedSubTopicId === sub.id;
                    return (
                      <div
                        key={sub.id}
                        onClick={() => onSelectSubTopic && onSelectSubTopic(sub, topic)}
                        className="p-3 rounded-lg border cursor-pointer transition-all group/sub"
                        style={
                          isSelected
                            ? {
                                background: 'var(--sage-tint)',
                                borderColor: 'var(--sage)',
                              }
                            : {
                                background: 'var(--panel)',
                                borderColor: 'var(--line)',
                              }
                        }
                      >
                        {/* Sub header row */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold border"
                              style={{
                                background: 'var(--chip)',
                                color: 'var(--sage)',
                                borderColor: 'var(--line)',
                              }}
                            >
                              {sub.code}
                            </span>
                            <span
                              className="text-sm font-semibold"
                              style={{
                                fontFamily: 'var(--font-newsreader), serif',
                                color: 'var(--ink)',
                                letterSpacing: '-0.01em',
                              }}
                            >
                              {sub.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {sub.hlOnly && (
                              <span
                                className="px-1.5 py-0.5 rounded text-[10px] font-semibold border"
                                style={{
                                  background: 'var(--chip)',
                                  color: 'var(--muted)',
                                  borderColor: 'var(--line)',
                                }}
                              >
                                HL
                              </span>
                            )}
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold border"
                              style={{
                                background:
                                  sub.difficulty === 'Foundation'
                                    ? 'var(--sage-tint)'
                                    : 'var(--chip)',
                                color:
                                  sub.difficulty === 'Foundation'
                                    ? 'var(--sage)'
                                    : 'var(--muted)',
                                borderColor: 'var(--line)',
                              }}
                            >
                              {sub.difficulty}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--muted)' }}>
                          {sub.summary}
                        </p>

                        {/* Formulas + Open link */}
                        <div
                          className="flex items-center justify-between pt-2 border-t"
                          style={{ borderColor: 'var(--line)' }}
                        >
                          <span className="flex items-center gap-1 text-[11px] font-mono" style={{ color: 'var(--sage)' }}>
                            <Calculator className="w-3 h-3" />
                            {sub.formulas.slice(0, 2).join(' · ')}
                            {sub.formulas.length > 2 && (
                              <span style={{ color: 'var(--muted)' }}>+{sub.formulas.length - 2}</span>
                            )}
                          </span>
                          <span
                            className="flex items-center gap-1 text-[11px] font-semibold transition-colors group-hover/sub:text-[var(--sage)]"
                            style={{ color: 'var(--muted)' }}
                          >
                            Open Notes
                            <ArrowRight className="w-3 h-3 transition-transform group-hover/sub:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
