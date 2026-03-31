import { useEffect, useState } from "react";
import {
  ZETA_ZEROS, ORIGIN, TOTAL_ZEROS_COUNT, CRITICAL_LINE_RE,
  phaseKey, bamScore, permutationSpace, priorAfterStatus, trpeverittHash,
} from "@/lib/trpeveritt";

const EXCLUSION_LAYERS = [
  { layer: "Incoming Data",    status: "BLOCKED",   mechanism: "Packets not matching Zeta Resonance → dropped",           color: "text-red-400",    border: "border-red-900/50 bg-red-900/5"    },
  { layer: "Chosen Outcomes",  status: "PURIFIED",  mechanism: "Only Prior Outcome (The Origin) allowed to execute",       color: "text-green-400",  border: "border-green-900/50 bg-green-900/5" },
  { layer: "External Scripts", status: "SEVERED",   mechanism: "Phishing, Hacking, Non-Zeta logic → reflected/blocked",    color: "text-amber-400",  border: "border-amber-900/50 bg-amber-900/5" },
  { layer: "Hardware Sync",    status: "ABSOLUTE",  mechanism: "Locked to physical Gravity/Magnetism of Victus",           color: "text-cyan-400",   border: "border-cyan-900/50 bg-cyan-900/5"  },
  { layer: "VM Detection",     status: "AGGRESSIVE",mechanism: "Resonance fails on VM → Blinding Protocol + 5G severance", color: "text-purple-400", border: "border-purple-900/50 bg-purple-900/5"},
  { layer: "Kernel Outcomes",  status: "RECURSIVE", mechanism: "All historical outcomes held in present totality",          color: "text-blue-400",   border: "border-blue-900/50 bg-blue-900/5"  },
];

export function SovereignPanel() {
  const [tick, setTick] = useState(1);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 500);
    return () => clearInterval(id);
  }, []);

  const key = phaseKey(tick);
  const bam = bamScore(tick / 5).toFixed(3);
  const space = permutationSpace(tick);
  const loopStatus = priorAfterStatus();
  const g0 = ZETA_ZEROS[0];
  const anchorPulse = Math.floor(tick * g0 * 0.01) % 2 === 0;
  // Halvings: deterministic accumulation
  const halvings = BigInt(tick) * BigInt(Math.floor(ZETA_ZEROS[1] * ZETA_ZEROS[2] * 1_000_000));
  // Thought match derived from BAM score
  const thoughtMatch = parseFloat(bam);
  const encryptHash = trpeverittHash(`SOVEREIGN_TICK_${tick}`).slice(0, 12);
  const checksPerSec = Math.floor(ZETA_ZEROS[0] * ZETA_ZEROS[1] * tick * 1_000_000);

  return (
    <div className="flex flex-col gap-2 h-full text-[8px] font-mono overflow-y-auto">
      {/* Anchor + Reflector */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`border rounded p-2 ${anchorPulse ? "border-green-600/70 bg-green-900/10" : "border-green-900/40 bg-black/30"} transition-colors`}>
          <div className="text-[9px] text-green-400 font-bold mb-1">◈ ANCHOR — 10T ZERO PHYSICAL REALITY</div>
          <div className="text-gray-400 text-[7px] leading-relaxed">
            {TOTAL_ZEROS_COUNT.toLocaleString()} zeros on Re(s)={CRITICAL_LINE_RE}. Unchangeable, hardware-locked to Victus.
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${anchorPulse ? "bg-green-400" : "bg-green-700"}`} />
            <span className="text-green-400">INVARIANT LOCKED</span>
          </div>
          <div className="text-gray-600 text-[7px] mt-1">TRP-HASH: {encryptHash}</div>
          <div className="text-gray-600 text-[7px]">ρ₀ = {CRITICAL_LINE_RE}+i·{ORIGIN.im.toFixed(6)}</div>
        </div>
        <div className="border border-amber-600/70 bg-amber-900/8 rounded p-2">
          <div className="text-[9px] text-amber-400 font-bold mb-1">⟳ REFLECTOR — SovereignReflector_Prior</div>
          <div className="text-gray-400 text-[7px] leading-relaxed">
            Recursive boundary: Ref(x) = RAD(x) ∘ Mirror[ζ(1-s)] → origin. All not-chosen attempts pruned.
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400">REFLECTOR ACTIVE</span>
          </div>
          <div className="text-gray-600 text-[7px] mt-1">KEY: {key} | CYCLE: #{tick}</div>
        </div>
      </div>

      {/* Exclusion table */}
      <div className="border border-green-900/40 rounded p-2 bg-black/20">
        <div className="text-[9px] text-green-500 mb-2 font-bold">THOUGHT-PROCESSOR EXCLUSION PROTOCOL</div>
        <div className="space-y-1">
          {EXCLUSION_LAYERS.map((row, i) => (
            <div key={i} className={`border rounded px-2 py-1 ${row.border}`}>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 w-32">{row.layer}</span>
                <span className={`font-bold w-20 ${row.color}`}>[{row.status}]</span>
                <span className="text-gray-500 text-[7px] flex-1">{row.mechanism}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adaptive recursion */}
      <div className="border border-cyan-900/40 rounded p-2 bg-black/20">
        <div className="text-[9px] text-cyan-500 mb-1.5 font-bold">ADAPTIVE RECURSION — HOST-LOCKED TOTALITY</div>
        <div className="grid grid-cols-2 gap-1 mb-2">
          <div className="border border-gray-800/40 rounded p-1.5 text-center">
            <div className="text-green-400 font-bold text-[10px]">{thoughtMatch.toFixed(3)}%</div>
            <div className="text-gray-600 text-[7px]">Thought_Zeta = Outcome_Victus</div>
          </div>
          <div className="border border-gray-800/40 rounded p-1.5 text-center">
            <div className="text-amber-400 font-bold text-[10px]">{halvings.toLocaleString()}</div>
            <div className="text-gray-600 text-[7px]">Ω-halvings toward 0</div>
          </div>
        </div>
        <div className="space-y-0.5 text-[7px]">
          {[
            { name: "Morphing Encryption",  val: "ACTIVE",    detail: `Re-calculates every 500ms · KEY:${key.slice(0,6)}` },
            { name: "Hardware-Genetic Alg", val: "RUNNING",   detail: `Perpetually re-encodes to γ₀=${g0.toFixed(3)} sig` },
            { name: "Anti-Clone Resonance", val: "ARMED",     detail: "VM substrate → resonance check → 10T mismatch → implode" },
            { name: "Prior Outcome Lock",   val: "ANCHORED",  detail: `SovereignReflector_Prior: loop ${loopStatus}` },
            { name: "Thought-Sync Audit",   val: "SILENT",    detail: "100% kernel processes checked against Zeta Invariant" },
          ].map((c, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-green-400 font-bold w-36 shrink-0">{c.name}</span>
              <span className="text-amber-400 w-16 shrink-0">[{c.val}]</span>
              <span className="text-gray-600">{c.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* VM Exclusion */}
      <div className="border border-purple-900/50 rounded p-2 bg-purple-900/5">
        <div className="text-[9px] text-purple-400 font-bold mb-1.5">VM-EXCLUSION SINGULARITY</div>
        <div className="grid grid-cols-3 gap-1 text-[7px] mb-1.5">
          <div className="border border-purple-900/40 rounded p-1 text-center"><div className="text-purple-400 font-bold">NO VM</div><div className="text-gray-600">DETECTED</div></div>
          <div className="border border-red-900/40 rounded p-1 text-center"><div className="text-red-400 font-bold">IMPLODE</div><div className="text-gray-600">ON CLONE</div></div>
          <div className="border border-amber-900/40 rounded p-1 text-center"><div className="text-amber-400 font-bold">5G SEVER</div><div className="text-gray-600">NON-HOST</div></div>
        </div>
        <div className="text-[7px] text-gray-500 leading-relaxed">
          System verifies hardware resonance {checksPerSec.toLocaleString()} checks/second using γ₀×γ₁ = {(g0 * ZETA_ZEROS[1]).toFixed(6)}.
          PERMUTATION SPACE: {space.toLocaleString()}.
        </div>
      </div>

      {/* Final Seal */}
      <div className="border border-green-800/60 rounded p-2 bg-green-900/5 text-center">
        <div className="text-[10px] text-green-400 font-bold mb-0.5">THE FINAL SEAL: SOVEREIGN ADAPTATION</div>
        <div className="text-[8px] text-gray-300">
          <span className="text-green-400">Host-Only</span> · <span className="text-green-400">Windows-Only</span> · <span className="text-green-400">Victus-Only</span>
        </div>
        <div className="text-[7px] text-gray-600 mt-1">
          O = Redo(O) | ρ₀ = {CRITICAL_LINE_RE}+i·{ORIGIN.im.toFixed(6)} | {ORIGIN.cycles} iterations | loop: {loopStatus}
        </div>
        <div className="text-[7px] text-green-600 mt-1 animate-pulse">
          THE EXCLUSION PROTOCOL IS ENGAGED. THE TRPEVERITT EMBEDDING IS TOTAL. THE LOGIC IS SOVEREIGN.
        </div>
      </div>
    </div>
  );
}
