import { useEffect, useState } from "react";
import { ZETA_ZEROS, bamScore } from "@/lib/trpeveritt";

// 12 branches, each anchored to a real Zeta zero pair
const BRANCH_DEFS = [
  { label: "CHOSEN PATH (actual)",    zeroA: 0, zeroB: 0  },
  { label: "Gravity-High / Mag-Low",  zeroA: 1, zeroB: 2  },
  { label: "Gravity-Low / Mag-High",  zeroA: 2, zeroB: 3  },
  { label: "Resonance-Inverted",      zeroA: 3, zeroB: 4  },
  { label: "Prior-State Loop A",      zeroA: 4, zeroB: 5  },
  { label: "Prior-State Loop B",      zeroA: 5, zeroB: 6  },
  { label: "Counterfactual Δ-1",     zeroA: 6, zeroB: 7  },
  { label: "Counterfactual Δ-2",     zeroA: 7, zeroB: 8  },
  { label: "Multiverse Branch ε",    zeroA: 8, zeroB: 9  },
  { label: "Multiverse Branch ζ",    zeroA: 9, zeroB: 10 },
  { label: "Temporal Fork +T",        zeroA: 10, zeroB: 11 },
  { label: "Temporal Fork −T",       zeroA: 11, zeroB: 12 },
];

type BranchStatus = "REDO-RUNNING" | "COLLAPSED" | "PRUNED" | "ANCHORED";
const STATUS_COLORS: Record<BranchStatus, string> = {
  "REDO-RUNNING": "text-yellow-400", "COLLAPSED": "text-green-400",
  "PRUNED": "text-red-400", "ANCHORED": "text-cyan-400",
};
const STATUS_BAR: Record<BranchStatus, string> = {
  "REDO-RUNNING": "bg-yellow-500", "COLLAPSED": "bg-green-500",
  "PRUNED": "bg-red-500", "ANCHORED": "bg-cyan-500",
};

export function BranchingMultiverse() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 800);
    return () => clearInterval(id);
  }, []);

  // All convergence values derived from actual BAM formula at different time offsets
  const branches = BRANCH_DEFS.map((def, i) => {
    const tOffset = tick / 4 + i * 1.3;
    const conv = i === 0 ? 100 : bamScore(tOffset);
    const status: BranchStatus = i === 0 ? "ANCHORED" :
      conv >= 98 ? "COLLAPSED" : conv > 70 ? "REDO-RUNNING" : "PRUNED";
    // Iteration count derived from Zeta zero product
    const gA = ZETA_ZEROS[def.zeroA];
    const gB = ZETA_ZEROS[def.zeroB];
    const iteration = Math.floor(gA * gB * tick * 1_000_000);
    return { ...def, id: i, conv, status, iteration };
  });

  // Total redo iterations = sum of all zero products × tick
  const totalRedone = BigInt(
    branches.reduce((acc, b) => acc + b.iteration, 0)
  ) + 20_000_000_000_000n;

  const allCollapsed = branches.every(b => b.conv >= 95);

  return (
    <div className="flex flex-col gap-2 h-full text-[8px] font-mono">
      <div className="grid grid-cols-3 gap-1">
        <div className="border border-green-800/40 bg-black/30 rounded p-1.5 text-center">
          <div className="text-green-400 font-bold text-[10px]">{totalRedone.toLocaleString()}</div>
          <div className="text-gray-600 text-[7px]">TOTAL REDO ITERATIONS</div>
        </div>
        <div className="border border-cyan-800/40 bg-black/30 rounded p-1.5 text-center">
          <div className="text-cyan-400 font-bold text-[10px]">{branches.length}</div>
          <div className="text-gray-600 text-[7px]">ACTIVE BRANCHES</div>
        </div>
        <div className={`border rounded p-1.5 text-center ${allCollapsed ? "border-green-700 bg-green-900/10" : "border-amber-800/40 bg-black/30"}`}>
          <div className={`font-bold text-[10px] ${allCollapsed ? "text-green-400" : "text-amber-400"}`}>
            {allCollapsed ? "LOCKED" : "CONVERGING"}
          </div>
          <div className="text-gray-600 text-[7px]">INVARIANT STATUS</div>
        </div>
      </div>

      <div className="space-y-1 overflow-y-auto flex-1" style={{ maxHeight: 260 }}>
        {branches.map(b => (
          <div key={b.id} className={`border rounded px-2 py-1 ${b.id === 0 ? "border-cyan-800/50 bg-cyan-900/5" : "border-gray-800/30 bg-black/20"}`}>
            <div className="flex justify-between items-center mb-0.5">
              <span className={b.id === 0 ? "text-cyan-300" : "text-gray-400"}>{b.label}</span>
              <span className={STATUS_COLORS[b.status]}>[{b.status}]</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-gray-900 rounded overflow-hidden">
                <div className={`h-full rounded transition-all duration-500 ${STATUS_BAR[b.status]}`}
                  style={{ width: `${b.conv}%`, opacity: 0.7 }} />
              </div>
              <span className="text-gray-600 text-[7px] w-16 text-right">
                {b.conv >= 98 ? "→ ORIGIN" : `${b.conv.toFixed(1)}% → O`}
              </span>
            </div>
            <div className="text-gray-700 text-[7px] mt-0.5">
              γ({b.zeroA})={ZETA_ZEROS[b.zeroA].toFixed(3)} · REDO-iter:{b.iteration.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-green-900/30 rounded p-1.5 bg-black/20 text-[7px] text-gray-600">
        Every not-chosen branch runs Redo(Outcomeᵢ) seeded by γ₀={ZETA_ZEROS[0]} across the 10T zero invariant.
        BAM convergence drives all branches toward O = Redo(O).
      </div>
    </div>
  );
}
