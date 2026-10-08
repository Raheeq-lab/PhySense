'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Pause, Sparkles, Activity, Compass, Gauge, Zap } from 'lucide-react';

export default function ProjectileSimulator() {
  const [velocity, setVelocity] = useState<number>(45); // m/s
  const [angle, setAngle] = useState<number>(45); // deg
  const [gravity, setGravity] = useState<number>(9.81); // m/s^2
  const [initialHeight, setInitialHeight] = useState<number>(0); // m
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [showVectors, setShowVectors] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Derived physics values
  const rad = (angle * Math.PI) / 180;
  const vx0 = velocity * Math.cos(rad);
  const vy0 = velocity * Math.sin(rad);

  // Quadratic formula for flight time with height h0:
  // -0.5 * g * t^2 + vy0 * t + h0 = 0
  const discriminant = vy0 * vy0 + 2 * gravity * initialHeight;
  const totalFlightTime = discriminant >= 0 ? (vy0 + Math.sqrt(discriminant)) / gravity : 0;
  const maxRange = vx0 * totalFlightTime;
  const maxHeight = initialHeight + (vy0 * vy0) / (2 * gravity);

  // Current state at time t
  const currentT = Math.min(timeElapsed, totalFlightTime);
  const currentX = vx0 * currentT;
  const currentY = Math.max(0, initialHeight + vy0 * currentT - 0.5 * gravity * currentT * currentT);
  const currentVy = vy0 - gravity * currentT;
  const currentSpeed = Math.sqrt(vx0 * vx0 + currentVy * currentVy);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background with sleek grid
    ctx.clearRect(0, 0, width, height);

    // Dark sleek background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#090d16');
    bgGradient.addColorStop(1, '#05070c');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Coordinate scale
    const padding = 50;
    const groundY = height - padding;
    const originX = padding;

    const scaleX = (width - padding * 2) / Math.max(100, maxRange * 1.15);
    const scaleY = (height - padding * 2) / Math.max(60, maxHeight * 1.35);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = originX; x < width - padding; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, groundY);
      ctx.stroke();
    }
    for (let y = groundY; y > padding; y -= 40) {
      ctx.beginPath();
      ctx.moveTo(originX, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Ground platform line
    ctx.strokeStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX - 10, groundY);
    ctx.lineTo(width - padding + 20, groundY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Ground glow baseline
    const groundGlow = ctx.createLinearGradient(0, groundY, 0, height);
    groundGlow.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
    groundGlow.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
    ctx.fillStyle = groundGlow;
    ctx.fillRect(originX - 10, groundY, width - padding + 30, height - groundY);

    // Draw full theoretical trajectory (dashed cyan)
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * totalFlightTime;
      const x = originX + (vx0 * t) * scaleX;
      const y = groundY - (initialHeight + vy0 * t - 0.5 * gravity * t * t) * scaleY;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw traversed path trail (glowing solid gradient)
    if (currentT > 0) {
      ctx.beginPath();
      const trailSteps = 50;
      for (let i = 0; i <= trailSteps; i++) {
        const t = (i / trailSteps) * currentT;
        const x = originX + (vx0 * t) * scaleX;
        const y = groundY - (initialHeight + vy0 * t - 0.5 * gravity * t * t) * scaleY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#06b6d4';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Launch Cannon Platform
    const launchCanvasX = originX;
    const launchCanvasY = groundY - initialHeight * scaleY;

    // Cannon base
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(launchCanvasX, launchCanvasY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Cannon barrel vector
    const barrelLength = 26;
    const barrelEndX = launchCanvasX + Math.cos(rad) * barrelLength;
    const barrelEndY = launchCanvasY - Math.sin(rad) * barrelLength;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(launchCanvasX, launchCanvasY);
    ctx.lineTo(barrelEndX, barrelEndY);
    ctx.stroke();

    // Current Projectile Position
    const projX = originX + currentX * scaleX;
    const projY = groundY - currentY * scaleY;

    // Glowing particle orb
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 20;
    const orbGrad = ctx.createRadialGradient(projX, projY, 2, projX, projY, 9);
    orbGrad.addColorStop(0, '#ffffff');
    orbGrad.addColorStop(0.5, '#38bdf8');
    orbGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = orbGrad;
    ctx.beginPath();
    ctx.arc(projX, projY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Vector Decompositions if enabled
    if (showVectors && currentT < totalFlightTime) {
      const vScale = 0.8;

      // Horizontal component (vx, emerald)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(projX, projY);
      ctx.lineTo(projX + vx0 * vScale, projY);
      ctx.stroke();

      // Vertical component (vy, amber)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(projX, projY);
      ctx.lineTo(projX, projY - currentVy * vScale);
      ctx.stroke();

      // Net velocity resultant (cyan)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(projX, projY);
      ctx.lineTo(projX + vx0 * vScale, projY - currentVy * vScale);
      ctx.stroke();
    }
  }, [velocity, angle, gravity, initialHeight, timeElapsed, showVectors, maxRange, maxHeight, totalFlightTime, vx0, vy0, rad, currentT, currentX, currentY, currentVy]);

  // Animation controller
  useEffect(() => {
    if (!isRunning) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      setTimeElapsed((prev) => {
        const next = prev + delta;
        if (next >= totalFlightTime) {
          setIsRunning(false);
          return totalFlightTime;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, totalFlightTime]);

  const handleFire = () => {
    if (timeElapsed >= totalFlightTime) {
      setTimeElapsed(0);
    }
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeElapsed(0);
  };

  return (
    <div className="rounded-2xl p-6 shadow-lg border" style={{ background: 'var(--panel)', borderColor: 'var(--line)', color: 'var(--ink)' }}>
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b" style={{ borderColor: 'var(--line)' }}>
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border" style={{ background: 'var(--sage-tint)', color: 'var(--sage)', borderColor: 'var(--line)' }}>
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-newsreader), serif', color: 'var(--ink)', letterSpacing: '-0.015em' }}>
              Kinematics Simulator
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border" style={{ background: 'var(--sage-tint)', color: 'var(--sage)', borderColor: 'var(--line)' }}>
                2D Parabolic Motion
              </span>
            </h2>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Real-time vector decomposition &amp; suvat kinematic trajectories with live telemetry.
          </p>
        </div>

        {/* Vector Toggle & Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowVectors(!showVectors)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border"
            style={showVectors ? { background: 'var(--sage-tint)', color: 'var(--sage)', borderColor: 'var(--sage)' } : { background: 'var(--bg)', color: 'var(--muted)', borderColor: 'var(--line)' }}
          >
            <Compass className="w-3.5 h-3.5" />
            {showVectors ? 'Vectors On' : 'Vectors Off'}
          </button>

          <button
            onClick={isRunning ? () => setIsRunning(false) : handleFire}
            className="flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm transition-all active:scale-95"
            style={{ background: 'var(--sage)', color: 'var(--sage-ink)' }}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> {timeElapsed > 0 && timeElapsed < totalFlightTime ? 'Resume' : 'Launch'}
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl border transition-colors"
            style={{ background: 'var(--bg)', borderColor: 'var(--line)', color: 'var(--muted)' }}
            title="Reset Flight"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full rounded-xl overflow-hidden border shadow-inner mb-6" style={{ borderColor: 'var(--line)', background: '#0a0f07' }}>
        <canvas
          ref={canvasRef}
          width={840}
          height={380}
          className="w-full h-[300px] sm:h-[360px] object-cover block"
        />

        {/* Live overlay badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
          {[
            { label: 't', val: `${currentT.toFixed(2)}s / ${totalFlightTime.toFixed(2)}s` },
            { label: 'x', val: `${currentX.toFixed(1)}m` },
            { label: 'y', val: `${currentY.toFixed(1)}m` },
            { label: '|v|', val: `${currentSpeed.toFixed(1)} m/s` },
          ].map(({ label, val }) => (
            <div key={label} className="backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono border" style={{ background: 'rgba(26,31,21,0.85)', borderColor: 'rgba(169,185,138,0.3)', color: '#a9b98a' }}>
              {label} = <span style={{ color: '#f2ecdf', fontWeight: 700 }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Vector legend in corner */}
        {showVectors && (
          <div className="absolute bottom-4 right-4 backdrop-blur-md border p-2.5 rounded-lg text-[11px] font-mono space-y-1 pointer-events-none" style={{ background: 'rgba(20,23,15,0.88)', borderColor: 'rgba(169,185,138,0.25)', color: '#a8a392' }}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-0.5 bg-[#a9b98a] rounded" /> Resultant |v|
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-0.5 bg-[#6ab187] rounded" /> Vx = {vx0.toFixed(1)} m/s
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-0.5 bg-[#d4a96a] rounded" /> Vy = {currentVy.toFixed(1)} m/s
            </div>
          </div>
        )}
      </div>

      {/* Live Physics Telemetry & Parameter Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Range (R)', val: `${maxRange.toFixed(1)} m`, sub: 'R = u² sin2θ / g', icon: Activity },
          { label: 'Peak Height', val: `${maxHeight.toFixed(1)} m`, sub: 'H = u² sin²θ / 2g', icon: Gauge },
          { label: 'Flight Time', val: `${totalFlightTime.toFixed(2)} s`, sub: 'T = 2u sinθ / g', icon: Zap },
          { label: 'Launch Vector', val: `${velocity} m/s @ ${angle}°`, sub: `Vx=${vx0.toFixed(1)} Vy₀=${vy0.toFixed(1)}`, icon: Compass },
        ].map(({ label, val, sub, icon: Icon }) => (
          <div key={label} className="p-4 rounded-xl border transition-all" style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}>
            <div className="flex items-center justify-between text-xs font-semibold mb-1" style={{ color: 'var(--muted)' }}>
              <span>{label}</span>
              <Icon className="w-3.5 h-3.5" style={{ color: 'var(--sage)' }} />
            </div>
            <div className="text-xl font-bold font-mono" style={{ color: 'var(--ink)' }}>
              {val}
            </div>
            <div className="text-[11px] mt-1 font-mono" style={{ color: 'var(--sage)' }}>
              {sub}
            </div>
          </div>
        ))}
      </div>

      {/* Sliders Control Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-4 rounded-xl border" style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}>
        {/* Velocity Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium" style={{ color: 'var(--ink)' }}>Initial Velocity (u)</span>
            <span className="font-mono font-bold" style={{ color: 'var(--sage)' }}>{velocity} m/s</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={velocity}
            onChange={(e) => {
              setVelocity(Number(e.target.value));
              setTimeElapsed(0);
              setIsRunning(false);
            }}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: 'var(--sage)' }}
          />
        </div>

        {/* Launch Angle Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium" style={{ color: 'var(--ink)' }}>Launch Angle (θ)</span>
            <span className="font-mono font-bold" style={{ color: 'var(--sage)' }}>{angle}°</span>
          </div>
          <input
            type="range"
            min="5"
            max="85"
            value={angle}
            onChange={(e) => {
              setAngle(Number(e.target.value));
              setTimeElapsed(0);
              setIsRunning(false);
            }}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: 'var(--sage)' }}
          />
        </div>

        {/* Gravity Slider (Earth / Moon / Mars presets) */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium" style={{ color: 'var(--ink)' }}>Gravitational Field (g)</span>
            <span className="font-mono font-bold" style={{ color: 'var(--sage)' }}>{gravity} m/s²</span>
          </div>
          <input
            type="range"
            min="1.6"
            max="25.0"
            step="0.1"
            value={gravity}
            onChange={(e) => {
              setGravity(Number(e.target.value));
              setTimeElapsed(0);
              setIsRunning(false);
            }}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: 'var(--sage)' }}
          />
          <div className="flex gap-1.5 text-[10px] font-mono" style={{ color: 'var(--muted)' }}>
            {[{ label: 'Moon (1.6)', val: 1.62 }, { label: 'Mars (3.7)', val: 3.72 }, { label: 'Earth (9.8)', val: 9.81 }].map(({ label, val }) => (
              <button
                key={label}
                onClick={() => { setGravity(val); setTimeElapsed(0); }}
                className="px-1.5 py-0.5 rounded border transition-all"
                style={gravity === val
                  ? { borderColor: 'var(--sage)', color: 'var(--sage)' }
                  : { borderColor: 'var(--line)', color: 'var(--muted)' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Initial Elevation Height */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium" style={{ color: 'var(--ink)' }}>Launch Elevation (h₀)</span>
            <span className="font-mono font-bold" style={{ color: 'var(--sage)' }}>{initialHeight} m</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={initialHeight}
            onChange={(e) => {
              setInitialHeight(Number(e.target.value));
              setTimeElapsed(0);
              setIsRunning(false);
            }}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: 'var(--sage)' }}
          />
        </div>
      </div>
    </div>
  );
}
