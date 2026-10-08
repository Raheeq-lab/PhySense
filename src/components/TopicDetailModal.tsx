'use client';

import { AlertTriangle, Calculator, CheckCircle, FlaskConical, Lightbulb, Map, SlidersHorizontal, X } from 'lucide-react';
import { SubTopic, Topic } from '@/data/syllabus';

interface TopicDetailModalProps { topic: Topic | null; subtopic: SubTopic | null; onClose: () => void; }

export default function TopicDetailModal({ topic, subtopic, onClose }: TopicDetailModalProps) {
  if (!topic || !subtopic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5" style={{ background: 'rgba(16,18,12,.66)', backdropFilter: 'blur(10px)' }} role="dialog" aria-modal="true" aria-labelledby="lesson-title">
      <article className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border p-5 sm:p-8 shadow-2xl" style={{ background: 'var(--panel)', borderColor: 'var(--line)', color: 'var(--ink)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full border" style={{ background: 'var(--bg)', borderColor: 'var(--line)' }} aria-label="Close lesson"><X className="w-4 h-4" /></button>

        <div className="pr-12">
          <span className="eyebrow">Block 1 · Lesson {subtopic.code}</span>
          <h2 id="lesson-title" className="mt-2 mb-3" style={{ fontFamily: 'var(--font-newsreader), Georgia, serif', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 500, letterSpacing: '-.035em', lineHeight: .98 }}>{subtopic.title}</h2>
          <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--muted)' }}>{subtopic.summary}</p>
        </div>

        <section className="mt-7 p-5 rounded-xl border" style={{ background: 'var(--sage-tint)', borderColor: 'var(--line)' }}>
          <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-[.16em]" style={{ color: 'var(--sage)' }}><Map className="w-4 h-4" /> Start in the real world</div>
          <p className="text-sm leading-relaxed">{subtopic.realLifeAnchor}</p>
          <p className="mt-3 text-lg italic" style={{ fontFamily: 'var(--font-newsreader), Georgia, serif', color: 'var(--sage)' }}>{subtopic.anchorQuestion}</p>
        </section>

        <div className="grid md:grid-cols-2 gap-5 mt-5">
          <section className="p-5 rounded-xl border" style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}>
            <div className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-[.16em]" style={{ color: 'var(--sage)' }}><CheckCircle className="w-4 h-4" /> Build it step by step</div>
            <ol className="space-y-3">
              {subtopic.learningPath.map((step, index) => <li key={step} className="flex gap-3 text-xs leading-relaxed"><span className="grid place-items-center w-6 h-6 shrink-0 rounded-full text-[10px] font-bold" style={{ background: 'var(--sage-tint)', color: 'var(--sage)' }}>{index + 1}</span><span>{step}</span></li>)}
            </ol>
          </section>

          <section className="p-5 rounded-xl border" style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}>
            <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-[.16em]" style={{ color: 'var(--sage)' }}><FlaskConical className="w-4 h-4" /> Interactive visual</div>
            <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-newsreader), Georgia, serif' }}>{subtopic.interactive.title}</h3>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--muted)' }}>{subtopic.interactive.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">{subtopic.interactive.controls.map((control) => <span key={control} className="px-2 py-1 rounded-full text-[10px]" style={{ background: 'var(--chip)' }}>{control}</span>)}</div>
            <p className="text-xs leading-relaxed flex gap-2"><SlidersHorizontal className="w-4 h-4 shrink-0" style={{ color: 'var(--sage)' }} /><span><strong>Try this:</strong> {subtopic.interactive.observation}</span></p>
          </section>
        </div>

        <section className="mt-5">
          <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-[.16em]" style={{ color: 'var(--sage)' }}><Calculator className="w-4 h-4" /> Equations, after the intuition</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">{subtopic.formulas.map((formula) => <code key={formula} className="p-3 rounded-lg border text-sm" style={{ background: 'var(--bg)', borderColor: 'var(--line)', color: 'var(--sage)' }}>{formula}</code>)}</div>
        </section>

        {subtopic.mathSpark && <section className="mt-5 p-5 rounded-xl border" style={{ background: 'var(--chip)', borderColor: 'var(--line)' }}><div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-[.16em]" style={{ color: 'var(--sage)' }}><Lightbulb className="w-4 h-4" /> Math Spark</div><p className="text-sm leading-relaxed">{subtopic.mathSpark}</p></section>}

        <section className="mt-5 p-5 rounded-xl border" style={{ borderColor: 'var(--sage)', background: 'var(--panel)' }}>
          <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-[.16em]" style={{ color: 'var(--sage)' }}><AlertTriangle className="w-4 h-4" /> Real-world challenge</div>
          <h3 className="text-xl mb-1" style={{ fontFamily: 'var(--font-newsreader), Georgia, serif' }}>{subtopic.challenge.title}</h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{subtopic.challenge.scenario}</p>
          <p className="text-sm leading-relaxed mt-3"><strong>Your mission:</strong> {subtopic.challenge.prompt}</p>
          <details className="mt-3 text-xs"><summary className="cursor-pointer font-bold" style={{ color: 'var(--sage)' }}>Need a hint?</summary><p className="mt-2 pl-3 border-l" style={{ borderColor: 'var(--sage)', color: 'var(--muted)' }}>{subtopic.challenge.hint}</p></details>
        </section>

        <button onClick={onClose} className="mt-6 px-5 py-2.5 rounded-full text-sm font-bold" style={{ background: 'var(--sage)', color: 'var(--sage-ink)' }}>Back to Block 1</button>
      </article>
    </div>
  );
}
