import Link from 'next/link';
import AdvancedPillarLab from './AdvancedPillarLab';
import type {AdvancedLesson} from '@/lib/block4';
import styles from './AdvancedLessonPage.module.css';

const course=[['Home','/'],['Block 1','/block-1'],['Block 2','/block-2'],['Block 3','/block-3'],['Block 4','/block-4'],['Math Spark','/math-spark'],['Reference','/reference']] as const;
const sections=[['Picture this','picture'],['Interactive lab','lab'],['Build the idea','ideas'],['Core equations','equations'],['Question answered','answer'],['Challenge','challenge']] as const;

export default function AdvancedLessonPage({lesson}:{lesson:AdvancedLesson}){
  return <div className={styles.page} id="top"><aside className={styles.sidebar}><Link className={styles.brand} href="/">PhySense<small>A field guide to physical law.</small></Link><nav>{course.map(([label,href])=><Link key={href} className={label==='Block 4'?styles.active:''} href={href}><span>{label==='Block 4'?'04':'·'}</span>{label}</Link>)}</nav><div className={styles.learning}><small>NOW LEARNING</small><b>{lesson.title}</b><p>{lesson.short}</p></div></aside>
    <main className={styles.main}><header><span>Block 4 · Lesson {lesson.number} · {lesson.level}</span><h1>{lesson.title}</h1><p>{lesson.short}. Build the physical picture first, then connect it to the advanced mathematical structure.</p></header>
      <section id="picture"><h2>Picture this</h2><p>{lesson.picture}</p><div className={styles.question}><span>QUESTION TO HOLD</span><b>{lesson.question}</b></div></section>
      <section id="lab"><h2>Interactive laboratory</h2><p>Change one variable at a time and connect the visual response to the live calculation.</p><AdvancedPillarLab lesson={lesson}/></section>
      <section id="ideas"><h2>Build the idea</h2><div className={styles.ideas}>{lesson.ideas.map((idea,index)=><article key={idea.title}><span>{index+1}</span><div><h3>{idea.title}</h3><p>{idea.body}</p></div></article>)}</div></section>
      <section id="equations"><h2>Core equations</h2><div className={styles.equations}>{lesson.equations.map((equation,index)=><article key={equation.formula}><span>{index+1}</span><div><b role="math">{equation.formula}</b><p>{equation.meaning}</p></div></article>)}</div></section>
      <section id="answer"><h2>Hold this question — answered</h2><div className={styles.answer}><b>{lesson.question}</b><p>{lesson.takeaway}</p></div></section>
      <section id="challenge"><h2>Try the challenge</h2><div className={styles.challenge}><span>USE THE LAB</span><p>{lesson.challenge}</p></div></section>
      <nav className={styles.next}>{lesson.next?<Link href={`/block-4/${lesson.next}`}><span>Continue through Block 4</span><b>Next advanced pillar →</b></Link>:<Link href="/block-4"><span>Block 4 complete</span><b>Return to the overview →</b></Link>}</nav>
    </main><aside className={styles.onPage}><span>ON THIS PAGE</span><nav>{sections.map(([label,id])=><a key={id} href={`#${id}`}>{label}</a>)}</nav><Link href="/block-4">← Block 4 overview</Link></aside>
  </div>
}
