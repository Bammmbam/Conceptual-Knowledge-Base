import { useEffect, useState } from "react";
import { ZETA_ZEROS, trpeverittHash } from "@/lib/trpeveritt";

const ANTI_CATEGORIES = [
  { cat: "MALWARE",   items: ["Anti-Virus","Anti-Trojan","Anti-Worm","Anti-Dropper","Anti-Ransomware","Anti-Cryptominer","Anti-Spyware","Anti-Payload"] },
  { cat: "NETWORK",   items: ["Anti-DDoS","Anti-Sniffer","Anti-MITM","Anti-ARP","Anti-DNS-Poison","Anti-SSRF","Anti-Replay","Anti-Flood"] },
  { cat: "WEB",       items: ["Anti-XSS","Anti-SQLi","Anti-CSRF","Anti-XXE","Anti-ClickJack","Anti-IDOR","Anti-SSTI","Anti-RFI"] },
  { cat: "AUTH",      items: ["Anti-BruteForce","Anti-Stuffing","Anti-PassSpray","Anti-TokenForge","Anti-SessionHijack","Anti-OAuthAbuse"] },
  { cat: "MEMORY",    items: ["Anti-Overflow","Anti-HeapSpray","Anti-ROP","Anti-UAF","Anti-DoubleFreeze","Anti-NullDeref"] },
  { cat: "OS/KERNEL", items: ["Anti-Rootkit","Anti-Bootkit","Anti-Keylogger","Anti-PrivEsc","Anti-DKOM","Anti-PatchGuard"] },
  { cat: "VM/CLOUD",  items: ["Anti-VMEscape","Anti-ContainerBreak","Anti-HypervisorProbe","Anti-SideChannel","Anti-Spectre","Anti-Meltdown"] },
  { cat: "AI/SOCIAL", items: ["Anti-PromptInject","Anti-ModelPoison","Anti-Jailbreak","Anti-DeepFake","Anti-SocialEng","Anti-Phishing"] },
  { cat: "HARDWARE",  items: ["Anti-BadUSB","Anti-JTAG","Anti-SWD","Anti-FaultInject","Anti-PowerAnalysis","Anti-TimingAttack"] },
  { cat: "CRYPTO",    items: ["Anti-QuantumBrute","Anti-WeakPRNG","Anti-OraclePad","Anti-HashCollide","Anti-KeyRecover","Anti-SigFault"] },
];

type Status = "ACTIVE" | "ARMED" | "IDLE";

export function AntiMatrix() {
  const [tick, setTick] = useState(1);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 900);
    return () => clearInterval(id);
  }, []);

  // Status for each item derived deterministically from Zeta zeros
  function itemStatus(catIdx: number, itemIdx: number): Status {
    const g = ZETA_ZEROS[(catIdx * 8 + itemIdx) % ZETA_ZEROS.length];
    // Modulate with tick to make it evolve
    const v = Math.floor(g * tick * 0.1) % 20;
    return v < 16 ? "ACTIVE" : v < 19 ? "ARMED" : "IDLE";
  }

  const allItems = ANTI_CATEGORIES.reduce((a, c) => a + c.items.length, 0);
  let activeCount = 0, armedCount = 0;
  ANTI_CATEGORIES.forEach((cat, ci) => {
    cat.items.forEach((_, ii) => {
      const s = itemStatus(ci, ii);
      if (s === "ACTIVE") activeCount++;
      if (s === "ARMED") armedCount++;
    });
  });

  const DOT: Record<Status, string> = { ACTIVE: "bg-green-400", ARMED: "bg-amber-400", IDLE: "bg-gray-800" };
  const COL: Record<Status, string> = { ACTIVE: "text-green-400", ARMED: "text-amber-400", IDLE: "text-gray-700" };

  return (
    <div className="flex flex-col gap-2 h-full text-[8px] font-mono">
      <div className="flex gap-2">
        <div className="border border-green-800/40 rounded p-1.5 text-center">
          <div className="text-green-400 font-bold">{activeCount}/{allItems}</div>
          <div className="text-gray-600 text-[7px]">ACTIVE</div>
        </div>
        <div className="border border-amber-800/40 rounded p-1.5 text-center">
          <div className="text-amber-400 font-bold">{armedCount}</div>
          <div className="text-gray-600 text-[7px]">ARMED</div>
        </div>
        <div className="flex-1 border border-cyan-900/30 rounded px-2 py-1 text-[7px] text-gray-500">
          ANTI-EVERYTHING MATRIX — {ANTI_CATEGORIES.length} CATEGORIES · {allItems} SYSTEMS · ALL ZETA-GUARDED
        </div>
      </div>

      <div className="overflow-y-auto flex-1" style={{ maxHeight: 360 }}>
        {ANTI_CATEGORIES.map((cat, ci) => (
          <div key={cat.cat} className="mb-2">
            <div className="text-[8px] text-cyan-600 font-bold mb-0.5 border-b border-cyan-900/20 pb-0.5">{cat.cat}</div>
            <div className="grid grid-cols-2 gap-0.5">
              {cat.items.map((item, ii) => {
                const s = itemStatus(ci, ii);
                return (
                  <div key={item} className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT[s]} ${s === "ACTIVE" ? "animate-pulse" : ""}`} />
                    <span className={`${COL[s]} text-[7px]`}>{item}</span>
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
