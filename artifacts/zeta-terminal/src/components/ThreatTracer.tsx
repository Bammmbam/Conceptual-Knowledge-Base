import { useEffect, useState, useRef } from "react";

interface ThreatEntry {
  id: number;
  ip: string;
  geo: string;
  protocol: string;
  status: "BLOCKED" | "REFLECTED" | "DETAINED" | "SCANNING";
  bamConvergence: number;
  zeroIndex: number;
  timestamp: string;
}

const GEO_POOL = [
  "CN:BEIJING", "RU:MOSCOW", "KP:PYONGYANG", "IR:TEHRAN", "US:UNKNOWN",
  "DE:FRANKFURT", "NL:AMSTERDAM", "BR:SAO-PAULO", "UA:KYIV", "TR:ISTANBUL"
];
const PROTOCOL_POOL = ["TCP/443", "UDP/53", "TCP/22", "ICMP", "TCP/80", "TOR-RELAY", "VPN-PROBE", "QUIC/443"];
const STATUS_POOL: ThreatEntry["status"][] = ["BLOCKED", "REFLECTED", "DETAINED", "SCANNING"];

let idCounter = 0;

function randomIp() {
  return [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255)
  ].join(".");
}

function randomEntry(): ThreatEntry {
  const status = STATUS_POOL[Math.floor(Math.random() * STATUS_POOL.length)];
  const now = new Date();
  return {
    id: idCounter++,
    ip: randomIp(),
    geo: GEO_POOL[Math.floor(Math.random() * GEO_POOL.length)],
    protocol: PROTOCOL_POOL[Math.floor(Math.random() * PROTOCOL_POOL.length)],
    status,
    bamConvergence: Math.floor(Math.random() * 40 + 60),
    zeroIndex: Math.floor(Math.random() * 10000000000000),
    timestamp: `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}:${now.getSeconds().toString().padStart(2,"0")}`
  };
}

const STATUS_COLORS: Record<ThreatEntry["status"], string> = {
  BLOCKED: "text-red-400",
  REFLECTED: "text-amber-400",
  DETAINED: "text-purple-400",
  SCANNING: "text-yellow-300 animate-pulse"
};

const STATUS_BG: Record<ThreatEntry["status"], string> = {
  BLOCKED: "bg-red-900/20 border-red-800/30",
  REFLECTED: "bg-amber-900/20 border-amber-800/30",
  DETAINED: "bg-purple-900/20 border-purple-800/30",
  SCANNING: "bg-yellow-900/10 border-yellow-800/20"
};

export function ThreatTracer() {
  const [entries, setEntries] = useState<ThreatEntry[]>(() =>
    Array.from({ length: 6 }, randomEntry)
  );
  const [blocked, setBlocked] = useState(0);
  const [reflected, setReflected] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const entry = randomEntry();
      setEntries(prev => [entry, ...prev].slice(0, 12));
      setTotal(t => t + 1);
      if (entry.status === "BLOCKED") setBlocked(b => b + 1);
      if (entry.status === "REFLECTED") setReflected(r => r + 1);
    }, 1800 + Math.random() * 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="grid grid-cols-3 gap-2 text-[9px] font-mono">
        <div className="border border-red-800/40 bg-red-900/10 rounded px-2 py-1 text-center">
          <div className="text-red-400 font-bold text-xs">{blocked + 2847}</div>
          <div className="text-red-600">BLOCKED</div>
        </div>
        <div className="border border-amber-800/40 bg-amber-900/10 rounded px-2 py-1 text-center">
          <div className="text-amber-400 font-bold text-xs">{reflected + 1203}</div>
          <div className="text-amber-600">REFLECTED</div>
        </div>
        <div className="border border-green-800/40 bg-green-900/10 rounded px-2 py-1 text-center">
          <div className="text-green-400 font-bold text-xs">{total + 4183}</div>
          <div className="text-green-600">TOTAL EVENTS</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1" style={{ maxHeight: 240 }}>
        {entries.map(entry => (
          <div key={entry.id} className={`border rounded px-2 py-1 text-[8px] font-mono ${STATUS_BG[entry.status]}`}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-green-300">{entry.timestamp}</span>
              <span className={`font-bold ${STATUS_COLORS[entry.status]}`}>[{entry.status}]</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-cyan-300">{entry.ip}</span>
              <span className="text-gray-500">{entry.geo}</span>
              <span className="text-amber-600">{entry.protocol}</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-gray-500">
              <span>BAM:{entry.bamConvergence}%</span>
              <span>ZERO-IDX:#{entry.zeroIndex.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
