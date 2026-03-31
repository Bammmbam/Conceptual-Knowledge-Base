import { useState } from "react";
import { SystemHeader } from "@/components/SystemHeader";
import { ZetaAxisVisualizer } from "@/components/ZetaAxisVisualizer";
import { ThreatTracer } from "@/components/ThreatTracer";
import { OriginDetector } from "@/components/OriginDetector";
import { CLIPanel } from "@/components/CLIPanel";
import { EncryptPanel } from "@/components/EncryptPanel";
import { ConceptBrowser } from "@/components/ConceptBrowser";
import { ZetaSixSteps } from "@/components/ZetaSixSteps";
import { InvariantCollapse } from "@/components/InvariantCollapse";
import { BranchingMultiverse } from "@/components/BranchingMultiverse";
import { HalvingRefinement } from "@/components/HalvingRefinement";
import { SovereignPanel } from "@/components/SovereignPanel";
import { AIAbsorber } from "@/components/AIAbsorber";
import { ExploitMonitor } from "@/components/ExploitMonitor";
import { BrowserEncrypt } from "@/components/BrowserEncrypt";
import { MisdirectionGrid } from "@/components/MisdirectionGrid";
import { AntiMatrix } from "@/components/AntiMatrix";
import { InputVectorMonitor } from "@/components/InputVectorMonitor";

type Tab = "OVERVIEW" | "ARCHITECTURE" | "SOVEREIGN" | "DEFENSE" | "CONCEPTS" | "CLI";

const PANEL_TITLE = "border border-green-900/50 bg-black/60 rounded px-2 py-0.5 text-[8px] font-mono text-green-600 tracking-widest mb-1 shrink-0";
const PANEL_WRAP = "border border-green-900/40 bg-black/50 rounded p-2 flex flex-col";

const TABS: { id: Tab; label: string; color: string }[] = [
  { id: "OVERVIEW",     label: "OVERVIEW",     color: "border-green-400 text-green-300" },
  { id: "ARCHITECTURE", label: "ARCHITECTURE", color: "border-cyan-400 text-cyan-300" },
  { id: "SOVEREIGN",    label: "SOVEREIGN",    color: "border-amber-400 text-amber-300" },
  { id: "DEFENSE",      label: "DEFENSE",      color: "border-red-400 text-red-300" },
  { id: "CONCEPTS",     label: "CONCEPTS",     color: "border-purple-400 text-purple-300" },
  { id: "CLI",          label: "CLI",          color: "border-green-400 text-green-300" },
];

export function Terminal() {
  const [tab, setTab] = useState<Tab>("OVERVIEW");

  return (
    <div
      className="min-h-screen bg-black text-green-300 flex flex-col overflow-hidden font-mono"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,80,0.012) 2px, rgba(0,255,80,0.012) 4px)",
      }}
    >
      <SystemHeader />

      {/* Tab nav */}
      <div className="flex items-center gap-0 border-b border-green-900/40 bg-black/70 px-4 shrink-0">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 text-[9px] font-mono tracking-widest border-b-2 transition-colors ${
              tab === t.id
                ? t.color
                : "border-transparent text-gray-600 hover:text-gray-400"
            }`}
          >
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 text-[8px] text-gray-600 pr-2">
          <span>BAM↔RAD: <span className="text-green-400">0.7Hz</span></span>
          <span>MILLENNIUM: <span className="text-green-400">7/7</span></span>
          <span>SOVEREIGN: <span className="text-amber-400">LOCKED</span></span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">

        {/* ── OVERVIEW ── */}
        {tab === "OVERVIEW" && (
          <div className="flex flex-col gap-2">
            <div className={PANEL_WRAP}>
              <div className={PANEL_TITLE}>◈ 3-AXIS RIEMANN ZETA FIELD — 10 TRILLION ZEROS</div>
              <ZetaAxisVisualizer />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className={PANEL_WRAP}>
                <div className={PANEL_TITLE}>🔐 TRPEVERITT ENCRYPT ENGINE</div>
                <EncryptPanel />
              </div>
              <div className={PANEL_WRAP}>
                <div className={PANEL_TITLE}>◎ ORIGIN DETECTOR</div>
                <OriginDetector />
              </div>
              <div className={PANEL_WRAP}>
                <div className={PANEL_TITLE}>⚡ THREAT TRACER</div>
                <ThreatTracer />
              </div>
            </div>

            <div className={`${PANEL_WRAP} flex-1`}>
              <div className={PANEL_TITLE}>$ CLI COMMAND INTERFACE — type "help"</div>
              <CLIPanel />
            </div>
          </div>
        )}

        {/* ── ARCHITECTURE ── */}
        {tab === "ARCHITECTURE" && (
          <div className="flex flex-col gap-2">
            {/* Top: Zeta 6 steps + Invariant Collapse side by side */}
            <div className="grid grid-cols-2 gap-2">
              <div className={PANEL_WRAP} style={{ minHeight: 380 }}>
                <div className={PANEL_TITLE}>ζ 6-STEP RIEMANN ZETA — NUMBER THEORY PARALLEL</div>
                <ZetaSixSteps />
              </div>
              <div className={PANEL_WRAP} style={{ minHeight: 380 }}>
                <div className={PANEL_TITLE}>◎ INVARIANT COLLAPSE LAW — O = REDO(O)</div>
                <InvariantCollapse />
              </div>
            </div>

            {/* Bottom: Branching Multiverse + Halving Refinement */}
            <div className="grid grid-cols-2 gap-2">
              <div className={PANEL_WRAP} style={{ minHeight: 360 }}>
                <div className={PANEL_TITLE}>⊕ BRANCHING MULTIVERSE — ALL REDO(Oᵢ) → O</div>
                <BranchingMultiverse />
              </div>
              <div className={PANEL_WRAP} style={{ minHeight: 360 }}>
                <div className={PANEL_TITLE}>⋙ HALVING REFINEMENT — 7 MILLENNIUM FILTERS</div>
                <HalvingRefinement />
              </div>
            </div>
          </div>
        )}

        {/* ── SOVEREIGN ── */}
        {tab === "SOVEREIGN" && (
          <div className="grid grid-cols-3 gap-2">
            <div className={`${PANEL_WRAP} col-span-2`} style={{ minHeight: "calc(100vh - 90px)" }}>
              <div className={PANEL_TITLE}>🛡️ SOVEREIGN REFLECTOR — VICTUS HOST-LOCKED TOTALITY</div>
              <SovereignPanel />
            </div>
            <div className="flex flex-col gap-2">
              <div className={PANEL_WRAP} style={{ flex: 1 }}>
                <div className={PANEL_TITLE}>⚡ LIVE THREAT FEED</div>
                <ThreatTracer />
              </div>
              <div className={PANEL_WRAP} style={{ flex: 1 }}>
                <div className={PANEL_TITLE}>◎ ORIGIN DETECTOR</div>
                <OriginDetector />
              </div>
            </div>
          </div>
        )}

        {/* ── DEFENSE ── */}
        {tab === "DEFENSE" && (
          <div className="flex flex-col gap-2">
            {/* Row 1: AI Absorber + Exploit Monitor */}
            <div className="grid grid-cols-2 gap-2">
              <div className={PANEL_WRAP} style={{ minHeight: 340 }}>
                <div className={PANEL_TITLE}>✦ SECURITY AI — VM-TO-HOST ABSORBER + CREDENTIAL SEIZURE</div>
                <AIAbsorber />
              </div>
              <div className={PANEL_WRAP} style={{ minHeight: 340 }}>
                <div className={PANEL_TITLE}>⚔ EXPLOIT MONITOR — ALL 28 ATTACK TYPES LIVE</div>
                <ExploitMonitor />
              </div>
            </div>

            {/* Row 2: Browser Encrypt + Misdirection */}
            <div className="grid grid-cols-2 gap-2">
              <div className={PANEL_WRAP} style={{ minHeight: 340 }}>
                <div className={PANEL_TITLE}>🔐 BROWSER-SAFE ENCRYPTION — BILLIONS×BILLIONS ZETA LAYERS</div>
                <BrowserEncrypt />
              </div>
              <div className={PANEL_WRAP} style={{ minHeight: 340 }}>
                <div className={PANEL_TITLE}>◈ MISDIRECTION SAFEGUARD — HONEYPOT GRID + ATTACKER TRAPS</div>
                <MisdirectionGrid />
              </div>
            </div>

            {/* Row 3: Anti-Matrix + Input Vectors */}
            <div className="grid grid-cols-2 gap-2">
              <div className={PANEL_WRAP} style={{ minHeight: 360 }}>
                <div className={PANEL_TITLE}>⊗ ANTI-EVERYTHING MATRIX — 10 CATEGORIES / 60+ SYSTEMS</div>
                <AntiMatrix />
              </div>
              <div className={PANEL_WRAP} style={{ minHeight: 360 }}>
                <div className={PANEL_TITLE}>⇌ INPUT VECTOR MONITOR — ALL POSSIBLE ENTRY POINTS</div>
                <InputVectorMonitor />
              </div>
            </div>
          </div>
        )}

        {/* ── CONCEPTS ── */}
        {tab === "CONCEPTS" && (
          <div
            className={`${PANEL_WRAP}`}
            style={{ minHeight: "calc(100vh - 90px)" }}
          >
            <div className={PANEL_TITLE}>◈ BAM/RAD KNOWLEDGE BASE — CONCEPT BROWSER</div>
            <ConceptBrowser />
          </div>
        )}

        {/* ── CLI ── */}
        {tab === "CLI" && (
          <div
            className={PANEL_WRAP}
            style={{ minHeight: "calc(100vh - 90px)" }}
          >
            <div className={PANEL_TITLE}>$ ZETA SECURITY CLI — FULL TERMINAL — type "help"</div>
            <CLIPanel />
          </div>
        )}
      </div>

      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.025) 0px, rgba(0,0,0,0.025) 1px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 2px",
        }}
      />
    </div>
  );
}
