'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import { useRef, useState } from 'react';
import styles from './algebra-foundations.module.css';

const answers = [3, 4, 5];

export function AlgebraFoundations() {
  const root = useRef<HTMLElement>(null);
  const [balanceStep, setBalanceStep] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const correct = answer === 5;

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-reveal]', { opacity: 0, y: 28, duration: .7, stagger: .12, ease: 'power3.out' });
      gsap.from('[data-balance]', { opacity: 0, scale: .86, duration: .8, delay: .25, ease: 'back.out(1.4)' });
    });
    return () => media.revert();
  }, { scope: root });

  return <main ref={root} className={styles.page}>
    <nav><Link href="/" className={styles.brand}>PhySense <span>STEM</span></Link><div><Link href="/math-spark">Math topics</Link><span>Algebra Foundations</span></div></nav>
    <header className={styles.hero}><p data-reveal>Math Lesson M1.1 · Algebra Foundations</p><h1 data-reveal>An equation is just a balanced scale.</h1><span data-reveal>Whatever you do to one side, do the same to the other. That is the whole idea.</span><a data-reveal href="#try-it">Start lesson <b>↓</b></a></header>
    <section id="try-it" className={styles.balanceSection}>
      <div className={styles.explanation} data-reveal><p>Meet the unknown</p><h2>Find what <i>x</i> is worth.</h2><div className={styles.equation}>{balanceStep === 0 ? <><b>x</b><span>+ 3</span><em>=</em><span>7</span></> : <><b>x</b><em>=</em><span>4</span></>}</div><p className={styles.helper}>{balanceStep === 0 ? 'We want x by itself. Remove 3 from both sides.' : 'Balanced. The same change on both sides keeps the equation true.'}</p>{balanceStep === 0 ? <button type="button" onClick={() => setBalanceStep(1)}>Subtract 3 from both sides</button> : <button type="button" className={styles.reset} onClick={() => setBalanceStep(0)}>Try that again</button>}</div>
      <div className={`${styles.balance} ${balanceStep ? styles.solved : ''}`} data-balance><div className={styles.tray}><span className={styles.xBlock}>x</span>{balanceStep === 0 && [1,2,3].map(n => <i key={n}>1</i>)}</div><div className={styles.beam}><span /></div><div className={styles.tray}>{Array.from({length: balanceStep ? 4 : 7}, (_, n) => <i key={n}>1</i>)}</div><div className={styles.base} /></div>
    </section>
    <section className={styles.rule} data-reveal><span>Keep this one rule</span><blockquote>Change one side? Change the other side in exactly the same way.</blockquote></section>
    <section className={styles.challenge}><div data-reveal><p>Your turn</p><h2>What makes this true?</h2><div className={styles.challengeEquation}><span>x</span><b>+ 2 = 7</b></div></div><div className={styles.answerPanel} data-reveal><span>Choose a value for x</span><div>{answers.map(value => <button type="button" key={value} aria-pressed={answer === value} onClick={() => setAnswer(value)}>{value}</button>)}</div>{answer !== null && <p className={correct ? styles.correct : styles.incorrect} role="status">{correct ? 'Exactly. 5 + 2 equals 7.' : `${answer} + 2 does not equal 7. Try once more.`}</p>}</div></section>
    <section className={styles.finish}><div><p>{correct ? 'Foundation complete' : 'One small step left'}</p><h2>{correct ? 'You can keep an equation balanced.' : 'Solve the challenge to finish.'}</h2></div>{correct ? <Link href="/math-spark">Choose another Math topic <span>→</span></Link> : <a href="#try-it">Review the balance idea</a>}</section>
    <footer><Link href="/">PhySense STEM</Link><span>Simple ideas. Real understanding.</span></footer>
  </main>;
}
