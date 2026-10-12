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

      <footer><Link href="/data-and-privacy">← Back to Data &amp; privacy</Link><Link href="/block-1/1-1">Open Lesson 1.1 →</Link></footer>
    </main>
  </div>;
}
