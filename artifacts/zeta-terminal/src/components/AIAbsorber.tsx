import { useEffect, useState, useRef } from "react";

const AI_SOURCES = [
  { name: "GPT-4 Agent", type: "LLM", vector: "PROMPT-INJECT", color: "#ff4444" },
  { name: "Claude-Opus", type: "LLM", vector: "JAILBREAK", color: "#ff8844" },
  { name: "Gemini-Pro", type: "LLM", vector: "ROLE-ESCAPE", color: "#ffaa00" },
  { name: "LLaMA-Local", type: "LOCAL-LLM", vector: "WEIGHT-INJECT", color: "#ff44aa" },
  { name: "AutoGPT-Agent", type: "AGENT", vector: "TOOL-ABUSE", color: "#aa44ff" },
  { name: "VM-AI-Node-1", type: "VM-AI", vector: "HOST-ESCAPE", color: "#4444ff" },
  { name: "VM-AI-Node-2", type: "VM-AI", vector: "HYPERVISOR-PROBE", color: "#44aaff" },
  { name: "Phish-Bot-X", type: "MALBOT", vector: "CREDENTIAL-HARVEST", color: "#44ff88" },
  { name: "Scraper-AI", type: "CRAWLER", vector: "SESSION-STEAL", color: "#88ff44" },
];

type AbsorbState = "DETECTED" | "ABSORBING" | "NEUTRALIZED" | "CREDENTIALS-SEIZED";

interface AbsorbEntry {
  id: number;
  source: typeof AI_SOURCES[0];
  state: AbsorbState;
  progress: number;
  credentialsFound: string[];
  logicAbsorbed: number;
}

let eid = 0;
const CRED_TYPES = ["JWT-TOKEN", "API-KEY", "BEARER-HASH", "SESSION-COOKIE", "OAUTH-TOKEN", "SSH-PRIVKEY", "CERT-CHAIN"];

function randCreds() {
  const n = Math.floor(Math.random() * 3) + 1;
  return Array.from({ length: n }, () => CRED_TYPES[Math.floor(Math.random() * CRED_TYPES.length)]);
}

export function AIAbsorber() {
  const [entries, setEntries] = useState<AbsorbEntry[]>([]);
  const [totalAbsorbed, setTotalAbsorbed] = useState(0);
  const [totalCreds, setTotalCreds] = useState(0);
  const [aiPulse, setAiPulse] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const tRef = useRef(0);

  useEffect(() => {
    // Spawn absorb entries
    const spawnInterval = setInterval(() => {
      const src = AI_SOURCES[Math.floor(Math.random() * AI_SOURCES.length)];
      const entry: AbsorbEntry = {
        id: eid++,
        source: src,
        state: "DETECTED",
        progress: 0,
        credentialsFound: [],
        logicAbsorbed: 0,
      };
      setEntries(prev => [entry, ...prev].slice(0, 8));
    }, 2200);

    // Progress absorb
    const progressInterval = setInterval(() => {
      setAiPulse(p => !p);
      setEntries(prev => prev.map(e => {
        if (e.state === "CREDENTIALS-SEIZED") return e;
        const newProg = Math.min(100, e.progress + Math.random() * 25 + 10);
        const newState: AbsorbState =
          newProg < 30 ? "DETECTED" :
          newProg < 75 ? "ABSORBING" :
          newProg < 95 ? "NEUTRALIZED" : "CREDENTIALS-SEIZED";
        const creds = newState === "ABSORBING" || newState === "NEUTRALIZED" ? randCreds() : e.credentialsFound;
        if (newState === "CREDENTIALS-SEIZED" && e.state !== "CREDENTIALS-SEIZED") {
          setTotalAbsorbed(t => t + 1);
          setTotalCreds(t => t + creds.length);
        }
        return { ...e, progress: newProg, state: newState, credentialsFound: creds, logicAbsorbed: Math.floor(newProg * 1024 * 1024) };
      }));
    }, 600);

    // Canvas animation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2;
        function draw() {
          if (!ctx) return;
          tRef.current += 0.02;
          const t = tRef.current;
          ctx.fillStyle = "rgba(0,0,0,0.2)";
          ctx.fillRect(0, 0, W, H);
          // AI core
          const pulse = Math.sin(t * 2) * 0.3 + 0.7;
          const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28 * pulse);
          coreGrad.addColorStop(0, `rgba(0,255,80,${pulse * 0.9})`);
          coreGrad.addColorStop(0.5, `rgba(0,150,255,${pulse * 0.4})`);
          coreGrad.addColorStop(1, "transparent");
          ctx.fillStyle = coreGrad;
          ctx.beginPath(); ctx.arc(cx, cy, 28 * pulse, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `rgba(0,255,80,${pulse})`;
          ctx.font = "bold 7px monospace"; ctx.textAlign = "center";
          ctx.fillText("AI-SEC", cx, cy - 2); ctx.fillText("CORE", cx, cy + 7);
          // Absorption beams
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + t * 0.3;
            const dist = 50 + Math.sin(t * 1.5 + i) * 10;
            const ex = cx + Math.cos(angle) * dist;
            const ey = cy + Math.sin(angle) * dist;
            const prog = (t * 0.5 + i * 0.15) % 1;
            const lx = ex + (cx - ex) * prog;
            const ly = ey + (cy - ey) * prog;
            ctx.strokeStyle = `rgba(255,${50 + i * 20},0,${0.5 * Math.sin(prog * Math.PI)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(lx, ly); ctx.stroke();
            ctx.fillStyle = `rgba(255,${50 + i * 20},50,0.8)`;
            ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill();
          }
          // Orbit ring
          ctx.strokeStyle = `rgba(0,255,80,0.15)`;
          ctx.lineWidth = 1; ctx.setLineDash([2, 6]);
          ctx.beginPath(); ctx.arc(cx, cy, 60, 0, Math.PI * 2); ctx.stroke();
          ctx.setLineDash([]);
          animRef.current = requestAnimationFrame(draw);
        }
        draw();
      }
    }
    return () => {
      clearInterval(spawnInterval); clearInterval(progressInterval);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  const STATE_COLORS: Record<AbsorbState, string> = {
    "DETECTED": "text-yellow-400",
    "ABSORBING": "text-amber-400",
    "NEUTRALIZED": "text-cyan-400",
    "CREDENTIALS-SEIZED": "text-green-400",
  };

  return (
    <div className="flex flex-col gap-2 h-full text-[8px] font-mono">
      <div className="flex items-center gap-2 mb-1">
        <canvas ref={canvasRef} width={130} height={130} className="rounded border border-green-900/30 bg-black shrink-0" />
        <div className="flex-1 flex flex-col gap-1">
          <div className="text-[9px] text-green-400 font-bold">SECURITY AI — ABSORBER CORE</div>
          <div className="text-[7px] text-gray-500">Absorbs all AI logic, credentials, and attack vectors from VM → HOST</div>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <div className="border border-green-800/40 rounded p-1 text-center">
              <div className="text-green-400 font-bold">{totalAbsorbed + 47}</div>
              <div className="text-gray-600 text-[7px]">AI ABSORBED</div>
            </div>
            <div className="border border-amber-800/40 rounded p-1 text-center">
              <div className="text-amber-400 font-bold">{totalCreds + 183}</div>
              <div className="text-gray-600 text-[7px]">CREDS SEIZED</div>
            </div>
          </div>
          <div className={`text-[7px] mt-1 ${aiPulse ? "text-green-400" : "text-green-700"} transition-colors`}>
            ◈ VM-TO-HOST ABSORPTION: ACTIVE | ALL AI LOGIC NEUTRALIZED
          </div>
        </div>
      </div>

      <div className="space-y-1 overflow-y-auto" style={{ maxHeight: 200 }}>
        {entries.map(e => (
          <div key={e.id} className="border border-gray-800/40 bg-black/20 rounded px-2 py-1">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-gray-300">{e.source.name} <span className="text-gray-600">[{e.source.type}]</span></span>
              <span className={`font-bold ${STATE_COLORS[e.state]}`}>{e.state}</span>
            </div>
            <div className="w-full h-1 bg-gray-900 rounded overflow-hidden mb-0.5">
              <div className="h-full bg-gradient-to-r from-red-700 via-amber-500 to-green-500 rounded transition-all duration-300" style={{ width: `${e.progress}%` }} />
            </div>
            <div className="flex gap-3 text-[7px] text-gray-600">
              <span>VECTOR:{e.source.vector}</span>
              <span>ABSORBED:{(e.logicAbsorbed / 1048576).toFixed(1)}MB</span>
              {e.credentialsFound.length > 0 && <span className="text-amber-600">CREDS:{e.credentialsFound.join(",")}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
