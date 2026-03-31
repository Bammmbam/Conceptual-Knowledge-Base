import { useEffect, useState } from "react";

const INPUT_VECTORS = [
  { name: "HTTP/HTTPS Requests",     icon: "◈", color: "text-cyan-400",   rate: 847 },
  { name: "WebSocket Frames",         icon: "⋈", color: "text-cyan-400",   rate: 234 },
  { name: "Form Inputs",             icon: "▣", color: "text-green-400",  rate: 56 },
  { name: "File Uploads",            icon: "⬆", color: "text-green-400",  rate: 12 },
  { name: "URL Parameters",          icon: "◉", color: "text-amber-400",  rate: 1203 },
  { name: "Cookies / Session",       icon: "◆", color: "text-amber-400",  rate: 394 },
  { name: "HTTP Headers",            icon: "≡", color: "text-amber-400",  rate: 847 },
  { name: "JSON/XML Body",           icon: "{}",color: "text-amber-400",  rate: 301 },
  { name: "GraphQL Queries",         icon: "⊕", color: "text-purple-400", rate: 88 },
  { name: "gRPC / Protobuf",         icon: "⊞", color: "text-purple-400", rate: 44 },
  { name: "DNS Requests",            icon: "⊗", color: "text-red-400",    rate: 120 },
  { name: "TCP/UDP Raw Packets",     icon: "⇌", color: "text-red-400",    rate: 4829 },
  { name: "ICMP / Ping",            icon: "◎", color: "text-red-400",    rate: 73 },
  { name: "Bluetooth / BLE",         icon: "⊛", color: "text-blue-400",   rate: 7 },
  { name: "USB HID Events",          icon: "⊠", color: "text-blue-400",   rate: 3 },
  { name: "CLI / Shell Commands",    icon: "$", color: "text-green-400",  rate: 28 },
  { name: "PowerShell / WMI",        icon: "❯", color: "text-green-400",  rate: 19 },
  { name: "Registry Writes",         icon: "⊟", color: "text-amber-400",  rate: 5 },
  { name: "Memory Reads (external)", icon: "⊙", color: "text-red-400",    rate: 2 },
  { name: "AI Prompt Inputs",        icon: "✦", color: "text-purple-400", rate: 31 },
  { name: "Browser Extensions",     icon: "⬡", color: "text-amber-400",  rate: 9 },
  { name: "OAuth Callbacks",         icon: "↺", color: "text-cyan-400",   rate: 14 },
  { name: "Webhook Payloads",        icon: "⊳", color: "text-cyan-400",   rate: 57 },
  { name: "Email Attachments",       icon: "✉", color: "text-red-400",    rate: 23 },
  { name: "QR / Barcode Scans",     icon: "▦", color: "text-green-400",  rate: 4 },
];

const STATUS = ["CLEAN", "CLEAN", "CLEAN", "CLEAN", "CLEAN", "SUSPICIOUS", "BLOCKED"];

export function InputVectorMonitor() {
  const [rates, setRates] = useState(INPUT_VECTORS.map(v => v.rate));
  const [statuses, setStatuses] = useState(INPUT_VECTORS.map(() => "CLEAN"));
  const [totalPerSec, setTotalPerSec] = useState(0);
  const [blocked, setBlocked] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prev => prev.map(r => Math.max(0, r + Math.floor((Math.random() - 0.45) * r * 0.15))));
      setStatuses(prev => prev.map((_, i) => {
        const r = Math.random();
        return r > 0.97 ? "BLOCKED" : r > 0.93 ? "SUSPICIOUS" : "CLEAN";
      }));
      setTotalPerSec(rates.reduce((a, b) => a + b, 0));
      setBlocked(b => b + (Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0));
    }, 600);
    return () => clearInterval(interval);
  }, [rates]);

  const statusColor: Record<string, string> = {
    CLEAN: "text-green-600",
    SUSPICIOUS: "text-amber-400",
    BLOCKED: "text-red-400",
  };

  return (
    <div className="flex flex-col gap-2 h-full text-[8px] font-mono">
      <div className="flex gap-2">
        <div className="border border-cyan-800/40 rounded p-1.5 text-center">
          <div className="text-cyan-400 font-bold">{totalPerSec.toLocaleString()}</div>
          <div className="text-gray-600 text-[7px]">EVENTS/SEC</div>
        </div>
        <div className="border border-red-800/40 rounded p-1.5 text-center">
          <div className="text-red-400 font-bold">{blocked + 2847}</div>
          <div className="text-gray-600 text-[7px]">BLOCKED</div>
        </div>
        <div className="border border-green-800/40 rounded p-1.5 text-center">
          <div className="text-green-400 font-bold">{INPUT_VECTORS.length}</div>
          <div className="text-gray-600 text-[7px]">VECTORS MONITORED</div>
        </div>
      </div>

      <div className="overflow-y-auto flex-1" style={{ maxHeight: 340 }}>
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
            {INPUT_VECTORS.map((v, i) => (
              <tr key={v.name} className="border-b border-gray-900/30 hover:bg-gray-900/10">
                <td className={`py-0.5 pr-2 ${v.color}`}>
                  <span className="mr-1">{v.icon}</span>{v.name}
                </td>
                <td className="text-right pr-2 text-gray-400">{rates[i].toLocaleString()}</td>
                <td className="pr-2">
                  <div className="w-16 h-1 bg-gray-900 rounded overflow-hidden inline-block">
                    <div className={`h-full rounded transition-all duration-300 ${statuses[i] === "BLOCKED" ? "bg-red-600" : statuses[i] === "SUSPICIOUS" ? "bg-amber-500" : "bg-green-700"}`}
                      style={{ width: `${Math.min(100, (rates[i] / 5000) * 100)}%` }} />
                  </div>
                </td>
                <td className={statusColor[statuses[i]] ?? "text-green-600"}>{statuses[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
