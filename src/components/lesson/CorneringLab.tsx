'use client';

import {useEffect,useMemo,useRef,useState} from 'react';
import styles from './CorneringLab.module.css';
import FocusLab from './FocusLab';

const G=9.8;

export default function CorneringLab(){
  const [speed,setSpeed]=useState(12),[radius,setRadius]=useState(28),[mass,setMass]=useState(900),[grip,setGrip]=useState(.55),[angle,setAngle]=useState(-50),[running,setRunning]=useState(true),[showTrail,setShowTrail]=useState(true);
  const frame=useRef(0),last=useRef(0);
  const values=useMemo(()=>{const acceleration=speed*speed/radius,force=mass*acceleration,maxGrip=grip*mass*G,safe=force<=maxGrip,maxSpeed=Math.sqrt(grip*G*radius),period=speed?2*Math.PI*radius/speed:0;return{acceleration,force,maxGrip,safe,maxSpeed,period}},[speed,radius,mass,grip]);
  useEffect(()=>{if(!running)return;const animate=(time:number)=>{const dt=Math.min(.05,(time-(last.current||time))/1000);last.current=time;setAngle(value=>(value+speed/radius*dt*180/Math.PI)%360);frame.current=requestAnimationFrame(animate)};frame.current=requestAnimationFrame(animate);return()=>cancelAnimationFrame(frame.current)},[running,speed,radius]);
  const radians=angle*Math.PI/180,cx=350,cy=230,drawRadius=70+radius/60*105,x=cx+Math.cos(radians)*drawRadius,y=cy+Math.sin(radians)*drawRadius;
  const tangent={x:-Math.sin(radians),y:Math.cos(radians)},inward={x:-Math.cos(radians),y:-Math.sin(radians)},velocityLength=35+speed*2.4,accelLength=35+Math.min(95,values.acceleration*8);
  const rotate=angle+90;
  return <FocusLab title="Cornering Lab"><div className={styles.lab} role="region" aria-label="Interactive circular motion cornering lab">
    <div className={styles.prompt}><b>Try this:</b> Double the speed while keeping the radius fixed. The required inward acceleration and force become four times larger.</div>
    <svg className={styles.scene} viewBox="0 0 700 470" role="img" aria-label={`A car moving around a ${radius} metre radius turn at ${speed} metres per second`}>
      <defs><marker id="corner-blue-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path fill="#315fd0" d="M0 0 8 4 0 8z"/></marker><marker id="corner-red-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path fill="#c84f42" d="M0 0 8 4 0 8z"/></marker></defs>
      <circle className={styles.grass} cx={cx} cy={cy} r="210"/><circle className={styles.roadEdge} cx={cx} cy={cy} r={drawRadius+28}/><circle className={styles.road} cx={cx} cy={cy} r={drawRadius}/><circle className={styles.innerEdge} cx={cx} cy={cy} r={Math.max(25,drawRadius-28)}/><circle className={styles.centre} cx={cx} cy={cy} r="5"/><text className={styles.centreLabel} x={cx+10} y={cy-8}>centre</text>
      {showTrail&&<path className={styles.trail} d={`M${x} ${y}A${drawRadius} ${drawRadius} 0 0 0 ${cx+Math.cos(radians-.9)*drawRadius} ${cy+Math.sin(radians-.9)*drawRadius}`}/>} 
      <path className={styles.radiusLine} d={`M${cx} ${cy}L${x} ${y}`}/>
      <path className={styles.velocityArrow} markerEnd="url(#corner-blue-arrow)" d={`M${x} ${y}L${x+tangent.x*velocityLength} ${y+tangent.y*velocityLength}`}/><text className={styles.velocityLabel} x={x+tangent.x*(velocityLength+18)} y={y+tangent.y*(velocityLength+18)}>velocity</text>
      <path className={styles.accelArrow} markerEnd="url(#corner-red-arrow)" d={`M${x} ${y}L${x+inward.x*accelLength} ${y+inward.y*accelLength}`}/><text className={styles.accelLabel} x={x+inward.x*(accelLength+22)} y={y+inward.y*(accelLength+22)}>acceleration</text>
      {!values.safe&&<path className={styles.escapePath} d={`M${x} ${y}L${x+tangent.x*150} ${y+tangent.y*150}`}/>} 
      <g className={styles.car} transform={`translate(${x} ${y}) rotate(${rotate})`}><rect x="-22" y="-11" width="44" height="22" rx="7"/><path d="M-10-11v22M11-11v22"/></g>
      <g className={styles.legend} transform="translate(30 390)"><path className={styles.velocityArrow} markerEnd="url(#corner-blue-arrow)" d="M0 0h48"/><text x="60" y="4">velocity: where the car is moving now</text><path className={styles.accelArrow} markerEnd="url(#corner-red-arrow)" d="M0 32h48"/><text x="60" y="36">acceleration and net force: toward the centre</text></g>
      <text className={values.safe?styles.safe:styles.unsafe} x="350" y="32">{values.safe?'GRIP IS ENOUGH — THE CAR CAN FOLLOW THE TURN':'NOT ENOUGH GRIP — THE CAR BEGINS TO SKID TOWARD THE TANGENT'}</text>
    </svg>
    <div className={styles.actions}><button type="button" onClick={()=>setRunning(value=>!value)}>{running?'Pause motion':'Play motion'}</button><label><input type="checkbox" checked={showTrail} onChange={event=>setShowTrail(event.target.checked)}/> Show recent path</label></div>
    <div className={styles.controls}><label><span>Speed <output>{speed} m/s</output></span><input type="range" min="2" max="28" value={speed} onChange={event=>setSpeed(Number(event.target.value))}/></label><label><span>Turn radius <output>{radius} m</output></span><input type="range" min="10" max="70" value={radius} onChange={event=>setRadius(Number(event.target.value))}/></label><label><span>Vehicle mass <output>{mass} kg</output></span><input type="range" min="400" max="1800" step="50" value={mass} onChange={event=>setMass(Number(event.target.value))}/></label><label><span>Tyre–road grip μ <output>{grip.toFixed(2)}</output></span><input type="range" min="0.15" max="1" step="0.05" value={grip} onChange={event=>setGrip(Number(event.target.value))}/></label></div>
    <div className={styles.readouts}><div><span>Inward acceleration</span><b>{values.acceleration.toFixed(2)} m/s²</b></div><div><span>Inward force needed</span><b>{Math.round(values.force).toLocaleString()} N</b></div><div><span>Maximum grip force</span><b>{Math.round(values.maxGrip).toLocaleString()} N</b></div><div><span>Largest safe speed</span><b>{values.maxSpeed.toFixed(1)} m/s</b></div><div><span>Time for one lap</span><b>{values.period.toFixed(1)} s</b></div></div>
    <div className={styles.explanation}><span>WHAT THE ARROWS MEAN</span><h4>Velocity points along the path; acceleration points into the turn</h4><p>The car&apos;s speed can stay constant while its velocity changes, because velocity includes direction. The inward acceleration keeps bending the velocity arrow into a circle. If grip disappears, nothing pulls the car inward, so it continues along the straight tangent shown by the dashed line.</p></div>
  </div></FocusLab>;
}
