'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { MATH_BLOCKS } from '@/data/mathSyllabus';
import styles from './math-curriculum.module.css';

export function MathSpark() {
  const root = useRef<HTMLElement>(null);
  const [activeBlock, setActiveBlock] = useState(0);
  const block = MATH_BLOCKS[activeBlock];

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-intro]', { opacity: 0, y: 24, stagger: .1, duration: .7, ease: 'power3.out' });
      gsap.from('[data-block]', { opacity: 0, y: 30, stagger: .08, duration: .65, delay: .2, ease: 'power3.out' });
    });
    return () => media.revert();
  }, { scope: root });

  return <main ref={root} className={styles.page}>
    <nav className={styles.nav}><Link href="/" className={styles.brand}>PhySense <span>STEM</span></Link><div><Link href="/">Physics home</Link><span>Math pathway</span></div></nav>
    <header className={styles.hero}><p data-intro>Math Spark</p><h1 data-intro>Learn the math behind the physics.</h1><span data-intro>Six connected blocks. Six short lessons in each. Every idea points to the Physics lesson where it comes alive.</span><a data-intro href="#curriculum">Explore the pathway <b>↓</b></a></header>

    <section id="curriculum" className={styles.curriculum}>
      <header><div><p>Your Math pathway</p><h2>Choose a block.</h2></div><p>Start with Algebra Foundations if you are new. Move in order, or jump to the Math tool needed by your Physics lesson.</p></header>
      <div className={styles.blockTabs} role="tablist" aria-label="Math blocks">{MATH_BLOCKS.map((item, index) => <button data-block key={item.number} type="button" role="tab" aria-selected={activeBlock === index} onClick={() => setActiveBlock(index)}><span>{item.symbol}</span><small>Math Block {item.number}</small><b>{item.title}</b><em>{item.description}</em></button>)}</div>

      <article className={styles.lessonPanel} key={block.number}>
        <div className={styles.blockIntro}><span>{block.symbol}</span><div><small>Math Block {block.number}</small><h2>{block.title}</h2><p>{block.description}</p></div></div>
        <ol className={styles.lessons}>{block.lessons.map((lesson, index) => <li key={lesson.code} className={lesson.href ? styles.available : ''}><span>{lesson.code}</span><div>{lesson.href ? <Link className={styles.lessonTitle} href={lesson.href}>{lesson.title}</Link> : <b>{lesson.title}</b>}<p>{lesson.summary}</p><Link href={lesson.physicsHref}>Connects to Physics: {lesson.physics} <i>↗</i></Link></div>{lesson.href ? <Link className={styles.lessonAction} href={lesson.href}>{index === 0 ? 'Start lesson now' : 'Open'} <span>→</span></Link> : <span className={styles.planned}>Planned</span>}</li>)}</ol>
      </article>
    </section>

    <section className={styles.connection}><div><p>One connected STEM pathway</p><h2>Math gives you the tool. Physics gives it meaning.</h2></div><div className={styles.connectionFlow}><span>Learn<br/><b>the idea</b></span><i>→</i><span>Try<br/><b>the math</b></span><i>→</i><span>Use it<br/><b>in Physics</b></span></div></section>
    <section className={styles.start}><div><p>Recommended starting point</p><h2>Begin with unknowns and balanced equations.</h2></div><Link href="/math-spark/algebra">Start Math Lesson M1.1 <span>→</span></Link></section>
    <footer><Link href="/">PhySense STEM</Link><span>Physics and Math, built as one connected journey.</span></footer>
  </main>;
}
