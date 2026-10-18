'use client';

import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP,ScrollTrigger);

export default function ReportsMotion({children}:{children:React.ReactNode}){
  const scope=useRef<HTMLDivElement>(null);
  useGSAP(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    gsap.from('[data-hero-copy] > *',{opacity:0,y:24,duration:.8,stagger:.08,ease:'power3.out'});
    gsap.from('[data-metric]',{opacity:0,y:28,scale:.97,duration:.75,stagger:.09,delay:.18,ease:'power3.out'});
    gsap.utils.toArray<HTMLElement>('[data-word]').forEach((word,index)=>gsap.fromTo(word,{opacity:.16},{opacity:1,ease:'none',scrollTrigger:{trigger:'[data-insight]',start:`top ${82-index*2}%`,end:`top ${54-index*2}%`,scrub:true}}));
    gsap.utils.toArray<HTMLElement>('[data-report-card]').forEach((card,index)=>{
      gsap.fromTo(card,{y:70,opacity:.35,scale:.975},{y:0,opacity:1,scale:1,ease:'none',scrollTrigger:{trigger:card,start:'top 92%',end:'top 64%',scrub:.7}});
      gsap.set(card,{zIndex:index+1});
    });
  },{scope});
  return <div ref={scope}>{children}</div>;
}
