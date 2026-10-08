export interface SubTopic {
  id: string;
  code: string;
  title: string;
  summary: string;
  formulas: string[];
  keyConcepts: string[];
  hlOnly?: boolean;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
}

export interface Topic {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  accentHex: string;
  bgGlow: string;
  subtopics: SubTopic[];
}

export const SYLLABUS_DATA: Topic[] = [
  {
    id: 'space-time-motion',
    number: 1,
    title: 'Space, Time & Motion',
    description: 'Kinematics, Newton’s laws of dynamics, projectile mechanics, momentum, and orbital gravitation.',
    icon: 'Rocket',
    color: 'from-blue-500 to-cyan-400',
    accentHex: '#06b6d4',
    bgGlow: 'rgba(6, 182, 212, 0.15)',
    subtopics: [
      {
        id: '1.1',
        code: 'A.1',
        title: 'Kinematics & Projectiles',
        summary: 'Uniform acceleration, suvat kinematic equations, resolution of vectors, and 2D parabolic trajectory mechanics.',
        formulas: ['v = u + at', 's = ut + ½at²', 'v² = u² + 2as', 's = ½(u + v)t'],
        keyConcepts: ['Independence of vertical and horizontal components', 'Terminal velocity', 'Frame of reference'],
        difficulty: 'Foundation',
      },
      {
        id: '1.2',
        code: 'A.2',
        title: 'Forces & Momentum',
        summary: 'Newtonian dynamics, free-body force resolution, momentum conservation, and impulse curves.',
        formulas: ['F_net = ma', 'p = mv', 'J = Δp = ∫F dt', 'F_friction ≤ μ_s R'],
        keyConcepts: ['Impulse as area under F-t graph', 'Elastic vs Inelastic collisions', 'Terminal drag equilibria'],
        difficulty: 'Intermediate',
      },
      {
        id: '1.3',
        code: 'A.3',
        title: 'Work, Energy & Power',
        summary: 'Mechanical work done, conservation of energy, elastic potential, and mechanical efficiency.',
        formulas: ['W = F s cosθ', 'E_k = ½mv²', 'E_p = mgh', 'P = F v'],
        keyConcepts: ['Conservative vs dissipative forces', 'Energy transformation diagrams', 'Hooke’s law elastic potential'],
        difficulty: 'Foundation',
      },
      {
        id: '1.4',
        code: 'A.4',
        title: 'Circular Motion & Gravitation',
        summary: 'Centripetal acceleration, universal law of gravitation, Keplerian orbital mechanics, and escape velocity.',
        formulas: ['a_c = v²/r = ω²r', 'F_g = G(M m)/r²', 'v_orbit = √(GM/r)', 'v_esc = √(2GM/r)'],
        keyConcepts: ['Centripetal force as resultant net force', 'Gravitational field strength g = GM/r²', 'Geostationary satellites'],
        hlOnly: true,
        difficulty: 'Advanced',
      },
    ],
  },
  {
    id: 'fields-electromagnetism',
    number: 2,
    title: 'Fields & Electromagnetism',
    description: 'Coulomb interactions, electric fields, magnetic flux, electromagnetic induction, and alternating currents.',
    icon: 'Zap',
    color: 'from-amber-400 to-orange-500',
    accentHex: '#f59e0b',
    bgGlow: 'rgba(245, 158, 11, 0.15)',
    subtopics: [
      {
        id: '2.1',
        code: 'B.1',
        title: 'Electrostatic Fields & Coulomb’s Law',
        summary: 'Point charges, Coulomb inverse-square law, radial vs uniform field strength, and equipotential surfaces.',
        formulas: ['F_e = k(q₁q₂)/r²', 'E = F/q = kQ/r²', 'V = kQ/r', 'W = qΔV'],
        keyConcepts: ['Electric potential gradient E = -dV/dr', 'Equipotential lines normal to field vectors', 'Millikan oil drop'],
        difficulty: 'Intermediate',
      },
      {
        id: '2.2',
        code: 'B.2',
        title: 'Current, Resistance & DC Circuits',
        summary: 'Drift velocity, Ohm’s law, Kirchhoff’s junction and loop conservation laws, and potential divider circuits.',
        formulas: ['I = nAvq', 'V = IR', 'R = ρL/A', 'ε = I(R + r)'],
        keyConcepts: ['Kirchhoff’s 1st Law (Charge conservation)', 'Kirchhoff’s 2nd Law (Energy conservation)', 'Internal resistance'],
        difficulty: 'Foundation',
      },
      {
        id: '2.3',
        code: 'B.3',
        title: 'Magnetic Effects & Induction',
        summary: 'Lorentz force on moving charges and wires, magnetic flux linkage, Faraday’s law, and Lenz’s opposition law.',
        formulas: ['F = qvB sinθ', 'F = BIL sinθ', 'Φ = BA cosθ', 'ε = -N(ΔΦ/Δt)'],
        keyConcepts: ['Right-hand screw and Fleming left-hand rules', 'Eddy currents and magnetic damping', 'AC generation & transformers'],
        hlOnly: true,
        difficulty: 'Advanced',
      },
    ],
  },
  {
    id: 'wave-behaviour',
    number: 3,
    title: 'Wave Behaviour & Optics',
    description: 'Simple harmonic oscillations, traveling vs standing waves, diffraction, interference, and Doppler shift.',
    icon: 'Radio',
    color: 'from-emerald-400 to-teal-500',
    accentHex: '#10b981',
    bgGlow: 'rgba(16, 185, 129, 0.15)',
    subtopics: [
      {
        id: '3.1',
        code: 'C.1',
        title: 'Simple Harmonic Motion (SHM)',
        summary: 'Restoring forces proportional to displacement, phase difference, and kinetic-potential energy interchanges.',
        formulas: ['a = -ω²x', 'x = x₀ cos(ωt)', 'v = ±ω√(x₀² - x²)', 'T = 2π√(m/k) = 2π√(L/g)'],
        keyConcepts: ['Definition of SHM acceleration', 'Damped vs forced resonance', 'Phase leads and lags'],
        difficulty: 'Intermediate',
      },
      {
        id: '3.2',
        code: 'C.2',
        title: 'Wave Characteristics & Optics',
        summary: 'Transverse vs longitudinal waves, Snell’s law of refraction, total internal reflection, and Malus’ law.',
        formulas: ['v = fλ', 'n₁ sinθ₁ = n₂ sinθ₂', 's = λD/d', 'I = I₀ cos²θ'],
        keyConcepts: ['Polarisation proving transverse nature', 'Diffraction and Huygens wavelet principle', 'Double-slit interference fringes'],
        difficulty: 'Foundation',
      },
      {
        id: '3.3',
        code: 'C.3',
        title: 'Wave Phenomena & Doppler Effect',
        summary: 'Single slit diffraction profiles, Rayleigh criterion resolution limits, and Doppler frequency shifts.',
        formulas: ['θ = λ/b', 'θ = 1.22 λ/b', 'f\' = f [v / (v ± u_s)]', 'Δf/f ≈ v/c'],
        keyConcepts: ['Standing waves in open vs closed pipes', 'Redshift and cosmological expansion', 'Thin film interference'],
        hlOnly: true,
        difficulty: 'Advanced',
      },
    ],
  },
  {
    id: 'thermal-energy',
    number: 4,
    title: 'Thermal & Thermodynamics',
    description: 'Kinetic model of ideal gases, specific heat capacity, latent heat, and thermodynamic cycles.',
    icon: 'Flame',
    color: 'from-rose-500 to-pink-500',
    accentHex: '#f43f5e',
    bgGlow: 'rgba(244, 63, 94, 0.15)',
    subtopics: [
      {
        id: '4.1',
        code: 'D.1',
        title: 'Thermal Energy Transfers',
        summary: 'Specific heat capacity, latent heat of phase changes, calorimetry, and conduction/convection/radiation.',
        formulas: ['Q = mcΔT', 'Q = mL', 'P = eσAT⁴', 'λ_max T = 2.9×10⁻³ m·K'],
        keyConcepts: ['Internal energy as sum of random kinetic and potential', 'Blackbody radiation curves', 'Thermal equilibrium'],
        difficulty: 'Foundation',
      },
      {
        id: '4.2',
        code: 'D.2',
        title: 'Thermodynamics & Gas Laws',
        summary: 'Ideal gas equation of state, molecular velocities, First & Second Laws of thermodynamics, and Carnot cycles.',
        formulas: ['pV = nRT = N k_B T', 'E_k = (3/2) k_B T', 'Q = ΔU + W', 'W = pΔV'],
        keyConcepts: ['Isobaric, isochoric, isothermal, and adiabatic transitions', 'Entropy and arrow of time', 'Heat engine limits'],
        hlOnly: true,
        difficulty: 'Advanced',
      },
    ],
  },
  {
    id: 'quantum-nuclear',
    number: 5,
    title: 'Quantum & Nuclear Physics',
    description: 'Photoelectric effect, de Broglie wave-particle duality, atomic emission spectra, and nuclear decay.',
    icon: 'Atom',
    color: 'from-purple-500 to-indigo-500',
    accentHex: '#a855f7',
    bgGlow: 'rgba(168, 85, 247, 0.15)',
    subtopics: [
      {
        id: '5.1',
        code: 'E.1',
        title: 'Atomic Energy Levels & Spectra',
        summary: 'Bohr model transitions, photon emission and absorption, and Rutherford-Geiger-Marsden scattering.',
        formulas: ['E = hf = hc/λ', 'ΔE = E₂ - E₁', 'λ_deBroglie = h/p'],
        keyConcepts: ['Discrete quantized energy states', 'Alpha particle backscattering evidence', 'Emission vs absorption spectra'],
        difficulty: 'Foundation',
      },
      {
        id: '5.2',
        code: 'E.2',
        title: 'Photoelectric Effect & Quantum Nature',
        summary: 'Einstein photoelectric equation, work function, stopping potential, and wave-particle duality.',
        formulas: ['E_max = hf - Φ', 'qV_s = hf - Φ', 'Δx Δp ≥ h / (4π)'],
        keyConcepts: ['Threshold frequency independent of intensity', 'Instantaneous emission proof of photon packets', 'Heisenberg uncertainty'],
        hlOnly: true,
        difficulty: 'Advanced',
      },
      {
        id: '5.3',
        code: 'E.3',
        title: 'Nuclear Structure & Radioactive Decay',
        summary: 'Mass defect, binding energy curve, alpha/beta/gamma decays, exponential half-life kinetics, and fission.',
        formulas: ['E = mc²', 'N = N₀ e^(-λt)', 'A = λN', 'T_½ = ln(2)/λ'],
        keyConcepts: ['Binding energy per nucleon curve (Iron-56 peak)', 'Strong nuclear force range', 'Neutrino hypothesis in beta decay'],
        difficulty: 'Intermediate',
      },
    ],
  },
];
