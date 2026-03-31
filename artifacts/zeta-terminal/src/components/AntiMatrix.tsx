import { useEffect, useState } from "react";

const ANTI_SYSTEMS = [
  { cat: "MALWARE",     items: ["Anti-Virus", "Anti-Trojan", "Anti-Worm", "Anti-Dropper", "Anti-Payload", "Anti-Ransomware", "Anti-Cryptominer", "Anti-Spyware"] },
  { cat: "NETWORK",     items: ["Anti-DDoS", "Anti-Sniffer", "Anti-MITM", "Anti-ARP", "Anti-DNS-Poison", "Anti-SSRF", "Anti-Replay", "Anti-Flood"] },
  { cat: "WEB",         items: ["Anti-XSS", "Anti-SQLi", "Anti-CSRF", "Anti-XXE", "Anti-ClickJack", "Anti-IDOR", "Anti-SSTI", "Anti-RFI"] },
  { cat: "AUTH",        items: ["Anti-BruteForce", "Anti-Stuffing", "Anti-PassSpray", "Anti-TokenForge", "Anti-SessionHijack", "Anti-OAuthAbuse"] },
  { cat: "MEMORY",      items: ["Anti-Overflow", "Anti-HeapSpray", "Anti-ROP", "Anti-UAF", "Anti-DoubleFreeze", "Anti-NullDeref"] },
  { cat: "OS/KERNEL",   items: ["Anti-Rootkit", "Anti-Bootkit", "Anti-Keylogger", "Anti-PrivEsc", "Anti-DKOM", "Anti-PatchGuard-Bypass"] },
  { cat: "VM/CLOUD",    items: ["Anti-VMEscape", "Anti-ContainerBreak", "Anti-HypervisorProbe", "Anti-SideChannel", "Anti-Spectre", "Anti-Meltdown"] },
  { cat: "AI/SOCIAL",   items: ["Anti-PromptInject", "Anti-ModelPoison", "Anti-Jailbreak", "Anti-DeepFake", "Anti-SocialEng", "Anti-Phishing"] },
  { cat: "HARDWARE",    items: ["Anti-BadUSB", "Anti-JTAG", "Anti-SWD", "Anti-FaultInject", "Anti-PowerAnalysis", "Anti-TimingAttack"] },
  { cat: "CRYPTO",      items: ["Anti-QuantumBrute", "Anti-WeakPRNG", "Anti-OraclePadding", "Anti-HashCollide", "Anti-KeyRecover", "Anti-SignatureFault"] },
];

type Status = "ACTIVE" | "ARMED" | "IDLE";

export function AntiMatrix() {
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [totalActive, setTotalActive] = useState(0);

  useEffect(() => {
    const initial: Record<string, Status> = {};
    ANTI_SYSTEMS.forEach(cat => {
      cat.items.forEach(item => {
        initial[`${cat.cat}.${item}`] = Math.random() > 0.15 ? "ACTIVE" : Math.random() > 0.5 ? "ARMED" : "IDLE";
      });
    });
    setStatuses(initial);
    setTotalActive(Object.values(initial).filter(s => s === "ACTIVE").length);

    const interval = setInterval(() => {
      setStatuses(prev => {
        const next = { ...prev };
        const keys = Object.keys(next);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        next[randomKey] = next[randomKey] === "ACTIVE" ? "ARMED" : "ACTIVE";
        setTotalActive(Object.values(next).filter(s => s === "ACTIVE").length);
        return next;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const STATUS_COLORS: Record<Status, string> = {
    ACTIVE: "text-green-400",
    ARMED: "text-amber-400",
    IDLE: "text-gray-700",
  };
  const STATUS_DOT: Record<Status, string> = {
    ACTIVE: "bg-green-400",
    ARMED: "bg-amber-400",
    IDLE: "bg-gray-800",
  };

  const allItems = ANTI_SYSTEMS.reduce((a, c) => a + c.items.length, 0);

  return (
    <div className="flex flex-col gap-2 h-full text-[8px] font-mono">
      <div className="flex gap-2">
        <div className="border border-green-800/40 rounded p-1.5 text-center">
          <div className="text-green-400 font-bold">{totalActive}/{allItems}</div>
          <div className="text-gray-600 text-[7px]">ACTIVE</div>
        </div>
        <div className="border border-amber-800/40 rounded p-1.5 text-center">
          <div className="text-amber-400 font-bold">{Object.values(statuses).filter(s => s === "ARMED").length}</div>
          <div className="text-gray-600 text-[7px]">ARMED</div>
        </div>
        <div className="flex-1 border border-cyan-900/30 rounded px-2 py-1 text-[7px] text-gray-500">
          ANTI-EVERYTHING MATRIX — {ANTI_SYSTEMS.length} CATEGORIES · {allItems} SYSTEMS · ALL ZETA-GUARDED
        </div>
      </div>

      <div className="overflow-y-auto flex-1" style={{ maxHeight: 340 }}>
        {ANTI_SYSTEMS.map(cat => (
          <div key={cat.cat} className="mb-1.5">
            <div className="text-[8px] text-cyan-600 font-bold mb-0.5 border-b border-cyan-900/20 pb-0.5">{cat.cat}</div>
            <div className="grid grid-cols-2 gap-0.5">
              {cat.items.map(item => {
                const key = `${cat.cat}.${item}`;
                const status = statuses[key] ?? "IDLE";
                return (
                  <div key={item} className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[status]} ${status === "ACTIVE" ? "animate-pulse" : ""}`} />
                    <span className={`${STATUS_COLORS[status]} text-[7px]`}>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
