import { useEffect, useState } from "react";

const HONEYPOT_NODES = [
  { id: "HP-01", label: "Admin Portal (fake)", port: 8080, type: "WEB", lure: "Login page with weak credentials" },
  { id: "HP-02", label: "SSH Open Port", port: 22, type: "SSH", lure: "Accepts creds → infinite stall loop" },
  { id: "HP-03", label: "API Gateway (fake)", port: 3000, type: "API", lure: "Returns plausible fake JWT tokens" },
  { id: "HP-04", label: "Database (fake)", port: 5432, type: "DB", lure: "Realistic schema → all reads poisoned" },
  { id: "HP-05", label: "File Server (fake)", port: 445, type: "SMB", lure: "Enticing filenames → forensic trap" },
  { id: "HP-06", label: "Admin CLI (fake)", port: 2222, type: "SHELL", lure: "Full shell experience → sandboxed jail" },
  { id: "HP-07", label: "Crypto Wallet (fake)", port: 9999, type: "WALLET", lure: "Balance shows $2.3M → unspendable" },
  { id: "HP-08", label: "AI Agent (fake)", port: 7777, type: "AI-API", lure: "Appears to follow instructions → loops" },
];

const GEO_LABELS = ["US", "RU", "CN", "DE", "BR", "KP", "IR", "UA", "IN", "GB", "NL", "FR"];
const ACTION_LABELS = ["ROUTED", "TRAPPED", "LOOPING", "POISONED", "JAILED", "STALLED", "MIRRORED", "RECYCLED"];

interface Attacker {
  id: number;
  ip: string;
  geo: string;
  honeypot: string;
  action: string;
  depth: number;
  timeInTrap: number;
}

let aid = 0;
function randIp() { return `${Math.floor(Math.random() * 223 + 1)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254 + 1)}`; }

export function MisdirectionGrid() {
  const [attackers, setAttackers] = useState<Attacker[]>([]);
  const [totalMisdirected, setTotalMisdirected] = useState(4721);
  const [avgTimeInTrap, setAvgTimeInTrap] = useState(47);

  useEffect(() => {
    // Seed initial
    const initial: Attacker[] = Array.from({ length: 6 }, (_, i) => ({
      id: aid++,
      ip: randIp(),
      geo: GEO_LABELS[Math.floor(Math.random() * GEO_LABELS.length)],
      honeypot: HONEYPOT_NODES[Math.floor(Math.random() * HONEYPOT_NODES.length)].id,
      action: ACTION_LABELS[Math.floor(Math.random() * ACTION_LABELS.length)],
      depth: Math.floor(Math.random() * 5 + 1),
      timeInTrap: Math.floor(Math.random() * 300 + 30),
    }));
    setAttackers(initial);

    const interval = setInterval(() => {
      setAttackers(prev => {
        const updated = prev.map(a => ({ ...a, timeInTrap: a.timeInTrap + 2, depth: Math.min(12, a.depth + (Math.random() > 0.7 ? 1 : 0)) }));
        if (Math.random() > 0.6) {
          const newEntry: Attacker = {
            id: aid++,
            ip: randIp(),
            geo: GEO_LABELS[Math.floor(Math.random() * GEO_LABELS.length)],
            honeypot: HONEYPOT_NODES[Math.floor(Math.random() * HONEYPOT_NODES.length)].id,
            action: ACTION_LABELS[Math.floor(Math.random() * ACTION_LABELS.length)],
            depth: 1,
            timeInTrap: 2,
          };
          setTotalMisdirected(t => t + 1);
          return [newEntry, ...updated].slice(0, 10);
        }
        return updated;
      });
      setAvgTimeInTrap(t => Math.max(40, Math.min(80, t + (Math.random() - 0.5) * 3)));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2 h-full text-[8px] font-mono">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-1">
        <div className="border border-amber-800/40 rounded p-1.5 text-center">
          <div className="text-amber-400 font-bold">{totalMisdirected.toLocaleString()}</div>
          <div className="text-gray-600 text-[7px]">TOTAL MISDIRECTED</div>
        </div>
        <div className="border border-red-800/40 rounded p-1.5 text-center">
          <div className="text-red-400 font-bold">{attackers.length}</div>
          <div className="text-gray-600 text-[7px]">CURRENTLY TRAPPED</div>
        </div>
        <div className="border border-green-800/40 rounded p-1.5 text-center">
          <div className="text-green-400 font-bold">{avgTimeInTrap.toFixed(0)}s</div>
          <div className="text-gray-600 text-[7px]">AVG TIME IN TRAP</div>
        </div>
      </div>

      {/* Honeypot nodes */}
      <div className="border border-amber-900/30 rounded p-1.5">
        <div className="text-[9px] text-amber-400 font-bold mb-1">HONEYPOT NODES — ACTIVE DECOYS</div>
        <div className="grid grid-cols-2 gap-1">
          {HONEYPOT_NODES.map(hp => {
            const trapped = attackers.filter(a => a.honeypot === hp.id).length;
            return (
              <div key={hp.id} className={`border rounded px-1.5 py-1 ${trapped > 0 ? "border-amber-700/60 bg-amber-900/8" : "border-gray-800/30"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold">{hp.id}</span>
                  <span className={`text-[7px] ${trapped > 0 ? "text-red-400" : "text-gray-600"}`}>{trapped > 0 ? `${trapped} TRAPPED` : "READY"}</span>
                </div>
                <div className="text-gray-500 text-[7px]">{hp.label} :{hp.port}</div>
                <div className="text-gray-600 text-[6px]">{hp.lure}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live attacker log */}
      <div className="border border-red-900/30 rounded p-1.5 flex-1">
        <div className="text-[9px] text-red-400 font-bold mb-1">LIVE MISDIRECTION LOG</div>
        <div className="space-y-0.5 overflow-y-auto" style={{ maxHeight: 180 }}>
          {attackers.map(a => (
            <div key={a.id} className="flex gap-2 text-[7px] border-b border-gray-900/40 pb-0.5">
              <span className="text-cyan-600 w-28 shrink-0">{a.ip}</span>
              <span className="text-gray-600 w-6">{a.geo}</span>
              <span className="text-amber-600 w-14">{a.honeypot}</span>
              <span className="text-red-600 w-16">{a.action}</span>
              <span className="text-gray-600 w-12">D:{a.depth} T:{a.timeInTrap}s</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-[7px] text-gray-600 border border-gray-800/30 rounded px-2 py-1">
        Misdirection layer routes all unauthorized access through convincing decoys. Attackers spend resources inside traps while the real system remains completely invisible.
        RAD-scatter provides infinite false branches — hacker never reaches the real surface.
      </div>
    </div>
  );
}
