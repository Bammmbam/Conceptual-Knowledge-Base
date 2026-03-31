import { useEffect, useState } from "react";

export function SystemHeader() {
  const [time, setTime] = useState(new Date());
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const b = setInterval(() => setBlink(p => !p), 800);
    return () => { clearInterval(t); clearInterval(b); };
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

  return (
    <div className="border-b border-green-900/50 bg-black/80 px-4 py-2 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${blink ? "bg-green-400" : "bg-green-700"} transition-colors`} />
          <span className="text-green-300 text-[10px] font-mono font-bold tracking-widest">
            ZETA SECURITY TERMINAL v3.1
          </span>
        </div>
        <div className="text-[8px] font-mono text-gray-600">
          Trpeveritt Encryption | BAM/RAD Engine | Origin Detector
        </div>
      </div>

      <div className="flex items-center gap-4 text-[8px] font-mono">
        <div className="flex items-center gap-1">
          <span className="text-gray-600">VICTUS:</span>
          <span className="text-green-400">LOCKED</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">ZEROS:</span>
          <span className="text-cyan-400">10T ACTIVE</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">AXIS:</span>
          <span className="text-amber-400">3/3 STABLE</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">WIN-ONLY:</span>
          <span className="text-green-400">ENFORCED</span>
        </div>
        <div className="text-green-500">{timeStr}</div>
      </div>
    </div>
  );
}
