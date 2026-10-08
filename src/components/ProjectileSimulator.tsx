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
  const startTimeRef = useRef<number | null>(null);

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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl text-white">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Interactive Kinematics Simulator
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                2D Parabolic Motion
              </span>
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time vector decomposition &amp; suvat kinematic trajectories with live telemetry.
          </p>
        </div>

        {/* Vector Toggle & Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowVectors(!showVectors)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              showVectors
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            {showVectors ? 'Vectors Active (Vx, Vy, V)' : 'Hide Vectors'}
          </button>

          <button
            onClick={isRunning ? () => setIsRunning(false) : handleFire}
            className="flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all active:scale-95"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" /> {timeElapsed > 0 && timeElapsed < totalFlightTime ? 'Resume' : 'Launch Projectile'}
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title="Reset Flight"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-[#070b14] shadow-inner mb-6">
        <canvas
          ref={canvasRef}
          width={840}
          height={380}
          className="w-full h-[320px] sm:h-[380px] object-cover block"
        />

        {/* Live overlay badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300">
            t = <span className="font-bold text-white">{currentT.toFixed(2)}s</span> / {totalFlightTime.toFixed(2)}s
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-300">
            x = <span className="font-bold text-white">{currentX.toFixed(1)}m</span>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-lg text-xs font-mono text-amber-300">
            y = <span className="font-bold text-white">{currentY.toFixed(1)}m</span>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-lg text-xs font-mono text-purple-300">
            |v| = <span className="font-bold text-white">{currentSpeed.toFixed(1)} m/s</span>
          </div>
        </div>

        {/* Vector legend in corner */}
        {showVectors && (
          <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-2.5 rounded-lg text-[11px] font-mono space-y-1 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-0.5 bg-[#38bdf8] rounded" /> Resultant Vector |v|
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-0.5 bg-[#10b981] rounded" /> Vx (Horizontal = {vx0.toFixed(1)} m/s)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-0.5 bg-[#f59e0b] rounded" /> Vy (Vertical = {currentVy.toFixed(1)} m/s)
            </div>
          </div>
        )}
      </div>

      {/* Live Physics Telemetry & Parameter Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Metric 1: Max Range */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Theoretical Range (R)</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {maxRange.toFixed(1)} <span className="text-sm font-normal text-slate-400">meters</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            R = (u² sin 2θ) / g
          </div>
        </div>

        {/* Metric 2: Max Height */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Peak Height (H_max)</span>
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">
            {maxHeight.toFixed(1)} <span className="text-sm font-normal text-slate-400">meters</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            H = (u² sin²θ) / (2g)
          </div>
        </div>

        {/* Metric 3: Total Flight Time */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Time of Flight (T)</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {totalFlightTime.toFixed(2)} <span className="text-sm font-normal text-slate-400">seconds</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            T = (2u sinθ) / g
          </div>
        </div>

        {/* Metric 4: Launch Kinetic Energy */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Initial Velocity Vector</span>
            <Compass className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">
            {velocity} <span className="text-sm font-normal text-slate-400">m/s @ {angle}°</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            Vx = {vx0.toFixed(1)} | Vy₀ = {vy0.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Sliders Control Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
        {/* Velocity Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Initial Velocity (u)</span>
            <span className="font-mono text-cyan-400 font-bold">{velocity} m/s</span>
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Launch Angle Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Launch Angle (θ)</span>
            <span className="font-mono text-cyan-400 font-bold">{angle}°</span>
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Gravity Slider (Earth / Moon / Mars presets) */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Gravitational Field (g)</span>
            <span className="font-mono text-cyan-400 font-bold">{gravity} m/s²</span>
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex gap-1.5 text-[10px] text-slate-500 font-mono">
            <button
              onClick={() => { setGravity(1.62); setTimeElapsed(0); }}
              className={`px-1.5 py-0.5 rounded border ${gravity === 1.62 ? 'border-cyan-500 text-cyan-400' : 'border-slate-800 hover:text-slate-300'}`}
            >
              Moon (1.6)
            </button>
            <button
              onClick={() => { setGravity(3.72); setTimeElapsed(0); }}
              className={`px-1.5 py-0.5 rounded border ${gravity === 3.72 ? 'border-cyan-500 text-cyan-400' : 'border-slate-800 hover:text-slate-300'}`}
            >
              Mars (3.7)
            </button>
            <button
              onClick={() => { setGravity(9.81); setTimeElapsed(0); }}
              className={`px-1.5 py-0.5 rounded border ${gravity === 9.81 ? 'border-cyan-500 text-cyan-400' : 'border-slate-800 hover:text-slate-300'}`}
            >
              Earth (9.8)
            </button>
          </div>
        </div>

        {/* Initial Elevation Height */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Launch Elevation (h₀)</span>
            <span className="font-mono text-cyan-400 font-bold">{initialHeight} m</span>
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>
    </div>
  );
}
