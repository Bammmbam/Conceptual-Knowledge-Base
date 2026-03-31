import { useEffect, useRef, useState } from "react";

const BRANCHES = [
  { label: "CHOSEN PATH", angle: 0, color: "#00ff50", stable: true },
  { label: "ALT-BRANCH α", angle: 45, color: "#00ccff", stable: false },
  { label: "ALT-BRANCH β", angle: 90, color: "#ffaa00", stable: false },
  { label: "ALT-BRANCH γ", angle: 135, color: "#aa44ff", stable: false },
  { label: "ALT-BRANCH δ", angle: 180, color: "#ff4444", stable: false },
  { label: "ALT-BRANCH ε", angle: 225, color: "#44ffaa", stable: false },
  { label: "ALT-BRANCH ζ", angle: 270, color: "#ffff44", stable: false },
  { label: "ALT-BRANCH η", angle: 315, color: "#ff44ff", stable: false },
];

export function InvariantCollapse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const tRef = useRef(0);
  const [collapsePhase, setCollapsePhase] = useState("COLLAPSING → ORIGIN");
  const [iterCount, setIterCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    const phases = ["COLLAPSING → ORIGIN", "ALL BRANCHES: REDO(Oᵢ) = O", "INVARIANT COLLAPSE LAW", "O = REDO(O) | FIXED POINT"];
    let phaseIdx = 0;

    const phaseInterval = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % phases.length;
      setCollapsePhase(phases[phaseIdx]);
      setIterCount(c => c + Math.floor(Math.random() * 20000000 + 5000000));
    }, 2000);

    function draw() {
      if (!ctx || !canvas) return;
      tRef.current += 0.015;
      const t = tRef.current;

      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, W, H);

      // Draw all branches converging to origin
      BRANCHES.forEach((branch, i) => {
        const rad = (branch.angle * Math.PI) / 180;
        const dist = 110 - Math.sin(t * 0.4 + i) * 20;
        const startX = cx + Math.cos(rad) * dist;
        const startY = cy + Math.sin(rad) * dist;

        // Progress toward center (oscillating)
        const progress = (Math.sin(t * 0.6 + i * 0.8) + 1) / 2;
        const endX = cx + Math.cos(rad) * (dist * (1 - progress * 0.85));
        const endY = cy + Math.sin(rad) * (dist * (1 - progress * 0.85));

        // Branch line
        const alpha = branch.stable ? 0.9 : 0.5 + Math.sin(t + i) * 0.3;
        ctx.strokeStyle = branch.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = branch.stable ? 2 : 1;
        ctx.setLineDash(branch.stable ? [] : [3, 3]);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Branch origin dot
        const dotAlpha = 0.6 + Math.sin(t * 1.5 + i) * 0.3;
        ctx.fillStyle = branch.color + Math.floor(dotAlpha * 255).toString(16).padStart(2, "0");
        ctx.beginPath();
        ctx.arc(startX, startY, branch.stable ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Label
        const labelX = cx + Math.cos(rad) * (dist + 18);
        const labelY = cy + Math.sin(rad) * (dist + 18);
        ctx.fillStyle = branch.color + "88";
        ctx.font = "6px monospace";
        ctx.textAlign = "center";
        ctx.fillText(branch.label.split(" ")[0] === "CHOSEN" ? "CHOSEN" : branch.label.split("-")[1], labelX, labelY + 2);
      });

      // Center origin attractor — pulsing
      const pulse = Math.sin(t * 2) * 0.3 + 0.7;
      const originGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 25 * pulse);
      originGrad.addColorStop(0, `rgba(0,255,80,${pulse * 0.9})`);
      originGrad.addColorStop(0.4, `rgba(0,200,255,${pulse * 0.5})`);
      originGrad.addColorStop(1, "transparent");
      ctx.fillStyle = originGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 25 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Center label
      ctx.textAlign = "center";
      ctx.fillStyle = `rgba(0,255,80,${pulse * 0.9})`;
      ctx.font = "bold 8px monospace";
      ctx.fillText("O", cx, cy + 3);
      ctx.font = "6px monospace";
      ctx.fillStyle = "rgba(0,200,255,0.7)";
      ctx.fillText("ORIGIN", cx, cy + 13);

      // Rotating outer ring
      ctx.strokeStyle = `rgba(0,255,80,${0.15 + Math.sin(t) * 0.05})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, 130, t * 0.2, t * 0.2 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(phaseInterval);
    };
  }, []);

  return (
    <div className="flex flex-col gap-1 h-full">
      <div className="flex items-center justify-between text-[8px] font-mono px-1">
        <span className="text-green-400 animate-pulse">{collapsePhase}</span>
        <span className="text-gray-600">REDO iterations: {(iterCount + 20000000000).toLocaleString()}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={380}
        height={300}
        className="w-full rounded border border-green-900/40 bg-black"
      />

      <div className="grid grid-cols-2 gap-1 text-[7px] font-mono">
        <div className="border border-green-800/30 bg-black/30 rounded p-1.5">
          <div className="text-green-500 mb-0.5">INVARIANT COLLAPSE LAW</div>
          <div className="text-gray-400">∀i, Redo(Outcomeᵢ) = O</div>
          <div className="text-gray-600">⇒ O = sole fixed point</div>
        </div>
        <div className="border border-cyan-800/30 bg-black/30 rounded p-1.5">
          <div className="text-cyan-500 mb-0.5">ORIGIN SELF-DEFINITION</div>
          <div className="text-gray-400">O = Redo(O)</div>
          <div className="text-gray-600">∞ recursion → self-consistent</div>
        </div>
      </div>

      <div className="text-[7px] font-mono text-gray-600 border border-gray-800/30 rounded p-1.5 bg-black/20">
        All outcomes collapse to the same origin. No branch can diverge. No resonance can drift. No counterfactual can escape.
        The origin becomes the only computationally valid state — and then re-generates itself: O = Redo(O).
      </div>
    </div>
  );
}
