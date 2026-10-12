import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Data & Privacy | PhySense',
  description: 'A plain-language record of how the PhySense Lesson 1.1 diagnostic currently handles learner data.',
};

const storedFields = [
  'Random participant and attempt IDs',
  'Lesson and pre/post phase',
  'Selected answer and selected reason',
  'Answer, reason, and joint correctness',
  'Confidence and response time',
  'Concept, misconception, and difficulty tags',
  'Start/completion times and summary scores',
  'Prototype consent version',
];

const openDecisions = [
  'ACU approval of Supabase and Vercel for research use',
  'The final university-approved participant consent process',
  'A research-data retention and deletion schedule',
  'Researcher roles and an instructor dashboard',
  'Migration of research storage to Supabase Sydney',
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
        <a href="#decisions">Open decisions</a>
      </nav>
      <Link className={styles.back} href="/block-1/1-1">← Lesson 1.1</Link>
    </aside>

    <main className={styles.main}>
      <header id="overview" className={styles.hero}>
        <span className={styles.eyebrow}>Prototype transparency record · reviewed 12 October 2026</span>
        <h1>How PhySense handles diagnostic data</h1>
        <p>This page documents the current Lesson 1.1 proof of concept. It is a technical description, not an ethics approval or final research consent form.</p>
        <div className={styles.statusRow}><span>Current system</span><span>Research use pending review</span></div>
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
          <div><dt>Administrative access</dt><dd>People with authorised access to the PhySense Supabase project can administer the stored data. A separate instructor dashboard does not yet exist.</dd></div>
          <div><dt>Learner export</dt><dd>The learner can download the attempt available on their own device as JSON. The interface does not provide access to another learner&apos;s attempt.</dd></div>
          <div><dt>Deletion and retention</dt><dd>No final research retention period or learner self-service deletion process has been approved yet.</dd></div>
        </dl>
      </section>

      <section id="decisions">
        <div className={styles.sectionHeading}><span>04</span><div><h2>Open decisions before a learner study</h2><p>These items remain deliberately unresolved while institutional advice is sought.</p></div></div>
        <ul className={styles.decisions}>{openDecisions.map(item => <li key={item}>{item}</li>)}</ul>
        <div className={styles.boundary}><strong>Current boundary</strong><p>The diagnostic may be demonstrated and tested with synthetic data. Real learner data must not be treated as an approved research dataset until the relevant ethics, consent, hosting, access, and retention requirements are confirmed.</p></div>
      </section>

      <footer><p>Continue the research documentation with the <Link href="/diagnostic-map">draft diagnostic concept and misconception map</Link>.</p><Link href="/block-1/1-1">Return to Lesson 1.1 →</Link></footer>
    </main>
  </div>;
}
