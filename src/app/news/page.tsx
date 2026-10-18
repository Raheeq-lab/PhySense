import type {Metadata} from 'next';
import Link from 'next/link';
import InstructorNav from '@/app/instructor/instructor-nav';
import styles from '@/app/instructor/login.module.css';

export const metadata:Metadata={title:'News | PhySense',description:'Updates from the PhySense physics learning platform.'};

export default function NewsPage(){return <main className={styles.page}><InstructorNav/><div className={`${styles.shell} ${styles.newsShell}`}>
  <section className={styles.card}><span>PHYSENSE NEWS</span><h1>What&apos;s new</h1><p>Product and teaching updates from the PhySense learning platform.</p><div className={styles.newsList}>
    <article><time dateTime="2026-10-18">18 October 2026</time><h2>Instructor accounts and student invitations</h2><p>Educators can now create protected accounts, generate personal student invitation links, and review class-level diagnostic reports.</p><Link href="/instructor/register">Create an instructor account →</Link></article>
    <article><time dateTime="2026-10-18">18 October 2026</time><h2>Professional instructor profiles</h2><p>Instructor workspaces now include the educator&apos;s name and university or institution.</p><Link href="/instructor/login">Open instructor access →</Link></article>
  </div></section>
</div></main>}
