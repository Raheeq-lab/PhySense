'use client';
import {useRef, type ReactNode} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function GuideMotion({children}: {children: ReactNode}) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('[data-guide-step]').forEach(card => {
        gsap.from(card, {y:18, duration:.55, ease:'power2.out', scrollTrigger:{trigger:card, start:'top 92%', once:true}});
      });
    });
    media.add('(min-width: 1001px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.create({trigger:'[data-guide-index]', start:'top 40px', endTrigger:'[data-guide-step]:last-child', end:'bottom bottom', pin:true, pinSpacing:false});
    });
    return () => media.revert();
  }, {scope});
  return <div ref={scope}>{children}</div>;
}
