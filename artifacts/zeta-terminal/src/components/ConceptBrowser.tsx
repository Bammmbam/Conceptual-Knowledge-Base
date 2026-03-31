import { useState } from "react";
import { CONCEPTS, MILLENNIUM_FILTERS, type Concept, type ConceptCategory } from "@/data/concepts";

const CATEGORY_LABELS: Record<ConceptCategory, string> = {
  laws: "CORE LAWS",
  axes: "PHYSICAL AXES",
  filters: "MILLENNIUM FILTERS",
  protocols: "PROTOCOLS",
  architecture: "ARCHITECTURE"
};

const CATEGORY_COLORS: Record<ConceptCategory, string> = {
  laws: "text-green-400 border-green-800/40",
  axes: "text-cyan-400 border-cyan-800/40",
  filters: "text-amber-400 border-amber-800/40",
  protocols: "text-purple-400 border-purple-800/40",
  architecture: "text-blue-400 border-blue-800/40"
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "text-green-400",
  LOCKED: "text-red-400",
  MONITORING: "text-yellow-400",
  STABLE: "text-cyan-400"
};

export function ConceptBrowser() {
  const [selected, setSelected] = useState<Concept | null>(null);
  const [filter, setFilter] = useState<ConceptCategory | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = CONCEPTS.filter(c => {
    const matchCat = filter === "all" || c.category === filter;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.shortDesc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const categories: Array<ConceptCategory | "all"> = ["all", "laws", "axes", "protocols", "architecture"];

  return (
    <div className="flex h-full gap-2">
      {/* Sidebar */}
      <div className="w-44 flex flex-col gap-1 shrink-0">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="search..."
          className="w-full bg-gray-900/50 border border-green-900/40 rounded px-2 py-1 text-[9px] font-mono text-green-300 outline-none placeholder-gray-600"
        />
        <div className="space-y-0.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`w-full text-left px-2 py-1 rounded text-[9px] font-mono transition-colors ${
                filter === cat
                  ? "bg-green-900/30 text-green-300 border border-green-800/40"
                  : "text-gray-500 hover:text-gray-300 hover:bg-gray-900/30"
              }`}
            >
              {cat === "all" ? "ALL MODULES" : CATEGORY_LABELS[cat as ConceptCategory]}
            </button>
          ))}
        </div>

        <div className="mt-2 border-t border-green-900/30 pt-2">
          <div className="text-[8px] text-gray-600 font-mono mb-1">MILLENNIUM FILTERS</div>
          {MILLENNIUM_FILTERS.map(mf => (
            <div key={mf.id} className="flex items-center gap-1 py-0.5">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${mf.status === "ACTIVE" ? "bg-green-500" : "bg-yellow-500"}`} />
              <span className="text-[7px] font-mono text-gray-400 truncate">{mf.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        {selected ? (
          <div className="flex flex-col gap-2 h-full overflow-y-auto">
            <button
              onClick={() => setSelected(null)}
              className="text-[9px] font-mono text-gray-500 hover:text-gray-300 text-left"
            >
              ← BACK TO LIST
            </button>
            <div className={`border rounded p-3 ${CATEGORY_COLORS[selected.category]}`}>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <div className="text-sm font-bold">{selected.name}</div>
                  <div className="text-[8px] text-gray-500">{CATEGORY_LABELS[selected.category]}</div>
                </div>
                <span className={`text-[9px] font-mono ${STATUS_COLORS[selected.status]}`}>
                  [{selected.status}]
                </span>
              </div>

              {selected.formula && (
                <div className="border border-current/20 bg-black/40 rounded p-2 my-2">
                  <div className="text-[8px] text-gray-500 mb-0.5">FORMULA</div>
                  <div className="text-[9px] font-mono leading-relaxed">{selected.formula}</div>
                </div>
              )}

              <div className="text-[8px] text-gray-400 leading-relaxed mt-2">
                {selected.fullDesc}
              </div>

              {selected.connections.length > 0 && (
                <div className="mt-2">
                  <div className="text-[8px] text-gray-500 mb-1">CONNECTED TO:</div>
                  <div className="flex flex-wrap gap-1">
                    {selected.connections.map(cid => {
                      const c = CONCEPTS.find(x => x.id === cid);
                      return c ? (
                        <button
                          key={cid}
                          onClick={() => setSelected(c)}
                          className="text-[7px] font-mono border border-current/30 rounded px-1.5 py-0.5 hover:bg-current/10 transition-colors"
                        >
                          {c.name}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1 overflow-y-auto" style={{ maxHeight: "100%" }}>
            {filtered.map(concept => (
              <button
                key={concept.id}
                onClick={() => setSelected(concept)}
                className={`border rounded p-2 text-left hover:bg-gray-900/30 transition-colors ${CATEGORY_COLORS[concept.category]}`}
              >
                <div className="flex items-start justify-between mb-0.5">
                  <span className="text-[9px] font-bold leading-tight">{concept.name}</span>
                  <span className={`text-[7px] font-mono shrink-0 ml-1 ${STATUS_COLORS[concept.status]}`}>
                    {concept.status}
                  </span>
                </div>
                <div className="text-[7px] text-gray-500 leading-relaxed">{concept.shortDesc}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
