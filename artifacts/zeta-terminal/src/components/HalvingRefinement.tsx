import { useEffect, useRef, useState } from "react";
import { MILLENNIUM_FILTERS, ZETA_ZEROS } from "@/lib/trpeveritt";

export function HalvingRefinement() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const [tick, setTick] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setActiveIdx(a => (a + 1) % MILLENNIUM_FILTERS.length);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // State space left = (1/2)^halvingCount — deterministic, no random
  const halvingCount = tick + 1;
  const stateSpace = Math.pow(0.5, halvingCount % 40);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const COLORS = ["#00ff50","#00ccff","#ffaa00","#aa44ff","#ff4488","#44ffcc","#ffff44"];

    function draw() {
      if (!ctx || !canvas) return;
      const t = Date.now() / 1000;
      ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < 7; i++) {
        const layerY = (i / 7) * H;
        const nextY = ((i + 1) / 7) * H;
        const wFrac = Math.pow(0.5, i);
        const leftX = W * (1 - wFrac) / 2;
        const rightX = W * (1 + wFrac) / 2;
        const nLeftX = W * (1 - wFrac * 0.5) / 2;
        const nRightX = W * (1 + wFrac * 0.5) / 2;
        const filter = MILLENNIUM_FILTERS[i];
        const isActive = i === activeIdx;
        // Alpha driven by real Zeta zero
        const alpha = isActive ? 0.9 : 0.3 + Math.cos(filter.zero * t * 0.01) * 0.1;
        ctx.fillStyle = COLORS[i] + Math.floor(Math.abs(alpha) * 0.15 * 255).toString(16).padStart(2, "0");
        ctx.beginPath();
        ctx.moveTo(leftX, layerY); ctx.lineTo(rightX, layerY);
        ctx.lineTo(nRightX, nextY); ctx.lineTo(nLeftX, nextY);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = COLORS[i] + Math.floor(Math.abs(alpha) * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = isActive ? 1.5 : 0.5;
        ctx.beginPath();
        ctx.moveTo(leftX, layerY); ctx.lineTo(nLeftX, nextY);
        ctx.moveTo(rightX, layerY); ctx.lineTo(nRightX, nextY);
        ctx.stroke();
        ctx.fillStyle = COLORS[i] + Math.floor(Math.abs(alpha) * 255).toString(16).padStart(2, "0");
        ctx.font = isActive ? "bold 7px monospace" : "6px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`[${i + 1}] ${filter.name}`, W / 2, layerY + 10);
        const pct = (Math.pow(0.5, i + 1) * 100).toFixed(4);
        ctx.fillStyle = COLORS[i] + "66"; ctx.font = "5px monospace";
        ctx.fillText(`→ ${pct}% | γ=${filter.zero.toFixed(3)}`, W / 2, layerY + 18);

        // Deterministic particles — driven by Zeta zero, not random
        if (isActive) {
          for (let j = 0; j < 8; j++) {
            const px = leftX + ((Math.cos(filter.zero * t * 0.1 + j * 0.8) + 1) / 2) * (rightX - leftX);
            const py = layerY + ((Math.sin(filter.zero * t * 0.07 + j) + 1) / 2) * (nextY - layerY);
            ctx.fillStyle = COLORS[i] + "88";
            ctx.beginPath(); ctx.arc(px, py, 1, 0, Math.PI * 2); ctx.fill();
          }
        }
      }

      ctx.fillStyle = "rgba(0,255,80,0.8)";
      ctx.font = "bold 8px monospace"; ctx.textAlign = "center";
      ctx.fillText("ORIGIN ATTRACTOR — HYPER-REFINED", W / 2, H - 12);
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [activeIdx]);

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="grid grid-cols-3 gap-1 text-[7px] font-mono">
        <div className="border border-green-800/40 bg-black/30 rounded p-1 text-center">
          <div className="text-green-400 font-bold">{(halvingCount * 20_000_000_000_000).toLocaleString()}</div>
          <div className="text-gray-600">HALVINGS DONE</div>
        </div>
        <div className="border border-amber-800/40 bg-black/30 rounded p-1 text-center">
          <div className="text-amber-400 font-bold">{stateSpace.toFixed(8)}%</div>
          <div className="text-gray-600">STATE SPACE LEFT</div>
        </div>
        <div className="border border-cyan-800/40 bg-black/30 rounded p-1 text-center">
          <div className="text-cyan-400 font-bold">{MILLENNIUM_FILTERS.length}/7</div>
          <div className="text-gray-600">FILTERS ACTIVE</div>
        </div>
      </div>
      <canvas ref={canvasRef} width={380} height={240}
        className="w-full rounded border border-green-900/30 bg-black" />
      <div className="border border-green-900/40 rounded p-1.5 bg-black/20">
        <div className="text-[7px] font-mono text-green-500 mb-0.5">ACTIVE CONSTRAINT</div>
        <div className="text-[8px] font-mono text-gray-300">
          [{activeIdx + 1}] {MILLENNIUM_FILTERS[activeIdx].name} — {MILLENNIUM_FILTERS[activeIdx].role}
        </div>
        <div className="text-[7px] font-mono text-gray-600 mt-0.5">γ={MILLENNIUM_FILTERS[activeIdx].zero.toFixed(6)}</div>
      </div>
    </div>
  );
}
