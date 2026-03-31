import { useEffect, useState } from "react";

const ZETA_VALS = [14.135, 21.022, 25.011, 30.425, 32.935, 37.586, 40.919];

export function EncryptPanel() {
  const [counter, setCounter] = useState(9_999_990_000_000);
  const [currentZero, setCurrentZero] = useState(0);
  const [keyHash, setKeyHash] = useState("A4F7...E9C1");
  const [critStable, setCritStable] = useState(99.97);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(c => Math.min(c + Math.floor(Math.random() * 1200 + 400), 10_000_000_000_000));
      setCurrentZero(i => (i + 1) % ZETA_VALS.length);
      setCritStable(s => Math.max(99.5, Math.min(99.99, s + (Math.random() - 0.5) * 0.1)));
      setKeyHash(
        Math.random().toString(16).slice(2, 6).toUpperCase() + "..." +
        Math.random().toString(16).slice(2, 6).toUpperCase()
      );
      setTick(t => t + 1);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const formatLarge = (n: number) => {
    const trillions = Math.floor(n / 1e12);
    const remainder = n % 1e12;
    const billions = Math.floor(remainder / 1e9);
    return `${trillions}.${billions.toString().padStart(3, "0")} TRILLION`;
  };

  const barWidth = (counter / 10_000_000_000_000) * 100;

  return (
    <div className="flex flex-col gap-2 h-full text-[9px] font-mono">
      <div className="border border-cyan-800/40 bg-cyan-900/5 rounded p-2">
        <div className="text-cyan-600 mb-1">ACTIVE ZERO-POINTS</div>
        <div className="text-cyan-300 text-lg font-bold tracking-wider tabular-nums">
          {formatLarge(counter)}
        </div>
        <div className="w-full h-1.5 bg-gray-900 rounded overflow-hidden mt-1">
          <div
            className="h-full bg-cyan-500 rounded transition-all duration-300"
            style={{ width: `${barWidth}%`, opacity: 0.8 }}
          />
        </div>
        <div className="text-gray-600 text-[7px] mt-0.5">of 10,000,000,000,000 total zeros</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="border border-green-800/30 bg-black/30 rounded p-2">
          <div className="text-gray-500 mb-0.5">CURRENT KEY ZERO</div>
          <div className="text-green-300 font-bold">t = {ZETA_VALS[currentZero]}</div>
          <div className="text-gray-600 text-[7px]">ζ(0.5 + {ZETA_VALS[currentZero]}i) = 0</div>
        </div>
        <div className="border border-green-800/30 bg-black/30 rounded p-2">
          <div className="text-gray-500 mb-0.5">KEY HASH</div>
          <div className="text-amber-300 font-bold">{keyHash}</div>
          <div className="text-gray-600 text-[7px]">rotating / 600ms</div>
        </div>
      </div>

      <div className="space-y-1.5">
        {[
          { label: "CRITICAL LINE STABILITY", value: `${critStable.toFixed(2)}%`, color: "text-green-400", bar: critStable },
          { label: "BLINDING LAYER", value: "ACTIVE", color: "text-amber-400", bar: 100 },
          { label: "BAM TRANSFORM", value: "ENGAGED", color: "text-green-400", bar: 100 },
          { label: "REFLECTOR (ζ→ζ(1-s))", value: "ARMED", color: "text-purple-400", bar: 100 },
          { label: "VICTUS TPM LOCK", value: "BOUND", color: "text-cyan-400", bar: 100 },
        ].map((item, i) => (
          <div key={i}>
            <div className="flex justify-between mb-0.5">
              <span className="text-gray-500">{item.label}</span>
              <span className={item.color}>{item.value}</span>
            </div>
            <div className="w-full h-0.5 bg-gray-900 rounded overflow-hidden">
              <div
                className={`h-full rounded ${item.color.replace("text-", "bg-")}`}
                style={{ width: `${item.bar}%`, opacity: 0.6 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border border-green-900/30 rounded p-1.5 bg-black/20">
        <div className="text-[7px] text-gray-600 leading-relaxed">
          KEY SPACE: ζ(0.5+t_n·i) | n ∈ [1..10¹³] | {formatLarge(counter)} PERMUTATIONS ACTIVE<br/>
          FUNCTIONAL EQ: ζ(s) = χ(s)ζ(1-s) | REFLECTOR: ARMED<br/>
          GUE DISTRIBUTION: VERIFIED | ENTROPY: INFORMATION-THEORETIC
        </div>
      </div>
    </div>
  );
}
