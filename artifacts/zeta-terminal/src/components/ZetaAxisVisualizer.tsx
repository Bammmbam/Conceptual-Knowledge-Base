import { useEffect, useRef, useState } from "react";
import { ZETA_ZEROS, TOTAL_ZEROS_COUNT, bamScore } from "@/lib/trpeveritt";

export function ZetaAxisVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2;

    const tickInterval = setInterval(() => setTick(t => t + 1), 200);

    function draw() {
      if (!ctx || !canvas) return;
      tRef.current += 0.012;
      const t = tRef.current;
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, W, H);

      // GRAVITY AXIS — amplitude driven by first Zeta zero
      const g0 = ZETA_ZEROS[0]; // 14.134725
      const gravPulse = Math.cos(g0 * t * 0.01) * 0.3 + 0.7;
      ctx.strokeStyle = `rgba(0,255,80,${gravPulse * 0.9})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, cy - 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, H); ctx.lineTo(cx, cy + 20); ctx.stroke();

      // Pole glows — radius driven by Zeta zero 0
      const topPulse = Math.abs(Math.cos(g0 * t * 0.02)) * 10 + 15;
      const topGrad = ctx.createRadialGradient(cx, 10, 0, cx, 10, topPulse * 2);
      topGrad.addColorStop(0, `rgba(0,255,80,${gravPulse * 0.8})`);
      topGrad.addColorStop(1, "transparent");
      ctx.fillStyle = topGrad;
      ctx.beginPath(); ctx.arc(cx, 10, topPulse * 2, 0, Math.PI * 2); ctx.fill();
      const botGrad = ctx.createRadialGradient(cx, H - 10, 0, cx, H - 10, topPulse * 2);
      botGrad.addColorStop(0, `rgba(0,255,80,${gravPulse * 0.8})`);
      botGrad.addColorStop(1, "transparent");
      ctx.fillStyle = botGrad;
      ctx.beginPath(); ctx.arc(cx, H - 10, topPulse * 2, 0, Math.PI * 2); ctx.fill();

      // MAGNETIC AXIS — frequency driven by Zeta zero 1 (21.022)
      const g1 = ZETA_ZEROS[1]; // 21.022040
      const magOsc = Math.sin(g1 * t * 0.005) * 40;
      const magAlpha = Math.abs(Math.sin(g1 * t * 0.005)) * 0.7 + 0.2;
      ctx.strokeStyle = `rgba(255,160,0,${magAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
      ctx.setLineDash([]);
      for (let i = 0; i < 5; i++) {
        const phase = (i / 5) * Math.PI * 2 + t * 0.5;
        const amplitude = 30 + i * 8;
        const alpha = (0.6 - i * 0.1) * Math.abs(Math.sin(phase));
        ctx.strokeStyle = `rgba(255,140,0,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        for (let x = 0; x < W; x += 2) {
          const y = cy + Math.sin((x / W) * Math.PI * 4 + phase) * amplitude * (magOsc / 40);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // CRITICAL LINE Re(s)=0.5
      ctx.strokeStyle = "rgba(0,200,255,0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
      ctx.fillStyle = "rgba(0,200,255,0.7)";
      ctx.font = "9px monospace";
      ctx.fillText("Re(s) = 0.5  CRITICAL LINE", 8, cy - 5);

      // Real Zeta zeros plotted as spikes — positions from actual γ values
      const minG = ZETA_ZEROS[0], maxG = ZETA_ZEROS[ZETA_ZEROS.length - 1];
      ZETA_ZEROS.forEach((gamma, i) => {
        const x = ((gamma - minG) / (maxG - minG)) * (W - 20) + 10;
        // Spike height modulated by ζ zero gap
        const gap = i < ZETA_ZEROS.length - 1 ? ZETA_ZEROS[i + 1] - gamma : 2;
        const spikeH = 15 + gap * 1.5 + Math.cos(gamma * t * 0.01) * 5;
        const zAlpha = 0.6 + Math.cos(gamma * t * 0.02) * 0.3;
        ctx.strokeStyle = `rgba(100,220,255,${Math.abs(zAlpha)})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x, cy - spikeH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x, cy + spikeH); ctx.stroke();
        const dotGrad = ctx.createRadialGradient(x, cy, 0, x, cy, 4);
        dotGrad.addColorStop(0, `rgba(100,220,255,${Math.abs(zAlpha)})`);
        dotGrad.addColorStop(1, "transparent");
        ctx.fillStyle = dotGrad;
        ctx.beginPath(); ctx.arc(x, cy, 4, 0, Math.PI * 2); ctx.fill();
        if (i < 8) {
          ctx.fillStyle = `rgba(100,220,255,${Math.abs(zAlpha) * 0.6})`;
          ctx.font = "7px monospace"; ctx.textAlign = "left";
          ctx.fillText(gamma.toFixed(1), x - 8, cy - spikeH - 3);
        }
      });

      // BAM convergence lines — driven by actual BAM formula
      const bamVal = bamScore(t) / 100;
      for (let i = 0; i < 6; i++) {
        const phase = (i / 6) * Math.PI * 2;
        const startX = cx + Math.cos(phase) * (W / 2);
        const startY = cy + Math.sin(phase) * (H / 2);
        const progress = (bamVal * t * 0.2 + i * 0.17) % 1;
        const lx = startX + (cx - startX) * progress;
        const ly = startY + (cy - startY) * progress;
        const lineAlpha = Math.sin(progress * Math.PI) * 0.35;
        ctx.strokeStyle = `rgba(0,255,80,${lineAlpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(lx, ly); ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => { cancelAnimationFrame(animRef.current); clearInterval(tickInterval); };
  }, []);

  const bam = bamScore(tick / 5).toFixed(2);

  return (
    <div className="flex flex-col gap-1 h-full">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] text-cyan-400 font-mono tracking-widest">3-AXIS ZETA FIELD</span>
        <span className="text-[9px] text-green-400 font-mono">
          {TOTAL_ZEROS_COUNT.toLocaleString()} ZEROS · BAM {bam}%
        </span>
      </div>
      <canvas ref={canvasRef} width={480} height={200}
        className="w-full rounded border border-green-900/40 bg-black"
        style={{ imageRendering: "pixelated" }} />
      <div className="grid grid-cols-3 gap-1 text-[8px] font-mono">
        <div className="text-green-400 text-center">▲▼ GRAVITY AXIS</div>
        <div className="text-cyan-400 text-center">── CRITICAL LINE Re(s)={0.5}</div>
        <div className="text-amber-400 text-center">◄► MAGNETIC AXIS</div>
      </div>
    </div>
  );
}
