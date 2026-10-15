'use client';

import {useState} from 'react';
import styles from './FluidLab.module.css';

const fluids={Water:1000,'Sea water':1025,Oil:850} as const;
type FluidName=keyof typeof fluids;

export default function FluidLab(){
  const [fluid,setFluid]=useState<FluidName>('Water');
  const [objectDensity,setObjectDensity]=useState(720);
  const [depth,setDepth]=useState(3);
  const [inletSpeed,setInletSpeed]=useState(2);
  const [areaRatio,setAreaRatio]=useState(.5);
  const rho=fluids[fluid],g=9.81,volume=.012,mass=objectDensity*volume;
  const fullySubmerged=objectDensity>=rho,submergedFraction=Math.min(1,objectDensity/rho);
  const buoyancy=rho*g*volume*(fullySubmerged?1:submergedFraction),weight=mass*g;
  const pressure=rho*g*depth,objectY=fullySubmerged?190:99+submergedFraction*62;
  const outletSpeed=inletSpeed/areaRatio,pressureDrop=.5*rho*(outletSpeed**2-inletSpeed**2);
  const outcome=objectDensity<rho*.98?'Floats':objectDensity<=rho*1.02?'Neutral': 'Sinks';
  return <div className={styles.lab} role="region" aria-label="Interactive fluids and pressure laboratory">
    <div className={styles.prompt}><b>Try this:</b> Make the object denser than the fluid, then narrow the pipe. Track forces in the tank and energy in the flow separately.</div>
    <div className={styles.stage}>
      <svg viewBox="0 0 720 390" role="img" aria-label={`${outcome} object in ${fluid.toLowerCase()} beside a narrowing flow pipe`}>
        <defs><linearGradient id="tankWater" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#82d9e8" stopOpacity=".72"/><stop offset="1" stopColor="#267b9d" stopOpacity=".9"/></linearGradient><linearGradient id="steel" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset=".5" stopColor="#bcc5ca"/><stop offset="1" stopColor="#6d777e"/></linearGradient><marker id="fluidArrowUp" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 8 4 0l4 8" fill="#fff"/></marker><marker id="fluidArrowDown" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0l4 8 4-8" fill="#f2b64a"/></marker><clipPath id="pipeClip"><path d={`M375 115H500L565 ${195-60*areaRatio}H690V${195+60*areaRatio}H565L500 275H375Z`}/></clipPath></defs>
        <rect width="720" height="390" fill="#edf3f1"/><path className={styles.tank} d="M28 42v306h292V42"/><rect x="29" y="82" width="290" height="265" fill="url(#tankWater)"/><path className={styles.surface} d="M30 82q18-8 36 0t36 0 36 0 36 0 36 0 36 0 36 0 36 0"/>
        {[1,2,3,4].map(i=><g key={i}><path className={styles.depthLine} d={`M45 ${82+i*53}H300`}/><text className={styles.depthLabel} x="52" y={76+i*53}>{i} m</text></g>)}
        <g transform={`translate(174 ${objectY})`}><rect className={styles.object} x="-39" y="-29" width="78" height="58" rx="10"/><text className={styles.objectText} y="4">{objectDensity}</text><text className={styles.objectUnit} y="20">kg/m³</text><path className={styles.upArrow} markerEnd="url(#fluidArrowUp)" d="M0-36V-82"/><text className={styles.upText} x="9" y="-61">F<tspan baselineShift="sub">B</tspan></text><path className={styles.downArrow} markerEnd="url(#fluidArrowDown)" d="M0 36V82"/><text className={styles.downText} x="9" y="67">mg</text></g>
        <text className={styles.panelTitle} x="42" y="28">HYDROSTATICS · FORCES</text><text className={styles.panelTitle} x="377" y="28">STEADY FLOW · ENERGY</text>
        <path className={styles.pipe} d={`M375 115H500L565 ${195-60*areaRatio}H690V${195+60*areaRatio}H565L500 275H375Z`}/><g clipPath="url(#pipeClip)">{Array.from({length:11},(_,i)=>{const x=390+i*29,fast=x>565;return <g key={i} className={styles.particle} style={{animationDelay:`-${i*.18}s`}}><circle cx={x} cy={195+(i%3-1)*(fast?22*areaRatio:45)} r="5"/><path d={`M${x-11} ${195+(i%3-1)*(fast?22*areaRatio:45)}h8`}/></g>})}</g>
        <path className={styles.flowArrow} d="M402 195H480"/><path className={styles.flowArrow} d="M592 195H664"/><text className={styles.flowLabel} x="406" y="180">v₁ = {inletSpeed.toFixed(1)} m/s</text><text className={styles.flowLabel} x="580" y="180">v₂ = {outletSpeed.toFixed(1)} m/s</text><path className={styles.gauge} d="M438 115V75h32v40M614 153V75h32v78"/><rect className={styles.gaugeFill} x="442" y="84" width="24" height="31"/><rect className={styles.gaugeFill} x="618" y={84+Math.min(31,pressureDrop/1800)} width="24" height={31-Math.min(31,pressureDrop/1800)}/><text className={styles.gaugeText} x="454" y="66">p₁</text><text className={styles.gaugeText} x="630" y="66">p₂</text>
        <text className={styles.caption} x="360" y="375" textAnchor="middle">Pressure comes from molecular pushes; buoyancy comes from the pressure gradient.</text>
      </svg>
      <aside className={styles.readout}><small>LIVE FLUID MODEL</small><span>Object</span><b>{outcome}</b><span>Pressure at probe depth</span><b>{(pressure/1000).toFixed(1)} kPa gauge</b><span>Buoyant force</span><b>{buoyancy.toFixed(1)} N</b><span>Weight</span><b>{weight.toFixed(1)} N</b><span>Narrow-section speed</span><b>{outletSpeed.toFixed(1)} m/s</b><span>Ideal pressure change</span><b>−{(pressureDrop/1000).toFixed(1)} kPa</b></aside>
    </div>
    <div className={styles.controls}><label><span>Fluid <output>{fluid}</output></span><select value={fluid} onChange={e=>setFluid(e.target.value as FluidName)}>{Object.keys(fluids).map(name=><option key={name}>{name}</option>)}</select></label><label><span>Object density <output>{objectDensity} kg/m³</output></span><input type="range" min="400" max="1400" step="20" value={objectDensity} onChange={e=>setObjectDensity(Number(e.target.value))}/></label><label><span>Pressure-probe depth <output>{depth.toFixed(1)} m</output></span><input type="range" min=".5" max="4" step=".1" value={depth} onChange={e=>setDepth(Number(e.target.value))}/></label><label><span>Wide-section speed <output>{inletSpeed.toFixed(1)} m/s</output></span><input type="range" min=".5" max="4" step=".1" value={inletSpeed} onChange={e=>setInletSpeed(Number(e.target.value))}/></label><label><span>Narrow area ÷ wide area <output>{areaRatio.toFixed(2)}</output></span><input type="range" min=".3" max="1" step=".05" value={areaRatio} onChange={e=>setAreaRatio(Number(e.target.value))}/></label></div>
    <div className={styles.equation}><b>Static fluid: Δp = ρgΔh and F<sub>B</sub> = ρ<sub>fluid</sub>gV<sub>displaced</sub></b><p>Steady incompressible flow: A₁v₁ = A₂v₂. Along one ideal streamline, p + ½ρv² + ρgh stays constant.</p></div>
  </div>
}
