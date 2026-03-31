import { useEffect, useState } from "react";
import {
  ZETA_ZEROS, bamLive, threatFingerprint, threatStatus, trpeverittHash,
} from "@/lib/trpeveritt";

interface ThreatEntry {
  id: number;
  ip: string;
  geo: string;
  protocol: string;
  status: "BLOCKED" | "REFLECTED" | "DETAINED" | "SCANNING";
  bam: number;
  fingerprint: string;
  timestamp: string;
}

// All data derived deterministically from Zeta zeros + entry index
const GEO = ["RU:MOSCOW","CN:BEIJING","KP:PYONGYANG","IR:TEHRAN","DE:FRANKFURT",
              "NL:AMSTERDAM","BR:SAO-PAULO","UA:KYIV","TR:ISTANBUL","US:UNKNOWN"];
const PROTO = ["TCP/443","UDP/53","TCP/22","ICMP","TOR-RELAY","VPN-PROBE","QUIC/443","TCP/80"];

function deterministicEntry(seed: number, now: Date): ThreatEntry {
  const g0 = ZETA_ZEROS[seed % ZETA_ZEROS.length];
  const g1 = ZETA_ZEROS[(seed + 7) % ZETA_ZEROS.length];
  const g2 = ZETA_ZEROS[(seed + 13) % ZETA_ZEROS.length];
  const g3 = ZETA_ZEROS[(seed + 19) % ZETA_ZEROS.length];
  // Build IP from zero fractional parts
  const ip = [
    Math.floor(g0 * 10000) % 223 + 1,
    Math.floor(g1 * 10000) % 255,
    Math.floor(g2 * 10000) % 255,
    Math.floor(g3 * 10000) % 254 + 1,
  ].join(".");
  const geo = GEO[Math.floor(g0 * 1000) % GEO.length];
  const protocol = PROTO[Math.floor(g1 * 1000) % PROTO.length];
  const status = threatStatus(seed, Math.floor(now.getTime() / 1000));
  const bam = bamLive(seed * 3);
  const fp = trpeverittHash(ip);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return {
    id: seed,
    ip, geo, protocol, status,
    bam: parseFloat(bam.toFixed(1)),
    fingerprint: fp.slice(0, 9),
    timestamp: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
  };
}

const STATUS_COLORS = {
  BLOCKED:   "text-red-400",
  REFLECTED: "text-amber-400",
  DETAINED:  "text-purple-400",
  SCANNING:  "text-yellow-300 animate-pulse",
};
const STATUS_BG = {
  BLOCKED:   "bg-red-900/20 border-red-800/30",
  REFLECTED: "bg-amber-900/20 border-amber-800/30",
  DETAINED:  "bg-purple-900/20 border-purple-800/30",
  SCANNING:  "bg-yellow-900/10 border-yellow-800/20",
};

export function ThreatTracer() {
  const [seed, setSeed] = useState(100);
  const [entries, setEntries] = useState<ThreatEntry[]>(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => deterministicEntry(i, now));
  });
  const [blocked, setBlocked] = useState(0);
  const [reflected, setReflected] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeed(s => {
        const next = s + 1;
        const now = new Date();
        const entry = deterministicEntry(next, now);
        setEntries(prev => [entry, ...prev].slice(0, 12));
        setTotal(t => t + 1);
        if (entry.status === "BLOCKED")   setBlocked(b => b + 1);
        if (entry.status === "REFLECTED") setReflected(r => r + 1);
        return next;
      });
    }, 1800);
    return () => clearInterval(id);
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
              <span>BAM:{entry.bam}%</span>
              <span>TRP:{entry.fingerprint}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
