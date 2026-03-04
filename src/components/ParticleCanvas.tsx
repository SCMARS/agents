"use client";

import { useEffect, useRef } from "react";
import { CallStatus } from "@/lib/types";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

interface ParticleCanvasProps {
  status: CallStatus;
}

function getStatusColor(status: CallStatus): string {
  switch (status) {
    case "active":
      return "0, 211, 238"; // cyan
    case "speaking":
      return "244, 114, 182"; // pink
    case "connecting":
      return "251, 146, 60"; // orange
    default:
      return "168, 85, 247"; // purple
  }
}

export default function ParticleCanvas({ status }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init particles
    const COUNT = 60;
    particles.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = getStatusColor(statusRef.current);
      const isActive = statusRef.current === "active" || statusRef.current === "speaking";
      const speed = isActive ? 1.8 : 1;

      for (const p of particles.current) {
        p.pulse += p.pulseSpeed * speed;
        const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.2;

        // Move
        p.x += p.vx * speed;
        p.y += p.vy * speed;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + Math.sin(p.pulse) * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${Math.max(0, Math.min(1, pulseOpacity))})`;
        ctx.fill();

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 6);
        gradient.addColorStop(0, `rgba(${color}, ${pulseOpacity * 0.3})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 6, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i];
          const b = particles.current[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          const maxDist = 100;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.25;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Central orb
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const orbR = isActive ? 28 + Math.sin(Date.now() * 0.003) * 6 : 20;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, orbR * 4);
      glow.addColorStop(0, `rgba(${color}, 0.35)`);
      glow.addColorStop(0.5, `rgba(${color}, 0.12)`);
      glow.addColorStop(1, `rgba(${color}, 0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, orbR * 4, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, orbR);
      core.addColorStop(0, `rgba(255,255,255,0.9)`);
      core.addColorStop(0.4, `rgba(${color}, 0.7)`);
      core.addColorStop(1, `rgba(${color}, 0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, orbR, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  );
}
