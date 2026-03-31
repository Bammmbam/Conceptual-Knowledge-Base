import { useState } from "react";
import { SystemHeader } from "@/components/SystemHeader";
import { ZetaAxisVisualizer } from "@/components/ZetaAxisVisualizer";
import { ThreatTracer } from "@/components/ThreatTracer";
import { OriginDetector } from "@/components/OriginDetector";
import { CLIPanel } from "@/components/CLIPanel";
import { EncryptPanel } from "@/components/EncryptPanel";
import { ConceptBrowser } from "@/components/ConceptBrowser";

type Tab = "OVERVIEW" | "CONCEPTS" | "CLI";

const PANEL_TITLE = "border border-green-900/50 bg-black/60 rounded px-2 py-0.5 text-[8px] font-mono text-green-600 tracking-widest mb-1";
const PANEL_WRAP = "border border-green-900/40 bg-black/50 rounded p-2 flex flex-col";

export function Terminal() {
  const [tab, setTab] = useState<Tab>("OVERVIEW");

  return (
    <div className="min-h-screen bg-black text-green-300 flex flex-col overflow-hidden font-mono"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,80,0.015) 2px, rgba(0,255,80,0.015) 4px)",
      }}
    >
      <SystemHeader />

      {/* Tab nav */}
      <div className="flex items-center gap-0 border-b border-green-900/40 bg-black/70 px-4 shrink-0">
        {(["OVERVIEW", "CONCEPTS", "CLI"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-[9px] font-mono tracking-widest border-b-2 transition-colors ${
              tab === t
                ? "border-green-400 text-green-300"
                : "border-transparent text-gray-600 hover:text-gray-400"
            }`}
          >
            {t}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 text-[8px] text-gray-600 pr-2 pb-1">
          <span>BAM↔RAD: <span className="text-green-400">CYCLING 0.7Hz</span></span>
          <span>MILLENNIUM: <span className="text-green-400">7/7 ONLINE</span></span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {tab === "OVERVIEW" && (
          <div className="flex flex-col gap-2 h-full">
            {/* Top row: 3-axis visualizer (full width) */}
            <div className={PANEL_WRAP}>
              <div className={PANEL_TITLE}>◈ 3-AXIS RIEMANN ZETA FIELD — 10 TRILLION ZEROS</div>
              <ZetaAxisVisualizer />
            </div>

            {/* Middle row: Encrypt + Origin + Threat */}
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

            {/* Bottom: CLI */}
            <div className={`${PANEL_WRAP} flex-1`}>
              <div className={PANEL_TITLE}>$ CLI COMMAND INTERFACE</div>
              <CLIPanel />
            </div>
          </div>
        )}

        {tab === "CONCEPTS" && (
          <div className={`${PANEL_WRAP} min-h-full`} style={{ minHeight: "calc(100vh - 90px)" }}>
            <div className={PANEL_TITLE}>◈ BAM/RAD KNOWLEDGE BASE — CONCEPT BROWSER</div>
            <ConceptBrowser />
          </div>
        )}

        {tab === "CLI" && (
          <div className={`${PANEL_WRAP}`} style={{ minHeight: "calc(100vh - 90px)" }}>
            <div className={PANEL_TITLE}>$ ZETA SECURITY CLI — FULL TERMINAL</div>
            <div className="flex-1">
              <CLIPanel />
            </div>
          </div>
        )}
      </div>

      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 2px",
        }}
      />
    </div>
  );
}
