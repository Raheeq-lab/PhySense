'use client';

import {useMemo,useState} from 'react';
import styles from './PushCrateLab.module.css';

const G=9.8;

function Readout({label,value,accent=false}:{label:string;value:string;accent?:boolean}){
  return <div className={accent?styles.accentReadout:undefined}><span>{label}</span><b>{value}</b></div>;
}

export default function PushCrateLab(){
  const [mass,setMass]=useState(20),[push,setPush]=useState(60),[angle,setAngle]=useState(0),[muS,setMuS]=useState(.4),[muK,setMuK]=useState(.28);
  const values=useMemo(()=>{
    const radians=angle*Math.PI/180;
    const horizontal=push*Math.cos(radians),vertical=push*Math.sin(radians);
    const normal=Math.max(0,mass*G-vertical),maxStatic=muS*normal;
    const moving=horizontal>maxStatic+.0001;
    const friction=moving?muK*normal:horizontal;
    const net=Math.max(0,horizontal-friction),acceleration=net/mass;
    return {horizontal,vertical,normal,maxStatic,moving,friction,net,acceleration};
  },[mass,push,angle,muS,muK]);
  const forceScale=1.25, pushLength=Math.min(170,values.horizontal*forceScale),frictionLength=Math.min(170,values.friction*forceScale);
  return <div className={styles.lab} role="region" aria-label="Interactive force and friction lab">
    <div className={styles.prompt}><b>Try this:</b> Raise the push slowly. Watch static friction match it—until the threshold is crossed and the crate begins to accelerate.</div>
    <svg className={styles.scene} viewBox="0 0 700 300" role="img" aria-label={`A ${mass} kilogram crate with ${push} newtons applied; ${values.moving?'the crate accelerates':'the crate remains at rest'}`}>
      <defs><marker id="force-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z"/></marker></defs>
      <path className={styles.floor} d="M30 235h640"/><g className={values.moving?styles.movingCrate:styles.crate}><rect x="280" y="145" width="140" height="90" rx="8"/><path d="M292 157l116 66m0-66-116 66"/><text x="350" y="197">{mass} kg</text></g>
      <path className={styles.pushArrow} markerEnd="url(#force-arrow)" d={`M${280-pushLength} ${190+Math.tan(angle*Math.PI/180)*pushLength}L272 190`}/><text className={styles.pushLabel} x={Math.max(30,260-pushLength)} y="130">push</text>
      {values.friction>0&&<><path className={styles.frictionArrow} markerEnd="url(#force-arrow)" d={`M420 ${215}H${428+frictionLength}`}/><text className={styles.frictionLabel} x={Math.min(610,438+frictionLength/2)} y="205">friction</text></>}
      <path className={styles.weightArrow} markerEnd="url(#force-arrow)" d="M350 235v48"/><text className={styles.weightLabel} x="360" y="278">weight</text><path className={styles.normalArrow} markerEnd="url(#force-arrow)" d="M350 145V92"/><text className={styles.normalLabel} x="360" y="104">normal</text>
      <text className={styles.state} x="350" y="36">{values.moving?'MOVING — the push has beaten static friction':'AT REST — static friction is matching the push'}</text>
    </svg>
    <div className={styles.controls}>
      <label><span>Mass <output>{mass} kg</output></span><input type="range" min="5" max="60" value={mass} onChange={event=>setMass(Number(event.target.value))}/></label>
      <label><span>Applied force <output>{push} N</output></span><input type="range" min="0" max="220" value={push} onChange={event=>setPush(Number(event.target.value))}/></label>
      <label><span>Upward push angle <output>{angle}°</output></span><input type="range" min="0" max="40" value={angle} onChange={event=>setAngle(Number(event.target.value))}/></label>
      <label><span>Static friction coefficient <output>{muS.toFixed(2)}</output></span><input type="range" min="0" max="0.8" step="0.05" value={muS} onChange={event=>setMuS(Number(event.target.value))}/></label>
      <label><span>Kinetic friction coefficient <output>{muK.toFixed(2)}</output></span><input type="range" min="0" max="0.7" step="0.05" value={muK} onChange={event=>setMuK(Number(event.target.value))}/></label>
    </div>
    <div className={styles.readouts}><Readout label="Horizontal push" value={`${values.horizontal.toFixed(1)} N`}/><Readout label="Maximum static friction" value={`${values.maxStatic.toFixed(1)} N`}/><Readout label="Friction now" value={`${values.friction.toFixed(1)} N`}/><Readout label="Net force" value={`${values.net.toFixed(1)} N`}/><Readout label="Acceleration" value={`${values.acceleration.toFixed(2)} m/s²`} accent/></div>
    <div className={styles.explanation}><span>{values.moving?'THRESHOLD CROSSED':'BEFORE MOTION'}</span><h4>{values.moving?'Kinetic friction now opposes the slide':'Static friction adjusts to what is needed'}</h4><p>{values.moving?`The horizontal push is greater than the ${values.maxStatic.toFixed(1)} N static limit. The remaining ${values.net.toFixed(1)} N is the net force, so the crate accelerates.`:`Static friction is ${values.friction.toFixed(1)} N because that is exactly enough to balance the horizontal push. It does not automatically equal its maximum value.`}</p></div>
  </div>;
}
