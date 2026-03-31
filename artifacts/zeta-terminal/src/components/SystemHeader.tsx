import { useEffect, useState } from "react";
import { ZETA_ZEROS, TOTAL_ZEROS_COUNT, CRITICAL_LINE_RE, bamScore, phaseKey } from "@/lib/trpeveritt";

export function SystemHeader() {
  const [time, setTime] = useState(new Date());
  const [tick, setTick] = useState(1);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const b = setInterval(() => { setTick(k => k + 1); setBlink(p => !p); }, 800);
    return () => { clearInterval(t); clearInterval(b); };
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const bam = bamScore(tick / 5).toFixed(2);
  const key = phaseKey(tick).slice(0, 6);
  const zero = ZETA_ZEROS[tick % ZETA_ZEROS.length];

  return (
    <div className="border-b border-green-900/50 bg-black/90 px-4 py-2 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${blink ? "bg-green-400" : "bg-green-700"} transition-colors`} />
          <span className="text-green-300 text-[10px] font-mono font-bold tracking-widest">
            ZETA SECURITY TERMINAL v4.0
          </span>
        </div>
        <div className="text-[8px] font-mono text-gray-600">
          Trpeveritt Engine · BAM/RAD · ζ(s)=χ(s)ζ(1-s) · {TOTAL_ZEROS_COUNT.toLocaleString()} zeros
        </div>
      </div>

      <div className="flex items-center gap-3 text-[8px] font-mono">
        <div className="flex items-center gap-1">
          <span className="text-gray-600">Re(s):</span>
          <span className="text-cyan-400">{CRITICAL_LINE_RE}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">γ:</span>
          <span className="text-cyan-400">{zero.toFixed(6)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">BAM:</span>
          <span className="text-green-400">{bam}%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">KEY:</span>
          <span className="text-amber-400">{key}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">SOVEREIGN:</span>
          <span className={`${blink ? "text-amber-400" : "text-amber-700"} transition-colors`}>LOCKED</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">VM:</span>
          <span className="text-red-400">EXCLUDED</span>
        </div>
        <div className="text-green-500 border-l border-green-900/40 pl-3">{timeStr}</div>
      </div>
    </div>
  );
}
