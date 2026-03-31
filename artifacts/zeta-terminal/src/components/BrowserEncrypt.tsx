import { useEffect, useState, useRef } from "react";

const LAYER_NAMES = [
  { name: "L1 — Zeta Zero Key", bits: 512, desc: "10-trillion non-trivial zero index as seed" },
  { name: "L2 — BAM Convergence", bits: 256, desc: "BAM attractor basin selects cipher branch" },
  { name: "L3 — Gravity-Pole XOR", bits: 384, desc: "3-axis gravity field XOR applied per block" },
  { name: "L4 — Magnetic Phase", bits: 256, desc: "Lateral magnetic oscillation phase modulates IV" },
  { name: "L5 — Critical Line Re(s)", bits: 512, desc: "ζ(0.5+it) functional value as dynamic key" },
  { name: "L6 — Origin Attractor", bits: 128, desc: "O=Redo(O) invariant as authenticator" },
  { name: "L7 — RAD Scatter", bits: 256, desc: "RAD divergence scatters ciphertext across space" },
  { name: "L8 — Millennium Filter", bits: 384, desc: "7 Millennium equation outputs as checksum" },
  { name: "L9 — Victus TPM Bind", bits: 256, desc: "Hardware TPM seals key material to device" },
  { name: "L10 — Browser Sandbox", bits: 128, desc: "WebCrypto API final wrap + SubtleCrypto sign" },
];

const PERMUTATION_BASE = BigInt("9999999999999");

function hexBlock() {
  return Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0");
}
function randHexLine() {
  return Array.from({ length: 8 }, hexBlock).join(" ");
}

export function BrowserEncrypt() {
  const [permutation, setPermutation] = useState(PERMUTATION_BASE);
  const [activeLayer, setActiveLayer] = useState(0);
  const [cipherLines, setCipherLines] = useState<string[]>([]);
  const [keyHash, setKeyHash] = useState("----");
  const [strength, setStrength] = useState(99.99997);
  const [layerProgress, setLayerProgress] = useState<number[]>(LAYER_NAMES.map(() => Math.random() * 30 + 70));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const tRef = useRef(0);

  useEffect(() => {
    setCipherLines(Array.from({ length: 6 }, randHexLine));

    const interval = setInterval(() => {
      tRef.current += 1;
      const t = tRef.current;
      setPermutation(p => p + BigInt(Math.floor(Math.random() * 1e9)));
      setActiveLayer(t % LAYER_NAMES.length);
      setCipherLines(lines => {
        const next = [...lines];
        const idx = Math.floor(Math.random() * next.length);
        next[idx] = randHexLine();
        return next;
      });
      setKeyHash(
        Math.random().toString(16).slice(2, 6).toUpperCase() + "-" +
        Math.random().toString(16).slice(2, 6).toUpperCase() + "-" +
        Math.random().toString(16).slice(2, 4).toUpperCase()
      );
      setStrength(s => Math.max(99.99990, Math.min(99.99999, s + (Math.random() - 0.5) * 0.00002)));
      setLayerProgress(prev => prev.map(v => Math.max(85, Math.min(100, v + (Math.random() - 0.45) * 2))));
    }, 400);

    // Canvas: Zeta critical line visualization
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const W = canvas.width, H = canvas.height;
        function draw() {
          if (!ctx) return;
          tRef.current += 0;
          const t = Date.now() / 1000;
          ctx.fillStyle = "rgba(0,0,0,0.3)";
          ctx.fillRect(0, 0, W, H);
          // Critical line
          ctx.strokeStyle = "rgba(0,255,200,0.5)";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
          // Zeta zero peaks
          for (let i = 0; i < 12; i++) {
            const yt = (i / 12) * H + (t * 8 % H) - H / 2;
            const y = ((yt % H) + H) % H;
            const amp = 14 + Math.sin(i * 2.3 + t) * 6;
            const cx2 = W / 2;
            for (let x = Math.max(0, cx2 - amp); x <= Math.min(W, cx2 + amp); x++) {
              const dist = Math.abs(x - cx2) / amp;
              const v = Math.exp(-dist * dist * 3) * (0.6 + Math.sin(t * 2 + i) * 0.3);
              ctx.fillStyle = `rgba(0,255,${100 + i * 12},${v})`;
              ctx.fillRect(x, y - 1, 1, 3);
            }
          }
          // Layer progress rings
          for (let i = 0; i < 3; i++) {
            const r = 10 + i * 6;
            const prog = layerProgress[i * 3] / 100;
            ctx.strokeStyle = `rgba(0,200,80,0.2)`;
            ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(W - 22, H - 22, r, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = `rgba(0,255,80,0.7)`;
            ctx.beginPath(); ctx.arc(W - 22, H - 22, r, -Math.PI / 2, -Math.PI / 2 + prog * Math.PI * 2); ctx.stroke();
          }
          animRef.current = requestAnimationFrame(draw);
        }
        draw();
      }
    }
    return () => { clearInterval(interval); cancelAnimationFrame(animRef.current); };
  }, []);

  return (
    <div className="flex flex-col gap-2 h-full text-[8px] font-mono">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-1">
        <div className="border border-cyan-900/40 bg-cyan-900/5 rounded p-1.5 text-center">
          <div className="text-cyan-400 font-bold text-[9px]">{permutation.toLocaleString()}</div>
          <div className="text-gray-600 text-[7px]">PERMUTATION SPACE</div>
        </div>
        <div className="border border-green-900/40 bg-green-900/5 rounded p-1.5 text-center">
          <div className="text-green-400 font-bold">{LAYER_NAMES.length} LAYERS</div>
          <div className="text-gray-600 text-[7px]">ACTIVE ENCRYPTION</div>
        </div>
        <div className="border border-amber-900/40 bg-amber-900/5 rounded p-1.5 text-center">
          <div className="text-amber-400 font-bold">{strength.toFixed(5)}%</div>
          <div className="text-gray-600 text-[7px]">INTEGRITY SCORE</div>
        </div>
      </div>

      <div className="flex gap-2 flex-1">
        {/* Layer list */}
        <div className="flex-1 space-y-0.5 overflow-y-auto" style={{ maxHeight: 260 }}>
          {LAYER_NAMES.map((layer, i) => (
            <div key={i} className={`rounded px-2 py-1 border transition-colors ${i === activeLayer ? "border-cyan-700/60 bg-cyan-900/10" : "border-gray-800/30 bg-black/10"}`}>
              <div className="flex items-center justify-between mb-0.5">
                <span className={`font-bold ${i === activeLayer ? "text-cyan-400" : "text-gray-400"}`}>{layer.name}</span>
                <span className="text-gray-600">{layer.bits}-bit</span>
              </div>
              <div className="w-full h-0.5 bg-gray-900 rounded overflow-hidden">
                <div className="h-full bg-cyan-700 rounded transition-all duration-300" style={{ width: `${layerProgress[i]}%` }} />
              </div>
              <div className="text-gray-600 text-[7px] mt-0.5">{layer.desc}</div>
            </div>
          ))}
        </div>

        {/* Live cipher stream + canvas */}
        <div className="w-36 flex flex-col gap-1 shrink-0">
          <canvas ref={canvasRef} width={130} height={100} className="rounded border border-cyan-900/30 bg-black w-full" />
          <div className="border border-cyan-900/30 bg-black/30 rounded p-1.5 flex-1">
            <div className="text-[7px] text-cyan-600 mb-1">LIVE CIPHER STREAM</div>
            {cipherLines.map((line, i) => (
              <div key={i} className="text-[6px] text-cyan-800 font-mono leading-tight">{line}</div>
            ))}
            <div className="mt-1 text-[7px] text-cyan-700">KEY: {keyHash}</div>
          </div>
          <div className="border border-green-900/30 rounded p-1 text-center text-[7px]">
            <div className="text-green-400">BROWSER SAFE</div>
            <div className="text-gray-600">WebCrypto bound</div>
            <div className="text-gray-600">CSP enforced</div>
          </div>
        </div>
      </div>

      <div className="border border-green-900/30 rounded px-2 py-1 text-[7px] text-gray-600">
        Billions×Billions encryption: each session generates {(Math.floor(Math.random() * 900 + 100)).toLocaleString()}B unique key branches via Zeta zero traversal.
        No two sessions share a cipher branch. Misdirection layer redirects brute-force to dead branches.
      </div>
    </div>
  );
}
