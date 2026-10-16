'use client';
import {useMemo,useState,type CSSProperties} from 'react';
import FocusLab from './FocusLab';
import type {AdvancedLesson} from '@/lib/block4';
import styles from './AdvancedPillarLab.module.css';

const clamp=(value:number,min=0,max=100)=>Math.min(max,Math.max(min,value));

export default function AdvancedPillarLab({lesson}:{lesson:AdvancedLesson}){
  const[a,setA]=useState(50),[b,setB]=useState(50);
  const result=useMemo(()=>{
    switch(lesson.labKind){
      case'mechanics':{const mass=.5+a/20,stiffness=5+b*.95,amplitude=.7;const omega=Math.sqrt(stiffness/mass);return{headline:`${(2*Math.PI/omega).toFixed(2)} s`,label:'Oscillation period',detail:`ω = ${omega.toFixed(2)} rad/s · E = ${(.5*stiffness*amplitude**2).toFixed(1)} J`,first:'Mass',firstValue:`${mass.toFixed(1)} kg`,second:'Stiffness',secondValue:`${stiffness.toFixed(0)} N/m`,x:clamp(50+(a-b)*.28)}}
      case'fields':{const electric=10+a*4.9,frequency=.2+b*.098,magnetic=electric/299792458*1e6,intensity=.5*8.854e-12*299792458*electric**2;return{headline:`${intensity.toFixed(1)} W/m²`,label:'Average intensity',detail:`B₀ = ${magnetic.toFixed(3)} μT · λ = ${(299792458/(frequency*1e9)).toFixed(2)} m`,first:'Electric amplitude',firstValue:`${electric.toFixed(0)} V/m`,second:'Frequency',secondValue:`${frequency.toFixed(1)} GHz`,x:frequency*9}}
      case'statistics':{const temperature=100+a*14, gap=.02+b*.0098,ratio=Math.exp(-gap/(8.617333e-5*temperature)),excited=ratio/(1+ratio);return{headline:`${(excited*100).toFixed(1)}%`,label:'Excited population',detail:`P₁/P₀ = ${ratio.toFixed(3)} · ground = ${((1-excited)*100).toFixed(1)}%`,first:'Temperature',firstValue:`${temperature.toFixed(0)} K`,second:'Energy gap',secondValue:`${gap.toFixed(2)} eV`,x:excited*100}}
      case'gravity':{const mass=.5+a*.195,radius=1.15+b*.0885,rs=2.953*mass,factor=Math.sqrt(1-1/radius);return{headline:`${factor.toFixed(3)}×`,label:'Nearby clock rate',detail:`rₛ = ${rs.toFixed(1)} km · clock radius = ${(radius*rs).toFixed(1)} km`,first:'Central mass',firstValue:`${mass.toFixed(1)} M☉`,second:'Radius',secondValue:`${radius.toFixed(1)} rₛ`,x:clamp((radius-1)*11)}}
      case'quantum':{const energy=.5+a*.035,height=5,width=.05+b*.0095;const transmission=Math.exp(-2*5.123*Math.sqrt(height-energy)*width);return{headline:`${(transmission*100).toFixed(3)}%`,label:'Transmission estimate',detail:`E = ${energy.toFixed(2)} eV · V₀ = ${height.toFixed(2)} eV`,first:'Particle energy',firstValue:`${energy.toFixed(2)} eV`,second:'Barrier width',secondValue:`${width.toFixed(2)} nm`,x:clamp(transmission*100)}}
      case'nuclear':{const halfLife=1+a*.19,time=b*.1,remaining=100*2**(-time/halfLife),lambda=Math.log(2)/halfLife;return{headline:`${remaining.toFixed(1)}%`,label:'Nuclei remaining',detail:`t½ = ${halfLife.toFixed(1)} y · activity = ${(lambda*remaining).toFixed(2)}%/y`,first:'Half-life',firstValue:`${halfLife.toFixed(1)} years`,second:'Elapsed time',secondValue:`${time.toFixed(1)} years`,x:remaining}}
    }
  },[a,b,lesson.labKind]);
  return <FocusLab title={lesson.labTitle}><div className={`${styles.lab} ${styles[lesson.labKind]}`} role="region" aria-label={`${lesson.title} interactive laboratory`}>
    <div className={styles.prompt}><b>Try this:</b> {lesson.labKind==='mechanics'?'Keep mass fixed and increase stiffness. Watch the period get shorter. Then increase mass and watch the period get longer.':'Change one quantity at a time. Watch the model, numerical result, and governing relationship update together.'}</div>
    <div className={styles.workspace}><aside className={styles.controls}><small>CONTROL THE MODEL</small><div className={styles.readout}><span>{result.label}</span><b>{result.headline}</b><p>{result.detail}</p></div><label><span>{result.first}<output>{result.firstValue}</output></span><input aria-label={result.first} type="range" min="0" max="100" value={a} onChange={event=>setA(Number(event.target.value))}/></label><label><span>{result.second}<output>{result.secondValue}</output></span><input aria-label={result.second} type="range" min="0" max="100" value={b} onChange={event=>setB(Number(event.target.value))}/></label><button type="button" onClick={()=>{setA(50);setB(50)}}>Reset model</button><p className={styles.hint}>{lesson.takeaway}</p></aside><div className={styles.visual} aria-label={`Visual model showing ${result.label.toLowerCase()}`}>
      <div className={styles.grid}/><div className={styles.title}>{lesson.title.toUpperCase()} · LIVE MODEL</div>
      {lesson.labKind==='mechanics'&&<><div className={styles.energyKey}><span><i/>Higher V</span><span><i/>Faster motion</span></div><div className={styles.potential}/><div className={styles.ball} style={{left:`${result.x}%`}}/><div className={styles.downhill}>restoring force points toward the bottom ↓</div><div className={styles.axisLabel}>one coordinate q describes position in the energy landscape</div></>}
      {lesson.labKind==='fields'&&<><div className={styles.waveA} style={{'--cycles':Math.max(2,result.x/10)} as CSSProperties}/><div className={styles.waveB} style={{'--cycles':Math.max(2,result.x/10)} as CSSProperties}/><div className={styles.flowArrow}>ENERGY FLOW →</div></>}
      {lesson.labKind==='statistics'&&<><div className={styles.level}><i style={{height:`${100-result.x}%`}}/><span>ground</span></div><div className={styles.level}><i style={{height:`${result.x}%`}}/><span>excited</span></div><div className={styles.axisLabel}>thermal population</div></>}
      {lesson.labKind==='gravity'&&<><div className={styles.spacetime}/><div className={styles.mass}/><div className={styles.clock} style={{left:`${35+result.x*.3}%`}}>τ</div><div className={styles.axisLabel}>curvature guides free fall</div></>}
      {lesson.labKind==='quantum'&&<><div className={styles.packet}/><div className={styles.barrier} style={{width:`${25+b*.2}%`}}/><div className={styles.transmitted} style={{opacity:Math.max(.08,result.x/100)}}/><div className={styles.axisLabel}>wave amplitude penetrates the barrier</div></>}
      {lesson.labKind==='nuclear'&&<><div className={styles.nuclei}>{Array.from({length:40},(_,index)=><i key={index} className={index<result.x*.4?styles.alive:styles.decayed}/>)}</div><div className={styles.axisLabel}>one random sample of an exponential ensemble</div></>}
    </div></div><div className={styles.equation}><b>{lesson.equations[0].formula}</b><p>{lesson.equations[0].meaning}</p></div>
  </div></FocusLab>
}
