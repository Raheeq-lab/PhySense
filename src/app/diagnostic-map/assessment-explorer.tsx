'use client';

import {useRef, useState} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {Search, ArrowRight} from 'lucide-react';
import Link from 'next/link';
import type {DiagnosticItem} from '@/data/kinematicsDiagnostic';
import styles from './page.module.css';

gsap.registerPlugin(useGSAP);
type Mapping = Record<string,{attributes:string[];interaction:string;reassessment:string}>;
const filters = [['all','All questions'],['A1','Position & velocity'],['A2','Graphs'],['A3','Acceleration'],['A4','2D motion'],['A5','Gravity'],['A6','Stopping distance']];

export default function AssessmentExplorer({items,reviewMap}:{items:DiagnosticItem[];reviewMap:Mapping}) {
  const [filter,setFilter] = useState('all');
  const [search,setSearch] = useState('');
  const scope = useRef<HTMLDivElement>(null);
  const visible = items.filter(item => (filter==='all'||reviewMap[item.id].attributes.includes(filter)) && `${item.concept} ${item.prompt} ${item.id}`.toLowerCase().includes(search.trim().toLowerCase()));
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from('[data-question-preview]',{y:8,duration:.25,stagger:.025,ease:'power2.out'});
  }, {scope, dependencies:[filter,search], revertOnUpdate:true});

  return <section id="questions" className={styles.explorer} aria-labelledby="questions-title">
    <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Inside the diagnostic</p><h2 id="questions-title">Explore the questions.</h2><p>Choose a concept and open a question to take a closer look.</p></div><label className={styles.search}><Search size={17} aria-hidden="true"/><span className={styles.srOnly}>Search questions</span><input type="search" value={search} onChange={event=>setSearch(event.target.value)} placeholder="Search questions"/></label></div>
    <div className={styles.filters} role="group" aria-label="Filter by concept">{filters.map(([value,label])=><button key={value} type="button" aria-pressed={filter===value} onClick={()=>setFilter(value)}>{label}</button>)}</div>
    <p className={styles.resultCount} role="status" aria-live="polite">{visible.length} of {items.length} questions <span>Preview only · answers are tucked away</span></p>
    <div ref={scope} className={styles.questionList}>{visible.map(item=><details key={item.id} className={styles.question} data-question-preview>
      <summary><span className={styles.questionNumber}>{String(items.indexOf(item)+1).padStart(2,'0')}</span><span><strong>{item.concept}</strong><span className={styles.questionPrompt}>{item.prompt}</span></span><span className={styles.expand} aria-hidden="true">+</span></summary>
      <div className={styles.questionBody}><p className={styles.choiceHeading}>Answer choices</p><ol className={styles.choices} type="A">{item.answers.map(option=><li key={option.label}>{option.label}</li>)}</ol><p className={styles.previewNote}>To choose an answer and save your progress, <Link href="/block-1/1-1#assessment">open the live assessment <ArrowRight size={13} aria-hidden="true"/></Link>.</p>
        <details className={styles.answer}><summary>Show answer & teaching notes<span aria-hidden="true">+</span></summary><dl><div><dt>Correct answer</dt><dd>{item.answers[item.correctAnswer].label}</dd></div><div><dt>Reasoning</dt><dd>{item.reasons[item.correctReason].label}</dd></div><div><dt>Why it works</dt><dd>{item.explanation}</dd></div><div><dt>Misconception to revisit</dt><dd>{item.misconception}</dd></div><div><dt>Suggested activity</dt><dd>{reviewMap[item.id].interaction}</dd></div><div><dt>Try next</dt><dd>{reviewMap[item.id].reassessment}</dd></div></dl></details>
      </div>
    </details>)}</div>
    {visible.length===0&&<div className={styles.empty}><h3>No questions match yet.</h3><p>Try another word or clear your filters to see all ten questions.</p><button type="button" onClick={()=>{setSearch('');setFilter('all')}}>Clear filters</button></div>}
  </section>;
}
