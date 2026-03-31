import { useEffect, useRef, useState } from "react";
import { ZETA_ZEROS } from "@/data/concepts";

export function ZetaAxisVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);
  const [zeroCount, setZeroCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    // Rolling zero counter
    let count = 0;
    const counterInterval = setInterval(() => {
      count = Math.min(count + Math.floor(Math.random() * 8500000 + 3000000), 10000000000000);
      setZeroCount(count);
    }, 50);

    function draw() {
      if (!ctx || !canvas) return;
      tRef.current += 0.012;
      const t = tRef.current;

      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, W, H);

      // === GRAVITY AXIS (vertical — top and bottom poles) ===
      // Top gravitational attractor
      const gravPulse = Math.sin(t * 0.7) * 0.3 + 0.7;
      ctx.strokeStyle = `rgba(0,255,80,${gravPulse * 0.9})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, cy - 20);
      ctx.stroke();

      // Bottom gravitational attractor
      ctx.strokeStyle = `rgba(0,255,80,${gravPulse * 0.9})`;
      ctx.beginPath();
      ctx.moveTo(cx, H);
      ctx.lineTo(cx, cy + 20);
      ctx.stroke();

      // Top pole glow
      const topPulse = Math.sin(t * 1.1 + 1) * 10 + 15;
      const topGrad = ctx.createRadialGradient(cx, 10, 0, cx, 10, topPulse * 2);
      topGrad.addColorStop(0, `rgba(0,255,80,${gravPulse * 0.8})`);
      topGrad.addColorStop(1, "transparent");
      ctx.fillStyle = topGrad;
      ctx.beginPath();
      ctx.arc(cx, 10, topPulse * 2, 0, Math.PI * 2);
      ctx.fill();

      // Bottom pole glow
      const botGrad = ctx.createRadialGradient(cx, H - 10, 0, cx, H - 10, topPulse * 2);
      botGrad.addColorStop(0, `rgba(0,255,80,${gravPulse * 0.8})`);
      botGrad.addColorStop(1, "transparent");
      ctx.fillStyle = botGrad;
      ctx.beginPath();
      ctx.arc(cx, H - 10, topPulse * 2, 0, Math.PI * 2);
      ctx.fill();

      // === MAGNETIC AXIS (lateral — left and right oscillation) ===
      const magOscillation = Math.sin(t * 1.8) * 40;
      const magAlpha = Math.abs(Math.sin(t * 1.8)) * 0.7 + 0.2;
      ctx.strokeStyle = `rgba(255,160,0,${magAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Magnetic field lines — lateral oscillating arcs
      for (let i = 0; i < 5; i++) {
        const phase = (i / 5) * Math.PI * 2 + t * 0.5;
        const amplitude = 30 + i * 8;
        const alpha = (0.6 - i * 0.1) * Math.abs(Math.sin(phase));
        ctx.strokeStyle = `rgba(255,140,0,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        for (let x = 0; x < W; x += 2) {
          const y = cy + Math.sin((x / W) * Math.PI * 4 + phase) * amplitude * (magOscillation / 40);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // === CRITICAL LINE (center — Re(s) = 0.5) ===
      // The critical line is the MIDDLE horizontal band
      ctx.strokeStyle = "rgba(0,200,255,0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.stroke();

      // Critical line label
      ctx.fillStyle = "rgba(0,200,255,0.7)";
      ctx.font = "9px monospace";
      ctx.fillText("Re(s) = 0.5  CRITICAL LINE", 8, cy - 5);

      // === ZETA ZEROS plotted as spikes on the critical line ===
      ZETA_ZEROS.forEach((t_n, i) => {
        const x = ((t_n - 14) / (101 - 14)) * W;
        const spikeHeight = 25 + Math.sin(t + i * 0.7) * 10;
        const zeroAlpha = 0.7 + Math.sin(t * 2 + i) * 0.3;

        // Spike up
        ctx.strokeStyle = `rgba(100,220,255,${zeroAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, cy);
        ctx.lineTo(x, cy - spikeHeight);
        ctx.stroke();

        // Spike down
        ctx.beginPath();
        ctx.moveTo(x, cy);
        ctx.lineTo(x, cy + spikeHeight);
        ctx.stroke();

        // Zero dot
        const dotGrad = ctx.createRadialGradient(x, cy, 0, x, cy, 4);
        dotGrad.addColorStop(0, `rgba(100,220,255,${zeroAlpha})`);
        dotGrad.addColorStop(1, "transparent");
        ctx.fillStyle = dotGrad;
        ctx.beginPath();
        ctx.arc(x, cy, 4, 0, Math.PI * 2);
        ctx.fill();

        // t_n label for first few
        if (i < 8) {
          ctx.fillStyle = `rgba(100,220,255,${zeroAlpha * 0.6})`;
          ctx.font = "7px monospace";
          ctx.fillText(t_n.toFixed(1), x - 8, cy - spikeHeight - 3);
        }
      });

      // === GRAVITY field lines — particles falling toward center ===
      for (let i = 0; i < 12; i++) {
        const phase = (i / 12) * Math.PI * 2;
        const particleT = (t * 0.4 + i * 0.3) % 1;
        const px = cx + Math.sin(phase) * 60;
        const py = (i % 2 === 0) ? particleT * cy : H - particleT * cy;
        const particleAlpha = Math.sin(particleT * Math.PI) * 0.6;
        ctx.fillStyle = `rgba(0,255,100,${particleAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // === BAM convergence lines ===
      for (let i = 0; i < 6; i++) {
        const phase = (i / 6) * Math.PI * 2;
        const startX = cx + Math.cos(phase) * (W / 2);
        const startY = cy + Math.sin(phase) * (H / 2);
        const progress = (t * 0.2 + i * 0.17) % 1;
        const lx = startX + (cx - startX) * progress;
        const ly = startY + (cy - startY) * progress;
        const lineAlpha = Math.sin(progress * Math.PI) * 0.35;
        ctx.strokeStyle = `rgba(0,255,80,${lineAlpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(lx, ly);
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(counterInterval);
    };
  }, []);

  const formatCount = (n: number) => {
    if (n >= 1e12) return (n / 1e12).toFixed(3) + " TRILLION";
    if (n >= 1e9) return (n / 1e9).toFixed(3) + " BILLION";
    return n.toLocaleString();
  };

  return (
    <div className="flex flex-col gap-1 h-full">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] text-cyan-400 font-mono tracking-widest">3-AXIS ZETA FIELD</span>
        <span className="text-[9px] text-green-400 font-mono">{formatCount(zeroCount)} ZEROS ACTIVE</span>
      </div>
      <canvas
        ref={canvasRef}
        width={480}
        height={200}
        className="w-full rounded border border-green-900/40 bg-black"
        style={{ imageRendering: "pixelated" }}
      />
      <div className="grid grid-cols-3 gap-1 text-[8px] font-mono">
        <div className="text-green-400 text-center">▲▼ GRAVITY AXIS</div>
        <div className="text-cyan-400 text-center">── CRITICAL LINE Re(s)=0.5</div>
        <div className="text-amber-400 text-center">◄► MAGNETIC AXIS</div>
      </div>
    </div>
  );
}
