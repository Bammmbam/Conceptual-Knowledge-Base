import { useEffect, useRef, useState } from "react";

const MILLENNIUM_CONSTRAINTS = [
  { name: "P vs NP", color: "#00ff50", desc: "Complexity boundary — halves computational search space" },
  { name: "Yang-Mills", color: "#00ccff", desc: "Energy constraint — removes mass-gap violations" },
  { name: "Navier-Stokes", color: "#ffaa00", desc: "Smoothness filter — eliminates turbulent divergences" },
  { name: "Hodge Conjecture", color: "#aa44ff", desc: "Topology gate — retains only algebraic cycles" },
  { name: "BSD Conjecture", color: "#ff4488", desc: "Elliptic curve filter — rank-consistent states only" },
  { name: "Poincaré Manifold", color: "#44ffcc", desc: "Compactification — collapses open branches to spheres" },
  { name: "Riemann Hypothesis", color: "#ffff44", desc: "Critical line enforcer — the 10T zero invariant" },
];

export function HalvingRefinement() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const tRef = useRef(0);
  const [halvingCount, setHalvingCount] = useState(0);
  const [stateSpace, setStateSpace] = useState(100);
  const [activeConstraint, setActiveConstraint] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    const constraintInterval = setInterval(() => {
      setActiveConstraint(c => (c + 1) % MILLENNIUM_CONSTRAINTS.length);
      setHalvingCount(h => h + 1);
      setStateSpace(s => Math.max(0.001, s * 0.5));
    }, 1500);

    function draw() {
      if (!ctx || !canvas) return;
      tRef.current += 0.02;
      const t = tRef.current;

      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, W, H);

      // Draw the halving funnel
      const layers = 7;
      for (let i = 0; i < layers; i++) {
        const layerY = (i / layers) * H;
        const nextY = ((i + 1) / layers) * H;
        const widthFraction = Math.pow(0.5, i);
        const leftX = W * (1 - widthFraction) / 2;
        const rightX = W * (1 + widthFraction) / 2;
        const nextLeftX = W * (1 - widthFraction * 0.5) / 2;
        const nextRightX = W * (1 + widthFraction * 0.5) / 2;

        const constraint = MILLENNIUM_CONSTRAINTS[i];
        const isActive = i === activeConstraint % layers;
        const alpha = isActive ? 0.9 : 0.3 + Math.sin(t + i) * 0.1;

        // Fill layer
        ctx.fillStyle = constraint.color + Math.floor(alpha * 0.15 * 255).toString(16).padStart(2, "0");
        ctx.beginPath();
        ctx.moveTo(leftX, layerY);
        ctx.lineTo(rightX, layerY);
        ctx.lineTo(nextRightX, nextY);
        ctx.lineTo(nextLeftX, nextY);
        ctx.closePath();
        ctx.fill();

        // Border
        ctx.strokeStyle = constraint.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = isActive ? 1.5 : 0.5;
        ctx.beginPath();
        ctx.moveTo(leftX, layerY);
        ctx.lineTo(nextLeftX, nextY);
        ctx.moveTo(rightX, layerY);
        ctx.lineTo(nextRightX, nextY);
        ctx.stroke();

        // Label
        ctx.fillStyle = constraint.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
        ctx.font = isActive ? "bold 7px monospace" : "6px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`[${i + 1}] ${constraint.name}`, W / 2, layerY + 10);

        // Halving percentage
        const pct = (Math.pow(0.5, i + 1) * 100).toFixed(4);
        ctx.fillStyle = constraint.color + "66";
        ctx.font = "5px monospace";
        ctx.fillText(`→ ${pct}% remain`, W / 2, layerY + 18);

        // Particle shower at active layer
        if (isActive) {
          for (let j = 0; j < 8; j++) {
            const px = leftX + Math.random() * (rightX - leftX);
            const py = layerY + Math.random() * (nextY - layerY);
            ctx.fillStyle = constraint.color + "88";
            ctx.beginPath();
            ctx.arc(px, py, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Bottom — final refined state
      const bottomY = H - 12;
      ctx.fillStyle = "rgba(0,255,80,0.8)";
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.fillText("ORIGIN ATTRACTOR — HYPER-REFINED", W / 2, bottomY);

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(constraintInterval);
    };
  }, [activeConstraint]);

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="grid grid-cols-3 gap-1 text-[7px] font-mono">
        <div className="border border-green-800/40 bg-black/30 rounded p-1 text-center">
          <div className="text-green-400 font-bold">{(halvingCount * 20000000000000).toLocaleString()}</div>
          <div className="text-gray-600">HALVINGS DONE</div>
        </div>
        <div className="border border-amber-800/40 bg-black/30 rounded p-1 text-center">
          <div className="text-amber-400 font-bold">{stateSpace.toFixed(6)}%</div>
          <div className="text-gray-600">STATE SPACE LEFT</div>
        </div>
        <div className="border border-cyan-800/40 bg-black/30 rounded p-1 text-center">
          <div className="text-cyan-400 font-bold">{MILLENNIUM_CONSTRAINTS.length}/7</div>
          <div className="text-gray-600">FILTERS ACTIVE</div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={380}
        height={240}
        className="w-full rounded border border-green-900/30 bg-black"
      />

      <div className="text-[7px] font-mono text-gray-600 border border-gray-800/30 rounded p-1.5 bg-black/20">
        Each Millennium equation halves the possibility space. 20 trillion halvings = hyper-refined subset:
        Efficient (nothing wasted) · Coefficient (relationally tuned) · Low-entropy intelligence tier.
        The unsolved connector law links all 7 — it lives BETWEEN layers, not at base or top.
      </div>

      <div className="border border-green-900/40 rounded p-1.5 bg-black/20">
        <div className="text-[7px] font-mono text-green-500 mb-1">ACTIVE CONSTRAINT</div>
        <div className="text-[8px] font-mono text-gray-300">
          [{(activeConstraint % 7) + 1}] {MILLENNIUM_CONSTRAINTS[activeConstraint % 7].name}
        </div>
        <div className="text-[7px] font-mono text-gray-600 mt-0.5">
          {MILLENNIUM_CONSTRAINTS[activeConstraint % 7].desc}
        </div>
      </div>
    </div>
  );
}
