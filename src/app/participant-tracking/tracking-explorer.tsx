'use client';
import {useRef,useState} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ArrowRight,Monitor,Link2,Unlink} from 'lucide-react';
import styles from './page.module.css';
gsap.registerPlugin(useGSAP);

const scenarios=[
  {label:'Same browser',code:'Browser A',linked:true,title:'The browser code stays the same.',text:'A later attempt reuses the saved participant code. Pre- and post-lesson attempts can be connected, as long as the browser’s site data remains available.',note:'This connects browser activity; it does not verify the person using it.'},
  {label:'Another device',code:'Browser B',linked:false,title:'A different browser means a different code.',text:'The same learner receives a new participant code on another browser or device. The participant code alone cannot connect the two histories.',note:'A learner can have more than one browser code.'},
  {label:'Shared device',code:'Browser A',linked:true,title:'Different learners can share one code.',text:'If learners use the same browser profile, their attempts may carry the same participant code—even though different people completed them.',note:'A linked history is not necessarily one learner’s history.'},
  {label:'Cleared storage',code:'New code',linked:false,title:'Clearing site data starts a new history.',text:'Removing the site’s local storage deletes the saved participant code. The diagnostic creates a new code the next time it loads.',note:'The participant code alone cannot reconnect the old and new histories.'},
  {label:'Private browsing',code:'New session',linked:false,title:'The code usually lasts for the private session.',text:'A private session normally loses its stored code when the session ends. A later private session creates a new code.',note:'Tracking across private sessions is not reliable.'},
];

export default function TrackingExplorer(){
  const [selected,setSelected]=useState(0);
  const scope=useRef<HTMLDivElement>(null);
  const scenario=scenarios[selected];
  useGSAP(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    gsap.from('[data-scenario]',{y:8,duration:.3,ease:'power2.out'});
  },{scope,dependencies:[selected],revertOnUpdate:true});
  return <section id="explore" className={styles.explorer} aria-labelledby="explorer-title"><div className={styles.heading}><p className={styles.eyebrow}>Try a scenario</p><h2 id="explorer-title">What happens if…?</h2><p>Choose a situation to see what the browser code can—and cannot—connect.</p></div><div className={styles.scenarios} role="group" aria-label="Browser scenarios">{scenarios.map((item,index)=><button key={item.label} type="button" aria-pressed={selected===index} aria-controls="scenario-result" onClick={()=>setSelected(index)}>{item.label}</button>)}</div>
    <div ref={scope} className={styles.scenarioPanel}><div className={styles.diagram} aria-label={scenario.linked?'Illustration: attempts carry the same browser code':'Illustration: attempts carry different browser codes'}><p>Illustrative example</p><div className={styles.diagramFlow}><div><Monitor size={24} aria-hidden="true"/><strong>Earlier attempt</strong><span>Browser A</span></div><span className={styles.connector} data-linked={scenario.linked}>{scenario.linked?<Link2 size={24} aria-hidden="true"/>:<Unlink size={24} aria-hidden="true"/>}<ArrowRight size={17} aria-hidden="true"/></span><div><Monitor size={24} aria-hidden="true"/><strong>Later attempt</strong><span>{scenario.code}</span></div></div><span className={styles.diagramCaption}>{scenario.linked?'Same participant code':'Different participant codes'}</span></div><div id="scenario-result" className={styles.scenarioCopy} aria-live="polite" aria-atomic="true"><div data-scenario><h3>{scenario.title}</h3><p>{scenario.text}</p><div className={styles.note}>{scenario.note}</div></div></div></div>
  </section>;
}
