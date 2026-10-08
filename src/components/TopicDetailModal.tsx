'use client';

import React from 'react';
import { SubTopic, Topic } from '@/data/syllabus';
import { X, BookOpen, CheckCircle, Lightbulb, AlertTriangle, Calculator, Sparkles, ExternalLink } from 'lucide-react';

interface TopicDetailModalProps {
  topic: Topic | null;
  subtopic: SubTopic | null;
  onClose: () => void;
}

export default function TopicDetailModal({ topic, subtopic, onClose }: TopicDetailModalProps) {
  if (!topic || !subtopic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/80">
            {subtopic.code}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Topic {topic.number} • {topic.title}
          </span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white mb-3">
          {subtopic.title}
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed mb-6 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
          {subtopic.summary}
        </p>

        {/* Key Formulas Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
            <Calculator className="w-4 h-4" /> High-Yield Formula Book
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {subtopic.formulas.map((formula, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-cyan-900/40 font-mono text-cyan-200 text-sm shadow-inner"
              >
                <span>{formula}</span>
                <span className="text-[10px] text-slate-500 font-sans">IB Data Booklet</span>
              </div>
            ))}
          </div>
        </div>

        {/* Core Concepts */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
            <CheckCircle className="w-4 h-4" /> Essential Examiner Criteria
          </div>
          <div className="space-y-2">
            {subtopic.keyConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{concept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BioNinja Exam Tip callout */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-orange-950/20 border border-amber-800/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">PhySense Exam Pitfall</h4>
            <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
              Always state coordinate conventions explicitly (e.g., choosing upwards as positive will require acceleration due to gravity to be substituted as -9.81 m/s²). Vector quantities must be reported with both magnitude and appropriate direction in Paper 2 responses.
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
}
