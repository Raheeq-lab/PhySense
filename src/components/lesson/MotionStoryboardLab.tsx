'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './MotionStoryboardLab.module.css';

type Mode='car'|'ball';
type Sample={t:number;position:number;velocity:number};
type Point={x:number;y:number};
const G=9.8;

function LineGraph({samples,kind}:{samples:Sample[];kind:'position'|'velocity'}){
  const values=samples.map(sample=>sample[kind]);
  const low=Math.min(0,...values),high=Math.max(1,...values),span=Math.max(1,high-low),start=Math.max(0,(samples.at(-1)?.t??0)-5);
  const points=samples.map(sample=>`${28+(sample.t-start)/5*252},${92-(sample[kind]-low)/span*68}`).join(' ');
  return <svg className={styles.graph} viewBox="0 0 300 112" role="img" aria-label={`${kind} versus time graph`}><path d="M28 12v80h258M28 92v8M154 92v8M280 92v8"/><text x="5" y="18">{high.toFixed(1)}</text><text x="8" y="94">{low.toFixed(1)}</text><text x="268" y="108">time</text>{points&&<polyline points={points}/>}</svg>;
}

export default function MotionStoryboardLab(){
  const [mode,setMode]=useState<Mode>('car'),[position,setPosition]=useState(50),[velocity,setVelocity]=useState(0),[acceleration,setAcceleration]=useState(0),[samples,setSamples]=useState<Sample[]>([]);
  const [speed,setSpeed]=useState(18),[angle,setAngle]=useState(47),[ball,setBall]=useState<Point>({x:0,y:0}),[trail,setTrail]=useState<Point[]>([]),[launched,setLaunched]=useState(false);
  const roadRef=useRef<SVGSVGElement>(null),dragging=useRef(false),positionRef=useRef(50),carFrame=useRef(0),launchFrame=useRef(0),tabRefs=useRef<(HTMLButtonElement|null)[]>([]),reduced=useRef(false);
  const carStart=useRef(0),lastFrame=useRef({time:0,position:50,velocity:0});
  const radians=angle*Math.PI/180,vx=speed*Math.cos(radians),vy=speed*Math.sin(radians),airTime=speed>0?2*vy/G:0,range=vx*airTime,maxHeight=vy*vy/(2*G);

  useEffect(()=>{reduced.current=window.matchMedia('(prefers-reduced-motion: reduce)').matches;return()=>{cancelAnimationFrame(carFrame.current);cancelAnimationFrame(launchFrame.current)}},[]);
  const stopAnimations=()=>{cancelAnimationFrame(carFrame.current);cancelAnimationFrame(launchFrame.current);dragging.current=false};
  const reset=()=>{stopAnimations();if(mode==='car'){positionRef.current=50;setPosition(50);setVelocity(0);setAcceleration(0);setSamples([]);carStart.current=0;lastFrame.current={time:0,position:50,velocity:0}}else{setBall({x:0,y:0});setTrail([]);setLaunched(false)}};
  const switchMode=(next:Mode)=>{if(next===mode)return;stopAnimations();setMode(next);setVelocity(0);setAcceleration(0);setBall({x:0,y:0});setTrail([]);setLaunched(false)};
  const readCarPosition=(clientX:number)=>{const rect=roadRef.current?.getBoundingClientRect();if(!rect)return positionRef.current;return Math.max(0,Math.min(100,(clientX-rect.left)/rect.width*100))};
  const sampleCar=(now:number)=>{if(!dragging.current)return;const previous=lastFrame.current;if(!carStart.current)carStart.current=now;const dt=Math.max(.001,(now-previous.time)/1000),nextVelocity=(positionRef.current-previous.position)/dt,nextAcceleration=(nextVelocity-previous.velocity)/dt,t=(now-carStart.current)/1000;setVelocity(nextVelocity);setAcceleration(nextAcceleration);setSamples(current=>{const next=[...current,{t,position:positionRef.current,velocity:nextVelocity}];return reduced.current?next.filter(sample=>sample.t<=5):next.filter(sample=>sample.t>=t-5)});lastFrame.current={time:now,position:positionRef.current,velocity:nextVelocity};carFrame.current=requestAnimationFrame(sampleCar)};
  const startDrag=(event:React.PointerEvent<SVGSVGElement>)=>{event.currentTarget.setPointerCapture(event.pointerId);dragging.current=true;const next=readCarPosition(event.clientX);positionRef.current=next;setPosition(next);const now=performance.now();if(!carStart.current)carStart.current=now;lastFrame.current={time:now,position:next,velocity:0};cancelAnimationFrame(carFrame.current);carFrame.current=requestAnimationFrame(sampleCar)};
  const moveCar=(event:React.PointerEvent<SVGSVGElement>)=>{if(!dragging.current)return;const next=readCarPosition(event.clientX);positionRef.current=next;setPosition(next)};
  const stopCar=()=>{if(!dragging.current)return;dragging.current=false;cancelAnimationFrame(carFrame.current);setVelocity(0);setAcceleration(0);lastFrame.current={time:performance.now(),position:positionRef.current,velocity:0}};
  const launch=()=>{cancelAnimationFrame(launchFrame.current);setLaunched(true);setBall({x:0,y:0});setTrail([{x:0,y:0}]);if(reduced.current){const staticTrail=Array.from({length:31},(_,i)=>{const t=airTime*i/30;return{x:vx*t,y:Math.max(0,vy*t-.5*G*t*t)}});setTrail(staticTrail);setBall({x:range,y:0});return}const start=performance.now();const animate=(now:number)=>{const t=Math.min(airTime,(now-start)/1000),point={x:vx*t,y:Math.max(0,vy*t-.5*G*t*t)};setBall(point);setTrail(current=>[...current,point].slice(-160));if(t<airTime)launchFrame.current=requestAnimationFrame(animate)};launchFrame.current=requestAnimationFrame(animate)};
  const courtPoint=(point:Point)=>({x:50+(range?point.x/range:0)*600,y:280-(maxHeight?point.y/maxHeight:0)*210});
  const ballPoint=courtPoint(ball),trailPoints=trail.map(courtPoint).map(point=>`${point.x},${point.y}`).join(' ');
  const changeTabByKey=(event:React.KeyboardEvent<HTMLDivElement>)=>{if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;event.preventDefault();const next:Mode=event.key==='ArrowRight'?'ball':'car';switchMode(next);tabRefs.current[next==='car'?0:1]?.focus()};

  return <div className={styles.lab} role="region" aria-label="Motion Storyboard Lab">
    <div className={styles.toolbar} role="tablist" aria-label="Lab modes" onKeyDown={changeTabByKey}><button ref={node=>{tabRefs.current[0]=node}} role="tab" aria-selected={mode==='car'} className={mode==='car'?styles.active:''} onClick={()=>switchMode('car')}>Car on a road</button><button ref={node=>{tabRefs.current[1]=node}} role="tab" aria-selected={mode==='ball'} className={mode==='ball'?styles.active:''} onClick={()=>switchMode('ball')}>Basketball launch</button><button className={styles.reset} type="button" onClick={reset}>Reset</button></div>
    {mode==='car'?<div role="tabpanel">
      <svg ref={roadRef} className={styles.road} viewBox="0 0 700 140" role="img" aria-label="A draggable car on a horizontal road" onPointerDown={startDrag} onPointerMove={moveCar} onPointerUp={stopCar} onPointerCancel={stopCar}><rect className={styles.asphalt} x="0" y="82" width="700" height="58"/><path d="M0 111h700"/><g className={styles.car} transform={`translate(${45+position/100*610} 0)`}><rect x="-27" y="66" width="54" height="25" rx="5"/><path d="m-16 66 10-15h21l13 15"/><circle cx="-17" cy="94" r="8"/><circle cx="18" cy="94" r="8"/></g><text x="18" y="25">0 m</text><text x="640" y="25">100 m</text></svg>
      <div className={styles.graphs}><figure><figcaption>Position vs time</figcaption><LineGraph samples={samples} kind="position"/></figure><figure><figcaption>Velocity vs time</figcaption><LineGraph samples={samples} kind="velocity"/></figure></div>
      <div className={styles.readouts} aria-live="polite"><div><span>Position</span><b>{position.toFixed(1)} m</b></div><div><span>Velocity</span><b>{velocity.toFixed(1)} m/s</b></div><div><span>Acceleration</span><b>{acceleration.toFixed(1)} m/s²</b></div></div>
    </div>:<div role="tabpanel">
      <svg className={styles.court} viewBox="0 0 700 320" role="img" aria-label="A basketball following a projectile path across a court"><path className={styles.ground} d="M20 280h660"/>{trailPoints&&<polyline className={styles.trail} points={trailPoints}/>}<g className={styles.ball} transform={`translate(${ballPoint.x} ${ballPoint.y})`}><circle r="13"/><path d="M-13 0h26M0-13c-7 7-7 19 0 26M0-13c7 7 7 19 0 26"/></g></svg>
      <div className={styles.controls}><label><span>Launch speed <output>{speed.toFixed(1)} m/s</output></span><input type="range" min="0" max="30" step="0.5" value={speed} onChange={event=>setSpeed(Number(event.target.value))}/></label><label><span>Launch angle <output>{angle}°</output></span><input type="range" min="0" max="90" step="1" value={angle} onChange={event=>setAngle(Number(event.target.value))}/></label></div>
      <button className={styles.launch} type="button" onClick={launch}>Launch</button>
      <div className={styles.readouts} aria-live="polite"><div><span>Air time</span><b>{launched?`${airTime.toFixed(2)} s`:'—'}</b></div><div><span>Range</span><b>{launched?`${range.toFixed(1)} m`:'—'}</b></div><div><span>Horizontal speed</span><b>{launched?`${vx.toFixed(1)} m/s`:'—'}</b></div><div><span>Vertical speed at launch</span><b>{launched?`${vy.toFixed(1)} m/s`:'—'}</b></div></div>
    </div>}
    <p className={styles.hint}>{mode==='car'?'Drag the car to see how position, velocity, and acceleration relate.':'Change the speed and angle, then launch. Watch the arc.'}</p>
  </div>;
}
