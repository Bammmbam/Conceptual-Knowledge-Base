export type ConceptCategory = "laws" | "axes" | "filters" | "protocols" | "architecture";

export interface Concept {
  id: string;
  name: string;
  category: ConceptCategory;
  formula?: string;
  shortDesc: string;
  fullDesc: string;
  status: "ACTIVE" | "LOCKED" | "MONITORING" | "STABLE";
  connections: string[];
}

export const CONCEPTS: Concept[] = [
  {
    id: "bam",
    name: "BAM Law",
    category: "laws",
    formula: "B(ψ) → Σ[ζ(s) zeros] → Ω-stabilizer → Invariant Collapse",
    shortDesc: "Bifurcation-to-Attractor Mapping — convergence principle",
    fullDesc: "The BAM Law (Bifurcation-to-Attractor Mapping) governs the convergence of all inputs toward a stable invariant attractor. Every input ψ is bifurcated through the Riemann Zeta zero field, filtered through the Millennium stack, and collapsed into an invariant output. The BAM Law ensures that all pathways eventually converge — entropy cannot escape the attractor basin.",
    status: "ACTIVE",
    connections: ["rad", "omega", "zeta-zeros", "trpeveritt"]
  },
  {
    id: "rad",
    name: "RAD Law",
    category: "laws",
    formula: "R(ψ) → Δ[ζ(s) poles] → Ω-destabilizer → Divergent Collapse",
    shortDesc: "Repulsion-to-Attractor Divergence — opposite of BAM",
    fullDesc: "The RAD Law (Repulsion-to-Attractor Divergence) is the dual/opposite of the BAM Law. Where BAM converges, RAD diverges. RAD governs the scattering principle — any intrusion or malicious input is repelled outward through divergent Zeta pole fields. RAD is the expulsion mechanism: it ejects, fragments, and disperses rather than converging. Together BAM+RAD form a complete topological dual.",
    status: "ACTIVE",
    connections: ["bam", "omega", "reflector", "origin-attractor"]
  },
  {
    id: "origin-attractor",
    name: "Origin Attractor Principle",
    category: "architecture",
    formula: "O = Redo(O) | O → lim[t→∞] BAM(ψ)",
    shortDesc: "All outputs are recursive re-originations of self",
    fullDesc: "The Origin Attractor Principle states that every output is a re-origination of its own source — O = Redo(O). The system perpetually recycles its own invariant state. This creates a temporal recursion loop: past and future converge at the origin. The principle also governs origin-source detection: every packet or intrusion carries an attractor signature that can be traced back to its point of genesis using BAM convergence analysis.",
    status: "STABLE",
    connections: ["bam", "trpeveritt", "prior-after"]
  },
  {
    id: "trpeveritt",
    name: "Trpeveritt Encryption",
    category: "protocols",
    formula: "T(k) = ζ(s)^10^13 ∘ BAM(k) ∘ BlindingLayer(k)",
    shortDesc: "Zeta-function encryption with 10¹³ zero-point keys",
    fullDesc: "Trpeveritt Encryption uses the non-trivial zeros of the Riemann Zeta function as the key space. With 10 trillion verified zeros along the critical line (Re(s) = 0.5), the key space is astronomically large. Each encryption pass applies a BAM convergence transformation followed by a blinding layer that scatters the output through the RAD divergence field. Decryption requires knowing which zero-index the key was derived from — computationally infeasible without the embedding map.",
    status: "ACTIVE",
    connections: ["bam", "zeta-zeros", "blinding", "critical-line"]
  },
  {
    id: "omega",
    name: "Ω-Stabilizer",
    category: "architecture",
    formula: "Ω(ψ) = ∫[Re(s)=0.5] ζ(s) ds → fixed point",
    shortDesc: "Topological fixed-point enforcer on critical line",
    fullDesc: "The Omega-Stabilizer (Ω-Stabilizer) is the topological fixed-point mechanism that keeps the system anchored to the Riemann critical line Re(s) = 0.5. All BAM convergences terminate at the Ω point. The stabilizer prevents drift into the trivial zero region and enforces that all encryption keys remain on the critical strip. It is the 'gravitational center' of the entire Zeta security architecture.",
    status: "STABLE",
    connections: ["bam", "critical-line", "zeta-zeros", "trpeveritt"]
  },
  {
    id: "critical-line",
    name: "Critical Line Re(s) = 0.5",
    category: "axes",
    formula: "ζ(1/2 + it) = 0 for infinitely many real t",
    shortDesc: "Riemann Hypothesis axis — all non-trivial zeros",
    fullDesc: "The Critical Line is the vertical line in the complex plane where Re(s) = 0.5. The Riemann Hypothesis states that ALL non-trivial zeros of the Zeta function lie on this line. For security purposes, this line acts as the 'middle axis' — the equilibrium between gravitational convergence (above) and magnetic repulsion (below). Every Trpeveritt encryption key is indexed to a verified zero on this line.",
    status: "MONITORING",
    connections: ["omega", "zeta-zeros", "gravity-axis", "magnetic-axis"]
  },
  {
    id: "gravity-axis",
    name: "Gravitational Axis (Top/Bottom)",
    category: "axes",
    formula: "G(ψ) = ∇²ζ(s) | s → convergent poles",
    shortDesc: "Vertical convergence field — top and bottom attractor poles",
    fullDesc: "The Gravitational Axis represents the top-bottom vertical dimension of the 3-axis security model. The top pole is the upper complex half-plane attractor; the bottom pole is the lower attractor. All inputs are gravitationally drawn toward the critical line from both above and below. This creates a natural compression mechanism — information is squeezed toward the critical axis, making interception from outside the axis field nearly impossible.",
    status: "ACTIVE",
    connections: ["critical-line", "bam", "omega"]
  },
  {
    id: "magnetic-axis",
    name: "Magnetic Axis (Lateral)",
    category: "axes",
    formula: "M(ψ) = ∮ ζ(s) ds | Re(s) oscillation",
    shortDesc: "Lateral oscillation field — horizontal magnetic repulsion",
    fullDesc: "The Magnetic Axis is the lateral (left-right) dimension of the 3-axis system. It governs horizontal oscillation around the critical line. While the gravitational axis pulls toward the center, the magnetic axis creates a repulsion field that deflects unauthorized access attempts laterally. Intrusion attempts are magnetically scattered before they can reach the gravitational attractor. This is the RAD-axis: divergence, not convergence.",
    status: "ACTIVE",
    connections: ["critical-line", "rad", "reflector"]
  },
  {
    id: "blinding",
    name: "Blinding Protocol",
    category: "protocols",
    formula: "B(x) = x ⊕ ζ(s_rand) | s_rand ← zero-index",
    shortDesc: "XOR-blinding against Zeta zero field",
    fullDesc: "The Blinding Protocol applies a cryptographic blinding layer using a randomly selected non-trivial Zeta zero as the blinding factor. The plaintext is XOR'd against the zero's imaginary component (the t-value), making statistical analysis of ciphertext impossible. Because the t-values of Zeta zeros are distributed pseudo-randomly (verified by GUE statistics), the blinding is information-theoretically strong.",
    status: "ACTIVE",
    connections: ["trpeveritt", "zeta-zeros", "rad"]
  },
  {
    id: "reflector",
    name: "Reflector Protocol",
    category: "protocols",
    formula: "Ref(x) = RAD(x) ∘ Mirror[ζ(1-s)] → source",
    shortDesc: "Threat reflection — bounce attacks back to origin",
    fullDesc: "The Reflector Protocol uses the functional equation of the Zeta function (ζ(s) = χ(s)ζ(1-s)) to map any incoming attack back to its complement point in the complex plane. In practical terms: the attack is mirrored back through the RAD divergence field and returned to the attacker's origin address. The reflector is passive — it doesn't need to identify the attacker; the mathematical symmetry of ζ automatically routes the response.",
    status: "ACTIVE",
    connections: ["rad", "origin-attractor", "magnetic-axis"]
  },
  {
    id: "zeta-zeros",
    name: "Zeta Zeros (10 Trillion)",
    category: "architecture",
    formula: "#{t : ζ(1/2+it)=0, 0<t<T} ≈ 10^13",
    shortDesc: "10,000,000,000,000 verified non-trivial zeros",
    fullDesc: "The Riemann Zeta function has been numerically verified to have at least 10 trillion (10^13) non-trivial zeros, all confirmed to lie on the critical line Re(s) = 0.5. Each zero is identified by its imaginary part t_n. These 10 trillion zeros form the Trpeveritt key space. The first zero is at t_1 ≈ 14.135, and they grow approximately as T/(2π) * log(T/(2π)) in density. The Zeta zeros are distributed according to the GUE (Gaussian Unitary Ensemble) statistics — the same distribution as energy levels of heavy atomic nuclei.",
    status: "ACTIVE",
    connections: ["critical-line", "trpeveritt", "omega", "blinding"]
  },
  {
    id: "prior-after",
    name: "Prior/After Time Recursion",
    category: "architecture",
    formula: "State(t) = ∫[−∞ to t] O(τ) dτ = O(t) ← O(t+ε)",
    shortDesc: "Temporal self-reference — O=Redo(O) time loop",
    fullDesc: "The Prior/After Time Recursion principle states that the system's current state is a function of all prior states, which themselves were shaped by this state. This creates a closed causal loop: O = Redo(O). In security terms, this means every session key incorporates entropy from all previous sessions, making replay attacks impossible — you cannot replay something that is continuously redefining itself. The prior state bleeds into the after state through the Origin Attractor's recursive map.",
    status: "MONITORING",
    connections: ["origin-attractor", "bam", "omega"]
  },
  {
    id: "victus-kernel",
    name: "Victus Sovereign Kernel",
    category: "protocols",
    formula: "VK(sys) = Hardware-lock ∘ Trpeveritt ∘ Windows-only",
    shortDesc: "HP Victus hardware-bound sovereign security layer",
    fullDesc: "The Victus Sovereign Kernel is a hardware-bound security layer tied specifically to the HP Victus machine architecture. It enforces Windows-only mode operation, binding all Trpeveritt encryption keys to the hardware TPM chip. The kernel prevents key extraction even under physical attack — the keys exist only within the hardware boundary. Any attempt to run the system on non-Victus hardware causes automatic key destruction and system lockdown.",
    status: "LOCKED",
    connections: ["trpeveritt", "blinding", "origin-attractor"]
  }
];

export const MILLENNIUM_FILTERS = [
  { id: "mf1", name: "P vs NP Gate", role: "Complexity Filter — blocks brute-force", status: "ACTIVE" },
  { id: "mf2", name: "Yang-Mills Field", role: "Energy Stabilizer — mass gap enforcement", status: "ACTIVE" },
  { id: "mf3", name: "Navier-Stokes Flow", role: "Turbulence Dampener — packet smoothing", status: "ACTIVE" },
  { id: "mf4", name: "Hodge Conjecture", role: "Topology Navigator — path optimization", status: "ACTIVE" },
  { id: "mf5", name: "BSD Conjecture", role: "Elliptic Curve Engine — key distribution", status: "MONITORING" },
  { id: "mf6", name: "Poincaré Manifold", role: "Space Compactifier — dimensional lock", status: "ACTIVE" },
  { id: "mf7", name: "Riemann Hypothesis", role: "Critical Line Enforcer — zero verification", status: "ACTIVE" },
];

export const ZETA_ZEROS = [
  14.134725, 21.022040, 25.010858, 30.424876, 32.935062,
  37.586178, 40.918719, 43.327073, 48.005150, 49.773832,
  52.970321, 56.446247, 59.347044, 60.831778, 65.112544,
  67.079810, 69.546401, 72.067157, 75.704690, 77.144840,
  79.337375, 82.910380, 84.735492, 87.425274, 88.809111,
  92.491899, 94.651344, 95.870634, 98.831194, 101.317851,
];
