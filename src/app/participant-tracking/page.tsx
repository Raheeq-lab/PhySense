import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Participant Tracking Design | PhySense',
  description: 'How PhySense can follow learning over time without placing direct identifiers in diagnostic records.',
};

const limitations = [
  ['Another device', 'The same learner receives a different code on another browser or device.'],
  ['Shared device', 'Different learners using the same browser profile may share one code.'],
  ['Cleared storage', 'Clearing site data removes the code and the next visit creates a new one.'],
  ['Private browsing', 'A private session normally loses its code when the session ends.'],
] as const;

const options = [
  {name: 'Browser-generated code', status: 'Current prototype', description: 'PhySense creates and remembers a random code on one browser.', strength: 'No name, email, or login is needed.', tradeoff: 'Cannot reliably follow one learner across devices.'},
  {name: 'Learner-entered study code', status: 'Possible pilot option', description: 'A participant receives a random study code and enters it for each assessment.', strength: 'Works across devices without putting an email in the response table.', tradeoff: 'Codes can be forgotten, copied, or entered incorrectly.'},
  {name: 'Login linked to a research code', status: 'Future option', description: 'A protected mapping connects an account to a separate research identifier.', strength: 'Most reliable for longitudinal and cross-device follow-up.', tradeoff: 'Creates re-identification risk and needs stronger consent, permissions, and governance.'},
] as const;

export default function ParticipantTrackingPage() {
  return <div className={styles.page}>
    <header className={styles.topbar}><Link href="/">PhySense</Link><nav><Link href="/data-and-privacy">Data &amp; privacy</Link><Link href="/block-1/1-1">Lesson 1.1</Link></nav></header>
    <main>
      <header className={styles.hero}>
        <span>Design note · reviewed 12 October 2026</span>
        <h1>Following learning over time without naming the learner</h1>
        <p>This note answers a specific question: can PhySense connect a learner&apos;s pre-test and post-test while keeping direct identifiers out of the diagnostic records?</p>
        <div><b>Short answer</b><p>Partly. The current prototype can connect attempts made in the same browser profile, but it cannot reliably identify the same learner across devices.</p></div>
      </header>

      <section>
        <div className={styles.heading}><span>01</span><div><h2>What the prototype does now</h2><p>No change is proposed here; this is the implemented behaviour.</p></div></div>
        <div className={styles.sequence}>
          <article><span>First visit</span><strong>A random UUID is created</strong><p>The browser generates a participant code using <code>crypto.randomUUID()</code>.</p></article>
          <i aria-hidden="true">→</i>
          <article><span>Same browser</span><strong>The code is remembered locally</strong><p>It is saved under <code>physense.anonymous.participant</code> in local storage.</p></article>
          <i aria-hidden="true">→</i>
          <article><span>Each submission</span><strong>A separate attempt ID is created</strong><p>The participant code links attempts without placing a name or email in the diagnostic tables.</p></article>
        </div>
        <aside className={styles.definition}><b>Classification: pseudonymous</b><p>The code is not a direct identity, but it is a persistent link between records. Calling it pseudonymous is more accurate than promising complete anonymity.</p></aside>
      </section>

      <section>
        <div className={styles.heading}><span>02</span><div><h2>What the code cannot prove</h2><p>A browser identifier is not the same thing as a verified learner identifier.</p></div></div>
        <div className={styles.limitations}>{limitations.map(([title, text]) => <article key={title}><span>LIMIT</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section>
        <div className={styles.heading}><span>03</span><div><h2>Three designs to consider</h2><p>The final choice should match the study design and ACU&apos;s ethics requirements.</p></div></div>
        <div className={styles.options}>{options.map((option, index) => <article key={option.name} className={index === 0 ? styles.current : ''}><header><span>{String(index + 1).padStart(2, '0')}</span><em>{option.status}</em></header><h3>{option.name}</h3><p>{option.description}</p><dl><div><dt>Strength</dt><dd>{option.strength}</dd></div><div><dt>Trade-off</dt><dd>{option.tradeoff}</dd></div></dl></article>)}</div>
      </section>

      <section>
        <div className={styles.heading}><span>04</span><div><h2>Recommendation for the proof of concept</h2><p>Keep the present design stable while the research requirements are being decided.</p></div></div>
        <div className={styles.recommendation}><strong>Keep the browser-generated code for now.</strong><p>Do not connect login emails or names to diagnostic responses yet. Use synthetic data for pipeline testing, describe current records as pseudonymous, and ask Wade/ACU whether cross-device longitudinal tracking is actually required.</p></div>
        <div className={styles.questions}><h3>Decisions needed from Wade / ACU</h3><ol><li>Must the study follow the same learner across different devices?</li><li>Is a learner-entered study code acceptable?</li><li>If login linkage is required, who may access the identity-to-code mapping?</li><li>How and when must that mapping be deleted?</li></ol></div>
      </section>

      <footer><Link href="/data-and-privacy">← Back to Data &amp; privacy</Link><Link href="/block-1/1-1">Open Lesson 1.1 →</Link></footer>
    </main>
  </div>;
}
