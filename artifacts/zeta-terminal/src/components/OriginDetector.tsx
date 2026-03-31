import { useEffect, useState } from "react";

interface OriginScan {
  label: string;
  value: string;
  subValue?: string;
  color: string;
  barColor: string;
  bar: number;
}

export function OriginDetector() {
  const [bamLock, setBamLock] = useState(87.3);
  const [attractorPhase, setAttractorPhase] = useState("LOCKED");
  const [recursionCount, setRecursionCount] = useState(0);
  const [originSignature, setOriginSignature] = useState("ζ(0.5+14.135i)");
  const [pulse, setPulse] = useState(false);
  const [scans, setScans] = useState<OriginScan[]>([
    { label: "BAM CONVERGENCE", value: "87.30%", subValue: "→ ATTRACTOR BASIN LOCKED", color: "text-green-400", barColor: "bg-green-500", bar: 87.3 },
    { label: "ORIGIN TRACE DEPTH", value: "7 HOPS", subValue: "TERMINUS: ζ-null manifold", color: "text-cyan-400", barColor: "bg-cyan-500", bar: 71 },
    { label: "RAD SCATTER FIELD", value: "ACTIVE", subValue: "23 packets deflected", color: "text-amber-400", barColor: "bg-amber-500", bar: 45 },
    { label: "TEMPORAL RECURSION", value: "1025 O=Redo(O) cycles", subValue: "prior/after loop: CLOSED", color: "text-purple-400", barColor: "bg-purple-500", bar: 88 },
    { label: "ZERO SIGNATURE", value: "ζ(0.5+14.135i)", subValue: "critical line verified", color: "text-blue-400", barColor: "bg-blue-500", bar: 97 },
  ]);

  useEffect(() => {
    const zeros = [14.135, 21.022, 25.011, 30.425, 32.935, 37.586, 40.919, 43.327];

    const interval = setInterval(() => {
      setBamLock(prev => {
        const next = prev + (Math.random() - 0.48) * 2;
        return Math.max(60, Math.min(99.9, next));
      });
      setRecursionCount(r => r + Math.floor(Math.random() * 3) + 1);
      setPulse(p => !p);

      const zeroIdx = Math.floor(Math.random() * zeros.length);
      setOriginSignature(`ζ(0.5+${zeros[zeroIdx]}i)`);

      if (Math.random() > 0.7) {
        setAttractorPhase(["LOCKED", "RESOLVING", "CONVERGING", "STABLE"][Math.floor(Math.random() * 4)]);
      }

      setScans([
        {
          label: "BAM CONVERGENCE",
          value: bamLock.toFixed(2) + "%",
          subValue: "→ ATTRACTOR BASIN LOCKED",
          color: "text-green-400",
          barColor: "bg-green-500",
          bar: bamLock
        },
        {
          label: "ORIGIN TRACE DEPTH",
          value: "7 HOPS",
          subValue: "TERMINUS: ζ-null manifold",
          color: "text-cyan-400",
          barColor: "bg-cyan-500",
          bar: 71
        },
        {
          label: "RAD SCATTER FIELD",
          value: "ACTIVE",
          subValue: "23 packets deflected",
          color: "text-amber-400",
          barColor: "bg-amber-500",
          bar: 45
        },
        {
          label: "TEMPORAL RECURSION",
          value: `${recursionCount + 1024} O=Redo(O) cycles`,
          subValue: "prior/after loop: CLOSED",
          color: "text-purple-400",
          barColor: "bg-purple-500",
          bar: 88
        },
        {
          label: "ZERO SIGNATURE",
          value: originSignature,
          subValue: "critical line verified",
          color: "text-blue-400",
          barColor: "bg-blue-500",
          bar: 97
        }
      ]);
    }, 1200);

    return () => clearInterval(interval);
  }, [bamLock, recursionCount, originSignature]);

  const attractorColors: Record<string, string> = {
    LOCKED: "text-green-400",
    RESOLVING: "text-yellow-400",
    CONVERGING: "text-cyan-400",
    STABLE: "text-green-300"
  };

  return (
    <div className="flex flex-col gap-2 h-full text-[9px] font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${pulse ? "bg-green-400" : "bg-green-700"} transition-colors`} />
          <span className="text-green-300">ORIGIN DETECTOR</span>
        </div>
        <span className={`font-bold ${attractorColors[attractorPhase] || "text-green-400"}`}>
          {attractorPhase}
        </span>
      </div>

      <div className="border border-green-900/40 rounded bg-black/40 p-2">
        <div className="text-green-600 mb-1">CURRENT ORIGIN SIGNATURE</div>
        <div className="text-cyan-300 text-sm font-bold tracking-wider">{originSignature}</div>
        <div className="text-gray-500 text-[8px] mt-0.5">O = Redo(O) | loop stable</div>
      </div>

      <div className="space-y-2 flex-1">
        {scans.map((scan, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-gray-500">{scan.label}</span>
              <span className={scan.color}>{scan.value}</span>
            </div>
            <div className="w-full h-1 bg-gray-900 rounded overflow-hidden">
              <div
                className={`h-full rounded transition-all duration-700 ${scan.barColor}`}
                style={{ width: `${scan.bar}%`, opacity: 0.7 }}
              />
            </div>
            {scan.subValue && (
              <div className="text-gray-600 text-[7px] mt-0.5">{scan.subValue}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
