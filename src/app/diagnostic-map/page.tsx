import type { Metadata } from 'next';
import Link from 'next/link';
import {kinematicsDiagnostic} from '@/data/kinematicsDiagnostic';
import styles from './page.module.css';
import {GeistSans} from 'geist/font/sans';
import {ArrowRight, BookOpen, Lightbulb, Gauge} from 'lucide-react';
import AssessmentExplorer from './assessment-explorer';

export const metadata: Metadata = {
  title: 'Assessments | PhySense',
  description: 'Explore the kinematics diagnostic, understand the assessment format, and review the concepts behind each question.',
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
  return <main className={`${styles.page} ${GeistSans.className}`}><div className={styles.shell}>
    <header className={styles.topbar}><Link className={styles.brand} href="/">PhySense<span>Assessments</span></Link><nav aria-label="Assessment navigation"><Link href="/user-guides">User guide</Link><Link href="/instructor">Instructor workspace <ArrowRight size={15} aria-hidden="true"/></Link></nav></header>
    <section className={styles.hero} aria-labelledby="assessment-title"><div><p className={styles.eyebrow}>Lesson 1.1 · Kinematics</p><h1 id="assessment-title">Go beyond<br/>the right answer.</h1><p className={styles.lead}>A short diagnostic that explores what you know about motion—and the thinking behind it.</p><div className={styles.actions}><Link className={styles.primary} href="/block-1/1-1#assessment">Open the assessment <ArrowRight size={17} aria-hidden="true"/></Link><a className={styles.secondary} href="#questions">Explore the questions</a></div></div><aside className={styles.overview}><span className={styles.overviewIcon}><BookOpen size={25} aria-hidden="true"/></span><h2>A clearer picture of understanding.</h2><p>Ten questions connect everyday motion with the ideas behind it.</p><div><span>Position & velocity</span><span>Graphs & acceleration</span><span>Projectiles & stopping</span></div><small>Explore this preview, or open the lesson to take the diagnostic.</small></aside></section>
    <section className={styles.how} aria-label="How the assessment works">{[{icon:BookOpen,title:'Choose your answer',text:'Read the situation and pick the best response.'},{icon:Lightbulb,title:'Explain your thinking',text:'Select the reason that matches your understanding.'},{icon:Gauge,title:'Rate your confidence',text:'Tell us how sure you feel. Then move on.'}].map(({icon:Icon,title,text})=><article key={title}><Icon size={21} aria-hidden="true"/><div><h2>{title}</h2><p>{text}</p></div></article>)}</section>
    <AssessmentExplorer items={kinematicsDiagnostic} reviewMap={reviewMap}/>
    <section className={styles.educator} aria-labelledby="educator-title"><div><p className={styles.eyebrow}>For educators</p><h2 id="educator-title">A closer look,<br/>when you need it.</h2><p>The concept mappings below are draft proposals for expert review. They are not validated measures of learning.</p></div><div className={styles.disclosures}>
      <details><summary>Concept map & Q-matrix<span aria-hidden="true">+</span></summary><div className={styles.detailBody}><p>Each marked cell proposes a concept needed to answer that question. These assignments need subject-expert review.</p><dl className={styles.attributes}>{attributes.map(([code,label])=><div key={code}><dt>{code}</dt><dd>{label}</dd></div>)}</dl><div className={styles.tableWrap} role="region" aria-label="Draft question to concept matrix" tabIndex={0}><table><caption>Proposed concepts by question</caption><thead><tr><th scope="col">Question</th>{attributes.map(([code])=><th scope="col" key={code}>{code}</th>)}</tr></thead><tbody>{kinematicsDiagnostic.map(item=><tr key={item.id}><th scope="row">{item.id}</th>{attributes.map(([code])=><td key={code} data-active={reviewMap[item.id].attributes.includes(code)||undefined}>{reviewMap[item.id].attributes.includes(code)?'1':'0'}</td>)}</tr>)}</tbody></table></div></div></details>
      <details><summary>Expert review checklist<span aria-hidden="true">+</span></summary><div className={styles.detailBody}><ul><li>Does each question test the intended concept?</li><li>Do distractors represent plausible misconceptions?</li><li>Are the correct answer and reasoning unambiguous?</li><li>Are the mapped concepts distinct and assigned correctly?</li><li>Does the suggested lesson activity address the misconception?</li><li>Would reassessment show transfer rather than memorisation?</li><li>Should validated items replace or supplement these drafts?</li></ul></div></details>
      <details><summary>Scoring & student privacy<span aria-hidden="true">+</span></summary><div className={styles.detailBody}><p>An item counts as fully understood when both the answer and reasoning are correct. Confidence is recorded separately.</p><p>Sharing is optional. Without consent, results stay on the learner’s device. Consented attempts from personal invitations can be linked to instructor-managed roster emails.</p><Link href="/data-and-privacy">Read about data and privacy <ArrowRight size={15} aria-hidden="true"/></Link></div></details>
    </div></section>
    <footer className={styles.footer}><Link href="/">PhySense</Link><span>Curiosity first. Understanding next.</span><Link href="/block-1/1-1#assessment">Open the assessment <ArrowRight size={15} aria-hidden="true"/></Link></footer>
  </div></main>;
}
