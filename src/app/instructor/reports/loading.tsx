'use client';

import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {GeistSans} from 'geist/font/sans';
import styles from './loading.module.css';

export default function ReportsLoading(){
  const scope=useRef<HTMLElement>(null);
  useGSAP(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    gsap.from('[data-loading-reveal]',{opacity:0,y:14,duration:.55,stagger:.07,ease:'power3.out'});
    gsap.from('[data-loading-card]',{opacity:0,y:22,scale:.985,duration:.65,stagger:.08,delay:.12,ease:'power3.out'});
    gsap.to('[data-loading-shimmer]',{backgroundPosition:'-200% 0',duration:1.5,repeat:-1,ease:'none'});
  },{scope});

  return <main ref={scope} className={`${styles.page} ${GeistSans.variable}`} aria-busy="true"><div className={styles.shell}>
    <nav className={styles.topbar} data-loading-reveal><span className={styles.brand}>PhySense <small>Instructor intelligence</small></span><span className={styles.secure}>Secure reports</span></nav>
    <header className={styles.hero}><div data-loading-reveal><p>Instructor reports</p><h1>Preparing your class performance.</h1><span>Loading the latest attempts, responses, and learning signals.</span></div><div className={styles.activity} data-loading-reveal aria-hidden="true"><i/><i/><i/><i/></div></header>
    <section className={styles.metrics} aria-hidden="true">{['Joint accuracy','Attempts','Responses','Average session'].map(label=><article data-loading-card key={label}><span>{label}</span><i data-loading-shimmer/></article>)}</section>
    <section className={styles.card} data-loading-card aria-hidden="true"><div><span/><i data-loading-shimmer/></div><div className={styles.table}><i data-loading-shimmer/><i data-loading-shimmer/><i data-loading-shimmer/><i data-loading-shimmer/></div></section>
    <section className={styles.card} data-loading-card aria-hidden="true"><div><span/><i data-loading-shimmer/></div><div className={styles.table}><i data-loading-shimmer/><i data-loading-shimmer/><i data-loading-shimmer/></div></section>
    <p className={styles.status} data-loading-reveal role="status" aria-live="polite">Checking your secure instructor session and preparing report data.</p>
  </div></main>;
}
