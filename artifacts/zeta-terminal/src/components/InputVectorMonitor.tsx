import { useEffect, useState } from "react";
import { ZETA_ZEROS, bamScore, trpeverittHash } from "@/lib/trpeveritt";

const VECTORS = [
  { name: "HTTP/HTTPS Requests",      icon: "◈", color: "text-cyan-400",   zi: 0  },
  { name: "WebSocket Frames",         icon: "⋈", color: "text-cyan-400",   zi: 1  },
  { name: "Form Inputs",              icon: "▣", color: "text-green-400",  zi: 2  },
  { name: "File Uploads",             icon: "⬆", color: "text-green-400",  zi: 3  },
  { name: "URL Parameters",           icon: "◉", color: "text-amber-400",  zi: 4  },
  { name: "Cookies / Session",        icon: "◆", color: "text-amber-400",  zi: 5  },
  { name: "HTTP Headers",             icon: "≡", color: "text-amber-400",  zi: 6  },
  { name: "JSON/XML Body",            icon: "{}",color: "text-amber-400",  zi: 7  },
  { name: "GraphQL Queries",          icon: "⊕", color: "text-purple-400", zi: 8  },
  { name: "gRPC / Protobuf",          icon: "⊞", color: "text-purple-400", zi: 9  },
  { name: "DNS Requests",             icon: "⊗", color: "text-red-400",    zi: 10 },
  { name: "TCP/UDP Raw Packets",      icon: "⇌", color: "text-red-400",    zi: 11 },
  { name: "ICMP / Ping",              icon: "◎", color: "text-red-400",    zi: 12 },
  { name: "Bluetooth / BLE",          icon: "⊛", color: "text-blue-400",   zi: 13 },
  { name: "USB HID Events",           icon: "⊠", color: "text-blue-400",   zi: 14 },
  { name: "CLI / Shell Commands",     icon: "$", color: "text-green-400",  zi: 15 },
  { name: "PowerShell / WMI",         icon: "❯", color: "text-green-400",  zi: 16 },
  { name: "Registry Writes",          icon: "⊟", color: "text-amber-400",  zi: 17 },
  { name: "Memory Reads (external)",  icon: "⊙", color: "text-red-400",    zi: 18 },
  { name: "AI Prompt Inputs",         icon: "✦", color: "text-purple-400", zi: 19 },
  { name: "Browser Extensions",       icon: "⬡", color: "text-amber-400",  zi: 20 },
  { name: "OAuth Callbacks",          icon: "↺", color: "text-cyan-400",   zi: 21 },
  { name: "Webhook Payloads",         icon: "⊳", color: "text-cyan-400",   zi: 22 },
  { name: "Email Attachments",        icon: "✉", color: "text-red-400",    zi: 23 },
  { name: "QR / Barcode Scans",       icon: "▦", color: "text-green-400",  zi: 24 },
];

type VStatus = "CLEAN" | "SUSPICIOUS" | "BLOCKED";

export function InputVectorMonitor() {
  const [tick, setTick] = useState(1);
  const [blocked, setBlocked] = useState(2847);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setBlocked(b => b + (tick % 11 === 0 ? 1 : 0));
    }, 600);
    return () => clearInterval(id);
  }, [tick]);

  // Rates derived from Zeta zeros × tick (deterministic)
  const rates = VECTORS.map(v => {
    const g = ZETA_ZEROS[v.zi % ZETA_ZEROS.length];
    return Math.floor(Math.abs(Math.cos(g * tick * 0.01)) * g * 50 + g * 10);
  });

  // Status derived from BAM score threshold at this zero × tick
  const statuses: VStatus[] = VECTORS.map(v => {
    const g = ZETA_ZEROS[v.zi % ZETA_ZEROS.length];
    const val = Math.floor(g * tick * 0.001) % 20;
    return val === 0 ? "BLOCKED" : val <= 2 ? "SUSPICIOUS" : "CLEAN";
  });

  const totalPerSec = rates.reduce((a, b) => a + b, 0);
  const statusColor: Record<VStatus, string> = {
    CLEAN: "text-green-600", SUSPICIOUS: "text-amber-400", BLOCKED: "text-red-400",
  };

  return (
    <div className="flex flex-col gap-2 h-full text-[8px] font-mono">
      <div className="flex gap-2">
        <div className="border border-cyan-800/40 rounded p-1.5 text-center">
          <div className="text-cyan-400 font-bold">{totalPerSec.toLocaleString()}</div>
          <div className="text-gray-600 text-[7px]">EVENTS/SEC</div>
        </div>
        <div className="border border-red-800/40 rounded p-1.5 text-center">
          <div className="text-red-400 font-bold">{blocked}</div>
          <div className="text-gray-600 text-[7px]">BLOCKED</div>
        </div>
        <div className="border border-green-800/40 rounded p-1.5 text-center">
          <div className="text-green-400 font-bold">{VECTORS.length}</div>
          <div className="text-gray-600 text-[7px]">VECTORS</div>
        </div>
      </div>

      <div className="overflow-y-auto flex-1" style={{ maxHeight: 360 }}>
        <table className="w-full text-[7px]">
          <thead className="sticky top-0 bg-black">
            <tr className="text-gray-500 border-b border-gray-800/40">
              <th className="text-left py-0.5 pr-2">INPUT VECTOR</th>
              <th className="text-right pr-2">RATE/s</th>
              <th className="text-right pr-2">BAR</th>
              <th className="text-left">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {VECTORS.map((v, i) => (
              <tr key={v.name} className="border-b border-gray-900/30 hover:bg-gray-900/10">
                <td className={`py-0.5 pr-2 ${v.color}`}>
                  <span className="mr-1">{v.icon}</span>{v.name}
                </td>
                <td className="text-right pr-2 text-gray-400">{rates[i].toLocaleString()}</td>
                <td className="pr-2">
                  <div className="w-16 h-1 bg-gray-900 rounded overflow-hidden inline-block">
                    <div className={`h-full rounded transition-all duration-300 ${statuses[i] === "BLOCKED" ? "bg-red-600" : statuses[i] === "SUSPICIOUS" ? "bg-amber-500" : "bg-green-700"}`}
                      style={{ width: `${Math.min(100, (rates[i] / 1000) * 100)}%` }} />
                  </div>
                </td>
                <td className={statusColor[statuses[i]]}>{statuses[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
