import type { Metadata } from 'next';
import Link from 'next/link';
import {kinematicsDiagnostic} from '@/data/kinematicsDiagnostic';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Diagnostic Map | PhySense',
  description: 'Draft concept, misconception, Q-matrix, interaction, and reassessment map for the PhySense Lesson 1.1 diagnostic.',
};

const attributes = [
  ['A1', 'Distinguish position, speed, and velocity'],
  ['A2', 'Interpret position–time graph slope'],
  ['A3', 'Relate acceleration to changing velocity'],
  ['A4', 'Decompose two-dimensional motion'],
  ['A5', 'Apply gravity throughout projectile motion'],
  ['A6', 'Combine reaction and braking distance'],
] as const;

const reviewMap: Record<string, {attributes: string[]; interaction: string; reassessment: string}> = {
  'KIN-01': {attributes: ['A1'], interaction: 'Car position, direction, and sign activity', reassessment: 'Ask about an object left of zero moving right.'},
  'KIN-02': {attributes: ['A1'], interaction: 'Opposite-direction cars: speed versus velocity comparison', reassessment: 'Compare two runners with equal speeds in opposite directions.'},
  'KIN-03': {attributes: ['A3'], interaction: 'GO/BRAKE car lab with velocity and acceleration vectors', reassessment: 'Ask for signs while a left-moving object slows down.'},
  'KIN-04': {attributes: ['A2'], interaction: 'Position–time graph slope exploration', reassessment: 'Interpret a straight falling position–time line.'},
  'KIN-05': {attributes: ['A2'], interaction: 'Flat position–time graph at a non-zero position', reassessment: 'Interpret a flat graph at a negative position.'},
  'KIN-06': {attributes: ['A3'], interaction: 'Constant-acceleration storyboard and velocity updates', reassessment: 'Predict velocity changes for a constant negative acceleration.'},
  'KIN-07': {attributes: ['A4'], interaction: 'Basketball horizontal/vertical component animation', reassessment: 'Ask about horizontal velocity of a launched puck or ball.'},
  'KIN-08': {attributes: ['A4', 'A5'], interaction: 'Projectile peak frame with velocity and gravity vectors', reassessment: 'Ask about acceleration at the peak of a tossed object.'},
  'KIN-09': {attributes: ['A4', 'A5'], interaction: 'Separate then recombine projectile components', reassessment: 'Apply component reasoning to a horizontally launched object.'},
  'KIN-10': {attributes: ['A6'], interaction: 'Late-yellow-light reaction and braking challenge', reassessment: 'Calculate total stopping distance in a new driving scenario.'},
};

export default function DiagnosticMapPage() {
  return <div className={styles.page}>
    <header className={styles.topbar}><Link href="/">PhySense</Link><nav><Link href="/data-and-privacy">Data &amp; privacy</Link><Link href="/block-1/1-1">Lesson 1.1</Link></nav></header>
    <main>
      <header className={styles.hero}>
        <span>Lesson 1.1 · Expert-review document</span>
        <h1>Diagnostic concept &amp; misconception map</h1>
        <p>This document connects each two-tier item to a proposed cognitive attribute, a targeted lesson interaction, and a possible transfer item.</p>
        <div><strong>Draft for expert review — not validated</strong><p>These mappings are hypotheses for content review and pipeline testing. They do not establish item validity, model fit, or educational effectiveness.</p></div>
      </header>

      <section>
        <div className={styles.heading}><span>01</span><div><h2>Proposed attribute set</h2><p>The six columns used in the draft binary Q-matrix.</p></div></div>
        <div className={styles.attributes}>{attributes.map(([code, label]) => <article key={code}><b>{code}</b><span>{label}</span></article>)}</div>
      </section>

      <section>
        <div className={styles.heading}><span>02</span><div><h2>Draft Q-matrix</h2><p>“1” means the item is proposed to require that attribute. Wade or another subject expert should review every assignment.</p></div></div>
        <div className={styles.tableWrap}><table><thead><tr><th>Item</th>{attributes.map(([code]) => <th key={code}>{code}</th>)}</tr></thead><tbody>{kinematicsDiagnostic.map(item => {const active = reviewMap[item.id].attributes; return <tr key={item.id}><th>{item.id}</th>{attributes.map(([code]) => <td key={code} data-active={active.includes(code) || undefined}>{active.includes(code) ? '1' : '0'}</td>)}</tr>})}</tbody></table></div>
      </section>

      <section>
        <div className={styles.heading}><span>03</span><div><h2>Item review cards</h2><p>The question wording comes directly from the live diagnostic. Attribute and transfer mappings remain proposals.</p></div></div>
        <div className={styles.cards}>{kinematicsDiagnostic.map(item => {const mapping = reviewMap[item.id]; return <article key={item.id}>
          <header><span>{item.id}</span><em data-difficulty={item.difficulty}>{item.difficulty}</em></header>
          <h3>{item.concept}</h3>
          <p className={styles.prompt}>{item.prompt}</p>
          <dl>
            <div><dt>Correct answer</dt><dd>{item.answers[item.correctAnswer].label}</dd></div>
            <div><dt>Correct reasoning</dt><dd>{item.reasons[item.correctReason].label}</dd></div>
            <div><dt>Targeted misconception</dt><dd>{item.misconception}</dd></div>
            <div><dt>Why the keyed response is correct</dt><dd>{item.explanation}</dd></div>
            <div><dt>Proposed Q-matrix attribute</dt><dd className={styles.attributeTags}>{mapping.attributes.map(code => <span key={code}>{code}</span>)}</dd></div>
            <div><dt>Targeted lesson interaction</dt><dd>{mapping.interaction}</dd></div>
            <div><dt>Proposed reassessment</dt><dd>{mapping.reassessment}</dd></div>
          </dl>
        </article>})}</div>
      </section>

      <section>
        <div className={styles.heading}><span>04</span><div><h2>Expert-review questions</h2><p>Points to resolve before treating this map as a defensible measurement model.</p></div></div>
        <ol className={styles.reviewQuestions}><li>Does each item test the stated concept rather than reading or calculation skill?</li><li>Do the distractors represent plausible learner misconceptions?</li><li>Is the keyed reasoning unambiguously better than the alternatives?</li><li>Are the Q-matrix attributes distinct, observable, and assigned correctly?</li><li>Does each targeted interaction address the diagnosed misconception?</li><li>Would the proposed reassessment show transfer rather than memorisation?</li><li>Should validated inventory items replace or supplement any draft item?</li></ol>
      </section>

      <footer><Link href="/data-and-privacy">← Data &amp; privacy</Link><Link href="/block-1/1-1">Open the live diagnostic →</Link></footer>
    </main>
  </div>;
}
