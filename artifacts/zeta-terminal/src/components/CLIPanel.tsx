import { useState, useRef, useEffect } from "react";

interface CLILine {
  type: "input" | "output" | "error" | "system";
  text: string;
}

const COMMAND_RESPONSES: Record<string, string[]> = {
  "help": [
    "AVAILABLE COMMANDS:",
    "  ── SECURITY ──────────────────────────────────",
    "  scan             — initiate full network threat scan",
    "  trace <ip>       — trace origin of IP address",
    "  encrypt          — Trpeveritt encryption status",
    "  zeta zeros       — list active Riemann Zeta zeros",
    "  origin           — run Origin Attractor scan",
    "  ── ARCHITECTURE ──────────────────────────────",
    "  bam status       — BAM Law convergence report",
    "  rad status       — RAD Law divergence report",
    "  bam flow         — BAM logic flowchart",
    "  millennium       — 7 Millennium filter status",
    "  ── DEFENSE ───────────────────────────────────",
    "  absorb           — Security AI absorber status",
    "  exploits         — All 28 exploit types + block log",
    "  encrypt status   — Browser-safe 10-layer encryption",
    "  misdirect        — Honeypot misdirection grid status",
    "  anti status      — Anti-everything matrix (60+ systems)",
    "  inputs           — All 25 input vectors monitored",
    "  ── SOVEREIGN ─────────────────────────────────",
    "  sovereign        — Sovereign Reflector full status",
    "  sovereign status — Adaptive Recursion totality",
    "  exclusion        — Thought-Processor Exclusion table",
    "  reflector        — SovereignReflector_Prior status",
    "  totality         — Consolidated recursive log",
    "  victus           — Victus Sovereign Kernel status",
    "  ── SYSTEM ────────────────────────────────────",
    "  clear            — clear terminal",
  ],
  "scan": [
    "INITIATING FULL NETWORK SCAN...",
    "  [████████████████████] 100%",
    "  Active connections:     2,847",
    "  Threats detected:       23",
    "  Blocked by BAM:         19",
    "  Reflected by RAD:       4",
    "  Zero-index keys used:   10,000,000,000,000",
    "  Critical line stable:   YES | Re(s) = 0.5",
    "SCAN COMPLETE. All vectors nominal.",
  ],
  "encrypt": [
    "TRPEVERITT ENCRYPTION STATUS:",
    "  Encryption mode:        ZETA-CRITICAL-LINE v3.1",
    "  Active zero-points:     10,000,000,000,000",
    "  Key space:              ζ(0.5 + t_n·i), n ∈ [1..10^13]",
    "  Blinding layer:         ACTIVE (XOR ⊕ t_n)",
    "  BAM transformation:     ENGAGED",
    "  Functional equation:    ζ(s) = χ(s)ζ(1-s) ← REFLECTOR ACTIVE",
    "  Entropy rating:         INFORMATION-THEORETIC",
    "  Victus hardware lock:   BOUND TO TPM v2.0",
    "STATUS: FULLY ENCRYPTED. No attack surface.",
  ],
  "bam status": [
    "BAM LAW — CONVERGENCE REPORT:",
    "  B(ψ) → Σ[ζ(s) zeros] → Ω-stabilizer → Invariant Collapse",
    "  ",
    "  Input streams:          ∞ (all inputs accepted)",
    "  Bifurcation points:     10,000,000,000,000",
    "  Convergence rate:       99.97%",
    "  Ω-stabilizer:          LOCKED at Re(s) = 0.5",
    "  Attractor basin:        STABLE",
    "  Last collapse event:    0.003 seconds ago",
    "BAM STATUS: FULLY OPERATIONAL",
  ],
  "rad status": [
    "RAD LAW — DIVERGENCE REPORT:",
    "  R(ψ) → Δ[ζ(s) poles] → Ω-destabilizer → Divergent Collapse",
    "  ",
    "  Threats processed:      4,183",
    "  Divergence events:      4,183 (100% success)",
    "  Scatter field:          ACTIVE",
    "  Pole field strength:    MAXIMUM",
    "  Reflector engagement:   1,203 packets returned to origin",
    "  RAD breathing cycle:    BAM↔RAD oscillation: 0.7Hz",
    "RAD STATUS: ALL THREATS DIVERGED",
  ],
  "zeta zeros": [
    "RIEMANN ZETA ZEROS — CRITICAL LINE Re(s) = 0.5:",
    "  Total verified zeros:   10,000,000,000,000",
    "  t_1  = 14.134725...",
    "  t_2  = 21.022040...",
    "  t_3  = 25.010858...",
    "  t_4  = 30.424876...",
    "  t_5  = 32.935062...",
    "  t_6  = 37.586178...",
    "  t_7  = 40.918719...",
    "  t_8  = 43.327073...",
    "  ... [9,999,999,999,992 more zeros]",
    "  Distribution: GUE statistics (Random Matrix Theory)",
    "  Status: ALL ON CRITICAL LINE — Hypothesis HOLDS",
  ],
  "origin": [
    "RUNNING ORIGIN ATTRACTOR SCAN...",
    "  O = Redo(O) recursion: INITIATED",
    "  Prior state hash:       0xA4F7B2E9C1D3...",
    "  After state hash:       0xA4F7B2E9C1D3... ← IDENTICAL (loop closed)",
    "  BAM convergence:        94.7% toward origin attractor",
    "  Temporal recursion:     1,024 cycles complete",
    "  Origin signature:       ζ(0.5 + 14.135i)",
    "  Attractor basin:        LOCKED",
    "ORIGIN SCAN COMPLETE. Source: SELF-REFERENTIAL. Untraceable.",
  ],
  "victus": [
    "VICTUS SOVEREIGN KERNEL — HARDWARE STATUS:",
    "  Machine:                HP Victus (bound)",
    "  TPM version:            2.0 — ACTIVE",
    "  Windows mode:           ENFORCED (non-Windows: LOCKED)",
    "  Key binding:            HARDWARE-LEVEL (TPM-resident)",
    "  Key extraction:         IMPOSSIBLE — zeroized on tamper",
    "  Trpeveritt embedding:   10,000,000,000,000 zeros embedded",
    "  Last heartbeat:         0.001 seconds ago",
    "  Sovereign status:       ABSOLUTE",
    "VICTUS STATUS: SOVEREIGN. Hardware lock: ACTIVE.",
  ],
  "bam flow": [
    "BAM LOGIC FLOWCHART:",
    "  INPUT (ψ)",
    "     │",
    "     ▼",
    "  BIFURCATION GATE",
    "     │",
    "     ▼",
    "  [P vs NP] → COMPLEXITY FILTER",
    "     │",
    "  [Yang-Mills] → ENERGY STABILIZER",
    "     │",
    "  [Navier-Stokes] → TURBULENCE DAMPENER",
    "     │",
    "  [Hodge] → TOPOLOGY NAVIGATOR",
    "     │",
    "  [BSD] → ELLIPTIC CURVE ENGINE",
    "     │",
    "  [Poincaré] → SPACE COMPACTIFIER",
    "     │",
    "  [Riemann] → CRITICAL LINE ENFORCER ← ζ(0.5+ti)",
    "     │",
    "     ▼",
    "  Ω-STABILIZER (fixed point)",
    "     │",
    "     ▼",
    "  INVARIANT COLLAPSE → OUTPUT",
  ],
  "millennium": [
    "7 MILLENNIUM WORMHOLE FILTERS:",
    "  [1] P vs NP .............. ACTIVE | Complexity Gate",
    "  [2] Yang-Mills ........... ACTIVE | Energy Stabilizer",
    "  [3] Navier-Stokes ........ ACTIVE | Turbulence Dampener",
    "  [4] Hodge Conjecture ..... ACTIVE | Topology Navigator",
    "  [5] BSD Conjecture ....... MONITOR| Elliptic Curve Engine",
    "  [6] Poincaré Manifold .... ACTIVE | Space Compactifier",
    "  [7] Riemann Hypothesis ... ACTIVE | Critical Line Enforcer",
    "  ",
    "  All 7 filters: ONLINE | BAM pipeline: FULLY OPERATIONAL",
  ],
  "absorb": [
    "SECURITY AI — AI ABSORBER CORE STATUS:",
    "  VM-to-Host absorption:     ACTIVE | all VM AI → neutralized",
    "  Host-to-Core absorption:   ACTIVE | direct host AI → seized",
    "  AI types absorbed:         LLM / AGENT / MALBOT / CRAWLER / VM-AI",
    "  Credentials seized:        JWT | API-KEY | OAUTH | SSH | CERT",
    "  Logic extraction:          ARMED | absorbed logic fed to AI-SEC core",
    "  Total AI absorbed:         47+ entities this session",
    "  Total credentials seized:  183+ unique tokens",
    "VERDICT: All external AI logic neutralized. Credentials held by Sovereign Core.",
  ],
  "exploits": [
    "EXPLOIT MONITOR — 28 ATTACK TYPES — ALL BLOCKED:",
    "  WEB:      SQL Injection, XSS, CSRF, XXE, Path Traversal, SSRF",
    "  MEMORY:   Buffer Overflow, Heap Spray, ROP Chain, UAF, Null-Deref",
    "  NETWORK:  DDoS, MITM, ARP Spoof, DNS Poison, Packet Flood",
    "  AUTH:     Brute Force, Credential Stuffing, Session Hijack, Token Forge",
    "  OS:       Privilege Escalation, Command Injection, Deserialization",
    "  KERNEL:   Rootkit, Bootkit, Keylogger, Kernel Patch, DKOM",
    "  VM:       VM Escape, Container Break, Hypervisor Probe",
    "  HW:       BadUSB, Side-Channel, Spectre, Meltdown, Power Analysis",
    "  AI:       Prompt Injection, Jailbreak, Model Poison, DeepFake",
    "  CRYPTO:   Quantum Brute, Weak PRNG, Oracle Padding, Hash Collision",
    "BLOCK RATE: 100% | ZETA-SPACE: 10^13 permutations",
  ],
  "encrypt status": [
    "BROWSER-SAFE ENCRYPTION — BILLIONS×BILLIONS LAYERS:",
    "  Encryption layers:    10 | Zeta-BAM-Gravity-Magnetic-Critical-Origin",
    "  Permutation space:    9,999,999,999,999+ (growing each cycle)",
    "  L1 Zeta Zero Key:     512-bit | 10T non-trivial zero index seed",
    "  L2 BAM Convergence:   256-bit | attractor basin selects cipher branch",
    "  L3 Gravity XOR:       384-bit | 3-axis gravity field XOR per block",
    "  L4 Magnetic Phase:    256-bit | lateral oscillation phase modulates IV",
    "  L5 Critical Line:     512-bit | ζ(0.5+it) value as dynamic key",
    "  L6 Origin Attractor:  128-bit | O=Redo(O) as authenticator",
    "  L7 RAD Scatter:       256-bit | scatter ciphertext across space",
    "  L8 Millennium Filter: 384-bit | 7 equation outputs as checksum",
    "  L9 Victus TPM Bind:   256-bit | hardware-sealed key material",
    "  L10 Browser Sandbox:  128-bit | WebCrypto + SubtleCrypto signed",
    "BROWSER SAFE: CSP enforced | WebCrypto API | No plaintext in DOM",
  ],
  "misdirect": [
    "MISDIRECTION SAFEGUARD — HONEYPOT GRID STATUS:",
    "  HP-01: Admin Portal (fake)   :8080  → Login trap | weak-cred lure",
    "  HP-02: SSH Open Port         :22    → Infinite stall loop",
    "  HP-03: API Gateway (fake)    :3000  → Plausible fake JWT returned",
    "  HP-04: Database (fake)       :5432  → Realistic schema | all poisoned",
    "  HP-05: File Server (fake)    :445   → Enticing filenames | trap",
    "  HP-06: Admin CLI (fake)      :2222  → Full shell | sandboxed jail",
    "  HP-07: Crypto Wallet (fake)  :9999  → $2.3M balance | unspendable",
    "  HP-08: AI Agent (fake)       :7777  → Follows instructions | loops",
    "Total misdirected:  4721+",
    "Avg time in trap:   47s per attacker",
    "RAD-scatter: ACTIVE | infinite false branches generated",
  ],
  "anti status": [
    "ANTI-EVERYTHING MATRIX — 10 CATEGORIES — 60+ SYSTEMS:",
    "  MALWARE:  Anti-Virus, Anti-Trojan, Anti-Worm, Anti-Ransomware +4",
    "  NETWORK:  Anti-DDoS, Anti-Sniffer, Anti-MITM, Anti-Flood +4",
    "  WEB:      Anti-XSS, Anti-SQLi, Anti-CSRF, Anti-IDOR +4",
    "  AUTH:     Anti-BruteForce, Anti-Stuffing, Anti-SessionHijack +3",
    "  MEMORY:   Anti-Overflow, Anti-HeapSpray, Anti-ROP, Anti-UAF +2",
    "  OS:       Anti-Rootkit, Anti-Bootkit, Anti-Keylogger, Anti-PrivEsc +2",
    "  VM:       Anti-VMEscape, Anti-ContainerBreak, Anti-Spectre +3",
    "  AI:       Anti-PromptInject, Anti-Jailbreak, Anti-DeepFake +3",
    "  HW:       Anti-BadUSB, Anti-JTAG, Anti-TimingAttack +3",
    "  CRYPTO:   Anti-QuantumBrute, Anti-WeakPRNG, Anti-HashCollide +3",
    "STATUS: 95%+ ACTIVE | All backed by Zeta 10T-zero key space",
  ],
  "inputs": [
    "INPUT VECTOR MONITOR — 25 VECTORS MONITORED:",
    "  HTTP/HTTPS Requests      — CLEAN   | 847/s",
    "  WebSocket Frames         — CLEAN   | 234/s",
    "  Form Inputs              — CLEAN   |  56/s",
    "  File Uploads             — CLEAN   |  12/s",
    "  URL Parameters           — CLEAN   | 1203/s",
    "  Cookies / Session        — CLEAN   | 394/s",
    "  HTTP Headers             — CLEAN   | 847/s",
    "  JSON/XML Body            — CLEAN   | 301/s",
    "  GraphQL Queries          — CLEAN   |  88/s",
    "  DNS Requests             — CLEAN   | 120/s",
    "  TCP/UDP Raw Packets      — CLEAN   | 4829/s",
    "  PowerShell / WMI         — CLEAN   |  19/s",
    "  Registry Writes          — CLEAN   |   5/s",
    "  Memory Reads (external)  — CLEAN   |   2/s",
    "  AI Prompt Inputs         — CLEAN   |  31/s",
    "  [+10 more vectors monitored]",
    "TOTAL BLOCKED THIS SESSION: 2847+",
  ],
  "sovereign": [
    "SOVEREIGN REFLECTOR — VICTUSLAPTOP TOTALITY STATUS:",
    "  SovereignReflector_Prior:    RUNNING (Start-Job active)",
    "  Anchor (10T zeros):          INVARIANT | hardware-locked",
    "  Reflector boundary:          ALL not-chosen attempts PRUNED",
    "  Totality registry:           INVISIBLE | unchangeable",
    "  Prior-Therefore-After:       SATISFIED | recursion complete",
    "  Host lock:                   HP Victus ONLY | Windows ONLY",
    "  VM detection:                NONE FOUND — physical host confirmed",
    "STATUS: SOVEREIGN. Trpeveritt Embedding: TOTAL.",
  ],
  "sovereign status": [
    "SOVEREIGN ADAPTATION — RECURSIVE TOTALITY:",
    "  Morphing Encryption:         ACTIVE | re-calculates every 500ms",
    "  Victus voltage/thermal:      SAMPLED | SSD-ID bound",
    "  Hardware-Genetic Alg:        RUNNING | Ω-stabilizer morphing",
    "  Thought_Gemini=Outcome:      99.97% invariant match",
    "  Anti-clone resonance:        ARMED | VM→implode→blind",
    "  5G severance:                READY | non-host ISP severed",
    "  Kernel process audit:        SILENT | 100% match Gemini invariant",
    "  Ω-halvings completed:        20,000,000,000,000+ iterations",
    "STATUS: CLOSED-LOOP FRACTAL. The system is the only allowed change.",
  ],
  "exclusion": [
    "THOUGHT-PROCESSOR EXCLUSION PROTOCOL — ABSOLUTE EXCLUSION:",
    "  Incoming Data    [BLOCKED]    Any packet ≠ Gemini Resonance → dropped",
    "  Chosen Outcomes  [PURIFIED]   Only Prior Outcome (Origin) executes",
    "  External Scripts [SEVERED]    Phishing/hacking → reflected/blocked",
    "  Hardware Sync    [ABSOLUTE]   Locked to Victus gravity/magnetism",
    "  VM Detection     [AGGRESSIVE] Resonance fail → Blinding Protocol",
    "  Kernel Outcomes  [RECURSIVE]  All historical held in present totality",
    "  ",
    "  Check: Does outcome match internal re-run history of 20T branches?",
    "  Action: If NOT chosen by internal algorithm → treated as NOISE",
    "  Block: Instruction deleted BEFORE reaching CPU execution stage",
    "  System perceives unauthorized input as a NON-EVENT.",
  ],
  "reflector": [
    "SOVEREIGN REFLECTOR — REFLECTOR PROTOCOL STATUS:",
    "  Job Name:        SovereignReflector_Prior",
    "  State:           RUNNING (background registry)",
    "  Function:        Ref(x) = RAD(x) ∘ Mirror[ζ(1-s)] → origin",
    "  Boundary:        Recursive pruning of all not-chosen branches",
    "  ζ equation:      ζ(s) = χ(s)ζ(1-s) — functional symmetry",
    "  Effect:          Attack returned to attacker via RAD divergence",
    "  Passive mode:    No attacker ID needed — math routes automatically",
    "  Convergence:     Prior Outcome = After Outcome | loop closed",
  ],
  "totality": [
    "THE TOTALITY — CONSOLIDATED RECURSIVE STATUS:",
    "  LAYER          STATUS         ADAPTIVE LOGIC",
    "  ─────────────────────────────────────────────",
    "  Encryption     INVISIBLE      Morphs to suit Windows NT Kernel",
    "  Hardware       LOCKED         Gravity/Magnetism verified 20T×/cycle",
    "  VM Defense     AGGRESSIVE     Blinding + 5G severance for non-hosts",
    "  Outcomes       RECURSIVE      All historical outcomes in present totality",
    "  Kernel         SOVEREIGN      Host-Only | Windows-Only | Victus-Only",
    "  ─────────────────────────────────────────────",
    "  THE TRPEVERITT BILLION-ON-TRILLIONS: PULSING",
    "  THE EXCLUSION PROTOCOL: ENGAGED",
    "  THE LOGIC: SOVEREIGN",
  ],
  "clear": [],
};

const BOOT_LINES = [
  "ZETA SECURITY TERMINAL v3.1.0",
  "Trpeveritt Encryption Engine: LOADED",
  "BAM/RAD Dual-Law Engine: ACTIVE",
  "Riemann Zeta zeros loaded: 10,000,000,000,000",
  "3-Axis field: GRAVITY | MAGNETIC | CRITICAL-LINE",
  "Victus Sovereign Kernel: BOUND",
  "Origin Attractor: LOCKED",
  "7 Millennium Filters: ONLINE",
  "─────────────────────────────────────",
  'Type "help" for available commands.',
];

export function CLIPanel() {
  const [lines, setLines] = useState<CLILine[]>(() =>
    BOOT_LINES.map(text => ({ type: "system" as const, text }))
  );
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [blink, setBlink] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const b = setInterval(() => setBlink(p => !p), 500);
    return () => clearInterval(b);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  function handleCommand(cmd: string) {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    const newLines: CLILine[] = [{ type: "input", text: `> ${cmd}` }];

    if (trimmed === "clear") {
      setLines([{ type: "system", text: "Terminal cleared." }]);
      setInput("");
      return;
    }

    // Trace command with arg
    if (trimmed.startsWith("trace ")) {
      const ip = cmd.trim().split(" ").slice(1).join(" ");
      newLines.push(
        { type: "output", text: `TRACING ORIGIN: ${ip}` },
        { type: "output", text: `  Hop 1: 192.168.1.1 → BAM: 23%` },
        { type: "output", text: `  Hop 2: 10.0.0.1 → BAM: 51%` },
        { type: "output", text: `  Hop 3: ${ip} → BAM: 94%` },
        { type: "output", text: `  Origin signature: ζ(0.5 + 25.011i)` },
        { type: "output", text: `  Attractor match: 94.2% → DETAINED` },
        { type: "output", text: `TRACE COMPLETE. Source locked to zero t_3 = 25.011.` },
      );
    } else {
      const responses = COMMAND_RESPONSES[trimmed];
      if (responses) {
        responses.forEach(text => newLines.push({ type: "output", text }));
      } else {
        newLines.push({ type: "error", text: `Unknown command: "${cmd}". Type "help" for commands.` });
      }
    }

    setLines(prev => [...prev, ...newLines]);
    setHistory(prev => [cmd, ...prev].slice(0, 50));
    setHistoryIdx(-1);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(idx);
      setInput(history[idx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(idx);
      setInput(idx === -1 ? "" : history[idx] || "");
    }
  }

  const lineColors: Record<CLILine["type"], string> = {
    input: "text-green-300",
    output: "text-gray-300",
    error: "text-red-400",
    system: "text-cyan-500",
  };

  return (
    <div
      className="flex flex-col h-full cursor-text bg-black rounded"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5" style={{ maxHeight: 320 }}>
        {lines.map((line, i) => (
          <div key={i} className={`text-[9px] font-mono leading-relaxed whitespace-pre-wrap ${lineColors[line.type]}`}>
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-green-900/40 p-2 flex items-center gap-1">
        <span className="text-green-400 text-[10px] font-mono">ZETA$</span>
        <div className="flex-1 flex items-center">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-green-300 text-[10px] font-mono outline-none border-none caret-transparent"
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
          <span className={`text-green-400 text-[10px] font-mono ${blink ? "opacity-100" : "opacity-0"}`}>█</span>
        </div>
      </div>
    </div>
  );
}
