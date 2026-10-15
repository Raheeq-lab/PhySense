'use client';

import {useState,type CSSProperties} from 'react';
import styles from './FluidLab.module.css';

const fluids={
  Water:{density:1000,top:'#79d9ec',bottom:'#267eac',line:'#dcfbff',accent:'#1687a6',particle:'#eaffff',motion:1},
  'Sea water':{density:1025,top:'#54ced2',bottom:'#075f78',line:'#bdf7ed',accent:'#087f84',particle:'#e7fff7',motion:.86},
  Oil:{density:850,top:'#e6b84f',bottom:'#9a5b13',line:'#fff0a8',accent:'#b87517',particle:'#ffe394',motion:.58},
} as const;
type FluidName=keyof typeof fluids;

export default function FluidLab(){
  const [fluid,setFluid]=useState<FluidName>('Water');
  const [objectDensity,setObjectDensity]=useState(720);
  const [depth,setDepth]=useState(3);
  const [inletSpeed,setInletSpeed]=useState(2);
  const [areaRatio,setAreaRatio]=useState(.5);
  const appearance=fluids[fluid],rho=appearance.density,g=9.81,volume=.012,mass=objectDensity*volume;
  const fullySubmerged=objectDensity>=rho,submergedFraction=Math.min(1,objectDensity/rho);
  const buoyancy=rho*g*volume*(fullySubmerged?1:submergedFraction),weight=mass*g;
  const pressure=rho*g*depth,objectY=fullySubmerged?190:99+submergedFraction*62;
  const outletSpeed=inletSpeed/areaRatio,pressureDrop=.5*rho*(outletSpeed**2-inletSpeed**2);
  const outcome=objectDensity<rho*.98?'Floats':objectDensity<=rho*1.02?'Neutral': 'Sinks';
  return <div className={styles.lab} data-fluid={fluid==='Oil'?'oil':fluid==='Sea water'?'sea':'water'} role="region" aria-label="Interactive fluids and pressure laboratory">
    <div className={styles.prompt}><b>Try this:</b> Make the object denser than the fluid, then narrow the pipe. Track forces in the tank and energy in the flow separately.</div>
    <div className={styles.workspace}><aside className={styles.controlPanel} style={{'--fluid-accent':appearance.top} as CSSProperties}><small>CONTROL THE FLUID</small><div className={styles.primaryReadout}><span>Object</span><b>{outcome}</b><p>{fluid} · {rho} kg/m³</p></div><fieldset className={styles.fluidPicker}><legend>Choose fluid</legend><div>{(Object.keys(fluids) as FluidName[]).map(name=><button type="button" key={name} className={fluid===name?styles.selectedFluid:''} onClick={()=>setFluid(name)} aria-pressed={fluid===name}><i style={{background:fluids[name].top}}/>{name}<small>{fluids[name].density}</small></button>)}</div></fieldset><div className={styles.controls}><label><span>Object density <output>{objectDensity}</output></span><input type="range" min="400" max="1400" step="20" value={objectDensity} onChange={e=>setObjectDensity(Number(e.target.value))}/></label><label><span>Probe depth <output>{depth.toFixed(1)} m</output></span><input type="range" min=".5" max="4" step=".1" value={depth} onChange={e=>setDepth(Number(e.target.value))}/></label><label><span>Flow speed <output>{inletSpeed.toFixed(1)} m/s</output></span><input type="range" min=".5" max="4" step=".1" value={inletSpeed} onChange={e=>setInletSpeed(Number(e.target.value))}/></label><label><span>Pipe opening <output>{Math.round(areaRatio*100)}%</output></span><input type="range" min=".3" max="1" step=".05" value={areaRatio} onChange={e=>setAreaRatio(Number(e.target.value))}/></label></div><dl className={styles.miniStats}><div><dt>Pressure</dt><dd>{(pressure/1000).toFixed(1)} kPa</dd></div><div><dt>Buoyancy / weight</dt><dd>{buoyancy.toFixed(0)} / {weight.toFixed(0)} N</dd></div><div><dt>Narrow speed</dt><dd>{outletSpeed.toFixed(1)} m/s</dd></div><div><dt>Pressure change</dt><dd>−{(pressureDrop/1000).toFixed(1)} kPa</dd></div></dl></aside><div className={styles.stage}>
      <svg viewBox="0 0 720 390" role="img" aria-label={`${outcome} object in ${fluid.toLowerCase()} beside a narrowing flow pipe`}>
        <defs><linearGradient id="activeFluid" x1="0" y1="0" x2="0" y2="1"><stop stopColor={appearance.top} stopOpacity=".78"/><stop offset="1" stopColor={appearance.bottom} stopOpacity=".95"/></linearGradient><linearGradient id="steel" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset=".5" stopColor="#bcc5ca"/><stop offset="1" stopColor="#6d777e"/></linearGradient><marker id="fluidArrowUp" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 8 4 0l4 8" fill="#fff"/></marker><marker id="fluidArrowDown" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0l4 8 4-8" fill="#f2b64a"/></marker><clipPath id="pipeClip"><path d={`M375 115H500L565 ${195-60*areaRatio}H690V${195+60*areaRatio}H565L500 275H375Z`}/></clipPath></defs>
        <rect width="720" height="390" fill="#edf3f1"/><path className={styles.tank} d="M28 42v306h292V42"/><rect className={styles.fluidFill} x="29" y="82" width="290" height="265" fill="url(#activeFluid)"/><path className={styles.surface} style={{stroke:appearance.line}} d="M30 82q18-8 36 0t36 0 36 0 36 0 36 0 36 0 36 0 36 0"/>
        <g className={styles.tankParticles} style={{fill:appearance.particle}}>{Array.from({length:18},(_,i)=><circle key={i} cx={48+(i*71)%250} cy={108+(i*43)%215} r={fluid==='Oil'?2.5:i%4===0?2:1}/>)}</g>
        {[1,2,3,4].map(i=><g key={i}><path className={styles.depthLine} d={`M45 ${82+i*53}H300`}/><text className={styles.depthLabel} x="52" y={76+i*53}>{i} m</text></g>)}
        <g className={styles.objectGroup} transform={`translate(174 ${objectY})`}><rect className={styles.object} x="-39" y="-29" width="78" height="58" rx="10"/><text className={styles.objectText} y="4">{objectDensity}</text><text className={styles.objectUnit} y="20">kg/m³</text><path className={styles.upArrow} markerEnd="url(#fluidArrowUp)" d="M0-36V-82"/><text className={styles.upText} x="9" y="-61">F<tspan baselineShift="sub">B</tspan></text><path className={styles.downArrow} markerEnd="url(#fluidArrowDown)" d="M0 36V82"/><text className={styles.downText} x="9" y="67">mg</text></g>
        <text className={styles.panelTitle} x="42" y="28">HYDROSTATICS · FORCES</text><text className={styles.panelTitle} x="377" y="28">STEADY FLOW · ENERGY</text>
        <path className={styles.pipe} style={{fill:appearance.top}} d={`M375 115H500L565 ${195-60*areaRatio}H690V${195+60*areaRatio}H565L500 275H375Z`}/><g clipPath="url(#pipeClip)" style={{color:appearance.particle}}>{Array.from({length:10},(_,i)=><circle key={i} className={styles.flowDot} r={i%3===0?5:3.5} fill="currentColor"><animateMotion dur={`${(4.2/appearance.motion)/Math.max(.5,inletSpeed/2)}s`} begin={`${-i*.42}s`} repeatCount="indefinite" path={`M380 ${170+(i%3)*25} L500 ${170+(i%3)*25} L570 ${185+(i%3)*10*areaRatio} L710 ${185+(i%3)*10*areaRatio}`}/></circle>)}</g>
        <path className={styles.flowArrow} d="M402 195H480"/><path className={styles.flowArrow} d="M592 195H664"/><text className={styles.flowLabel} x="406" y="180">v₁ = {inletSpeed.toFixed(1)} m/s</text><text className={styles.flowLabel} x="580" y="180">v₂ = {outletSpeed.toFixed(1)} m/s</text><path className={styles.gauge} d="M438 115V75h32v40M614 153V75h32v78"/><rect className={styles.gaugeFill} x="442" y="84" width="24" height="31"/><rect className={styles.gaugeFill} x="618" y={84+Math.min(31,pressureDrop/1800)} width="24" height={31-Math.min(31,pressureDrop/1800)}/><text className={styles.gaugeText} x="454" y="66">p₁</text><text className={styles.gaugeText} x="630" y="66">p₂</text>
        <text className={styles.caption} x="360" y="375" textAnchor="middle">Pressure comes from molecular pushes; buoyancy comes from the pressure gradient.</text>
      </svg>
    </div></div>
    <div className={styles.equation}><b>Static fluid: Δp = ρgΔh and F<sub>B</sub> = ρ<sub>fluid</sub>gV<sub>displaced</sub></b><p>Steady incompressible flow: A₁v₁ = A₂v₂. Along one ideal streamline, p + ½ρv² + ρgh stays constant.</p></div>
  </div>
}
