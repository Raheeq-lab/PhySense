'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useRef, useState } from 'react';
import KinematicsDiagnostic from '@/components/lesson/KinematicsDiagnostic';
import { algebraFoundationsDiagnostic } from '@/data/algebraFoundationsDiagnostic';
import styles from './algebra-foundations.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);
const answers = [3, 4, 5];

export function AlgebraFoundations() {
  const root = useRef<HTMLElement>(null);
  const [balanceStep, setBalanceStep] = useState(0);
  const [ticketStep, setTicketStep] = useState(0);
  const [speed, setSpeed] = useState(5);
  const [time, setTime] = useState(4);
  const [answer, setAnswer] = useState<number | null>(null);
  const correct = answer === 5;
  const distance = speed * time;

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-reveal]', { opacity: 0, y: 28, duration: .7, stagger: .12, ease: 'power3.out' });
      gsap.from('[data-balance]', { opacity: 0, scale: .86, duration: .8, delay: .25, ease: 'back.out(1.4)' });
      gsap.utils.toArray<HTMLElement>('[data-scroll-card]').forEach(card => gsap.fromTo(card,{opacity:.35,scale:.9,y:45},{opacity:1,scale:1,y:0,ease:'none',scrollTrigger:{trigger:card,start:'top 88%',end:'top 42%',scrub:true}}));
    });
    return () => media.revert();
  }, { scope: root });

  const ticketEquation = ticketStep === 0 ? '3x + 5 = 20' : ticketStep === 1 ? '3x = 15' : 'x = 5';
  const ticketCopy = ticketStep === 0 ? 'Remove the one-time £5 booking fee from both sides.' : ticketStep === 1 ? 'Three equal tickets cost £15, so divide both sides by 3.' : 'Each ticket costs £5. Check it: 3 × £5 + £5 = £20.';

  return <main ref={root} className={styles.page}>
    <nav><Link href="/" className={styles.brand}>PhySense <span>STEM</span></Link><div><Link href="/math-spark">Math blocks</Link><span>Lesson M1.1</span></div></nav>
    <header className={styles.hero}><p data-reveal>Math Lesson M1.1 · Algebra Foundations</p><h1 data-reveal>An equation is just a balanced scale.</h1><span data-reveal>Algebra helps us name what we do not know, then use what we do know to find it.</span><a data-reveal href="#meaning">Start lesson <b>↓</b></a></header>

    <section id="meaning" className={styles.meaning}>
      <header data-scroll-card><p>The simple idea</p><h2>Letters are placeholders, not mysteries.</h2><span>When a number is unknown, we give it a short name such as x. The equation tells us everything that is known about it.</span></header>
      <div className={styles.conceptGrid}>
        <article data-scroll-card><span>x</span><h3>Variable</h3><p>A letter standing in for a number that can change or that we need to find.</p></article>
        <article data-scroll-card><span>=</span><h3>Equality</h3><p>The left and right sides have exactly the same value. Think of a level scale.</p></article>
        <article data-scroll-card><span>↺</span><h3>Inverse operation</h3><p>Undo addition with subtraction, or multiplication with division.</p></article>
      </div>
    </section>

    <section id="try-it" className={styles.balanceSection}>
      <div className={styles.explanation} data-scroll-card><p>See the balance</p><h2>Find what <i>x</i> is worth.</h2><div className={styles.equation} aria-label={balanceStep === 0 ? 'x plus 3 equals 7' : 'x equals 4'}>{balanceStep === 0 ? <><b>x</b><span>+ 3</span><em>=</em><span>7</span></> : <><b>x</b><em>=</em><span>4</span></>}</div><p className={styles.helper}>{balanceStep === 0 ? 'We want x by itself. Remove 3 from both sides.' : 'Balanced. The same change on both sides keeps the equation true.'}</p>{balanceStep === 0 ? <button type="button" onClick={() => setBalanceStep(1)}>Subtract 3 from both sides</button> : <button type="button" className={styles.reset} onClick={() => setBalanceStep(0)}>Reset the scale</button>}</div>
      <div className={`${styles.balance} ${balanceStep ? styles.solved : ''}`} data-balance><div className={styles.tray}><span className={styles.xBlock}>x</span>{balanceStep === 0 && [1,2,3].map(n => <i key={n}>1</i>)}</div><div className={styles.beam}><span /></div><div className={styles.tray}>{Array.from({length: balanceStep ? 4 : 7}, (_, n) => <i key={n}>1</i>)}</div><div className={styles.base} /></div>
    </section>

    <section className={styles.rule} data-scroll-card><span>Keep this one rule</span><blockquote>Change one side? Change the other side in exactly the same way.</blockquote></section>

    <section className={styles.realLife}>
      <div className={styles.story} data-scroll-card><p>A real-life equation</p><h2>Three tickets and one booking fee cost £20.</h2><p>Each ticket has the same unknown price, so call it <b>x</b>. The booking fee is £5.</p><div className={styles.ticketRow}><span>Ticket x</span><span>Ticket x</span><span>Ticket x</span><i>+ £5 fee</i></div></div>
      <div className={styles.storySolver} data-scroll-card><small>{ticketStep === 2 ? 'Solved and checked' : 'Solve it one move at a time'}</small><code>{ticketEquation}</code><p>{ticketCopy}</p><div><button type="button" disabled={ticketStep === 0} onClick={() => setTicketStep(step => Math.max(0, step - 1))}>Back</button><button type="button" onClick={() => setTicketStep(step => step === 2 ? 0 : step + 1)}>{ticketStep === 2 ? 'Try again' : 'Next move'}</button></div></div>
    </section>

    <section className={styles.physicsLab}>
      <header data-scroll-card><p>Now connect it to Physics</p><h2>Algebra turns motion into something we can predict.</h2><span>Physics gives us the relationship <b>distance = speed × time</b>. Algebra lets us substitute measurements, calculate the missing quantity, and rearrange the formula when a different value is unknown.</span></header>
      <div className={styles.motionLab} data-scroll-card>
        <div className={styles.motionScene}><div className={styles.road}><span style={{left:`${Math.min(92, 8 + distance * .7)}%`}}>car</span></div><p>The car travels <b>{distance} metres</b>.</p></div>
        <div className={styles.motionControls}><label><span>Speed <b>{speed} m/s</b></span><input type="range" min="1" max="15" value={speed} onChange={event => setSpeed(Number(event.target.value))} /></label><label><span>Time <b>{time} s</b></span><input type="range" min="1" max="10" value={time} onChange={event => setTime(Number(event.target.value))} /></label><div className={styles.physicsEquation}><span>d = v × t</span><code>d = {speed} × {time} = <b>{distance} m</b></code></div></div>
      </div>
      <div className={styles.physicsLinks}><Link href="/block-1/1-1">See this in Physics: Kinematics <span>→</span></Link><p>Later, the same Algebra helps rearrange <b>v = d ÷ t</b> and <b>t = d ÷ v</b>.</p></div>
    </section>

    <section className={styles.challenge}><div data-scroll-card><p>Your turn</p><h2>What makes this true?</h2><div className={styles.challengeEquation}><span>x</span><b>+ 2 = 7</b></div></div><div className={styles.answerPanel} data-scroll-card><span>Choose a value for x</span><div>{answers.map(value => <button type="button" key={value} aria-pressed={answer === value} onClick={() => setAnswer(value)}>{value}</button>)}</div>{answer !== null && <p className={correct ? styles.correct : styles.incorrect} role="status">{correct ? 'Exactly. 5 + 2 equals 7.' : `${answer} + 2 does not equal 7. Try once more.`}</p>}</div></section>
    <section className={styles.diagnosticSection}><header><p>Check what you learned</p><h2>Algebra understanding quiz</h2><span>Ten short questions measure both your answer and your reasoning. You choose whether anonymous results are shared; otherwise they stay on this device.</span></header><KinematicsDiagnostic items={algebraFoundationsDiagnostic} lessonId="math-spark/algebra" storageSlug="math.m1.1" simulationFilename="algebra-foundations" /></section>
    <section className={styles.finish}><div><p>{correct ? 'Foundation complete' : 'One small step left'}</p><h2>{correct ? 'You can keep an equation balanced.' : 'Solve the practice challenge to finish.'}</h2></div>{correct ? <Link href="/math-spark">Choose another Math lesson <span>→</span></Link> : <a href="#try-it">Review the balance idea</a>}</section>
    <footer><Link href="/">PhySense STEM</Link><span>Simple ideas. Real understanding.</span></footer>
  </main>;
}
