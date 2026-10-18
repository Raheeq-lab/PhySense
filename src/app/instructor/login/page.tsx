import type {Metadata} from 'next';
import Link from 'next/link';
import LoginForm from './login-form';
import styles from '../login.module.css';

export const metadata:Metadata={title:'Instructor login | PhySense',description:'Sign in to manage PhySense classes and diagnostic reports.'};

export default function InstructorLoginPage(){return <main className={styles.page}><div className={styles.shell}>
  <div className={styles.top}><Link href="/">PhySense</Link><Link href="/">← Home</Link></div>
  <section className={styles.card}><span>INSTRUCTOR ACCESS</span><h1>Sign in</h1><p>Use your instructor email and password.</p><LoginForm/><p>Need an account? <Link href="/instructor/register/">Register as an instructor</Link>.</p></section>
</div></main>}
