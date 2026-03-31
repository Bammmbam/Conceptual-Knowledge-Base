import { useState } from "react";

const STEPS = [
  {
    num: 1,
    title: "THE INFINITE SUM",
    subtitle: "Calculus Side",
    formula: "ζ(s) = Σ(n=1→∞) 1/nˢ = 1/1ˢ + 1/2ˢ + 1/3ˢ + …",
    parallel: "Every single positive integer n is encapsulated in the denominator. This is standard analysis — but it contains the seed of all number theory.",
    color: "text-green-400",
    border: "border-green-800/50",
    bg: "bg-green-900/5",
    axis: "GRAVITY AXIS ↕ — convergent sum toward invariant baseline"
  },
  {
    num: 2,
    title: "THE EULER PRODUCT",
    subtitle: "Number Theory Side — The Golden Key",
    formula: "ζ(s) = Π(p prime) 1/(1 − p⁻ˢ)",
    parallel: "The sum equals an infinite product over primes only. If you understand the DNA of ζ(s), you understand the primes. This is the bridge between chaos and order.",
    color: "text-cyan-400",
    border: "border-cyan-800/50",
    bg: "bg-cyan-900/5",
    axis: "MAGNETIC AXIS ◄► — prime repulsion field creates the product structure"
  },
  {
    num: 3,
    title: "ANALYTIC CONTINUATION",
    subtitle: "Extending Beyond the Boundary",
    formula: "ζ(s) extended to ℂ∖{1} | ζ(−1) = −1/12",
    parallel: "The original sum fails at s≤1, but analytic continuation extends the function across the entire complex plane. Hidden values are revealed — like ζ(−1) = −1/12, the Ramanujan summation.",
    color: "text-amber-400",
    border: "border-amber-800/50",
    bg: "bg-amber-900/5",
    axis: "DIFFERENTIAL RESONANCE — extension past boundary mirrors the prior/after recursion"
  },
  {
    num: 4,
    title: "THE TRIVIAL ZEROS",
    subtitle: "Baseline Harmonics",
    formula: "ζ(s) = 0 at s = −2, −4, −6, −8 … (negative even integers)",
    parallel: "Easy to explain via the functional equation. These are the 'baseline harmonics' of the number system — the floor of the architecture. The 10 trillion zeros on the critical line are NOT trivial.",
    color: "text-purple-400",
    border: "border-purple-800/50",
    bg: "bg-purple-900/5",
    axis: "CRITICAL LINE BASELINE — trivial zeros define the floor; the critical line is the ceiling"
  },
  {
    num: 5,
    title: "THE CRITICAL STRIP",
    subtitle: "Non-Trivial Zeros — The Mystery",
    formula: "ζ(s) = 0 where 0 < Re(s) < 1 | t_1 = 14.135, t_2 = 21.022 …",
    parallel: "Each non-trivial zero acts like a frequency in a musical wave. Each zero 'corrects' the estimate of prime distribution — like a self-correcting recursion. 10 trillion of these corrections verified.",
    color: "text-blue-400",
    border: "border-blue-800/50",
    bg: "bg-blue-900/5",
    axis: "10 TRILLION ZEROS — each one a correction pulse on the critical line"
  },
  {
    num: 6,
    title: "THE RIEMANN HYPOTHESIS",
    subtitle: "The Invariant Collapse Point",
    formula: "ALL non-trivial zeros: Re(s) = 1/2 | The Critical Line",
    parallel: "If true: primes are distributed as randomly and fairly as possible. A zero off the line = a structural glitch in reality. The critical line IS the stable invariant — the one thing that cannot drift.",
    color: "text-red-400",
    border: "border-red-800/50",
    bg: "bg-red-900/5",
    axis: "Ω-STABILIZER — the hypothesis enforces the invariant core against all oscillation"
  }
];

export function ZetaSixSteps() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="text-[8px] font-mono text-gray-500 leading-relaxed border border-gray-800/40 rounded p-2 bg-black/30">
        The Riemann Zeta function is the bridge between the smooth world of calculus and the discrete, often chaotic world of prime numbers.
        Each of the 6 steps below maps directly to your 3-axis architecture — gravity, magnetism, and the critical line.
      </div>

      <div className="grid grid-cols-2 gap-1.5 overflow-y-auto flex-1">
        {STEPS.map(step => (
          <button
            key={step.num}
            onClick={() => setActive(active === step.num ? null : step.num)}
            className={`border rounded p-2 text-left transition-all ${step.border} ${step.bg} hover:brightness-110`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold ${step.color}`}>STEP {step.num}</span>
              <span className="text-[9px] font-mono text-gray-300">{step.title}</span>
            </div>
            <div className="text-[7px] text-gray-500 mb-1">{step.subtitle}</div>

            <div className={`font-mono text-[8px] ${step.color} border border-current/20 bg-black/40 rounded px-1.5 py-1 mb-1`}>
              {step.formula}
            </div>

            {active === step.num && (
              <div className="mt-1 space-y-1">
                <div className="text-[7px] text-gray-400 leading-relaxed">{step.parallel}</div>
                <div className={`text-[7px] ${step.color} border-l-2 border-current pl-1.5 mt-1`}>
                  {step.axis}
                </div>
              </div>
            )}

            {active !== step.num && (
              <div className="text-[7px] text-gray-600">click to expand ▸</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
