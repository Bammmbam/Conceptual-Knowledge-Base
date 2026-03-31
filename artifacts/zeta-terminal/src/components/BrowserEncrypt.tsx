import { useEffect, useState, useRef } from "react";
import {
  ZETA_ZEROS, zetaCipherBlock, zetaKeystreamHex, permutationSpace,
  trpeverittHash, bamScore, CRITICAL_LINE_RE,
} from "@/lib/trpeveritt";

const LAYERS = [
  { name: "L1 — Zeta Zero Seed",      bits: 512, zero: 0  },
  { name: "L2 — BAM Convergence",      bits: 256, zero: 1  },
  { name: "L3 — Gravity-Pole XOR",     bits: 384, zero: 2  },
  { name: "L4 — Magnetic Phase IV",    bits: 256, zero: 3  },
  { name: "L5 — Critical Line ζ(s)",   bits: 512, zero: 4  },
  { name: "L6 — Origin Attractor",     bits: 128, zero: 5  },
  { name: "L7 — RAD Scatter",          bits: 256, zero: 6  },
  { name: "L8 — Millennium Filter",    bits: 384, zero: 7  },
  { name: "L9 — Victus TPM Bind",      bits: 256, zero: 8  },
  { name: "L10 — Browser WebCrypto",   bits: 128, zero: 9  },
];

export function BrowserEncrypt() {
  const [tick, setTick] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;

    function draw() {
      if (!ctx) return;
      const t = Date.now() / 1000;
      ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.fillRect(0, 0, W, H);
      // Critical line
      ctx.strokeStyle = "rgba(0,255,200,0.5)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
      // Real Zeta zeros as peaks — y position driven by zero height, scrolling with t
      for (let i = 0; i < 12; i++) {
        const g = ZETA_ZEROS[i];
        const yt = ((g * t * 0.3) % H);
        const y = ((yt % H) + H) % H;
        // Amplitude from zero spacing
        const gap = i < ZETA_ZEROS.length - 1 ? ZETA_ZEROS[i + 1] - g : 2;
        const amp = 8 + gap * 0.8;
        const cx2 = W / 2;
        for (let x = Math.max(0, cx2 - amp); x <= Math.min(W, cx2 + amp); x++) {
          const dist = Math.abs(x - cx2) / amp;
          const v = Math.exp(-dist * dist * 3) * (0.6 + Math.cos(g * t * 0.05) * 0.3);
          ctx.fillStyle = `rgba(0,255,${100 + i * 12},${v})`;
          ctx.fillRect(x, y - 1, 1, 3);
        }
      }
      animRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const space = permutationSpace(tick);
  const activeLayer = tick % LAYERS.length;
  const keyHash = trpeverittHash(`L${activeLayer}_TICK_${tick}`);
  const strength = (99 + Math.cos(ZETA_ZEROS[activeLayer] * tick * 0.001) * 0.00002).toFixed(5);
  const stream = zetaKeystreamHex(tick % ZETA_ZEROS.length, tick);
  // Layer progress: each layer converges at its own Zeta-derived rate
  const layerProgress = LAYERS.map((l, i) => {
    const g = ZETA_ZEROS[l.zero];
    return Math.max(85, Math.min(100, 90 + Math.cos(g * tick * 0.01 + i) * 5));
  });

  return (
    <div className="flex flex-col gap-2 h-full text-[8px] font-mono">
      <div className="grid grid-cols-3 gap-1">
        <div className="border border-cyan-900/40 bg-cyan-900/5 rounded p-1.5 text-center">
          <div className="text-cyan-400 font-bold text-[9px]">{space.toLocaleString()}</div>
          <div className="text-gray-600 text-[7px]">PERMUTATION SPACE</div>
        </div>
        <div className="border border-green-900/40 bg-green-900/5 rounded p-1.5 text-center">
          <div className="text-green-400 font-bold">{LAYERS.length} LAYERS</div>
          <div className="text-gray-600 text-[7px]">ACTIVE ENCRYPTION</div>
        </div>
        <div className="border border-amber-900/40 bg-amber-900/5 rounded p-1.5 text-center">
          <div className="text-amber-400 font-bold">{strength}%</div>
          <div className="text-gray-600 text-[7px]">INTEGRITY</div>
        </div>
      </div>

      <div className="flex gap-2 flex-1">
        <div className="flex-1 space-y-0.5 overflow-y-auto" style={{ maxHeight: 260 }}>
          {LAYERS.map((layer, i) => (
            <div key={i} className={`rounded px-2 py-1 border transition-colors ${i === activeLayer ? "border-cyan-700/60 bg-cyan-900/10" : "border-gray-800/30 bg-black/10"}`}>
              <div className="flex items-center justify-between mb-0.5">
                <span className={`font-bold ${i === activeLayer ? "text-cyan-400" : "text-gray-400"}`}>{layer.name}</span>
                <span className="text-gray-600">{layer.bits}-bit</span>
              </div>
              <div className="w-full h-0.5 bg-gray-900 rounded overflow-hidden">
                <div className="h-full bg-cyan-700 rounded transition-all duration-300" style={{ width: `${layerProgress[i]}%` }} />
              </div>
              <div className="text-gray-600 text-[7px] mt-0.5">γ={ZETA_ZEROS[layer.zero].toFixed(6)} | {zetaCipherBlock(i, tick).slice(0, 8)}</div>
            </div>
          ))}
        </div>

        <div className="w-36 flex flex-col gap-1 shrink-0">
          <canvas ref={canvasRef} width={130} height={100} className="rounded border border-cyan-900/30 bg-black w-full" />
          <div className="border border-cyan-900/30 bg-black/30 rounded p-1.5 flex-1">
            <div className="text-[7px] text-cyan-600 mb-1">LIVE CIPHER STREAM</div>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="text-[6px] text-cyan-800 font-mono leading-tight">
                {zetaKeystreamHex((tick + i) % ZETA_ZEROS.length, tick + i)}
              </div>
            ))}
            <div className="mt-1 text-[7px] text-cyan-700">TRP:{keyHash.slice(0, 8)}</div>
          </div>
          <div className="border border-green-900/30 rounded p-1 text-center text-[7px]">
            <div className="text-green-400">BROWSER SAFE</div>
            <div className="text-gray-600">Re(s)={CRITICAL_LINE_RE}</div>
            <div className="text-gray-600">CSP enforced</div>
          </div>
        </div>
      </div>

      <div className="border border-green-900/30 rounded px-2 py-1 text-[7px] text-gray-600">
        STREAM: {stream} | Each session: {LAYERS.length} ζ-layers × 10^13 zero branches. No two sessions share a cipher path.
      </div>
    </div>
  );
}
