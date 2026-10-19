'use client';
import {useRef,type ReactNode} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(useGSAP,ScrollTrigger);

export default function NewsMotion({children}:{children:ReactNode}){
  const scope=useRef<HTMLDivElement>(null);
  useGSAP(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    gsap.utils.toArray<HTMLElement>('[data-news-card]').forEach(card=>{
      gsap.from(card,{y:16,duration:.5,ease:'power2.out',scrollTrigger:{trigger:card,start:'top 94%',once:true}});
    });
  },{scope});
  return <div ref={scope}>{children}</div>;
}
