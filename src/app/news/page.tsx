import type {Metadata} from 'next';
import Link from 'next/link';
import {GeistSans} from 'geist/font/sans';
import {ArrowRight, Users, UserRound, BookOpen, ChartNoAxesCombined} from 'lucide-react';
import NewsMotion from './news-motion';
import styles from './page.module.css';

export const metadata:Metadata={title:'News | PhySense',description:'Product and teaching updates from the PhySense physics learning platform.'};

export default function NewsPage(){
  return <main className={`${styles.page} ${GeistSans.className}`}><NewsMotion><div className={styles.shell}>
    <header className={styles.nav}><Link className={styles.brand} href="/">PhySense<span>News</span></Link><nav aria-label="News navigation"><Link href="/data-and-privacy">About</Link><Link href="/instructor">Instructor workspace <ArrowRight size={15} aria-hidden="true"/></Link></nav></header>
    <header className={styles.hero}><p className={styles.eyebrow}>From PhySense</p><h1>Small updates.<br/>More room to learn.</h1><p className={styles.lead}>The latest product and teaching updates, with a clear path to try what’s new.</p></header>
    <section aria-label="Product announcements" className={styles.updates}>
      <article className={styles.featured} data-news-card><div className={styles.featureCopy}><div className={styles.meta}><span>For educators</span><time dateTime="2026-10-18">18 October 2026</time></div><h2>Bring your class<br/>into PhySense.</h2><p>Educators can now create protected accounts, generate personal student invitation links, and review class-level diagnostic reports.</p><Link className={styles.primary} href="/instructor/register">Create an instructor account <ArrowRight size={16} aria-hidden="true"/></Link><details className={styles.details}><summary>What’s included<span aria-hidden="true">+</span></summary><ul><li>A protected instructor account for managing your classes.</li><li>Personal invitation links generated from your student roster.</li><li>Class reports to explore shared diagnostic results.</li></ul></details></div><div className={styles.featureVisual} aria-label="Instructor accounts, invitations, and reports"><div className={styles.visualHeading}>Your teaching workspace</div>{[{icon:UserRound,title:'Your account',text:'A workspace for your classes.'},{icon:Users,title:'Your learners',text:'Personal invitations, ready to share.'},{icon:ChartNoAxesCombined,title:'Your class insights',text:'See the thinking behind the answers.'}].map(({icon:Icon,title,text})=><div className={styles.visualRow} key={title}><span><Icon size={22} aria-hidden="true"/></span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div></article>
      <article className={styles.update} data-news-card><span className={styles.updateIcon}><UserRound size={25} aria-hidden="true"/></span><div><div className={styles.meta}><span>Instructor profiles</span><time dateTime="2026-10-18">18 October 2026</time></div><h2>A workspace that feels like yours.</h2><p>Instructor workspaces now include the educator’s name and university or institution.</p><Link className={styles.textLink} href="/instructor/login">Open instructor access <ArrowRight size={16} aria-hidden="true"/></Link></div></article>
    </section>
    <section className={styles.guide} aria-labelledby="guide-title"><BookOpen size={27} aria-hidden="true"/><div><h2 id="guide-title">New here? Start with the guide.</h2><p>From creating your first class to understanding the results.</p></div><Link href="/user-guides">Read the user guide <ArrowRight size={16} aria-hidden="true"/></Link></section>
    <footer className={styles.footer}><Link href="/">PhySense</Link><span>Built for curiosity. Made for understanding.</span><Link href="/data-and-privacy">About & privacy</Link></footer>
  </div></NewsMotion></main>;
}
