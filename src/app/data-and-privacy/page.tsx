import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Data & Privacy | PhySense',
  description: 'A plain-language guide to how PhySense handles learner data and class participation.',
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
        <a href="#choices">Your choices</a>
        <a href="#classes">Class participation</a>
        <a href="#records">Information used</a>
      </nav>
      <Link className={styles.back} href="/block-1/1-1">← Lesson 1.1</Link>
    </aside>

    <main className={styles.main}>
      <header id="overview" className={styles.hero}>
        <span className={styles.eyebrow}>Data &amp; privacy</span>
        <h1>Your information and your choices</h1>
        <p>PhySense diagnostics do not ask students for a name or email. An instructor may separately upload roster emails to create personal invitation links. This page explains what stays in the browser, what may be shared, and what an instructor can see.</p>
      </header>

      <section id="choices">
        <div className={styles.sectionHeading}><span>01</span><div><h2>Your choices</h2><p>You can use the lesson and complete the diagnostic without sending the attempt to a class summary.</p></div></div>
        <ol className={styles.flow}>
          <li><b>Join a class</b><span>A six-character class code connects this browser to an instructor-created class. The code is shared by the whole class and is not a personal identity.</span></li>
          <li><b>Complete the diagnostic</b><span>Your progress and result are kept in this browser while you work.</span></li>
          <li><b>Choose whether to share</b><span>If optional sharing is selected, the completed attempt is added to the class summary. Otherwise, it stays on this device.</span></li>
          <li><b>View your result</b><span>You can review your score and explanations and download your attempt as a JSON file.</span></li>
        </ol>
        <aside className={styles.note}><b>Remember</b><p>Clearing browser data, changing browsers, or using another device may remove or change the locally saved participant code and class connection.</p></aside>
      </section>

      <section id="classes">
        <div className={styles.sectionHeading}><span>02</span><div><h2>What an instructor can see</h2><p>The instructor view shows a class summary, not student profiles.</p></div></div>
        <div className={styles.splitCards}>
          <article><span className={styles.verified}>Visible</span><h3>Aggregate class results</h3><p>The number of pseudonymous learners, shared attempts, pre/post attempts, and average pre/post scores.</p></article>
          <article><span className={styles.caution}>Kept separate</span><h3>Roster email</h3><p>The student join and diagnostic forms do not request personal details. If an instructor uploads a roster email, it stays in the protected roster table and is not copied into diagnostic response records.</p></article>
        </div>
        <aside className={styles.note}><b>Instructor privacy</b><p>The private class-management information is saved in the instructor&apos;s browser and should not be shared with learners.</p></aside>
      </section>

      <section id="records">
        <div className={styles.sectionHeading}><span>03</span><div><h2>Information used for a shared attempt</h2><p>When optional sharing is selected, PhySense stores the learning information needed to calculate results and class summaries.</p></div></div>
        <ul className={styles.fieldGrid}>{storedFields.map(field => <li key={field}>{field}</li>)}</ul>
        <aside className={styles.note}><b>Pseudonymous, not identified by name</b><p>A random participant code can connect attempts made in the same browser. It is not a verified identity, but it means shared attempts should not be described as completely anonymous.</p></aside>
      </section>

      <footer><p>Students can review this information before deciding whether to share a completed diagnostic attempt.</p><Link href="/block-1/1-1">Return to Lesson 1.1 →</Link></footer>
    </main>
  </div>;
}
