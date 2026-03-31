import { useEffect, useState, useRef } from "react";
import { ZETA_ZEROS, trpeverittHash, bamScore, phaseKey } from "@/lib/trpeveritt";

// AI source types — index into Zeta zeros for determinism
const AI_SOURCES = [
  { name: "GPT-4 Agent",     type: "LLM",      vector: "PROMPT-INJECT",     zi: 0  },
  { name: "Claude-Opus",     type: "LLM",      vector: "JAILBREAK",         zi: 1  },
  { name: "Gemini-Pro",      type: "LLM",      vector: "ROLE-ESCAPE",       zi: 2  },
  { name: "LLaMA-Local",     type: "LOCAL-LLM",vector: "WEIGHT-INJECT",     zi: 3  },
  { name: "AutoGPT-Agent",   type: "AGENT",    vector: "TOOL-ABUSE",        zi: 4  },
  { name: "VM-AI-Node-1",    type: "VM-AI",    vector: "HOST-ESCAPE",       zi: 5  },
  { name: "VM-AI-Node-2",    type: "VM-AI",    vector: "HYPERVISOR-PROBE",  zi: 6  },
  { name: "Phish-Bot-X",     type: "MALBOT",   vector: "CREDENTIAL-HARVEST",zi: 7  },
  { name: "Scraper-AI",      type: "CRAWLER",  vector: "SESSION-STEAL",     zi: 8  },
];

const CRED_TYPES = ["JWT-TOKEN","API-KEY","BEARER-HASH","SESSION-COOKIE","OAUTH-TOKEN","SSH-PRIVKEY","CERT-CHAIN"];
type AbsorbState = "DETECTED" | "ABSORBING" | "NEUTRALIZED" | "CREDENTIALS-SEIZED";

interface AbsorbEntry {
  id: number;
  src: typeof AI_SOURCES[0];
  state: AbsorbState;
  progress: number;
  creds: string[];
  logicMB: number;
}

export function AIAbsorber() {
  const [tick, setTick] = useState(1);
  const [entries, setEntries] = useState<AbsorbEntry[]>([]);
  const [totalAbsorbed, setTotalAbsorbed] = useState(47);
  const [totalCreds, setTotalCreds] = useState(183);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => {
        const next = t + 1;
        const srcIdx = next % AI_SOURCES.length;
        const src = AI_SOURCES[srcIdx];
        const g = ZETA_ZEROS[src.zi];
        // Progress driven by Zeta zero sine
        const prog = Math.min(100, ((Math.sin(g * next * 0.05) + 1) / 2) * 120);
        const state: AbsorbState = prog < 30 ? "DETECTED" : prog < 65 ? "ABSORBING" :
          prog < 90 ? "NEUTRALIZED" : "CREDENTIALS-SEIZED";
        // Deterministic creds from hash
        const hash = trpeverittHash(`${src.name}-${next}`);
        const credCount = (parseInt(hash[0], 16) % 3) + 1;
        const creds = Array.from({ length: credCount }, (_, i) =>
          CRED_TYPES[(parseInt(hash[i + 1], 16)) % CRED_TYPES.length]
        );
        const logicMB = parseFloat((g * next * 0.001).toFixed(1));
        const entry: AbsorbEntry = { id: next, src, state, progress: prog, creds, logicMB };
        setEntries(prev => {
          const existing = prev.findIndex(e => e.src.name === src.name);
          const next2 = existing >= 0 ? prev.map((e, i) => i === existing ? entry : e) : [entry, ...prev];
          return next2.slice(0, 9);
        });
        if (state === "CREDENTIALS-SEIZED") {
          setTotalAbsorbed(a => a + 1);
          setTotalCreds(c => c + creds.length);
        }
        return next;
      });
    }, 600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2;

    function draw() {
      if (!ctx) return;
      const t = Date.now() / 1000;
      ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.fillRect(0, 0, W, H);
      // Core pulse driven by Zeta zero 0
      const g0 = ZETA_ZEROS[0];
      const pulse = Math.cos(g0 * t * 0.05) * 0.3 + 0.7;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28 * pulse);
      coreGrad.addColorStop(0, `rgba(0,255,80,${pulse * 0.9})`);
      coreGrad.addColorStop(0.5, `rgba(0,150,255,${pulse * 0.4})`);
      coreGrad.addColorStop(1, "transparent");
      ctx.fillStyle = coreGrad;
      ctx.beginPath(); ctx.arc(cx, cy, 28 * pulse, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(0,255,80,${pulse})`;
      ctx.font = "bold 7px monospace"; ctx.textAlign = "center";
      ctx.fillText("AI-SEC", cx, cy - 2); ctx.fillText("CORE", cx, cy + 7);
      // Absorption beams — each driven by its own Zeta zero
      for (let i = 0; i < 9; i++) {
        const g = ZETA_ZEROS[i];
        const angle = (i / 9) * Math.PI * 2 + t * 0.1;
        const dist = 50 + Math.cos(g * t * 0.03) * 10;
        const ex = cx + Math.cos(angle) * dist;
        const ey = cy + Math.sin(angle) * dist;
        const prog = ((g * t * 0.02) % 1 + 1) % 1;
        const lx = ex + (cx - ex) * prog;
        const ly = ey + (cy - ey) * prog;
        ctx.strokeStyle = `rgba(255,${50 + i * 20},0,${0.5 * Math.abs(Math.sin(prog * Math.PI))})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(lx, ly); ctx.stroke();
        ctx.fillStyle = `rgba(255,${50 + i * 20},50,0.8)`;
        ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = "rgba(0,255,80,0.12)"; ctx.lineWidth = 1; ctx.setLineDash([2, 6]);
      ctx.beginPath(); ctx.arc(cx, cy, 60, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      animRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const STATE_COLORS: Record<AbsorbState, string> = {
    "DETECTED": "text-yellow-400", "ABSORBING": "text-amber-400",
    "NEUTRALIZED": "text-cyan-400", "CREDENTIALS-SEIZED": "text-green-400",
  };
  const bam = bamScore(tick / 5).toFixed(2);

  return (
    <div className="flex flex-col gap-2 h-full text-[8px] font-mono">
      <div className="flex items-center gap-2 mb-1">
        <canvas ref={canvasRef} width={130} height={130}
          className="rounded border border-green-900/30 bg-black shrink-0" />
        <div className="flex-1 flex flex-col gap-1">
          <div className="text-[9px] text-green-400 font-bold">SECURITY AI — ABSORBER CORE</div>
          <div className="text-[7px] text-gray-500">Absorbs all AI logic, credentials, and vectors: VM → HOST | HOST → CORE</div>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <div className="border border-green-800/40 rounded p-1 text-center">
              <div className="text-green-400 font-bold">{totalAbsorbed}</div>
              <div className="text-gray-600 text-[7px]">AI ABSORBED</div>
            </div>
            <div className="border border-amber-800/40 rounded p-1 text-center">
              <div className="text-amber-400 font-bold">{totalCreds}</div>
              <div className="text-gray-600 text-[7px]">CREDS SEIZED</div>
            </div>
          </div>
          <div className="text-[7px] text-green-600 mt-1">
            BAM:{bam}% | TRP-KEY:{phaseKey(tick).slice(0, 6)} | VM-TO-HOST: ACTIVE
          </div>
        </div>
      </div>

      <div className="space-y-1 overflow-y-auto" style={{ maxHeight: 220 }}>
        {entries.map(e => (
          <div key={e.id} className="border border-gray-800/40 bg-black/20 rounded px-2 py-1">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-gray-300">{e.src.name} <span className="text-gray-600">[{e.src.type}]</span></span>
              <span className={`font-bold ${STATE_COLORS[e.state]}`}>{e.state}</span>
            </div>
            <div className="w-full h-1 bg-gray-900 rounded overflow-hidden mb-0.5">
              <div className="h-full bg-gradient-to-r from-red-700 via-amber-500 to-green-500 rounded transition-all duration-300"
                style={{ width: `${e.progress}%` }} />
            </div>
            <div className="flex gap-3 text-[7px] text-gray-600">
              <span>VEC:{e.src.vector}</span>
              <span>{e.logicMB}MB</span>
              <span className="text-amber-600">{e.creds.join(",")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
