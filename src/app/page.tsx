'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProjectileSimulator from '@/components/ProjectileSimulator';
import SyllabusTree from '@/components/SyllabusTree';
import TopicDetailModal from '@/components/TopicDetailModal';
import FormulaSheetModal from '@/components/FormulaSheetModal';
import { Topic, SubTopic, SYLLABUS_DATA } from '@/data/syllabus';
import {
  Sparkles,
  Zap,
  Atom,
  BookOpen,
  CheckCircle2,
  Compass,
  ArrowRight,
  GraduationCap,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState<SubTopic | null>(null);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState<boolean>(false);

  const handleSelectSubTopic = (sub: SubTopic, topic: Topic) => {
    setSelectedTopic(topic);
    setSelectedSubTopic(sub);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar onOpenFormulas={() => setIsFormulaModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-slate-800 bg-gradient-to-br from-slate-900/90 via-[#0a1122] to-[#060a14] shadow-2xl">
          {/* Subtle Ambient Lighting */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-800/80 text-cyan-300 text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BioNinja Physics • Interactive Learning Environment</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-5">
              Master Physics through{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                Visual Intuition
              </span>{' '}
              &amp; Structured Logic.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              A high-yield, syllabus-aligned reference inspired by the clarity of BioNinja.
              Navigate complete curriculum trees, inspect high-impact formulas, and experiment directly with real-time dynamic simulation laboratories.
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px]">
                  5
                </span>
                <span>Core Domains</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">
                  16
                </span>
                <span>Structured Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold text-[10px]">
                  ✓
                </span>
                <span>IB / AP / A-Level Aligned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Live Interactive Simulation Playground */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-1 bg-cyan-400 rounded-full" />
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Interactive Visual Laboratory
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Kinematics • Topic 1.1
            </span>
          </div>

          <ProjectileSimulator />
        </section>

        {/* Section 2: BioNinja Structured Syllabus Tree */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-1 bg-emerald-400 rounded-full" />
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Syllabus Architecture &amp; Topic Modules
              </h2>
            </div>
            <button
              onClick={() => setIsFormulaModalOpen(true)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>Browse full formula booklet</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <SyllabusTree
            onSelectSubTopic={handleSelectSubTopic}
            selectedSubTopicId={selectedSubTopic?.id}
          />
        </section>

        {/* High-yield BioNinja Study Methodology Banner */}
        <section className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0c1426] border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <Layers className="w-4 h-4" />
              <span>Hierarchical Breakdown</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every topic is indexed cleanly with syllabus reference numbers, isolating core principles from advanced Higher Level extensions.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Activity className="w-4 h-4" />
              <span>Interactive Experiments</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manipulate variables like gravitational acceleration and launch angle to witness mathematical formulas translate into real physical dynamics.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>Exam-Targeted Content</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Summaries focus on high-yield examiner criteria, formula booklet navigation, and common pitfalls identified in past exam papers.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">bioninja-physics</span>
            <span>• Inspired by the BioNinja learning philosophy</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Powered by Next.js &amp; Tailwind CSS</span>
            <span>Database: Supabase</span>
          </div>
        </div>
      </footer>

      {/* Topic Detail Modal */}
      <TopicDetailModal
        topic={selectedTopic}
        subtopic={selectedSubTopic}
        onClose={() => {
          setSelectedTopic(null);
          setSelectedSubTopic(null);
        }}
      />

      {/* Formula Sheet Reference Modal */}
      {isFormulaModalOpen && (
        <FormulaSheetModal onClose={() => setIsFormulaModalOpen(false)} />
      )}
    </div>
  );
}
