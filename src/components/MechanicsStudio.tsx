'use client';

import { useMemo, useState } from 'react';
import { Activity, ArrowRight, Bike, BookOpen, Boxes, Calculator, Car, Check, ChevronRight, CircleDot, Gauge, Lightbulb, RotateCcw, Scale, Sparkles, Target, Zap } from 'lucide-react';
import { SYLLABUS_DATA } from '@/data/syllabus';

const topics = SYLLABUS_DATA[0].subtopics;
const icons = [Car, Scale, Bike, Gauge, Boxes, Calculator];
const names = ['Kinematics', 'Forces', 'Circular', 'Energy', 'Momentum', 'Math Spark'];
type Values = { speed:number; angle:number; mass:number; force:number; friction:number; radius:number; height:number; cart2:number; time:number };
const defaults:Values = { speed:18, angle:45, mass:10, force:55, friction:.3, radius:12, height:8, cart2:-4, time:2.5 };

function Slider({label,value,min,max,step=1,unit,onChange}:{label:string;value:number;min:number;max:number;step?:number;unit:string;onChange:(n:number)=>void}) {
  const fill = `${((value-min)/(max-min))*100}%`;
  return <label className="control"><span>{label}<output>{value.toFixed(step<1?1:0)} {unit}</output></span><input aria-label={label} type="range" min={min} max={max} step={step} value={value} style={{'--fill':fill} as React.CSSProperties} onChange={e=>onChange(Number(e.target.value))}/></label>;
}

function Simulation({active,v,setV}:{active:number;v:Values;setV:React.Dispatch<React.SetStateAction<Values>>}) {
  const set=(key:keyof Values)=>(value:number)=>setV(old=>({...old,[key]:value}));
  const g=9.81, rad=v.angle*Math.PI/180;
  const flight=2*v.speed*Math.sin(rad)/g, range=v.speed*Math.cos(rad)*flight;
  const friction=v.friction*v.mass*g, accel=Math.max(0,(v.force-friction)/v.mass);
  const inward=v.speed**2/v.radius, energy=v.mass*g*v.height;
  const collision=(v.mass*v.speed+8*v.cart2)/(v.mass+8);
  const controls = [
    <><Slider label="Launch speed" value={v.speed} min={6} max={30} unit="m/s" onChange={set('speed')}/><Slider label="Launch angle" value={v.angle} min={15} max={75} unit="°" onChange={set('angle')}/></>,
    <><Slider label="Crate mass" value={v.mass} min={2} max={30} unit="kg" onChange={set('mass')}/><Slider label="Your push" value={v.force} min={0} max={140} unit="N" onChange={set('force')}/><Slider label="Floor roughness μ" value={v.friction} min={0} max={.8} step={.1} unit="" onChange={set('friction')}/></>,
    <><Slider label="Bicycle speed" value={v.speed} min={4} max={24} unit="m/s" onChange={set('speed')}/><Slider label="Turn radius" value={v.radius} min={5} max={30} unit="m" onChange={set('radius')}/><Slider label="Rider + bike" value={v.mass} min={5} max={30} unit="×10 kg" onChange={set('mass')}/></>,
    <><Slider label="Release height" value={v.height} min={1} max={10} unit="m" onChange={set('height')}/><Slider label="Skater mass" value={v.mass} min={4} max={20} unit="×5 kg" onChange={set('mass')}/></>,
    <><Slider label="Blue cart speed" value={v.speed} min={2} max={20} unit="m/s →" onChange={set('speed')}/><Slider label="Orange cart speed" value={v.cart2} min={-12} max={4} unit="m/s" onChange={set('cart2')}/><Slider label="Blue cart mass" value={v.mass} min={4} max={20} unit="kg" onChange={set('mass')}/></>,
    <><Slider label="Scrub time" value={v.time} min={.5} max={6} step={.5} unit="s" onChange={set('time')}/><Slider label="Initial velocity u" value={v.speed} min={0} max={20} unit="m/s" onChange={set('speed')}/><Slider label="Acceleration a" value={v.force} min={0} max={10} unit="m/s²" onChange={set('force')}/></>,
  ];
  const visual = [
    <><path d={`M35 248 Q 270 ${Math.max(25,235-v.speed*7)} 605 248`} className="trace"/><circle cx="270" cy={Math.max(45,190-v.speed*3)} r="11" className="ball"/><path d="M270 160h100m-8-7 8 7-8 7M270 160v-75m-7 8 7-8 7 8" className="vectors"/><text x="392" y="164">vₓ stays steady</text><text x="280" y="82">vᵧ changes</text></>,
    <><path d="M25 238H615" className="ground"/><g transform={`translate(${Math.min(445,145+accel*22)} 0)`}><rect x="0" y="162" width="110" height="75" rx="8" className="object"/></g><path d={`M255 145h${Math.min(170,v.force*1.5)}m-8-7 8 7-8 7`} className="vectors"/><path d={`M145 255H${145-Math.min(100,friction)}m8-7-8 7 8 7`} className="warm-vector"/><text x="430" y="130">push</text><text x="35" y="280">friction</text></>,
    <><circle cx="320" cy="150" r={Math.min(110,55+v.radius*2)} className="road"/><g transform={`translate(300 ${38-v.radius*.4})`}><Bike width="40" height="40" className="bike"/></g><path d={`M320 ${55-v.radius*.4}v80m-7-8 7 8 7-8`} className="warm-vector"/><text x="338" y="125">inward acceleration</text></>,
    <><path d="M22 65Q175 65 250 230Q330 280 430 150Q510 62 620 62" className="track"/><circle cx={80+v.height*15} cy={66+v.height*9} r="13" className="ball"/><rect x="48" y={225-v.height*15} width="48" height={v.height*15} className="pe"/><rect x="112" y={85+v.height*10} width="48" height={140-v.height*10} className="ke"/><text x="58" y="248">PE</text><text x="120" y="248">KE</text><text x="395" y="275">total energy stays fixed</text></>,
    <><path d="M25 225H615" className="ground"/><g transform={`translate(${105+v.speed*4} 0)`}><rect y="165" width="120" height="52" rx="9" className="cart-blue"/><circle cx="25" cy="223" r="10"/><circle cx="95" cy="223" r="10"/></g><g transform={`translate(${485+v.cart2*8} 0)`}><rect y="165" width="90" height="52" rx="9" className="cart-warm"/><circle cx="20" cy="223" r="10"/><circle cx="70" cy="223" r="10"/></g><text x="45" y="48">momentum before = momentum after</text></>,
    <><path d="M58 238H600M58 238V34" className="ground"/><path d="M58 220L580 55" className="graph-line"/><path d={`M58 238V220L${58+v.time*80} ${220-v.time*25}V238Z`} className="area"/><circle cx={58+v.time*80} cy={220-v.time*25} r="8" className="warm-ball"/><text x="310" y="270">area = displacement</text><text x="410" y="70">slope = acceleration</text></>,
  ];
  const results = [
    [['air time',`${flight.toFixed(2)} s`],['range',`${range.toFixed(1)} m`],['horizontal speed',`${(v.speed*Math.cos(rad)).toFixed(1)} m/s`]],
    [['friction',`${friction.toFixed(1)} N`],['net force',`${Math.max(0,v.force-friction).toFixed(1)} N`],['acceleration',`${accel.toFixed(2)} m/s²`]],
    [['inward acceleration',`${inward.toFixed(1)} m/s²`],['inward force',`${(v.mass*10*inward).toFixed(0)} N`],['speed effect','F ∝ v²']],
    [['starting PE',`${(energy*5).toFixed(0)} J`],['bottom speed',`${Math.sqrt(2*g*v.height).toFixed(1)} m/s`],['key surprise','speed ignores mass']],
    [['total momentum',`${(v.mass*v.speed+8*v.cart2).toFixed(0)} kg·m/s`],['final speed',`${collision.toFixed(2)} m/s`],['direction',collision>=0?'right':'left']],
    [['v = u + at',`${(v.speed+v.force*v.time).toFixed(1)} m/s`],['area = Δx',`${(v.speed*v.time+.5*v.force*v.time**2).toFixed(1)} m`],['slope',`${v.force.toFixed(1)} m/s²`]],
  ];
  return <div className="simulation"><svg viewBox="0 0 640 300" role="img" aria-label={`${names[active]} interactive visualization`}><rect width="640" height="300" rx="18" className="sim-bg"/>{visual[active]}</svg><div className="controls">{controls[active]}</div><div className="results">{results[active].map(([a,b])=><span key={a}><small>{a}</small>{b}</span>)}</div></div>;
}

export default function MechanicsStudio(){
  const [active,setActive]=useState(0),[values,setValues]=useState(defaults),[step,setStep]=useState(0),[hint,setHint]=useState(false);
  const topic=topics[active], Icon=icons[active], completion=useMemo(()=>Math.round((active+1)/topics.length*100),[active]);
  const choose=(i:number)=>{setActive(i);setStep(0);setHint(false);window.scrollTo({top:0,behavior:'smooth'});};
  return <main className="shell">
    <header className="topbar"><a className="brand" href="#top"><Activity/>PhySense</a><div><b>Block 1</b><span>The Intuition & Calculus Spark</span></div><button onClick={()=>document.getElementById('equations')?.scrollIntoView({behavior:'smooth'})}><BookOpen/>Equation map</button></header>
    <div className="progress" aria-label={`${completion}% complete`}><span style={{width:`${completion}%`}}/></div>
    <nav className="rail" aria-label="Block topics">{topics.map((item,i)=>{const ItemIcon=icons[i];return <button key={item.id} aria-current={active===i?'step':undefined} onClick={()=>choose(i)}><small>0{i+1}</small><ItemIcon/><span>{names[i]}<i>{item.code}</i></span>{active===i&&<ChevronRight/>}</button>})}</nav>
    <div className="content" id="top">
      <section className="intro"><div className="kicker"><Icon/>Lesson {topic.code} · {topic.difficulty}</div><h1>{topic.title}</h1><p className="anchor"><b>Picture this</b>{topic.realLifeAnchor}</p><aside><Lightbulb/><div><small>Hold this question</small>{topic.anchorQuestion}</div></aside></section>
      <section className="lab"><div className="lab-head"><span><i/>Interactive lab</span><h2>{topic.interactive.title}</h2><p>{topic.interactive.description}</p></div><button className="reset" onClick={()=>setValues(defaults)}><RotateCcw/>Reset</button><Simulation active={active} v={values} setV={setValues}/><div className="try"><Sparkles/><p><b>Try this</b>{topic.interactive.observation}</p></div></section>
      <section className="cards"><article><div className="label"><Target/>Build the idea</div><h2>From what you see to what you know</h2><ol>{topic.learningPath.map((item,i)=><li className={i<=step?'shown':''} key={item}><button onClick={()=>setStep(i)}><span>{i<step?<Check/>:i+1}</span>{item}</button></li>)}</ol>{step<topic.learningPath.length-1&&<button className="next" onClick={()=>setStep(s=>s+1)}>Reveal next step <ArrowRight/></button>}</article><article><div className="label"><Zap/>What to notice</div><h2>The physics hiding in plain sight</h2><ul>{topic.keyConcepts.map(x=><li key={x}><Check/>{x}</li>)}</ul><div className="formulas" id="equations"><small>Now earn the equations</small>{topic.formulas.map(x=><code key={x}>{x}</code>)}</div></article></section>
      {topic.mathSpark&&<section className="spark"><Calculator/><div><div className="label">Math Spark</div><h2>The calculus underneath</h2><p>{topic.mathSpark}</p></div><div className="chain"><span>picture</span><ChevronRight/><span>graph</span><ChevronRight/><span>calculus</span></div></section>}
      <section className="challenge"><div className="label"><CircleDot/>Real-world challenge</div><h2>{topic.challenge.title}</h2><p>{topic.challenge.scenario}</p><blockquote><b>Your mission</b>{topic.challenge.prompt}</blockquote><button onClick={()=>setHint(!hint)}>{hint?'Hide the coaching hint':'I need a coaching hint'}</button>{hint&&<p className="hint"><Lightbulb/>{topic.challenge.hint}</p>}</section>
      <footer><div><small>Up next</small><b>{names[(active+1)%topics.length]}</b></div><button onClick={()=>choose((active+1)%topics.length)}>Continue <ArrowRight/></button></footer>
    </div>
  </main>;
}
