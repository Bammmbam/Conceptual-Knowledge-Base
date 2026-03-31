import { useEffect, useRef, useState } from "react";
import { ZETA_ZEROS, ORIGIN, bamScore } from "@/lib/trpeveritt";

// Branches anchored to actual Zeta zero angles (not arbitrary)
const BRANCHES = ZETA_ZEROS.slice(0, 8).map((gamma, i) => ({
  label: i === 0 ? "CHOSEN PATH" : `ALT-BRANCH γ${i}`,
  // Angle derived from the zero's imaginary part modulo 360
  angle: (gamma * 360 / 143) % 360,
  // Color from zero index
  color: ["#00ff50","#00ccff","#ffaa00","#aa44ff","#ff4444","#44ffaa","#ffff44","#ff44ff"][i],
  stable: i === 0,
  gamma,
}));

const PHASES = [
  "COLLAPSING → ORIGIN",
  "ALL BRANCHES: REDO(Oᵢ) = O",
  "INVARIANT COLLAPSE LAW",
  "O = REDO(O) | FIXED POINT",
];

export function InvariantCollapse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const tRef = useRef(0);
  const [tick, setTick] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2;

    const phaseInterval = setInterval(() => {
      setPhaseIdx(p => (p + 1) % PHASES.length);
      setTick(t => t + 1);
    }, 2000);

    function draw() {
      if (!ctx || !canvas) return;
      tRef.current += 0.015;
      const t = tRef.current;
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, W, H);

      BRANCHES.forEach((branch, i) => {
        const rad = (branch.angle * Math.PI) / 180;
        // Distance oscillates based on real Zeta zero
        const dist = 110 - Math.cos(branch.gamma * t * 0.005) * 20;
        const startX = cx + Math.cos(rad) * dist;
        const startY = cy + Math.sin(rad) * dist;
        // BAM convergence drives progress toward center
        const bam = bamScore(t + i) / 100;
        const progress = (Math.sin(bam * Math.PI + i * 0.8) + 1) / 2;
        const endX = cx + Math.cos(rad) * (dist * (1 - progress * 0.85));
        const endY = cy + Math.sin(rad) * (dist * (1 - progress * 0.85));
        const alpha = branch.stable ? 0.9 : 0.5 + Math.cos(branch.gamma * t * 0.01) * 0.3;
        ctx.strokeStyle = branch.color + Math.floor(Math.abs(alpha) * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = branch.stable ? 2 : 1;
        ctx.setLineDash(branch.stable ? [] : [3, 3]);
        ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY); ctx.stroke();
        ctx.setLineDash([]);
        const dotA = 0.6 + Math.cos(branch.gamma * t * 0.02) * 0.3;
        ctx.fillStyle = branch.color + Math.floor(Math.abs(dotA) * 255).toString(16).padStart(2, "0");
        ctx.beginPath(); ctx.arc(startX, startY, branch.stable ? 4 : 2.5, 0, Math.PI * 2); ctx.fill();
        const labelX = cx + Math.cos(rad) * (dist + 18);
        const labelY = cy + Math.sin(rad) * (dist + 18);
        ctx.fillStyle = branch.color + "88";
        ctx.font = "6px monospace"; ctx.textAlign = "center";
        ctx.fillText(i === 0 ? "CHOSEN" : `γ${branch.gamma.toFixed(1)}`, labelX, labelY + 2);
      });

      // Origin pulse driven by Zeta zero 0 frequency
      const pulse = Math.cos(ZETA_ZEROS[0] * t * 0.01) * 0.3 + 0.7;
      const originGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 25 * pulse);
      originGrad.addColorStop(0, `rgba(0,255,80,${pulse * 0.9})`);
      originGrad.addColorStop(0.4, `rgba(0,200,255,${pulse * 0.5})`);
      originGrad.addColorStop(1, "transparent");
      ctx.fillStyle = originGrad;
      ctx.beginPath(); ctx.arc(cx, cy, 25 * pulse, 0, Math.PI * 2); ctx.fill();
      ctx.textAlign = "center";
      ctx.fillStyle = `rgba(0,255,80,${pulse * 0.9})`;
      ctx.font = "bold 8px monospace";
      ctx.fillText("O", cx, cy + 3);
      ctx.font = "6px monospace";
      ctx.fillStyle = "rgba(0,200,255,0.7)";
      ctx.fillText(`ρ=${ORIGIN.im.toFixed(3)}`, cx, cy + 14);

      ctx.strokeStyle = `rgba(0,255,80,${0.12 + Math.cos(t) * 0.04})`;
      ctx.lineWidth = 1; ctx.setLineDash([2, 6]);
      ctx.beginPath(); ctx.arc(cx, cy, 130, t * 0.2, t * 0.2 + Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => { cancelAnimationFrame(animRef.current); clearInterval(phaseInterval); };
  }, []);

  // Iteration count is deterministic: ORIGIN.cycles * (tick+1)
  const iters = ORIGIN.cycles * (tick + 1) * 19_560_000;

  return (
    <div className="flex flex-col gap-1 h-full">
      <div className="flex items-center justify-between text-[8px] font-mono px-1">
        <span className="text-green-400 animate-pulse">{PHASES[phaseIdx]}</span>
        <span className="text-gray-600">REDO iters: {iters.toLocaleString()}</span>
      </div>
      <canvas ref={canvasRef} width={380} height={300}
        className="w-full rounded border border-green-900/40 bg-black" />
      <div className="grid grid-cols-2 gap-1 text-[7px] font-mono">
        <div className="border border-green-800/30 bg-black/30 rounded p-1.5">
          <div className="text-green-500 mb-0.5">INVARIANT COLLAPSE LAW</div>
          <div className="text-gray-400">∀i, Redo(Outcomeᵢ) = O</div>
          <div className="text-gray-600">⇒ O = sole fixed point</div>
        </div>
        <div className="border border-cyan-800/30 bg-black/30 rounded p-1.5">
          <div className="text-cyan-500 mb-0.5">ORIGIN SELF-DEFINITION</div>
          <div className="text-gray-400">O = Redo(O)</div>
          <div className="text-gray-600">ρ₀ = {0.5}+i·{ORIGIN.im.toFixed(6)}</div>
        </div>
      </div>
    </div>
  );
}
