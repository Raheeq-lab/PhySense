'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './math-spark.module.css';

const topics = [
  { id: 'algebra', symbol: 'x', title: 'Algebra foundations', description: 'Equations, variables, graphs, and the patterns behind them.', level: 'Best place to start', first: 'Solving one-step equations', example: '3x + 5 = 20' },
  { id: 'geometry', symbol: '△', title: 'Geometry & measurement', description: 'Shapes, angles, area, volume, and spatial reasoning.', level: 'Visual learner friendly', first: 'Angles and triangles', example: 'a² + b² = c²' },
  { id: 'functions', symbol: 'f', title: 'Functions & graphs', description: 'How inputs change into outputs and how to read their graphs.', level: 'Builds toward calculus', first: 'Inputs, outputs, and notation', example: 'f(x) = 2x + 1' },
  { id: 'calculus', symbol: '∫', title: 'Calculus', description: 'Change, motion, slopes, and accumulation explained visually.', level: 'Useful for physics', first: 'The idea of a changing slope', example: 'dy/dx' },
  { id: 'probability', symbol: '%', title: 'Probability & statistics', description: 'Chance, data, averages, and making evidence-based decisions.', level: 'Useful in daily life', first: 'Describing a set of data', example: 'P(A) = 1/6' },
  { id: 'vectors', symbol: '→', title: 'Vectors', description: 'Direction and size—the shared language of math and physics.', level: 'Math meets physics', first: 'Magnitude and direction', example: 'v = ⟨3, 4⟩' },
] as const;

export function MathSpark() {
  const [selectedId, setSelectedId] = useState<string>('algebra');
  const [started, setStarted] = useState(false);
  const selected = topics.find(topic => topic.id === selectedId) ?? topics[0];

  return <main className={styles.page}>
    <nav className={styles.nav} aria-label="Math navigation"><Link href="/" className={styles.brand}>PhySense <span>STEM</span></Link><Link href="/">Back to home</Link></nav>
    <section className={styles.hero}><div><p>Math Spark</p><h1>Find the math that moves you forward.</h1><span>Choose a suggested topic. We will show your first lesson before you continue.</span></div><div className={styles.formulaArt} aria-hidden="true"><i>y</i><b>=</b><i>mx</i><b>+</b><i>b</i></div></section>
    <section className={styles.finder} aria-labelledby="topic-heading"><header><div><span>First, choose a direction</span><h2 id="topic-heading">Suggested math topics</h2></div><p>Not sure? Algebra foundations is our recommendation because it supports every STEM pathway.</p></header><div className={styles.topicGrid}>{topics.map(topic => <button key={topic.id} type="button" className={selectedId === topic.id ? styles.selected : ''} aria-pressed={selectedId === topic.id} onClick={() => { setSelectedId(topic.id); setStarted(false); }}><span className={styles.symbol}>{topic.symbol}</span><span><small>{topic.level}</small><b>{topic.title}</b><em>{topic.description}</em></span><span className={styles.check} aria-hidden="true">✓</span></button>)}</div></section>
    <section className={styles.nextStep} aria-live="polite"><div><span>Your suggested first lesson</span><h2>{selected.first}</h2><p>{selected.description}</p></div><div className={styles.preview}><small>We will unpack</small><code>{selected.example}</code></div>{selectedId === 'algebra' ? <Link className={styles.ctaLink} href="/math-spark/algebra">Start Algebra Foundations <span>→</span></Link> : !started ? <button type="button" onClick={() => setStarted(true)}>Next: preview lesson <span>→</span></button> : <div className={styles.lessonPreview}><span>Ready to learn</span><p>Start with a short visual explanation, try one guided example, then check your understanding.</p><button type="button" onClick={() => setStarted(false)}>Open guided lesson soon</button></div>}</section>
    <section className={styles.bridge}><p>Math and physics are better together.</p><h2>Use Math Spark to build the tools, then see them come alive in Physics.</h2><Link href="/block-1/1-1">Explore the Physics pathway →</Link></section>
    <footer><Link href="/">PhySense STEM</Link><span>Learn by seeing, trying, and connecting ideas.</span></footer>
  </main>;
}
