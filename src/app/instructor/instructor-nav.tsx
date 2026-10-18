import Link from 'next/link';
import styles from './login.module.css';

const links=[
  ['Home','/'],
  ['User Guides','/block-1'],
  ['Assessments','/diagnostic-map'],
  ['Reports','/instructor/reports'],
  ['Research','/participant-tracking'],
  ['About','/data-and-privacy'],
  ['News','/news'],
] as const;

export default function InstructorNav(){
  return <header className={styles.siteNav}>
    <Link className={styles.navBrand} href="/">PhySense<span>Physics learning platform</span></Link>
    <nav aria-label="Main navigation">{links.map(([label,href])=><Link href={href} key={href}>{label}</Link>)}</nav>
    <Link className={styles.navAccount} href="/instructor/login">Sign up / Log in</Link>
  </header>;
}
