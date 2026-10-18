import type {Metadata} from 'next';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import LoginForm from './login-form';
import styles from '../login.module.css';
import {getInstructor} from '@/lib/instructor-auth';

export const metadata:Metadata={title:'Instructor login | PhySense',description:'Sign in to manage PhySense classes and diagnostic reports.'};

export default async function InstructorLoginPage(){if(await getInstructor())redirect('/instructor');return <main className={styles.page}><div className={styles.shell}>
  <div className={styles.top}><Link href="/">PhySense</Link><Link href="/">← Home</Link></div>
  <section className={styles.card}><span>INSTRUCTOR ACCESS</span><h1>Sign in</h1><p>Use your instructor email and password.</p><LoginForm/><div className={styles.registerPrompt}><span>New to PhySense?</span><Link href="/instructor/register/">Create instructor account</Link></div></section>
</div></main>}
