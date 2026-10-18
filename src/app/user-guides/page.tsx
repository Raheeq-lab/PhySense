import type {Metadata} from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata:Metadata={title:'Educator user guide | PhySense',description:'A simple guide for professors and teachers using PhySense.'};

const steps=[
  ['1','Create an instructor account','Register with your name, institution, email, and password. After signing in, your private instructor workspace opens.'],
  ['2','Create a class','Enter a class title and create a class code for the available physics lesson. Each class belongs only to your account.'],
  ['3','Invite your students','Paste student emails or upload a CSV roster. PhySense creates one personal invitation link for each student.'],
  ['4','Teach and assess','Students open their invitation, study the lesson, and complete the diagnostic assessment with consent.'],
  ['5','Review the results','Open Reports to see class-level hardest questions, concept mastery, and downloadable CSV data.'],
] as const;

export default function UserGuidesPage(){return <main className={styles.page}><div className={styles.shell}>
  <header className={styles.top}><Link href="/">PhySense</Link><Link href="/">← Home</Link></header>
  <section className={styles.hero}><span>USER GUIDE FOR EDUCATORS</span><h1>How professors and teachers use PhySense</h1><p>A quick guide from creating your account to reviewing student understanding.</p><div className={styles.actions}><Link href="/instructor/register">Create instructor account</Link><Link href="/instructor/login">Instructor sign in</Link></div></section>
  <section className={styles.steps} aria-label="Educator workflow">{steps.map(([number,title,description])=><article key={number}><b>{number}</b><div><h2>{title}</h2><p>{description}</p></div></article>)}</section>
  <aside className={styles.note}><strong>Student privacy</strong><p>Diagnostic responses are pseudonymous. Roster emails are kept separately from assessment responses, and instructors only see data for classes they created.</p><Link href="/data-and-privacy">Read about data and privacy →</Link></aside>
</div></main>}
