'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styles from './SimpleDefinition.module.css';

export default function SimpleDefinition({term,definition}:{term:string;definition:string}){
  const [open,setOpen]=useState(false),id=useId(),wrapperRef=useRef<HTMLSpanElement>(null);
  useEffect(()=>{if(!open)return;const close=(event:KeyboardEvent|MouseEvent)=>{if(event instanceof KeyboardEvent&&event.key==='Escape')setOpen(false);if(event instanceof MouseEvent&&!wrapperRef.current?.contains(event.target as Node))setOpen(false)};document.addEventListener('keydown',close);document.addEventListener('mousedown',close);return()=>{document.removeEventListener('keydown',close);document.removeEventListener('mousedown',close)}},[open]);
  return <span ref={wrapperRef} className={styles.wrapper}><button type="button" className={styles.term} aria-expanded={open} aria-describedby={open?id:undefined} onClick={()=>setOpen(value=>!value)}>{term}<span aria-hidden="true">?</span></button>{open&&<span id={id} className={styles.definition} role="note"><b>{term} means:</b>{definition}<button type="button" aria-label={`Close ${term} definition`} onClick={()=>setOpen(false)}>×</button></span>}</span>;
}
