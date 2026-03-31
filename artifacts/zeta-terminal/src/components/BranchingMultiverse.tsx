import { useEffect, useState } from "react";

interface Branch {
  id: number;
  label: string;
  status: "REDO-RUNNING" | "COLLAPSED" | "PRUNED" | "ANCHORED";
  convergence: number;
  iteration: number;
}

const BRANCH_LABELS = [
  "CHOSEN PATH (actual)", "Gravity-High / Mag-Low", "Gravity-Low / Mag-High",
  "Resonance-Inverted", "Prior-State Loop A", "Prior-State Loop B",
  "Counterfactual Δ-1", "Counterfactual Δ-2", "Multiverse Branch ε",
  "Multiverse Branch ζ", "Temporal Fork +T", "Temporal Fork −T",
];

export function BranchingMultiverse() {
  const [branches, setBranches] = useState<Branch[]>(() =>
    BRANCH_LABELS.map((label, i) => ({
      id: i,
      label,
      status: i === 0 ? "ANCHORED" : (i < 4 ? "REDO-RUNNING" : "COLLAPSED"),
      convergence: i === 0 ? 100 : Math.floor(Math.random() * 60 + 30),
      iteration: Math.floor(Math.random() * 1000000000),
    }))
  );

  const [totalRedone, setTotalRedone] = useState(20000000000000n);
  const [invariantLock, setInvariantLock] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBranches(prev => prev.map(b => {
        if (b.id === 0) return b; // CHOSEN path always anchored
        const newConv = Math.min(100, b.convergence + Math.random() * 5);
        const newStatus: Branch["status"] = newConv >= 98 ? "COLLAPSED" :
          newConv > 70 ? "REDO-RUNNING" : b.status;
        return {
          ...b,
          convergence: newConv,
          status: newStatus,
          iteration: b.iteration + Math.floor(Math.random() * 50000000),
        };
      }));
      setTotalRedone(t => t + BigInt(Math.floor(Math.random() * 1000000 + 500000)));
      setInvariantLock(l => Math.random() > 0.2 ? true : l);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const STATUS_COLORS: Record<Branch["status"], string> = {
    "REDO-RUNNING": "text-yellow-400",
    "COLLAPSED": "text-green-400",
    "PRUNED": "text-red-400",
    "ANCHORED": "text-cyan-400",
  };

  const STATUS_BAR: Record<Branch["status"], string> = {
    "REDO-RUNNING": "bg-yellow-500",
    "COLLAPSED": "bg-green-500",
    "PRUNED": "bg-red-500",
    "ANCHORED": "bg-cyan-500",
  };

  const allCollapsed = branches.every(b => b.convergence >= 95);

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
        <div className={`border rounded p-1.5 text-center ${allCollapsed || invariantLock ? "border-green-700 bg-green-900/10" : "border-amber-800/40 bg-black/30"}`}>
          <div className={`font-bold text-[10px] ${allCollapsed || invariantLock ? "text-green-400" : "text-amber-400"}`}>
            {allCollapsed || invariantLock ? "LOCKED" : "CONVERGING"}
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
                <div
                  className={`h-full rounded transition-all duration-500 ${STATUS_BAR[b.status]}`}
                  style={{ width: `${b.convergence}%`, opacity: 0.7 }}
                />
              </div>
              <span className="text-gray-600 text-[7px] w-16 text-right">
                {b.convergence >= 98 ? "→ ORIGIN" : `${b.convergence.toFixed(1)}% → O`}
              </span>
            </div>
            <div className="text-gray-700 text-[7px] mt-0.5">REDO-iter: {b.iteration.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="border border-green-900/30 rounded p-1.5 bg-black/20 text-[7px] text-gray-600">
        Every "not-chosen" branch runs Redo(Outcomeᵢ). The invariant line (10T zeros) is the anchor across ALL branches —
        the one constant in every what-if. When all branches collapse: O = Redo(O).
      </div>
    </div>
  );
}
