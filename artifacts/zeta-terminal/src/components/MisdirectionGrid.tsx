import { useEffect, useState } from "react";
import { ZETA_ZEROS, trpeverittHash, bamScore } from "@/lib/trpeveritt";

const HONEYPOTS = [
  { id: "HP-01", label: "Admin Portal (decoy)",  port: 8080, type: "WEB",    lure: "Login page / weak-cred trap" },
  { id: "HP-02", label: "SSH Open Port (decoy)", port: 22,   type: "SSH",    lure: "Accepts creds → infinite stall loop" },
  { id: "HP-03", label: "API Gateway (decoy)",   port: 3000, type: "API",    lure: "Returns plausible fake JWT tokens" },
  { id: "HP-04", label: "Database (decoy)",      port: 5432, type: "DB",     lure: "Realistic schema → all reads poisoned" },
  { id: "HP-05", label: "File Server (decoy)",   port: 445,  type: "SMB",    lure: "Enticing filenames → forensic trap" },
  { id: "HP-06", label: "Admin CLI (decoy)",     port: 2222, type: "SHELL",  lure: "Full shell experience → sandboxed jail" },
  { id: "HP-07", label: "Crypto Wallet (decoy)", port: 9999, type: "WALLET", lure: "Balance $2.3M shown → unspendable" },
  { id: "HP-08", label: "AI Agent (decoy)",      port: 7777, type: "AI-API", lure: "Appears to follow instructions → loops" },
];

const GEO = ["US","RU","CN","DE","BR","KP","IR","UA","IN","GB","NL","FR"];

interface Attacker {
  id: number;
  ip: string;
  geo: string;
  honeypot: string;
  action: string;
  depth: number;
  timeInTrap: number;
  fingerprint: string;
}

const ACTIONS = ["ROUTED","TRAPPED","LOOPING","POISONED","JAILED","STALLED","MIRRORED","RECYCLED"];

function buildAttacker(seed: number): Attacker {
  const gA = ZETA_ZEROS[seed % ZETA_ZEROS.length];
  const gB = ZETA_ZEROS[(seed + 3) % ZETA_ZEROS.length];
  const gC = ZETA_ZEROS[(seed + 7) % ZETA_ZEROS.length];
  const ip = [
    Math.floor(gA * 1000) % 223 + 1,
    Math.floor(gB * 1000) % 255,
    Math.floor(gC * 1000) % 255,
    Math.floor((gA + gB) * 1000) % 254 + 1,
  ].join(".");
  return {
    id: seed,
    ip,
    geo: GEO[Math.floor(gA * 100) % GEO.length],
    honeypot: HONEYPOTS[Math.floor(gB * 100) % HONEYPOTS.length].id,
    action: ACTIONS[Math.floor(gC * 100) % ACTIONS.length],
    depth: (Math.floor(gA * 10) % 12) + 1,
    timeInTrap: Math.floor(gB * 100) % 300 + 30,
    fingerprint: trpeverittHash(ip).slice(0, 8),
  };
}

export function MisdirectionGrid() {
  const [tick, setTick] = useState(1);
  const [attackers, setAttackers] = useState<Attacker[]>(() =>
    Array.from({ length: 6 }, (_, i) => buildAttacker(i))
  );
  const [total, setTotal] = useState(4721);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => {
        const next = t + 1;
        // Update time-in-trap deterministically, occasionally add new attacker
        setAttackers(prev => {
          const updated = prev.map(a => ({
            ...a,
            timeInTrap: a.timeInTrap + 2,
            depth: Math.min(12, a.depth + (Math.floor(ZETA_ZEROS[next % ZETA_ZEROS.length] * 10) % 2)),
          }));
          if (next % 7 === 0) {
            setTotal(t2 => t2 + 1);
            return [buildAttacker(next + 100), ...updated].slice(0, 10);
          }
          return updated;
        });
        return next;
      });
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const avgTime = attackers.length > 0
    ? Math.floor(attackers.reduce((a, b) => a + b.timeInTrap, 0) / attackers.length)
    : 47;

  return (
    <div className="flex flex-col gap-2 h-full text-[8px] font-mono">
      <div className="grid grid-cols-3 gap-1">
        <div className="border border-amber-800/40 rounded p-1.5 text-center">
          <div className="text-amber-400 font-bold">{total.toLocaleString()}</div>
          <div className="text-gray-600 text-[7px]">TOTAL MISDIRECTED</div>
        </div>
        <div className="border border-red-800/40 rounded p-1.5 text-center">
          <div className="text-red-400 font-bold">{attackers.length}</div>
          <div className="text-gray-600 text-[7px]">CURRENTLY TRAPPED</div>
        </div>
        <div className="border border-green-800/40 rounded p-1.5 text-center">
          <div className="text-green-400 font-bold">{avgTime}s</div>
          <div className="text-gray-600 text-[7px]">AVG TIME IN TRAP</div>
        </div>
      </div>

      <div className="border border-amber-900/30 rounded p-1.5">
        <div className="text-[9px] text-amber-400 font-bold mb-1">HONEYPOT NODES</div>
        <div className="grid grid-cols-2 gap-1">
          {HONEYPOTS.map(hp => {
            const trapped = attackers.filter(a => a.honeypot === hp.id).length;
            return (
              <div key={hp.id} className={`border rounded px-1.5 py-1 ${trapped > 0 ? "border-amber-700/60 bg-amber-900/8" : "border-gray-800/30"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold">{hp.id}</span>
                  <span className={`text-[7px] ${trapped > 0 ? "text-red-400" : "text-gray-600"}`}>{trapped > 0 ? `${trapped} TRAPPED` : "READY"}</span>
                </div>
                <div className="text-gray-500 text-[7px]">{hp.label}:{hp.port}</div>
                <div className="text-gray-600 text-[6px]">{hp.lure}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border border-red-900/30 rounded p-1.5 flex-1">
        <div className="text-[9px] text-red-400 font-bold mb-1">LIVE MISDIRECTION LOG</div>
        <div className="space-y-0.5 overflow-y-auto" style={{ maxHeight: 170 }}>
          {attackers.map(a => (
            <div key={a.id} className="flex gap-2 text-[7px] border-b border-gray-900/40 pb-0.5">
              <span className="text-cyan-600 w-28 shrink-0">{a.ip}</span>
              <span className="text-gray-600 w-6">{a.geo}</span>
              <span className="text-amber-600 w-14">{a.honeypot}</span>
              <span className="text-red-600 w-14">{a.action}</span>
              <span className="text-gray-600">D:{a.depth} T:{a.timeInTrap}s FP:{a.fingerprint}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
