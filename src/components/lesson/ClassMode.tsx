'use client';

import {useRouter} from 'next/navigation';
import {useSyncExternalStore,type ReactNode} from 'react';

type Classroom={id:string;code:string;title:string;lessonId:string};
const KEY='physense.classroom';
const EVENT='physense-classroom-change';

function subscribe(listener:()=>void){window.addEventListener('storage',listener);window.addEventListener(EVENT,listener);return()=>{window.removeEventListener('storage',listener);window.removeEventListener(EVENT,listener)}}
function snapshot(){return localStorage.getItem(KEY)??''}
function serverSnapshot(){return ''}
function useClassroom(){const value=useSyncExternalStore(subscribe,snapshot,serverSnapshot);try{const classroom=JSON.parse(value) as Classroom|null;return classroom?.code&&classroom.lessonId==='block-1/1-1'?classroom:null}catch{return null}}

export function ClassAwareNavigation({children,className}:{children:ReactNode;className:string}){
  const router=useRouter();
  const classroom=useClassroom();
  if(!classroom)return children;
  const leave=()=>{localStorage.removeItem(KEY);window.dispatchEvent(new Event(EVENT));router.push('/')};
  return <div className={className}>
    <span>CLASS MODE</span>
    <h2>{classroom.title}</h2>
    <p>Class code <b>{classroom.code}</b></p>
    <nav aria-label="Assigned class content"><a href="#top" aria-current="page"><b>Lesson 1.1</b><small>Kinematics · Motion in 1D &amp; 2D</small></a><a href="#challenge"><b>Diagnostic challenge</b><small>Answer, reasoning, and confidence</small></a></nav>
    <button type="button" onClick={leave}>Leave class mode</button>
  </div>;
}

export function PublicOnly({children}:{children:ReactNode}){return useClassroom()?null:children}

export function ClassModeHeader(){const classroom=useClassroom();return classroom?<div role="status" style={{display:'flex',justifyContent:'space-between',gap:12,marginBottom:24,padding:'12px 14px',borderRadius:8,background:'#e6eafb',color:'#3049a4',fontSize:12}}><b>{classroom.title}</b><span>Class {classroom.code} · Assigned Lesson 1.1</span></div>:null}
