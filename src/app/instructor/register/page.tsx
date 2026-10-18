import type {Metadata} from 'next';
import Link from 'next/link';
import RegisterForm from './register-form';
import InstructorNav from '../instructor-nav';
import styles from '../login.module.css';

export const metadata:Metadata={title:'Create instructor account | PhySense',description:'Register for a PhySense instructor account.'};

export default function InstructorRegisterPage(){return <main className={styles.page}><InstructorNav/><div className={styles.shell}>
  <section className={styles.card}><span>INSTRUCTOR REGISTRATION</span><h1>Create account</h1><p>Register with an email and password to create classes and view their diagnostic reports.</p><RegisterForm/><p>Already registered? <Link href="/instructor/login/">Sign in</Link>.</p></section>
</div></main>}
