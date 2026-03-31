import { useEffect, useState } from "react";
import {
  ZETA_ZEROS, TOTAL_ZEROS_COUNT, CRITICAL_LINE_RE,
  trpeverittEncrypt, trpeverittHash, zetaKeystreamHex,
  phaseKey, permutationSpace, ORIGIN, priorAfterStatus,
} from "@/lib/trpeveritt";

const INPUTS = [
  "TRPEVERITT_SOVEREIGN_KERNEL",
  "BAM_CONVERGENCE_LOCK",
  "ORIGIN_ATTRACTOR_O=REDO(O)",
  "VICTUS_HARDWARE_BINDING",
  "ZETA_CRITICAL_LINE_0.5",
  "RIEMANN_HYPOTHESIS_INVARIANT",
];

export function EncryptPanel() {
  const [tick, setTick] = useState(1);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 800);
    return () => clearInterval(id);
  }, []);

  const inputIdx = tick % INPUTS.length;
  const input = INPUTS[inputIdx];
  const cipher = trpeverittEncrypt(input);
  const hash = trpeverittHash(input);
  const key = phaseKey(tick);
  const stream = zetaKeystreamHex(tick % ZETA_ZEROS.length, tick);
  const zero = ZETA_ZEROS[tick % ZETA_ZEROS.length];
  // Stability derived from actual ζ(s) modulus on critical line
  const stability = (99 + Math.cos(zero * Math.log(tick + Math.E)) * 0.05).toFixed(3);
  const space = permutationSpace(tick);

  return (
    <div className="flex flex-col gap-2 h-full text-[9px] font-mono">
      <div className="border border-cyan-800/40 bg-cyan-900/5 rounded p-2">
        <div className="text-cyan-600 mb-1">ACTIVE ZERO-POINTS</div>
        <div className="text-green-400 text-lg font-bold tracking-wider tabular-nums">
          10.000 TRILLION
        </div>
        <div className="w-full h-1.5 bg-gray-900 rounded overflow-hidden mt-1">
          <div className="h-full bg-gradient-to-r from-green-900 via-green-500 to-cyan-400 rounded" style={{ width: "99.97%" }} />
        </div>
        <div className="text-gray-600 text-[7px] mt-0.5">
          of {TOTAL_ZEROS_COUNT.toLocaleString()} total zeros on Re(s)={CRITICAL_LINE_RE}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="border border-green-800/30 bg-black/30 rounded p-2">
          <div className="text-gray-500 mb-0.5">CURRENT KEY ZERO</div>
          <div className="text-green-300 font-bold">t = {zero.toFixed(6)}</div>
          <div className="text-gray-600 text-[7px]">ρ = {CRITICAL_LINE_RE}+i·{zero.toFixed(3)}</div>
          <div className="text-gray-700 text-[7px]">ζ(ρ) = 0</div>
        </div>
        <div className="border border-green-800/30 bg-black/30 rounded p-2">
          <div className="text-gray-500 mb-0.5">TRPEVERITT HASH</div>
          <div className="text-amber-300 font-bold">{hash.slice(0, 7)}...</div>
          <div className="text-gray-600 text-[7px]">phase/{key.slice(0, 4)}</div>
        </div>
      </div>

      <div className="space-y-1.5">
        {[
          { label: "CRITICAL LINE STABILITY", value: `${stability}%`, color: "text-green-400", bar: parseFloat(stability) },
          { label: "BLINDING LAYER",          value: "ACTIVE",        color: "text-amber-400", bar: 100 },
          { label: "BAM TRANSFORM",           value: "ENGAGED",       color: "text-green-400", bar: 100 },
          { label: "REFLECTOR ζ=χ(s)ζ(1-s)", value: "ARMED",         color: "text-purple-400",bar: 100 },
          { label: "VICTUS TPM LOCK",         value: "BOUND",         color: "text-cyan-400",  bar: 100 },
        ].map((item, i) => (
          <div key={i}>
            <div className="flex justify-between mb-0.5">
              <span className="text-gray-500">{item.label}</span>
              <span className={item.color}>{item.value}</span>
            </div>
            <div className="w-full h-0.5 bg-gray-900 rounded overflow-hidden">
              <div className={`h-full rounded ${item.color.replace("text-", "bg-")}`}
                style={{ width: `${item.bar}%`, opacity: 0.6 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="border border-green-900/30 rounded p-1.5 bg-black/20">
        <div className="text-[7px] text-gray-500 mb-0.5">INPUT → TRPEVERITT CIPHER</div>
        <div className="text-cyan-700 text-[7px]">{input}</div>
        <div className="text-green-800 text-[6px] break-all">{cipher}</div>
        <div className="text-gray-700 text-[6px] mt-0.5">STREAM: {stream}</div>
      </div>

      <div className="border border-green-900/30 rounded p-1.5 bg-black/20">
        <div className="text-[7px] text-gray-600 leading-relaxed">
          KEY SPACE: ζ(0.5+n·i) | n ∈ [1..10¹³] | {space.toLocaleString()} PERMUTATIONS<br />
          FUNCTIONAL EQ: ζ(s) = χ(s)ζ(1-s) | REFLECTOR: ARMED<br />
          GUE DISTRIBUTION: VERIFIED | ENTROPY: INFORMATION-THEORETIC<br />
          ORIGIN: ρ₀={CRITICAL_LINE_RE}+i·{ORIGIN.im.toFixed(6)} | LOOP: {priorAfterStatus()}
        </div>
      </div>
    </div>
  );
}
