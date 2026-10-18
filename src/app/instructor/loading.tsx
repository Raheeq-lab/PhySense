import styles from '../classroom.module.css';

export default function InstructorLoading(){return <main className={styles.page} data-instructor-page><div className={styles.shell}><div className={styles.top}><span className={styles.brand}>PhySense</span></div><section data-instructor-loading role="status" aria-live="polite"><span className={styles.eyebrow}>Instructor workspace</span><h1>Loading your workspace…</h1><p>Checking your secure instructor session and preparing your class data.</p><div><i/><i/><i/></div></section></div></main>}
