import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Data & Privacy | PhySense',
  description: 'A plain-language record of how the PhySense Lesson 1.1 diagnostic currently handles learner data.',
};

const storedFields = [
  'Random participant and attempt IDs',
  'Optional class association when a class code was used',
  'Lesson and pre/post phase',
  'Selected answer and selected reason',
  'Answer, reason, and joint correctness',
  'Confidence and response time',
  'Concept, misconception, and difficulty tags',
  'Start/completion times and summary scores',
  'Prototype consent version',
];

export default function DataAndPrivacyPage() {
  return <div className={styles.page}>
    <aside className={styles.sidebar}>
      <Link className={styles.brand} href="/">PhySense<small>A field guide to physical law.</small></Link>
      <nav aria-label="Page navigation">
        <a href="#overview">Overview</a>
        <a href="#flow">Current data flow</a>
        <a href="#fields">Fields collected</a>
        <a href="#access">Access and export</a>
      </nav>
      <Link className={styles.back} href="/block-1/1-1">← Lesson 1.1</Link>
    </aside>

    <main className={styles.main}>
      <header id="overview" className={styles.hero}>
        <span className={styles.eyebrow}>Data &amp; privacy</span>
        <h1>How PhySense handles diagnostic data</h1>
        <p>This page explains in plain language what information the Lesson 1.1 diagnostic uses, when it may be shared, and how learners can access their results.</p>
        <div className={styles.documentLinks} aria-label="Research design documents">
          <Link href="/participant-tracking"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3 19c.7-4 2.7-6 6-6s5.3 2 6 6M17 8h4m-2-2v4M17 15h4m-4 4h4"/></svg><span><b>Participant tracking</b><small>how learners are linked over time</small></span></Link>
          <Link href="/diagnostic-map"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM9 5v14M9 10h11M9 15h11"/><path d="m5.8 11.8 1 1 1.5-2M5.8 16.8l1 1 1.5-2"/></svg><span><b>Diagnostic map</b><small>questions, attributes &amp; misconceptions</small></span></Link>
        </div>
      </header>

      <section id="flow">
        <div className={styles.sectionHeading}><span>01</span><div><h2>Current data flow</h2><p>What happens from opening the diagnostic to receiving a result.</p></div></div>
        <ol className={styles.flow}>
          <li><b>Learner&apos;s browser</b><span>Creates a random participant code and keeps quiz progress in local browser storage.</span></li>
          <li><b>PhySense on Vercel</b><span>Shows the lesson and validates completed diagnostic submissions through a server endpoint.</span></li>
          <li><b>Optional sharing choice</b><span>If sharing is not selected, the attempt stays on that device. If selected, the completed attempt is sent to the server.</span></li>
          <li><b>Supabase</b><span>Stores the pseudonymous attempt and item-level responses. The browser cannot read the research tables directly.</span></li>
          <li><b>Learner result</b><span>Shows scores and explanations and allows the learner to download that attempt as JSON.</span></li>
        </ol>
        <aside className={styles.note}><b>Important terminology</b><p>The random code is stable on one browser, so it can connect attempts over time. The data is therefore best described as <strong>pseudonymous</strong>, not guaranteed anonymous.</p><Link href="/participant-tracking">Read the participant tracking design →</Link></aside>
      </section>

      <section id="fields">
        <div className={styles.sectionHeading}><span>02</span><div><h2>Fields collected</h2><p>The diagnostic database currently stores the following fields after optional sharing.</p></div></div>
        <ul className={styles.fieldGrid}>{storedFields.map(field => <li key={field}>{field}</li>)}</ul>
        <div className={styles.splitCards}>
          <article><span className={styles.verified}>Verified</span><h3>Not written to the diagnostic tables</h3><p>Name, email address, sex, country, first-in-family status, and other demographic fields are not part of the current diagnostic submission.</p></article>
          <article><span className={styles.caution}>Operational note</span><h3>Service logs are separate</h3><p>PhySense does not intentionally add an IP address or device profile to diagnostic records. Hosting providers may still create ordinary security and operational logs.</p></article>
        </div>
      </section>

      <section id="access">
        <div className={styles.sectionHeading}><span>03</span><div><h2>Storage, access, and export</h2><p>Where the proof-of-concept data sits and who can reach it today.</p></div></div>
        <dl className={styles.facts}>
          <div><dt>Website</dt><dd>Deployed on Vercel.</dd></div>
          <div><dt>Diagnostic database</dt><dd>Supabase project “PhySense”, currently in <code>us-west-2</code> (Oregon, USA).</dd></div>
          <div><dt>Browser access</dt><dd>Public and signed-in browser roles are blocked from the diagnostic tables by database permissions and Row Level Security.</dd></div>
          <div><dt>Administrative access</dt><dd>People with authorised access to the PhySense Supabase project can administer the stored data. The instructor prototype shows only aggregate results for a class through its private management token.</dd></div>
          <div><dt>Learner export</dt><dd>The learner can download the attempt available on their own device as JSON. The interface does not provide access to another learner&apos;s attempt.</dd></div>
          <div><dt>Deletion and retention</dt><dd>No final research retention period or learner self-service deletion process has been approved yet.</dd></div>
        </dl>
      </section>

      <footer><p>Continue the research documentation with the <Link href="/diagnostic-map">draft diagnostic concept and misconception map</Link>.</p><Link href="/block-1/1-1">Return to Lesson 1.1 →</Link></footer>
    </main>
  </div>;
}
