'use client';

import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {GeistSans} from 'geist/font/sans';
import styles from './reports/loading.module.css';

export default function InstructorLoading(){
  const scope=useRef<HTMLElement>(null);
  useGSAP(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    gsap.to('[data-loading-shimmer]',{backgroundPosition:'-200% 0',duration:1.5,repeat:-1,ease:'none'});
  },{scope});

  return <main ref={scope} className={`${styles.page} ${GeistSans.variable}`} aria-busy="true"><div className={styles.shell}>
    <nav className={styles.topbar} data-loading-reveal><span className={styles.brand}>PhySense <small>Instructor workspace</small></span><span className={styles.secure}>Secure session</span></nav>
    <header className={styles.hero}><div data-loading-reveal><p>Instructor workspace</p><h1>Preparing your class dashboard.</h1><span>Loading classes, learning signals, and roster tools.</span></div><div className={styles.activity} data-loading-reveal aria-hidden="true"><i/><i/><i/><i/></div></header>
    <section className={styles.metrics} aria-hidden="true">{['Active classes','Learners','Attempts','Class status'].map(label=><article data-loading-card key={label}><span>{label}</span><i data-loading-shimmer/></article>)}</section>
    <section className={styles.card} data-loading-card aria-hidden="true"><div><span/><i data-loading-shimmer/></div><div className={styles.table}><i data-loading-shimmer/><i data-loading-shimmer/><i data-loading-shimmer/></div></section>
    <p className={styles.status} data-loading-reveal role="status" aria-live="polite">Checking your secure instructor session and preparing class data.</p>
  </div></main>;
}
