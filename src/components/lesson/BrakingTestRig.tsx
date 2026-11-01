'use client';

import { useEffect, useId, useRef } from 'react';
import { Bench, Cart, face, moveCart, projection } from './braking-rig/art';
import { translateAlong } from './braking-rig/iso-kit';
import { brakingAt, STOP_TIME } from './braking-rig/model';
import styles from './braking-rig/rig.module.css';

type Action = 'play' | 'reset' | 'pause' | number;
const tickAngles = Array.from({ length: 31 }, (_, i) => -225 + i * 9);

/** Self-contained lesson reference. All motion/readouts derive from brakingAt(t). */
export default function BrakingTestRig() {
  const id = useId().replaceAll(':', '');
  const root = useRef<HTMLElement>(null);
  const cart = useRef<SVGGElement>(null);
  const shoe = useRef<SVGGElement>(null);
  const needle = useRef<SVGGElement>(null);
  const readout = useRef<HTMLOutputElement>(null);
  const status = useRef<HTMLSpanElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const control = useRef<(action: Action) => void>(() => {});

  useEffect(() => {
    const element = root.current!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wheels = element.querySelectorAll<SVGGElement>('[data-wheel]');
    const drums = element.querySelectorAll<SVGGElement>('[data-drum]');
    let time = 0, frame = 0, last = 0, wait = 0;
    let visible = false, playing = false, touring = !reduced.matches;
    let suspended = false;
    const draw = () => {
      const model = brakingAt(time);
      cart.current?.setAttribute('transform', moveCart(model.position));
      shoe.current?.setAttribute('transform', translateAlong(projection, [time > 0 || playing ? -1 : 3, 0, 0]));
      needle.current?.setAttribute('transform', `rotate(${-225 + model.velocity * 18})`);
      wheels.forEach(wheel => wheel.setAttribute('transform', `rotate(${model.position * 21 / 15 * 180 / Math.PI})`));
      // Odometer drums carry together only at the end of each lower-place cycle.
      const hundredths = Math.round(model.position * 100000) / 1000;
      drums.forEach((drum, index) => {
        const divisor = 10 ** (3-index);
        const digit = Math.floor(hundredths / divisor) % 10;
        const carry = Math.max(0, hundredths % divisor - divisor + 1);
        drum.setAttribute('transform', `translate(0,${-(digit+carry)*25})`);
      });
      if (slider.current) slider.current.value = String(time);
      if (readout.current) readout.current.textContent = `${time.toFixed(2)} s · ${model.velocity.toFixed(2)} m/s · ${model.position.toFixed(2)} m`;
      element.dataset.phase = time >= STOP_TIME ? 'stopped' : playing || time > 0 ? 'braking' : 'ready';
    };
    const announce = (message: string) => { if (status.current) status.current.textContent = message; };
    const cancel = () => { cancelAnimationFrame(frame); frame = 0; last = 0; };
    const run = () => {
      if (!frame && visible && !document.hidden && !suspended && (playing || touring)) frame = requestAnimationFrame(tick);
    };
    function tick(now: number) {
      frame = 0;
      const dt = last ? Math.min((now-last)/1000, 1/30) : 0;
      last = now;
      if (playing) {
        time = Math.min(STOP_TIME, time + dt);
        if (time >= STOP_TIME) {
          playing = false; wait = 0;
          announce('Stopped after 2.50 seconds. Velocity is zero. Position is 18.75 metres.');
        }
      } else if (touring) {
        wait += dt;
        if (wait > (time === 0 ? 1.8 : 3.6)) { time = 0; playing = true; wait = 0; }
      }
      draw(); run();
    }
    control.current = action => {
      touring = false; suspended = false; cancel();
      if (typeof action === 'number') {
        playing = false; time = brakingAt(action).t;
        const sample = brakingAt(time);
        announce(`At ${time.toFixed(2)} seconds: velocity ${sample.velocity.toFixed(2)} metres per second; position ${sample.position.toFixed(2)} metres.`);
      } else if (action === 'play') {
        time = 0; playing = !reduced.matches;
        if (reduced.matches) time = STOP_TIME;
        announce(reduced.matches ? 'Stopped at 18.75 metres. Use the time slider to inspect intermediate values.' : 'Brake applied. Velocity falls while position continues to increase.');
      } else if (action === 'reset') {
        playing = false; time = 0; announce('Ready. Initial velocity 15 metres per second. Position zero.');
      } else { playing = false; announce('Paused. Use the time slider to inspect the motion.'); }
      draw(); run();
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[entries.length-1].isIntersecting;
      if (visible) run(); else cancel();
    }, { threshold: .15 });
    const visibility = () => { if (document.hidden) cancel(); else run(); };
    const motion = () => { if (reduced.matches) { touring = false; playing = false; cancel(); draw(); } };
    const holdTour = () => { if (touring) { suspended = true; cancel(); } };
    const releaseTour = () => { if (!element.matches(':hover') && !element.contains(document.activeElement)) { suspended = false; run(); } };
    element.addEventListener('pointerenter', holdTour);
    element.addEventListener('pointerleave', releaseTour);
    element.addEventListener('focusin', holdTour);
    element.addEventListener('focusout', releaseTour);
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', motion);
    observer.observe(element); draw();
    return () => {
      cancel(); observer.disconnect(); control.current = () => {};
      element.removeEventListener('pointerenter', holdTour); element.removeEventListener('pointerleave', releaseTour);
      element.removeEventListener('focusin', holdTour); element.removeEventListener('focusout', releaseTour);
      document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', motion);
    };
  }, []);

  return <figure ref={root} className={styles.figure} data-braking-rig="" aria-labelledby={`${id}-title`}>
    <div className={styles.topline}><span>FIG. 1.1 / MOTION REFERENCE</span><span>Braking only</span></div>
    <div className={styles.intro}><h3 id={`${id}-title`}>Slowing down. Still moving forward.</h3><p>Press the brake. Watch the needle fall while the counter keeps turning.</p></div>
    <div className={styles.stage}>
      <svg viewBox="0 0 940 470" role="img" aria-labelledby={`${id}-svg-title ${id}-svg-desc`}>
        <title id={`${id}-svg-title`}>A cart braking on a straight test track</title>
        <desc id={`${id}-svg-desc`}>The orange brake shoe presses the front wheel. A velocity dial decreases from 15 to 0 metres per second while the position counter increases from 0 to 18.75 metres. The cart stops after 2.5 seconds.</desc>
        <Bench/>
        <g transform={face(290,36,151)}>
          {[-48,48].flatMap(x => [-28,28].map(y => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="2" fill="#879482" stroke="#fafbed" strokeWidth=".6"/><path className="iso-line" d={`M${x-1},${y}h2`} stroke="#42533f" strokeWidth=".6"/></g>))}
          <circle r="34" fill="#e6e9df" stroke="#566457" strokeWidth="3"/>
          <circle r="30" fill="#fbfaf0" stroke="#b3bbae" strokeWidth="1"/>
          {tickAngles.map((angle, i) => <path className="iso-line" key={i} transform={`rotate(${angle})`} d={`M${i%5===0?23:26},0H29`} stroke="#596858" strokeWidth={i%5===0?1:.5}/>)}
          {[0,5,10,15].map((v,i) => {const a=(-225+i*90)*Math.PI/180;return <text key={v} x={19*Math.cos(a)} y={19*Math.sin(a)+2} textAnchor="middle" fontSize="6" fill="#344b39">{v}</text>;})}
          <text y="17" textAnchor="middle" fontSize="5" fill="#5c6b59">m/s</text>
          <g ref={needle} transform="rotate(45)"><path d="M-6,-1.7L25,0L-6,1.7Z" fill="#bd5937"/></g>
          <circle r="3" fill="#6c7768"/><circle r="1.3" fill="#e3e6d9"/>
        </g>
        <g transform={face(374,36,169)}>
          <rect x="-3" y="-3" width="127" height="32" rx="3" fill="#3c493e" stroke="#83917f"/>
          {[0,1,2,3].map(i => <g key={i} transform={`translate(${i*27+(i>1?7:0)},0)`}>
            <defs><clipPath id={`${id}-drum-${i}`}><rect width="24" height="25" rx="2"/></clipPath></defs>
            <g clipPath={`url(#${id}-drum-${i})`}>
              <rect width="24" height="25" fill="#ececdf"/>
              <g data-drum="">{Array.from({length:11},(_,n)=><text key={n} x="12" y={18+n*25} textAnchor="middle" fontFamily="monospace" fontSize="20" fill="#334736">{n%10}</text>)}</g>
              <path className="iso-line" d="M0,1H24M0,24H24" stroke="#a3ac9e"/>
            </g>
          </g>)}
          <circle cx="55" cy="21" r="1.8" fill="#f1eee0"/>
          <text x="115" y="22" fontSize="7" fill="#f1eee0">m</text>
        </g>
        <g ref={cart}><Cart shoeRef={shoe}/></g>
      </svg>
    </div>
    <div className={styles.instrumentKey}><span><i/> Velocity dial <b>falls toward zero</b></span><span>Position counter <b>keeps increasing</b></span></div>
    <div className={styles.controls}>
      <div className={styles.buttons}><button type="button" onClick={() => control.current('play')}>Press brake / replay <span aria-hidden="true">↗</span></button><button type="button" onClick={() => control.current('pause')}>Pause</button><button type="button" onClick={() => control.current('reset')}>Reset</button></div>
      <label className={styles.scrubber}><span>Inspect time <small>0–2.50 s</small></span><input ref={slider} type="range" min="0" max="2.5" step="0.01" defaultValue="0" aria-label="Braking time in seconds" onChange={event => control.current(Number(event.target.value))}/></label>
    </div>
    <div className={styles.bottomline}><span>15 m/s initially · a = −6 m/s² while braking</span><output ref={readout} aria-live="off">0.00 s · 15.00 m/s · 0.00 m</output></div>
    <figcaption className={styles.caption}><p><strong>The deceleration paradox.</strong> Negative acceleration reduces positive velocity. Position keeps increasing as long as velocity is above zero. At <strong>2.50 s</strong>, the cart stops at <strong>18.75 m</strong>; it does not reverse.</p><p><span>v = 15 − 6t</span><span>x = 15t − 3t²</span><span>0 ≤ t ≤ 2.5 s</span></p><small>Position is measured from where braking begins. The lesson’s 0.75 s reaction time is excluded. Track and cart are schematic; travel is scaled to the stopping distance.</small></figcaption>
    <span ref={status} className={styles.srOnly} role="status" aria-live="polite">Ready. Initial velocity 15 metres per second.</span>
  </figure>;
}
