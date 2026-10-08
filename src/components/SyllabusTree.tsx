'use client';

import React, { useState } from 'react';
import { SYLLABUS_DATA, Topic, SubTopic } from '@/data/syllabus';
import {
  Rocket,
  Zap,
  Radio,
  Flame,
  Atom,
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Layers,
  Sparkles,
  ArrowRight,
  Calculator,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Rocket,
  Zap,
  Radio,
  Flame,
  Atom,
};

interface SyllabusTreeProps {
  onSelectSubTopic?: (subtopic: SubTopic, topic: Topic) => void;
  selectedSubTopicId?: string;
}

export default function SyllabusTree({ onSelectSubTopic, selectedSubTopicId }: SyllabusTreeProps) {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    'space-time-motion': true,
    'fields-electromagnetism': true,
  });
  const [filterMode, setFilterMode] = useState<'all' | 'hl' | 'foundation'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleTopic = (id: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredTopics = SYLLABUS_DATA.map((topic) => {
    const matchingSubtopics = topic.subtopics.filter((sub) => {
      const matchesSearch =
        sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.code.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (filterMode === 'hl') return sub.hlOnly;
      if (filterMode === 'foundation') return sub.difficulty === 'Foundation';
      return true;
    });

    return {
      ...topic,
      subtopics: matchingSubtopics,
    };
  }).filter((topic) => topic.subtopics.length > 0 || searchQuery === '');

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/70 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Structured Physics Syllabus</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            BioNinja-style hierarchical taxonomy • Standard &amp; Higher Level curriculum
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white bg-slate-800/40 border border-slate-800'
            }`}
          >
            All Topics
          </button>
          <button
            onClick={() => setFilterMode('hl')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === 'hl'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white bg-slate-800/40 border border-slate-800'
            }`}
          >
            HL Only (Higher Level)
          </button>
          <button
            onClick={() => setFilterMode('foundation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === 'foundation'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white bg-slate-800/40 border border-slate-800'
            }`}
          >
            Core Foundations
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter by concept, equation, or keyword (e.g. projectile, Doppler, flux, Kepler)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/50 transition-all font-sans"
        />
      </div>

      {/* Topics Tree List */}
      <div className="space-y-4">
        {filteredTopics.map((topic) => {
          const isExpanded = !!expandedTopics[topic.id];
          const IconComponent = ICON_MAP[topic.icon] || BookOpen;

          return (
            <div
              key={topic.id}
              className="rounded-xl border border-slate-800/80 bg-slate-950/50 overflow-hidden transition-all duration-200 hover:border-slate-700/80"
            >
              {/* Topic header banner */}
              <button
                onClick={() => toggleTopic(topic.id)}
                className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-slate-800/30 group"
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl font-bold shadow-md ring-1 ring-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${topic.accentHex}25, ${topic.accentHex}05)`,
                      color: topic.accentHex,
                    }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Topic {topic.number}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {topic.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{topic.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-medium text-slate-500 hidden sm:inline-block">
                    {topic.subtopics.length} modules
                  </span>
                  <span className="text-slate-400 group-hover:text-white transition-colors">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </span>
                </div>
              </button>

              {/* Subtopics accordion container */}
              {isExpanded && (
                <div className="p-3 pt-0 border-t border-slate-800/50 space-y-2 bg-slate-900/30">
                  {topic.subtopics.map((sub) => {
                    const isSelected = selectedSubTopicId === sub.id;

                    return (
                      <div
                        key={sub.id}
                        onClick={() => onSelectSubTopic && onSelectSubTopic(sub, topic)}
                        className={`p-3.5 rounded-lg border transition-all cursor-pointer group/sub ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                            : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700 hover:bg-slate-800/20'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                              {sub.code}
                            </span>
                            <span className="text-sm font-semibold text-slate-200 group-hover/sub:text-white transition-colors">
                              {sub.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {sub.hlOnly && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-950/70 text-purple-300 border border-purple-800/60">
                                Higher Level (HL)
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                sub.difficulty === 'Foundation'
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                                  : sub.difficulty === 'Intermediate'
                                  ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                                  : 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                              }`}
                            >
                              {sub.difficulty}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 mb-2.5 leading-relaxed">{sub.summary}</p>

                        {/* Formulas & Concept tags */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/50">
                          <span className="flex items-center gap-1 text-[11px] text-cyan-400/80 font-mono">
                            <Calculator className="w-3 h-3" />
                            {sub.formulas.slice(0, 2).join(' • ')}
                            {sub.formulas.length > 2 && (
                              <span className="text-slate-500 font-sans text-[10px]">
                                +{sub.formulas.length - 2} more
                              </span>
                            )}
                          </span>

                          <div className="ml-auto flex items-center gap-1 text-[11px] text-slate-400 group-hover/sub:text-cyan-300 transition-colors">
                            <span>Open Notes</span>
                            <ArrowRight className="w-3 h-3 transition-transform group-hover/sub:translate-x-0.5" />
                          </div>
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
