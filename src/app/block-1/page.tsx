'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

const lessons = [
  { number: '1.1', slug: '1-1', title: 'Kinematics', description: 'How position, velocity, and acceleration relate.', icon: 'motion' },
  { number: '1.2', slug: '1-2', title: 'Forces', description: 'Why motion changes — and how to predict it.', icon: 'force' },
  { number: '1.3', slug: '1-3', title: 'Circular Motion', description: 'Turning without slowing down.', icon: 'circle' },
  { number: '1.4', slug: '1-4', title: 'Energy', description: 'The currency of the universe.', icon: 'energy' },
  { number: '1.5', slug: '1-5', title: 'Momentum', description: 'Collisions, recoil, and score-keeping.', icon: 'momentum' },
  { number: '1.6', slug: '1-6', title: 'Math Spark', description: 'The calculus hiding under every formula.', icon: 'calculus' },
] as const;

function LessonIcon({ type }: { type: (typeof lessons)[number]['icon'] }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...common}>
      {type === 'motion' && <><path d="M7 32h34"/><circle cx="15" cy="27" r="5"/><path d="M12 17c8-8 17-8 25 0M31 13l6 4-5 5"/></>}
      {type === 'force' && <><rect x="16" y="17" width="16" height="16" rx="2"/><path d="M5 25h11M10 20l-5 5 5 5M32 25h11M38 20l5 5-5 5"/></>}
      {type === 'circle' && <><circle cx="24" cy="24" r="15"/><circle cx="24" cy="9" r="3"/><path d="M24 12v12M24 24l8-5"/></>}
      {type === 'energy' && <><path d="M27 5 13 27h10l-2 16 14-23H25z"/></>}
      {type === 'momentum' && <><circle cx="13" cy="24" r="6"/><circle cx="35" cy="24" r="6"/><path d="M19 24h10M25 20l4 4-4 4"/></>}
      {type === 'calculus' && <><path d="M8 34c7 0 7-20 14-20s7 20 18 20"/><path d="M8 39h32M13 8v31"/><circle cx="29" cy="25" r="2.5"/></>}
    </svg>
  );
}

function readCompletedCount() {
  try {
    const raw = window.localStorage.getItem('physense.block1');
    if (!raw) return 0;
    const value: unknown = JSON.parse(raw);
    if (Array.isArray(value)) return Math.min(6, new Set(value).size);
    if (typeof value === 'number') return Math.min(6, Math.max(0, value));
    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      if (Array.isArray(record.completed)) return Math.min(6, new Set(record.completed).size);
      return Math.min(6, lessons.filter(({ number, slug }) => record[number] === true || record[slug] === true).length);
    }
  } catch {
    return 0;
  }
  return 0;
}

export default function BlockOneHub() {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    setCompleted(readCompletedCount());
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Block 1</p>
          <h1>The Intuition &amp; Calculus Spark</h1>
          <p className={styles.subtitle}>Build physical reality with your hands — then learn the math that describes it.</p>
          <p className={styles.why}>Why this matters: intuition gives every equation something real to describe.</p>
        </header>

        <section className={styles.intro} aria-label="About this block">
          <p>Physics starts with your eyes and hands, not with formulas. In this block you&apos;ll watch things move, push things, spin things, drop things, and crash things.</p>
          <p>Then — only then — you&apos;ll learn the math that makes sense of all of it.</p>
          <p>By the end of this block you&apos;ll solve real motion problems with <strong>calculus</strong> (math for describing change) instead of memorised algebra.</p>
          <p className={styles.note}>New to physics? Start at 1.1 and go in order. Lesson 1.6 (Math Spark) will feel easier after you&apos;ve seen the physics first.</p>
          <p className={styles.why}>Why this matters: understanding grows faster when experience comes before symbols.</p>
        </section>

        <section className={styles.progressSection} aria-labelledby="progress-title">
          <div className={styles.progressLabel}>
            <h2 id="progress-title">Your progress in Block 1</h2>
            <span>{completed} / 6 completed</span>
          </div>
          <div className={styles.progressTrack} role="progressbar" aria-valuemin={0} aria-valuemax={6} aria-valuenow={completed} aria-label={`${completed} of 6 lessons completed`}>
            <span style={{ width: `${(completed / 6) * 100}%` }} />
          </div>
          <p className={styles.why}>Why this matters: small, visible steps make a big subject feel possible.</p>
        </section>

        <section className={styles.lessonSection} aria-labelledby="lessons-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Your path</p>
            <h2 id="lessons-title">Six ideas that build on each other</h2>
          </div>
          <div className={styles.grid}>
            {lessons.map((lesson) => (
              <article className={styles.card} key={lesson.number}>
                <div className={styles.icon}><LessonIcon type={lesson.icon} /></div>
                <span className={styles.tag}>Lesson {lesson.number}</span>
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>
                <Link href={`/block-1/${lesson.slug}`}>Start lesson</Link>
              </article>
            ))}
          </div>
          <p className={styles.why}>Why this matters: each lesson adds one tool you will use in every block that follows.</p>
        </section>

        <footer className={styles.footer}>
          <p>This block is the foundation. Every later block reuses the ideas you build here. Take your time.</p>
        </footer>
      </div>
    </main>
  );
}
