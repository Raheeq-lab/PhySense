import Link from 'next/link';
import styles from './hub.module.css';

type IconName = 'home' | 'atom' | 'wave' | 'orbit' | 'bolt' | 'function' | 'bookmark' | 'arrow-up' | 'chevron-right' | 'arrow-right';

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    home: <path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />,
    atom: <><circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/></>,
    wave: <path d="M2 12c3-8 5 8 8 0s5 8 8 0 4 0 4 0"/>,
    orbit: <><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><circle cx="18.5" cy="7.5" r="1.5"/></>,
    bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7z"/>,
    function: <path d="M15 3c-4 0-4 4-5 9s-1 9-5 9m2-9h8m2-4 4 8m0-8-4 8"/>,
    bookmark: <path d="M6 3h12v18l-6-4-6 4z"/>,
    'arrow-up': <path d="M12 20V4m-6 6 6-6 6 6"/>,
    'chevron-right': <path d="m9 5 7 7-7 7"/>,
    'arrow-right': <path d="M4 12h16m-6-6 6 6-6 6"/>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

const primaryNav: [IconName, string, string, string][] = [
  ['home', 'Home', '', '/'], ['atom', 'Block 1', 'The Intuition & Calculus Spark', '/block-1'],
  ['wave', 'Block 2', 'Fields, Waves, and Math Tools', '/block-2'], ['orbit', 'Block 3', 'The Intermediate Bridge', '/block-3'],
  ['bolt', 'Block 4', 'The Advanced Pillars', '/block-4'], ['function', 'Math Spark', 'Calculus, ODEs, Linear Algebra', '/math-spark'],
  ['bookmark', 'Reference', 'Equations & constants', '/reference'],
];

const lessons = [
  ['1.1', 'Kinematics', 'Motion in 1D & 2D', '1-1'], ['1.2', 'Forces', 'Why motion changes', '1-2'],
  ['1.3', 'Circular', 'Turning without slowing', '1-3'], ['1.4', 'Energy', 'The currency of the universe', '1-4'],
  ['1.5', 'Momentum', 'Collisions and recoil', '1-5'], ['1.6', 'Math Spark', 'The calculus underneath', '1-6'],
] as const;

function PageNav() {
  return <>
    <span className={styles.sideEyebrow}>On this page</span>
    <nav className={styles.pageNav} aria-label="Block 1 lessons">
      <Link className={styles.active} href="#top"><Icon name="arrow-up"/><span>Block 1 overview</span></Link>
      {lessons.map(([number, title, , slug]) => <Link key={number} href={`/block-1/${slug}`}><span className={styles.navNumber}>{number}</span><span>{title}</span></Link>)}
    </nav>
    <div className={styles.divider}/>
    <section className={styles.progress} aria-label="Block 1 progress"><span>Your progress</span><strong>0 / 6 completed</strong><div className={styles.progressTrack}><i/></div></section>
  </>;
}

export default function BlockOneHub() {
  return <div className={styles.page} id="top">
    <aside className={styles.primarySidebar}>
      <Link href="/" className={styles.brand}>PhySense<small>A field guide to physical law.</small></Link>
      <nav aria-label="Primary navigation">{primaryNav.map(([icon, label, sub, href]) => <Link key={label} href={href} className={label === 'Block 1' ? styles.current : ''} aria-current={label === 'Block 1' ? 'page' : undefined}><Icon name={icon}/><span>{label}{sub && <small>{sub}</small>}</span></Link>)}</nav>
    </aside>

    <div className={styles.shell}>
      <main className={styles.content}>
        <header className={styles.header}><span className={styles.eyebrow}>Block 1 · Foundation</span><h1>The Intuition &amp; Calculus Spark</h1><div className={styles.tags}><span>Mechanics</span><span>Calculus</span><span>6 lessons</span></div></header>
        <section className={styles.description} aria-label="About Block 1"><p>Build physical reality with your hands — motion, forces, spin, energy, collisions — then learn the calculus that describes all of it.</p><p>Six lessons. No prerequisites beyond middle-school math. Each lesson has an interactive lab, one real-world challenge, and a Math Spark section for the deeper view.</p></section>
        <section className={styles.lessonSection}><h2>What you&apos;ll learn</h2><div className={styles.lessonList}>{lessons.map(([number, title, description, slug]) => <Link className={styles.lessonCard} href={`/block-1/${slug}`} key={number}><span className={styles.badge}>{number}</span><span className={styles.lessonCopy}><strong>{title}</strong><small>{description}</small></span><Icon name="chevron-right"/></Link>)}</div></section>
        <Link className={styles.callout} href="/block-1/1-1"><Icon name="arrow-right"/><span>Begin at Lesson 1.1 — Kinematics</span></Link>
        <Link className={styles.cta} href="/block-1/1-1">Start Block 1</Link>
        <p className={styles.note}>Six lessons. Take them in order.</p>
        <details className={styles.mobilePageNav}><summary>Block 1 navigation</summary><div><PageNav/></div></details>
      </main>
      <aside className={styles.rightSidebar}><PageNav/></aside>
    </div>
  </div>;
}
