import Link from 'next/link';
import styles from './login.module.css';

export default function AccessDenied(){return <main className={styles.page}><div className={styles.shell}><div className={styles.top}><Link href="/">PhySense</Link><Link href="/">← Home</Link></div><section className={styles.card}><span>INSTRUCTOR ACCESS</span><h1>Access denied</h1><p>You must sign in with an approved instructor account before viewing this page.</p><Link href="/instructor/login/">Go to instructor login →</Link></section></div></main>}
