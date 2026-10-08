export interface InteractiveConcept {
  title: string;
  description: string;
  controls: string[];
  observation: string;
}

export interface Challenge {
  title: string;
  scenario: string;
  prompt: string;
  hint: string;
}

export interface SubTopic {
  id: string;
  code: string;
  title: string;
  summary: string;
  realLifeAnchor: string;
  anchorQuestion: string;
  formulas: string[];
  keyConcepts: string[];
  learningPath: string[];
  interactive: InteractiveConcept;
  challenge: Challenge;
  mathSpark?: string;
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

export const SYLLABUS_DATA: Topic[] = [{
  id: 'block-1-intuition-calculus-spark',
  number: 1,
  title: 'The Intuition & Calculus Spark',
  description: 'Build mechanics from everyday experience, then reveal the calculus underneath it.',
  icon: 'Sparkles', color: 'from-emerald-500 to-lime-400', accentHex: '#4d5a3d', bgGlow: 'rgba(77,90,61,.15)',
  subtopics: [
    {
      id: 'block-1-kinematics', code: '1.1', title: 'Kinematics: Motion in 1D & 2D', difficulty: 'Foundation',
      summary: 'Describe motion using position, velocity, acceleration, graphs, and vector components.',
      realLifeAnchor: 'You are riding in a car when the driver suddenly hits the brakes. Your speed falls every second, but your position keeps moving forward until the car stops.',
      anchorQuestion: 'How can velocity be decreasing while position is still increasing?',
      formulas: ['v = Δx/Δt', 'a = Δv/Δt', 'v = u + at', 'Δx = ut + ½at²', 'x = x₀ + v₀ₓt', 'y = y₀ + v₀ᵧt − ½gt²'],
      keyConcepts: ['Position tells where; velocity tells how position changes', 'Acceleration changes velocity, not necessarily speed', 'Horizontal and vertical projectile motion can be analysed independently', 'The slope of a position–time graph is velocity'],
      learningPath: ['Choose a positive direction and locate the object', 'Compare average speed with average velocity', 'Read slopes on motion graphs', 'Build constant-acceleration equations', 'Split a basketball launch into horizontal and vertical motion'],
      interactive: { title: 'Motion Storyboard Lab', description: 'Drag a car along a road or launch a basketball while linked motion graphs and vectors update.', controls: ['Starting position', 'Speed', 'Acceleration', 'Launch angle', 'Frame-step'], observation: 'Draw a tangent on the position graph and watch it become the instantaneous velocity vector.' },
      challenge: { title: 'The late yellow light', scenario: 'A car travels at 18 m/s. The driver reacts for 0.70 s, then brakes at 6.0 m/s². The stop line is 39 m away.', prompt: 'Will the car stop before the line? Separate reaction distance from braking distance.', hint: 'During reaction the speed is constant. During braking, use a velocity–time triangle or v² = u² + 2aΔx.' },
      mathSpark: 'Instantaneous velocity is the limit of average velocity: v = dx/dt. Acceleration is the slope of velocity: a = dv/dt.',
    },
    {
      id: 'block-1-newtons-laws', code: '1.2', title: 'Newton’s Laws & Friction', difficulty: 'Foundation',
      summary: 'Connect forces to changes in motion through free-body diagrams, net force, inertia, and friction.',
      realLifeAnchor: 'Push an empty shopping cart and it accelerates easily. Load it with groceries and the same push produces a smaller change in motion.',
      anchorQuestion: 'Why does the same push create different accelerations?',
      formulas: ['ΣF = ma', 'W = mg', 'fₛ ≤ μₛN', 'fₖ = μₖN'],
      keyConcepts: ['Motion does not require a net force; changing motion does', 'Interaction pairs act on different objects', 'A free-body diagram includes only forces on the chosen object', 'Static friction adjusts up to a maximum'],
      learningPath: ['Choose the object', 'Draw each interaction force', 'Choose useful axes', 'Resolve and add force components', 'Use ΣF = ma and check direction'],
      interactive: { title: 'Push the Crate', description: 'Apply a draggable force to a crate while changing its mass and the floor roughness.', controls: ['Mass', 'Push magnitude', 'Push angle', 'Static friction', 'Force diagram'], observation: 'Friction matches the push until its threshold is crossed, then the crate accelerates.' },
      challenge: { title: 'Moving day ramp', scenario: 'A 32 kg box rests on a 20° ramp with μₛ = 0.35 and μₖ = 0.25.', prompt: 'Will it stay put? If it slides, predict its acceleration.', hint: 'Compare mg sinθ with the maximum static friction μₛmg cosθ.' },
      mathSpark: 'Newton’s second law is a differential equation: F_net = m(dv/dt). Constant net force creates a constant velocity–time slope.',
    },
    {
      id: 'block-1-circular-motion', code: '1.3', title: 'Circular Motion', difficulty: 'Intermediate',
      summary: 'Understand why turning requires inward acceleration even when speed stays constant.',
      realLifeAnchor: 'On a bicycle around a tight corner, you lean inward. Go faster or turn tighter and the required grip rises sharply.',
      anchorQuestion: 'If the speedometer is constant, why are you still accelerating?',
      formulas: ['v = 2πr/T', 'a_c = v²/r = ω²r', 'F_c = mv²/r'],
      keyConcepts: ['Velocity changes when direction changes', 'Centripetal describes the inward net force, not a new force', 'Friction, tension, gravity, or a normal force can point inward', 'The inward requirement grows with speed squared'],
      learningPath: ['Compare nearby velocity arrows', 'Subtract them to reveal inward Δv', 'Connect Δv to inward acceleration', 'Identify the real inward force', 'Test speed and radius limits'],
      interactive: { title: 'Cornering Lab', description: 'Ride a bicycle around an adjustable turn with live velocity, acceleration, and grip vectors.', controls: ['Speed', 'Turn radius', 'Mass', 'Road grip', 'Vector trail'], observation: 'Double the speed and the required inward force becomes four times larger.' },
      challenge: { title: 'The wet roundabout', scenario: 'A 900 kg car enters a 28 m radius roundabout where μₛ = 0.42.', prompt: 'Find the largest safe speed and explain why mass cancels.', hint: 'At the limit, friction μₛmg supplies mv²/r.' },
    },
    {
      id: 'block-1-energy', code: '1.4', title: 'Work, Energy & Conservation', difficulty: 'Intermediate',
      summary: 'Track energy transfers and use conservation without following every instant of motion.',
      realLifeAnchor: 'At the top of a skateboard ramp you are nearly still. Descending turns height into speed; rough wheels warm the surroundings.',
      anchorQuestion: 'Where does the energy go when the skater slows without climbing?',
      formulas: ['W = FΔx cosθ', 'K = ½mv²', 'U_g = mgh', 'W_net = ΔK', 'E_before = E_after + E_dissipated'],
      keyConcepts: ['Energy transfers or transforms; it is not used up', 'Work transfers energy through displacement', 'Conservative forces store recoverable energy', 'Power is the rate of energy transfer'],
      learningPath: ['Choose a system boundary', 'Build before-and-after energy bars', 'Mark transfers across the boundary', 'Include energy dissipated by friction', 'Connect net work to ΔK'],
      interactive: { title: 'Energy Skate Park', description: 'Shape a track and release a skater while live bars show kinetic, gravitational, and thermal energy.', controls: ['Track shape', 'Release height', 'Mass', 'Friction', 'Energy view'], observation: 'Mass changes the energies, but not frictionless speed at the same height.' },
      challenge: { title: 'Design the loop', scenario: 'A cart must complete a vertical loop of radius 3.0 m without losing contact.', prompt: 'Estimate the minimum release height and state both physical conditions.', hint: 'At the top, minimum v²/r = g. Then conserve energy.' },
      mathSpark: 'For a changing force, work is accumulated area under the force–position graph: W = ∫F(x)dx.',
    },
    {
      id: 'block-1-momentum', code: '1.5', title: 'Momentum & Collisions', difficulty: 'Intermediate',
      summary: 'Use impulse and momentum conservation to understand impacts, recoil, and collision safety.',
      realLifeAnchor: 'An airbag does not remove the momentum change. It stretches that change over more time, reducing peak force.',
      anchorQuestion: 'How can a longer collision make the same stop safer?',
      formulas: ['p = mv', 'J = F_avgΔt = Δp', 'J = ∫Fdt', 'Σp_before = Σp_after'],
      keyConcepts: ['Momentum is a vector', 'Impulse is area under a force–time graph', 'System momentum is conserved when external impulse is negligible', 'Only elastic collisions conserve kinetic energy'],
      learningPath: ['Define the collision system', 'Choose a positive direction', 'Draw before-and-after momentum bars', 'Use impulse for collision force', 'Compare elastic and inelastic outcomes'],
      interactive: { title: 'Collision Table', description: 'Launch two carts and choose magnetic bumpers, springs, or sticky clay.', controls: ['Masses', 'Velocities', 'Collision type', 'Slow motion', 'Force–time graph'], observation: 'System momentum stays fixed while kinetic energy changes in inelastic collisions.' },
      challenge: { title: 'Crash reconstruction', scenario: 'A 1200 kg car at 16 m/s east sticks to a 900 kg car at 12 m/s north.', prompt: 'Find the wreck’s speed and direction immediately after impact.', hint: 'Conserve east and north momentum separately, then combine components.' },
    },
    {
      id: 'block-1-calculus-bridge', code: '1.6', title: 'The Calculus Bridge', difficulty: 'Advanced',
      summary: 'Unlock kinematic equations through slopes, accumulated area, derivatives, and integrals.',
      realLifeAnchor: 'A fitness tracker records your speed every instant. Its graph knows both how your pace changes and how far you travelled.',
      anchorQuestion: 'How can one velocity–time graph contain both acceleration and displacement?',
      formulas: ['v = dx/dt', 'a = dv/dt = d²x/dt²', 'Δx = ∫v(t)dt', 'Δv = ∫a(t)dt', 'v = u + at', 'x = x₀ + ut + ½at²'],
      keyConcepts: ['A derivative measures local rate of change', 'An integral accumulates tiny contributions', 'Slope and area are inverse viewpoints', 'Initial conditions determine integration constants'],
      learningPath: ['Shrink a secant into a tangent', 'Read tangent slope as instantaneous velocity', 'Stack thin rectangles under v(t)', 'Integrate constant acceleration to get v(t)', 'Integrate again and apply x(0) = x₀'],
      interactive: { title: 'Slope ↔ Area Studio', description: 'Draw acceleration and watch velocity and position graphs build live—or differentiate a position curve.', controls: ['Graph pencil', 'Tangent scrubber', 'Rectangle width', 'Initial velocity', 'Initial position'], observation: 'Thinner rectangles make their sum approach the exact area under the curve.' },
      challenge: { title: 'A non-constant accelerator', scenario: 'An electric cart has a(t) = 2t m/s², v(0) = 3 m/s, and x(0) = 1 m.', prompt: 'Derive v(t) and x(t), then find x at t = 4 s.', hint: 'Integrate twice and apply one initial condition after each integration.' },
      mathSpark: 'From constant a, integrate a = dv/dt to get v = u + at. Integrate v = dx/dt to get x = x₀ + ut + ½at².',
    },
  ],
}];
