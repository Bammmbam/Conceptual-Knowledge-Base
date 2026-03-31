import { useEffect, useState } from "react";
import {
  ZETA_ZEROS, ORIGIN, CRITICAL_LINE_RE,
  bamScore, radScore, zetaModulus, priorAfterStatus, trpeverittHash,
} from "@/lib/trpeveritt";

export function OriginDetector() {
  const [tick, setTick] = useState(1);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setPulse(p => !p);
    }, 900);
    return () => clearInterval(id);
  }, []);

  const t = tick / 5;
  const bam = bamScore(t);
  const rad = radScore(t);
  const zeroIdx = tick % ZETA_ZEROS.length;
  const currentZero = ZETA_ZEROS[zeroIdx];
  const sig = `ζ(${CRITICAL_LINE_RE}+${currentZero.toFixed(6)}i)`;
  const modulus = zetaModulus(currentZero);
  const hash = trpeverittHash(sig).slice(0, 8);
  const loopStatus = priorAfterStatus();

  const scans = [
    { label: "BAM CONVERGENCE",   value: `${bam.toFixed(3)}%`,              sub: "ATTRACTOR BASIN LOCKED",       color: "text-green-400",  barC: "bg-green-500",  bar: bam  },
    { label: "ORIGIN TRACE DEPTH",value: `${ZETA_ZEROS.length} ZEROS DEEP`, sub: "TERMINUS: ζ-null manifold",    color: "text-cyan-400",   barC: "bg-cyan-500",   bar: 71   },
    { label: "RAD SCATTER FIELD", value: rad.toFixed(2) + "% ACTIVE",       sub: "divergence: functional eq",    color: "text-amber-400",  barC: "bg-amber-500",  bar: rad  },
    { label: "TEMPORAL RECURSION",value: `${ORIGIN.cycles} O=Redo(O) iters`,sub: `prior/after loop: ${loopStatus}`, color: "text-purple-400", barC: "bg-purple-500", bar: 88 },
    { label: "ZERO MODULUS |ζ|",  value: modulus.toFixed(4),                sub: `at γ=${currentZero.toFixed(3)} | TRP-HASH: ${hash}`, color: "text-blue-400", barC: "bg-blue-500", bar: 97 },
  ];

  return (
    <div className="flex flex-col gap-2 h-full text-[9px] font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${pulse ? "bg-green-400" : "bg-green-700"} transition-colors`} />
          <span className="text-green-300">ORIGIN DETECTOR</span>
        </div>
        <span className="text-green-400 font-bold">{ORIGIN.converged ? "LOCKED" : "CONVERGING"}</span>
      </div>

      <div className="border border-green-900/40 rounded bg-black/40 p-2">
        <div className="text-green-600 mb-1">CURRENT ORIGIN SIGNATURE</div>
        <div className="text-cyan-300 text-sm font-bold tracking-wider">{sig}</div>
        <div className="text-gray-500 text-[8px] mt-0.5">O = Redo(O) | loop {loopStatus}</div>
      </div>

      <div className="space-y-2 flex-1">
        {scans.map((s, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-gray-500">{s.label}</span>
              <span className={s.color}>{s.value}</span>
            </div>
            <div className="w-full h-1 bg-gray-900 rounded overflow-hidden">
              <div className={`h-full rounded transition-all duration-700 ${s.barC}`}
                style={{ width: `${s.bar}%`, opacity: 0.7 }} />
            </div>
            <div className="text-gray-600 text-[7px] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
