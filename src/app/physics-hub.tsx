'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { BufferGeometry, Group, Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D } from 'three';
import styles from './block-1/page.module.css';

type IconName = 'home'|'bookmark'|'atom'|'orbit'|'wave'|'bolt'|'magnet'|'map'|'steps'|'lab'|'equation'|'check'|'arrow-right'|'arrow-left'|'chevron-right'|'chevron-left'|'search'|'bell'|'user'|'sun'|'moon'|'magnifier-plus'|'magnifier'|'expand'|'function';

function Icon({ name, className }: { name: IconName; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><use href={`#icon-${name}`} /></svg>;
}

function IconLibrary() {
  return <svg className={styles.iconLibrary} aria-hidden="true"><defs>
    <symbol id="icon-home" viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></symbol>
    <symbol id="icon-bookmark" viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></symbol>
    <symbol id="icon-atom" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/></symbol>
    <symbol id="icon-orbit" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><circle cx="18.5" cy="7.5" r="1.5"/></symbol>
    <symbol id="icon-wave" viewBox="0 0 24 24"><path d="M2 12c3-8 5 8 8 0s5 8 8 0 4 0 4 0"/></symbol>
    <symbol id="icon-bolt" viewBox="0 0 24 24"><path d="m13 2-8 12h7l-1 8 8-12h-7z"/></symbol>
    <symbol id="icon-magnet" viewBox="0 0 24 24"><path d="M5 4v9a7 7 0 0 0 14 0V4h-5v9a2 2 0 0 1-4 0V4zM5 8h5m4 0h5"/></symbol>
    <symbol id="icon-map" viewBox="0 0 24 24"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15m6-12v15"/></symbol>
    <symbol id="icon-steps" viewBox="0 0 24 24"><path d="M3 19h6v-5h6V9h6V4"/></symbol>
    <symbol id="icon-lab" viewBox="0 0 24 24"><path d="M9 3h6m-5 0v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M8 15h8"/></symbol>
    <symbol id="icon-equation" viewBox="0 0 24 24"><path d="M4 7h7M4 11h7m4-3h5m-2-2v4M15 17h5M4 17h7"/></symbol>
    <symbol id="icon-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></symbol>
    <symbol id="icon-arrow-right" viewBox="0 0 24 24"><path d="M4 12h16m-6-6 6 6-6 6"/></symbol>
    <symbol id="icon-arrow-left" viewBox="0 0 24 24"><path d="M20 12H4m6-6-6 6 6 6"/></symbol>
    <symbol id="icon-chevron-right" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></symbol>
    <symbol id="icon-chevron-left" viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></symbol>
    <symbol id="icon-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></symbol>
    <symbol id="icon-bell" viewBox="0 0 24 24"><path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9m4 12h4"/></symbol>
    <symbol id="icon-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/></symbol>
    <symbol id="icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/></symbol>
    <symbol id="icon-moon" viewBox="0 0 24 24"><path d="M20 16a9 9 0 0 1-12-12 9 9 0 1 0 12 12"/></symbol>
    <symbol id="icon-magnifier-plus" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6M10 6v8M6 10h8"/></symbol>
    <symbol id="icon-magnifier" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6M6 10h8"/></symbol>
    <symbol id="icon-expand" viewBox="0 0 24 24"><path d="M9 3H3v6m12-6h6v6M9 21H3v-6m12 6h6v-6"/></symbol>
    <symbol id="icon-function" viewBox="0 0 24 24"><path d="M15 3c-4 0-4 4-5 9s-1 9-5 9m2-9h8m2-4 4 8m0-8-4 8"/></symbol>
  </defs></svg>;
}

const nav: [IconName,string,string,string][] = [
  ['home','Home','','/'], ['atom','Block 1','The Intuition & Calculus Spark','/block-1'], ['wave','Block 2','Fields, Waves, and Math Tools','/block-2'],
  ['orbit','Block 3','The Intermediate Bridge','/block-3'], ['bolt','Block 4','The Advanced Pillars','/block-4'], ['function','Math Spark','Calculus, ODEs, Linear Algebra','/math-spark'],
  ['bookmark','Reference','Equations & constants','/reference'],
] as const;

const lessons: [string,string,string,IconName][] = [
  ['1.1','Kinematics','Motion in 1D & 2D','arrow-right'], ['1.2','Forces','Why motion changes','magnet'], ['1.3','Circular','Turning without slowing','orbit'],
  ['1.4','Energy','The currency of the universe','bolt'], ['1.5','Momentum','Collisions and recoil','atom'], ['1.6','Math Spark','The calculus underneath','function'],
];

const atomFacts = {
  protons: {title:'Protons',definition:'Positively charged particles inside the nucleus.',fact:'The number of protons is what decides which element an atom is. One proton is hydrogen. Two is helium. Seventy-nine is gold.'},
  neutrons: {title:'Neutrons',definition:'Neutral particles that sit inside the nucleus alongside protons.',fact:'Neutrons have almost the same mass as protons but no electric charge. Without them, most nuclei would fall apart.'},
  nucleus: {title:'Nucleus',definition:'The tiny, dense centre of the atom, made of protons and neutrons.',fact:"Almost all of an atom's mass lives in the nucleus, but the nucleus takes up less than one trillionth of the atom's volume. An atom is mostly empty space."},
  electrons: {title:'Electrons',definition:'Negatively charged particles that orbit the nucleus.',fact:'Electrons are about 1,800 times lighter than protons. Their arrangement around the nucleus is what makes chemistry possible.'},
  charge: {title:'What is electric charge?',definition:'',fact:''},
} as const;

export function PhysicsHub({ home = false }: { home?: boolean }) {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const atomLabelOpener = useRef<HTMLButtonElement|null>(null);
  const actions = useRef({ zoomIn:()=>{}, zoomOut:()=>{}, turn:(_n:number)=>{}, reset:()=>{} });
  const defaultZoom=1;
  const [dusk,setDusk]=useState(false), [focus,setFocus]=useState(false), [hint,setHint]=useState(true), [zoomState,setZoomState]=useState(defaultZoom), [tab,setTab]=useState(0), [loading,setLoading]=useState(false), [toast,setToast]=useState<string|null>(null);
  const [atomInfo,setAtomInfo]=useState<{name:keyof typeof atomFacts;left:number;top:number}|null>(null);

  const switchTab=(next:number)=>{ if(next===tab) return; setLoading(true); setTab(next); window.setTimeout(()=>setLoading(false),500); };
  const notify=(message:string)=>{setToast(message);window.setTimeout(()=>setToast(null),2400)};
  const closeAtomInfo=()=>{setAtomInfo(null);window.requestAnimationFrame(()=>atomLabelOpener.current?.focus())};
  const openAtomInfo=(name:keyof typeof atomFacts,button:HTMLButtonElement)=>{const main=mainRef.current;if(!main)return;atomLabelOpener.current=button.classList.contains(styles.mobileChargeLink)?main.querySelector<HTMLButtonElement>('[data-label="nucleus"]'):button;const buttonRect=button.getBoundingClientRect(),mainRect=main.getBoundingClientRect(),cardWidth=name==='charge'?312:272;const left=Math.min(Math.max(12,buttonRect.left-mainRect.left+30),Math.max(12,main.clientWidth-cardWidth));const top=Math.min(Math.max(74,buttonRect.top-mainRect.top+24),Math.max(74,main.clientHeight-(name==='charge'?390:250)));setAtomInfo({name,left,top})};

  useEffect(()=>{
    const canvas=canvasRef.current, hero=heroRef.current, main=mainRef.current, stageLayout=stageRef.current, stage=dragRef.current;
    if(!canvas||!hero||!main||!stage||!stageLayout) return;
    let disposed=false;
    let cleanup=()=>{};
    import('three').then(async THREE=>{
      if(disposed) return;
      const { RoomEnvironment }=await import('three/examples/jsm/environments/RoomEnvironment.js');
      if(disposed) return;
      const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio,2));
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.NeutralToneMapping;
      renderer.toneMappingExposure=1.05;
      const scene=new THREE.Scene();
      const camera=new THREE.PerspectiveCamera(26,1,.1,100);
      const pmrem=new THREE.PMREMGenerator(renderer);
      const environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;
      scene.environment=environment;
      scene.environmentIntensity=.95;
      const key=new THREE.DirectionalLight(0xfff4e2,1.6); key.position.set(2.5,4,5); scene.add(key);
      const rim=new THREE.DirectionalLight(0xbfd8ff,.5); rim.position.set(-4,2,-3); scene.add(rim);
      const pivot=new THREE.Group(), spin=new THREE.Group(); pivot.add(spin); scene.add(pivot);
      const accent=new THREE.Color('#3a5bdb'), warm=new THREE.Color('#f0b429');
      const geometries:BufferGeometry[]=[], materials:Material[]=[];
      const electronPivots:Group[]=[], electronMeshes:Mesh[]=[], electronSpeeds=[1.4,-.9,.7], nucleusMaterials:MeshStandardMaterial[]=[], ringMaterials:MeshBasicMaterial[]=[];
      let blockOrbit:Group|null=null, protonTarget:Mesh|null=null, neutronTarget:Mesh|null=null, pulse:Mesh|null=null, pulseMaterial:MeshBasicMaterial|null=null, pulseProgress=-1, labelTimer=0;
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const labelLayer=main.querySelector<HTMLElement>(`.${styles.atomLabels}`);
      const labelNames=['nucleus','protons','neutrons','electrons','charge'] as const;
      const labelNodes=Object.fromEntries(labelNames.map(name=>[name,{text:labelLayer?.querySelector<HTMLElement>(`[data-label="${name}"]`),line:labelLayer?.querySelector<SVGLineElement>(`[data-line="${name}"]`),x:0,y:0,ready:false}])) as Record<(typeof labelNames)[number],{text:HTMLElement|null|undefined;line:SVGLineElement|null|undefined;x:number;y:number;ready:boolean}>;
      if(home){
        spin.rotation.set(.15,.55,0,'YXZ');
        const nucleons=[['neutron',[.09,.03,.05]],['proton',[-.02,.08,.06]],['neutron',[.05,-.07,.05]],['proton',[-.08,-.02,.03]],['proton',[.03,.06,-.07]],['neutron',[-.06,-.05,-.06]],['proton',[.08,-.03,-.05]],['neutron',[-.03,.04,-.08]]] as const;
        nucleons.forEach(([kind,position])=>{const geometry=new THREE.SphereGeometry(.09,32,32);geometries.push(geometry);const proton=kind==='proton',color=proton?'#b5323f':'#cfc9bd';const material=new THREE.MeshStandardMaterial({color,emissive:proton?'#b5323f':'#000000',emissiveIntensity:proton?.05:0,roughness:.55,metalness:.05});material.userData.proton=proton;materials.push(material);nucleusMaterials.push(material);const mesh=new THREE.Mesh(geometry,material);mesh.position.set(position[0],position[1],position[2]);spin.add(mesh);if(proton&&!protonTarget)protonTarget=mesh;if(!proton&&!neutronTarget)neutronTarget=mesh;});
        const haloGeo=new THREE.SphereGeometry(.24,32,32);geometries.push(haloGeo);const haloMat=new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.08,depthWrite:false});materials.push(haloMat);spin.add(new THREE.Mesh(haloGeo,haloMat));
        const tracks=[[0,0],[75*Math.PI/180,15*Math.PI/180],[-70*Math.PI/180,-20*Math.PI/180]] as const;
        tracks.forEach(([x,z],index)=>{const track=new THREE.Group();track.rotation.set(x,0,z);spin.add(track);const torusGeo=new THREE.TorusGeometry(.85,.0035,8,160);geometries.push(torusGeo);const torusMat=new THREE.MeshBasicMaterial({color:accent,transparent:true,opacity:.55,depthWrite:false});materials.push(torusMat);ringMaterials.push(torusMat);track.add(new THREE.Mesh(torusGeo,torusMat));const electronPivot=new THREE.Group();track.add(electronPivot);electronPivots.push(electronPivot);electronPivot.rotation.z=index*2.1;const electronGeo=new THREE.SphereGeometry(.075,28,28);geometries.push(electronGeo);const electronMat=new THREE.MeshStandardMaterial({color:warm,roughness:.45,metalness:.1,emissive:warm,emissiveIntensity:.08});materials.push(electronMat);const electron=new THREE.Mesh(electronGeo,electronMat);electron.position.x=.85;electronPivot.add(electron);electronMeshes.push(electron);if(index===2){const pulseGeo=new THREE.SphereGeometry(.032,18,18);geometries.push(pulseGeo);pulseMaterial=new THREE.MeshBasicMaterial({color:warm,transparent:true,opacity:0,toneMapped:false});materials.push(pulseMaterial);pulse=new THREE.Mesh(pulseGeo,pulseMaterial);pulse.visible=false;track.add(pulse);}});
      }else{
        spin.rotation.set(.12,.75,0);
        const ballGeo=new THREE.SphereGeometry(1,64,64);geometries.push(ballGeo);const ballMat=new THREE.MeshStandardMaterial({color:accent,emissive:accent,emissiveIntensity:.48,roughness:.35,metalness:.05});materials.push(ballMat);spin.add(new THREE.Mesh(ballGeo,ballMat));
        const pts=new Float32Array(780);for(let i=0;i<260;i++){const a=i*2.39996,r=1.08+(i%19)/115,y=((i%43)/42-.5)*1.9;pts[i*3]=Math.cos(a)*Math.sqrt(Math.max(0,r*r-y*y*.45));pts[i*3+1]=y;pts[i*3+2]=Math.sin(a)*Math.sqrt(Math.max(0,r*r-y*y*.45));}const haloGeo=new THREE.BufferGeometry();haloGeo.setAttribute('position',new THREE.BufferAttribute(pts,3));geometries.push(haloGeo);const haloMat=new THREE.PointsMaterial({color:accent,size:.015,transparent:true,opacity:.42,blending:THREE.AdditiveBlending,depthWrite:false});materials.push(haloMat);spin.add(new THREE.Points(haloGeo,haloMat));blockOrbit=new THREE.Group();blockOrbit.rotation.set(.72,.18,.3);spin.add(blockOrbit);const orbitPositions=new Float32Array(96*3);for(let i=0;i<96;i++){const a=i/96*Math.PI*2;orbitPositions[i*3]=Math.cos(a)*1.6;orbitPositions[i*3+1]=Math.sin(a)*1.6;}const orbitGeo=new THREE.BufferGeometry();orbitGeo.setAttribute('position',new THREE.BufferAttribute(orbitPositions,3));geometries.push(orbitGeo);const orbitMat=new THREE.PointsMaterial({color:accent,size:.035,transparent:true,opacity:.68,depthWrite:false});materials.push(orbitMat);blockOrbit.add(new THREE.Points(orbitGeo,orbitMat));
      }
      let W=1,H=1,cx=1,cy=1,px=200,tcx=1,tcy=1,tpx=200,zoom=defaultZoom,targetZoom=defaultZoom,queue=0,last=performance.now(),lastInteraction=performance.now(),drag=false,pointerId=-1,lastX=0,lastY=0,downX=0,downY=0,vx=0,vy=0,resetting=false,moved=false,hovered=false,hasDragged=false;
      const homeOrientation=new THREE.Quaternion().setFromEuler(new THREE.Euler(home ? .15 : .12,home ? .55 : .75,0,home?'YXZ':'XYZ'));
      const mark=()=>{lastInteraction=performance.now();setHint(false)};
      const measure=()=>{const mr=main.getBoundingClientRect(),sr=stageLayout.getBoundingClientRect();W=Math.max(1,mr.width);H=Math.max(1,mr.height);renderer.setSize(W,H,false);camera.aspect=W/H;camera.updateProjectionMatrix();tcx=focus?W*.5:sr.left-mr.left+sr.width*.5;tcy=focus?H*.5:sr.top-mr.top+sr.height*.5;const stageMin=focus?Math.min(W,H):Math.min(sr.width,sr.height);tpx=home?stageMin*.38/(2*.85*defaultZoom):(focus?H:sr.height)*.09;};
      const ro=new ResizeObserver(measure);ro.observe(main);ro.observe(stageLayout);measure();cx=tcx;cy=tcy;px=tpx;
      const updateHover=(e:PointerEvent)=>{const mr=main.getBoundingClientRect(),dx=e.clientX-mr.left-cx,dy=e.clientY-mr.top-cy;hovered=home&&Math.hypot(dx,dy)<px*1.1*zoom;stage.classList.toggle(styles.atomHover,hovered)};
      const down=(e:PointerEvent)=>{drag=true;moved=false;pointerId=e.pointerId;lastX=downX=e.clientX;lastY=downY=e.clientY;stage.setPointerCapture(e.pointerId);stage.classList.add(styles.grabbing);if(labelLayer){window.clearTimeout(labelTimer);labelLayer.style.opacity='0'}mark()};
      const move=(e:PointerEvent)=>{updateHover(e);if(!drag||e.pointerId!==pointerId)return;const dx=e.clientX-lastX,dy=e.clientY-lastY,k=Math.PI/Math.max(260,px*1.6);if(Math.hypot(e.clientX-downX,e.clientY-downY)>5){moved=true;hasDragged=true}lastX=e.clientX;lastY=e.clientY;vx=dx*k;vy=dy*k;const qy=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),vx),qx=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),vy);spin.quaternion.premultiply(qy).premultiply(qx)};
      const up=(e:PointerEvent)=>{if(e.pointerId===pointerId){drag=false;stage.classList.remove(styles.grabbing);if(labelLayer)labelTimer=window.setTimeout(()=>{labelLayer.style.opacity='1'},1500);if(home&&!moved&&hovered&&!reduced&&pulse&&pulseMaterial){pulseProgress=0;pulse.visible=true;pulseMaterial.opacity=1}}};
      const leave=()=>{if(!drag){hovered=false;stage.classList.remove(styles.atomHover)}};
      const maxSafeZoom=()=>home?Math.min(3.4,Math.max(defaultZoom,Math.min(stageLayout.clientWidth,stageLayout.clientHeight)*.45/(Math.max(1,tpx)*.22))):3.4;
      const wheel=(e:WheelEvent)=>{e.preventDefault();mark();targetZoom=Math.min(maxSafeZoom(),Math.max(.55,targetZoom*Math.exp(-e.deltaY*(e.ctrlKey?.01:.0016))));setZoomState(targetZoom)};
      const keydown=(e:KeyboardEvent)=>{const q=new THREE.Quaternion();if(e.key==='ArrowLeft'||e.key==='ArrowRight'){q.setFromAxisAngle(new THREE.Vector3(0,1,0),e.key==='ArrowLeft'?-.18:.18);spin.quaternion.premultiply(q)}else if(e.key==='ArrowUp'||e.key==='ArrowDown'){q.setFromAxisAngle(new THREE.Vector3(1,0,0),e.key==='ArrowUp'?-.18:.18);spin.quaternion.premultiply(q)}else if(e.key==='+'||e.key==='='){targetZoom=Math.min(maxSafeZoom(),targetZoom*1.2)}else if(e.key==='-'){targetZoom=Math.max(.55,targetZoom/1.2)}else if(e.key==='0'){resetting=true;targetZoom=defaultZoom}else if(e.key==='Escape'){setFocus(false)}else return;e.preventDefault();mark();setZoomState(targetZoom)};
      stage.addEventListener('pointerdown',down);stage.addEventListener('pointermove',move);stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);stage.addEventListener('pointerleave',leave);stage.addEventListener('wheel',wheel,{passive:false});stage.addEventListener('keydown',keydown);
      actions.current={zoomIn:()=>{targetZoom=Math.min(maxSafeZoom(),targetZoom*1.35);setZoomState(targetZoom);mark()},zoomOut:()=>{targetZoom=Math.max(.55,targetZoom/1.35);setZoomState(targetZoom);mark()},turn:(n)=>{queue+=n;mark()},reset:()=>{resetting=true;targetZoom=defaultZoom;setZoomState(defaultZoom);mark()}};
      let frame=0;
      const render=(now:number)=>{const dt=Math.min(.05,(now-last)/1000);last=now;const e7=1-Math.exp(-dt*7);cx+=(tcx-cx)*e7;cy+=(tcy-cy)*e7;px+=(tpx-px)*e7;zoom+=(targetZoom-zoom)*(1-Math.exp(-dt*6));camera.position.z=H/(2*Math.tan(THREE.MathUtils.degToRad(13))*Math.max(1,px)*zoom);camera.setViewOffset(W,H,W/2-cx,H/2-cy,W,H);camera.lookAt(0,0,0);if(blockOrbit)blockOrbit.rotation.z+=dt*.18;if(home&&!reduced){electronPivots.forEach((electronPivot,index)=>electronPivot.rotation.z+=electronSpeeds[index]*dt);if(!hasDragged&&now-lastInteraction>4000)spin.rotateY(dt*.04);if(pulse&&pulseMaterial&&pulseProgress>=0){pulseProgress+=dt*1.45;const p=Math.min(1,pulseProgress),radius=.12+(.85-.12)*p,angle=p*Math.PI*.85;pulse.position.set(Math.cos(angle)*radius,Math.sin(angle)*radius,0);pulseMaterial.opacity=1-p;if(p>=1){pulseProgress=-1;pulse.visible=false}}}if(Math.abs(queue)>.001){const step=queue*(1-Math.exp(-dt*4.2));queue-=step;spin.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),step))}if(!drag){vx*=Math.exp(-dt*4.5);vy*=Math.exp(-dt*4.5);spin.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),vx)).premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),vy))}if(resetting){spin.quaternion.slerp(homeOrientation,1-Math.exp(-dt*6));if(spin.quaternion.angleTo(homeOrientation)<.002)resetting=false}if(!home&&!reduced){const idle=Math.min(1,Math.max(0,(now-lastInteraction-1800)/1500));pivot.rotation.y=Math.sin(now*.00055)*.16*idle;pivot.rotation.x=Math.sin(now*.0009)*.03*idle;pivot.position.y=Math.sin(now*.0013)*.028*idle}const duskNow=hero.dataset.light==='dusk';scene.environmentIntensity+=((duskNow?.28:.95)-scene.environmentIntensity)*(1-Math.exp(-dt*4));key.intensity+=((duskNow?2.6:1.6)-key.intensity)*(1-Math.exp(-dt*4));rim.intensity+=((duskNow?1.9:.5)-rim.intensity)*(1-Math.exp(-dt*4));nucleusMaterials.forEach(material=>{const target=material.userData.proton?(duskNow?.16:.05):0;material.emissiveIntensity+=(target-material.emissiveIntensity)*(1-Math.exp(-dt*5))});ringMaterials.forEach(material=>material.color.lerp(new THREE.Color(duskNow?'#8aa2ff':'#3a5bdb'),1-Math.exp(-dt*5)));scene.updateMatrixWorld();camera.updateMatrixWorld();if(home&&labelLayer){const project=(object:Object3D|null)=>{const point=new THREE.Vector3();if(object)object.getWorldPosition(point);point.project(camera);return{x:(point.x*.5+.5)*W,y:(-point.y*.5+.5)*H}};const electronPoints=electronMeshes.map(project),electronPoint=electronPoints.sort((a,b)=>a.y-b.y)[0]??{x:cx,y:cy};const targets={nucleus:{x:cx,y:cy},protons:project(protonTarget),neutrons:project(neutronTarget),electrons:electronPoint,charge:{x:cx-.85*px*zoom-8,y:cy-44}};const offsets={nucleus:[72,-8],protons:[-18,70],neutrons:[70,48],electrons:[54,-54],charge:[-112,0]} as const;labelNames.forEach(name=>{const node=labelNodes[name],target=targets[name],desiredX=target.x+offsets[name][0],desiredY=target.y+offsets[name][1];if(!node.ready){node.x=desiredX;node.y=desiredY;node.ready=true}else{node.x+=(desiredX-node.x)*e7;node.y+=(desiredY-node.y)*e7}if(node.text){node.text.style.left=`${node.x}px`;node.text.style.top=`${node.y}px`}if(node.line){node.line.setAttribute('x1',`${target.x}`);node.line.setAttribute('y1',`${target.y}`);node.line.setAttribute('x2',`${node.x}`);node.line.setAttribute('y2',`${node.y+7}`)}})}renderer.render(scene,camera);frame=requestAnimationFrame(render)};frame=requestAnimationFrame(render);
      cleanup=()=>{cancelAnimationFrame(frame);window.clearTimeout(labelTimer);ro.disconnect();stage.removeEventListener('pointerdown',down);stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerup',up);stage.removeEventListener('pointercancel',up);stage.removeEventListener('pointerleave',leave);stage.removeEventListener('wheel',wheel);stage.removeEventListener('keydown',keydown);geometries.forEach(geometry=>geometry.dispose());materials.forEach(material=>material.dispose());environment.dispose();pmrem.dispose();renderer.dispose()};
    });
    return()=>{disposed=true;cleanup()};
  },[focus,home]);

  useEffect(()=>{document.body.style.background=dusk?'#0f1116':'#f4f2ec';return()=>{document.body.style.background=''}},[dusk]);
  useEffect(()=>{const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setFocus(false)};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[]);
  useEffect(()=>{if(!home)return;setHint(true);const timer=window.setTimeout(()=>setHint(false),5000);return()=>window.clearTimeout(timer)},[home]);
  useEffect(()=>{if(!atomInfo)return;window.requestAnimationFrame(()=>document.querySelector<HTMLButtonElement>(`.${styles.atomInfoClose}`)?.focus());const close=(event:KeyboardEvent)=>{if(event.key==='Escape')closeAtomInfo()};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close)},[atomInfo]);

  return <div ref={heroRef} className={`${styles.hero} ${focus?styles.focus:''}`} data-light={dusk?'dusk':'day'} data-variant={home?'home':'block'}>
    <IconLibrary/>
    <aside className={styles.sidebar}>
      <div className={styles.brand}>PhySense<small>A field guide to physical law.</small></div>
      <nav>{nav.map(([icon,label,sub,href])=>{const active=home?label==='Home':label==='Block 1';return <Link key={label} href={href} className={active?styles.current:''} aria-current={active?'page':undefined}><Icon name={icon}/><span>{label}{sub&&<small>{sub}</small>}</span></Link>})}</nav>
      <div className={styles.featured}><span>Now learning</span><svg viewBox="0 0 92 76" aria-hidden="true"><path d="M9 57c14-1 20-16 31-23 11-8 23-10 42-13"/><circle cx="61" cy="26" r="8"/><path d="M12 58h2m8-7h2m8-8h2m8-8h2"/></svg><h2>Kinematics</h2><p>Position, velocity, and acceleration — the alphabet of motion.</p><Link href="/block-1/1-1">Continue lesson <Icon name="arrow-right"/></Link></div>
    </aside>
    <section ref={mainRef} className={styles.main}>
      <canvas id="gl" ref={canvasRef} className={styles.canvas}/>
      {home&&<div className={styles.atomLabels} role="note" aria-hidden="false">
        <svg aria-hidden="true"><line data-line="nucleus" className={atomInfo?.name==='nucleus'?styles.activeLeader:undefined}/><line data-line="protons" className={atomInfo?.name==='protons'?styles.activeLeader:undefined}/><line data-line="neutrons" className={atomInfo?.name==='neutrons'?styles.activeLeader:undefined}/><line data-line="electrons" className={atomInfo?.name==='electrons'?styles.activeLeader:undefined}/><line data-line="charge" className={atomInfo?.name==='charge'?styles.activeLeader:undefined}/></svg>
        {(['nucleus','protons','neutrons','electrons','charge'] as const).map(name=><button type="button" key={name} data-label={name} aria-label={name==='charge'?'What is electric charge?':atomFacts[name].title} className={atomInfo?.name===name?styles.activeAtomLabel:undefined} onClick={event=>openAtomInfo(name,event.currentTarget)}>{name==='charge'?'Electric charge':atomFacts[name].title}</button>)}
        {atomInfo&&<section className={`${styles.atomInfoCard} ${atomInfo.name==='charge'?styles.chargeCard:''}`} style={{left:atomInfo.left,top:atomInfo.top}} role="dialog" aria-labelledby={`atom-info-${atomInfo.name}`}>
          <button type="button" className={styles.atomInfoClose} aria-label={`Close ${atomFacts[atomInfo.name].title} information`} onClick={closeAtomInfo}>×</button>
          <h3 id={`atom-info-${atomInfo.name}`}>{atomFacts[atomInfo.name].title}</h3>
          {atomInfo.name==='charge'?<><p>Charge is a property of matter, like weight or temperature. But instead of measuring how heavy something is, charge measures how it pushes or pulls on other charged things.</p><p>There are two kinds:</p><ul><li>Positive charge — like protons</li><li>Negative charge — like electrons</li></ul><p>The one rule to remember:</p><blockquote role="note">Same charges push apart. Opposite charges pull together.</blockquote><p>That&apos;s it. Every electric force in the universe comes from this one rule. When you rub a balloon on your hair and it sticks, that&apos;s opposite charges pulling. When two magnets snap together or fly apart, the same idea is at work.</p><p className={styles.chargeAside}>So what does &apos;proton has positive charge&apos; mean? If you put a proton next to another proton, they push apart. If you put a proton next to an electron, they pull together.</p><p className={styles.chargeAside}>And what does &apos;neutron has no charge&apos; mean? If you put a neutron next to anything — a proton, an electron, another neutron — nothing happens. No push. No pull. It&apos;s electrically invisible. But it still has weight, so it still helps hold the nucleus together.</p><em>Neutral = no electric force at all.</em></>:<><p>{atomFacts[atomInfo.name].definition}</p><span>Did you know?</span><p>{atomFacts[atomInfo.name].fact}</p><button type="button" className={styles.mobileChargeLink} onClick={event=>openAtomInfo('charge',event.currentTarget)}>What is charge?</button></>}
        </section>}
        <span className={styles.srOnly} aria-live="polite">{atomInfo?`${atomFacts[atomInfo.name].title} info opened.`:''}</span>
      </div>}
      <div className={styles.mobileTop}><b>PhySense</b><div><button aria-label="Search" onClick={()=>notify('Search is coming soon.')}><Icon name="search"/></button><button aria-label="Notifications" onClick={()=>notify('No new notifications.')}><Icon name="bell"/></button><button className={styles.account} aria-label="Account" onClick={()=>notify('Account tools are coming soon.')}><Icon name="user"/></button></div></div>
      <div className={styles.tabs} role="tablist" aria-label="Learning blocks">
        {home ? <><button role="tab" aria-selected={tab===0} onClick={()=>switchTab(0)}><Icon name="home"/><span>Welcome<small>start here</small></span></button><button role="tab" aria-selected={tab===1} onClick={()=>switchTab(1)}><Icon name="map"/><span>How to use PhySense<small>five simple parts</small></span></button></> : <><button role="tab" aria-selected="true" onClick={()=>router.push('/block-1')}><Icon name="atom"/><span>Block 1 · Foundations<small>6 lessons</small></span></button><button role="tab" aria-selected="false" aria-disabled="true" data-locked onClick={()=>notify('Block 2 unlocks after Block 1.')}><Icon name="wave"/><span>Block 2 · Preview (locked)<small>coming next</small></span></button></>}
      </div>
      <div ref={dragRef} className={styles.dragSurface} tabIndex={0} onDoubleClick={()=>actions.current.reset()} aria-label="Interactive charged particle. Drag to rotate, scroll or pinch to zoom, and double-click to reset."/>
      <div ref={stageRef} className={styles.stage}>
        <div className={`${styles.shadow} ${loading?styles.hidden:''}`}/><div className={`${styles.loader} ${loading?styles.visible:''}`}><i/>Preparing the lesson…</div>
        {hint&&<div className={styles.hint}>{home?'Drag to rotate · click for energy pulse':'Drag to turn · scroll to zoom'}</div>}
        <div className={styles.rail}>
          <button aria-label="Zoom in" aria-pressed={zoomState>=1} onClick={()=>actions.current.zoomIn()}><Icon name="magnifier-plus"/></button>
          <button aria-label="Zoom out" aria-pressed={zoomState<1} onClick={()=>actions.current.zoomOut()}><Icon name="magnifier"/></button>
          <button aria-label="Expand scene" aria-pressed={focus} onClick={()=>setFocus(!focus)}><Icon name="expand"/></button>
          <button aria-label={dusk?'Use day light':'Use dusk light'} aria-pressed={dusk} onClick={()=>setDusk(!dusk)}><Icon name={dusk?'moon':'sun'}/></button>
        </div>
        <div className={styles.turn}><button aria-label="Turn left" onClick={()=>actions.current.turn(-Math.PI/2)}><Icon name="arrow-left"/></button><button onClick={()=>actions.current.turn(Math.PI*2)}>360°</button><button aria-label="Turn right" onClick={()=>actions.current.turn(Math.PI/2)}><Icon name="arrow-right"/></button></div>
        <p className={styles.caption}>{home?'Physics is not a list of formulas. It is a way of asking the universe what it is doing.':'Every law of physics is a promise the universe keeps.'}</p>
      </div>
      {toast&&<div className={styles.toast} role="status">{toast}</div>}
    </section>
    <section className={styles.info}>
      <div className={styles.tools}><label><Icon name="search"/><input aria-label="Search" placeholder="Search topics, laws, or equations…"/></label><button aria-label="Notifications" onClick={()=>notify('No new notifications.')}><Icon name="bell"/></button><button className={styles.account} aria-label="Account" onClick={()=>notify('Account tools are coming soon.')}><Icon name="user"/></button></div>
      <article className={styles.detail} aria-live="polite">{home?<HomeDetail/>:<BlockDetail/>}</article>
    </section>
  </div>;
}

function BlockDetail(){return <><span className={styles.eyebrow}>Block 1 · Foundation</span><h1>The Intuition &amp; Calculus Spark</h1><div className={styles.tags}><span>Mechanics</span><span>Calculus</span><span>6 lessons</span></div><p>Build physical reality with your hands — motion, forces, spin, energy, collisions — then learn the calculus that describes all of it. Six lessons, no prerequisites beyond middle-school math.</p><h2 id="lesson-map">What you&apos;ll learn</h2><div className={styles.lessons}>{lessons.map(([n,name,text,icon])=><div key={n}><Icon name={icon}/><b>{n}</b><span>{name}</span><small>{text}</small></div>)}</div><h2>Starting point</h2><div className={styles.starting}><Icon name="arrow-right"/><span>Begin at Lesson 1.1 — Kinematics</span></div><Link className={styles.startButton} href="/block-1/1-1"><svg viewBox="0 0 76 58" aria-hidden="true"><path d="M7 48c12-2 18-19 29-25s19-5 33-14"/><path d="M31 42 61 12"/><circle cx="43" cy="29" r="3"/></svg><span><b>Start Block 1</b><small>Six lessons. Take them in order.</small></span><Icon name="chevron-right"/></Link></>}

const homeRows:[IconName,string,string][]=[['map','Blocks','Four blocks, from intuition to mastery'],['steps','Phases','Each block splits into small, ordered lessons'],['lab','Labs','Every lesson has something to drag, launch, or watch'],['equation','Equations',"Formulas come last — after you've earned them"],['check','Challenges','One real-world problem per lesson to prove it']];
function HomeDetail(){return <><span className={styles.eyebrow}>A field guide to physical law</span><h1>Learn physics from the ground up.</h1><div className={styles.tags}><span>No prerequisites</span><span>Interactive</span><span>Free</span></div><p>PhySense takes you from the very first question — &apos;what is motion?&apos; — all the way to the equations that describe light, heat, and the quantum world. Everything here is built around one idea: you should see the physics before you memorise the math.</p><h2>How it works</h2><div className={styles.homeRows}>{homeRows.map(([icon,name,text])=><div key={name}><Icon name={icon}/><b>{name}</b><small>{text}</small></div>)}</div><h2>Where to start</h2><p>If you&apos;ve never studied physics before, begin at Block 1 · Lesson 1.1 — Kinematics. If you already know the basics, jump to Math Spark or pick any block from the sidebar.</p><Link className={styles.startButton} href="/block-1/1-1"><svg viewBox="0 0 76 58" aria-hidden="true"><circle cx="29" cy="29" r="15"/><path d="M29 29h34m-8-8 8 8-8 8"/></svg><span><b>Start with Lesson 1.1</b><small>Kinematics — motion in 1D and 2D.</small></span><Icon name="chevron-right"/></Link></>}
