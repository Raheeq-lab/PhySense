export type MathLesson = {
  code: string;
  title: string;
  summary: string;
  physics: string;
  physicsHref: string;
  href?: string;
};

export type MathBlock = {
  number: number;
  symbol: string;
  title: string;
  description: string;
  lessons: MathLesson[];
};

export const MATH_BLOCKS: MathBlock[] = [
  { number: 1, symbol: 'x', title: 'Algebra Foundations', description: 'Build the language used in every STEM equation.', lessons: [
    { code: 'M1.1', title: 'Unknowns & Equations', summary: 'Keep both sides balanced and solve for x.', physics: 'Kinematics equations', physicsHref: '/block-1/1-1', href: '/math-spark/algebra' },
    { code: 'M1.2', title: 'Rearranging Formulas', summary: 'Make any variable the subject of a formula.', physics: 'Newton’s laws', physicsHref: '/block-1/1-2' },
    { code: 'M1.3', title: 'Ratios, Units & Scale', summary: 'Compare quantities and check that units agree.', physics: 'Measurements and motion', physicsHref: '/block-1/1-1' },
    { code: 'M1.4', title: 'Coordinates & Graphs', summary: 'Turn a table of values into a visual story.', physics: 'Motion graphs', physicsHref: '/block-1/1-1' },
    { code: 'M1.5', title: 'Powers & Roots', summary: 'Work confidently with squares and square roots.', physics: 'Energy and speed', physicsHref: '/block-1/1-4' },
    { code: 'M1.6', title: 'Scientific Notation', summary: 'Handle numbers from atoms to galaxies.', physics: 'Atomic and space scales', physicsHref: '/block-3/3-6' },
  ]},
  { number: 2, symbol: '→', title: 'Geometry & Vectors', description: 'Describe shape, direction, and motion through space.', lessons: [
    { code: 'M2.1', title: 'Angles & Triangles', summary: 'Read angles and use triangle relationships.', physics: 'Projectile motion', physicsHref: '/block-1/1-1' },
    { code: 'M2.2', title: 'Trigonometry', summary: 'Connect angles to side lengths with sine and cosine.', physics: 'Force components', physicsHref: '/block-1/1-2' },
    { code: 'M2.3', title: 'Vectors', summary: 'Represent magnitude and direction together.', physics: 'Velocity and force', physicsHref: '/block-1/1-1' },
    { code: 'M2.4', title: 'Vector Components', summary: 'Split one vector into useful directions.', physics: 'Inclined planes', physicsHref: '/block-1/1-2' },
    { code: 'M2.5', title: 'Circles & Radians', summary: 'Measure rotation naturally with radius and angle.', physics: 'Circular motion', physicsHref: '/block-1/1-3' },
    { code: 'M2.6', title: 'Waves as Geometry', summary: 'See wavelength, amplitude, and phase on a graph.', physics: 'Waves', physicsHref: '/block-2/2-6' },
  ]},
  { number: 3, symbol: '∫', title: 'Functions & Calculus', description: 'Understand change, slopes, and accumulation.', lessons: [
    { code: 'M3.1', title: 'Functions', summary: 'Connect each input to an output.', physics: 'Physical models', physicsHref: '/block-1/1-1' },
    { code: 'M3.2', title: 'Slope & Rate of Change', summary: 'Measure how quickly one quantity changes.', physics: 'Velocity', physicsHref: '/block-1/1-1' },
    { code: 'M3.3', title: 'Derivatives', summary: 'Find the rate of change at one instant.', physics: 'Acceleration', physicsHref: '/block-1/1-1' },
    { code: 'M3.4', title: 'Derivative Rules', summary: 'Differentiate useful combinations of functions.', physics: 'Variable forces', physicsHref: '/block-1/1-2' },
    { code: 'M3.5', title: 'Area & Integrals', summary: 'Accumulate many tiny changes into a total.', physics: 'Work and displacement', physicsHref: '/block-1/1-4' },
    { code: 'M3.6', title: 'Differential Equations', summary: 'Write rules for systems that evolve over time.', physics: 'Oscillations', physicsHref: '/block-2/2-5' },
  ]},
  { number: 4, symbol: 'λ', title: 'Advanced Math Tools', description: 'Prepare for fields, relativity, and quantum physics.', lessons: [
    { code: 'M4.1', title: 'Exponentials & Logarithms', summary: 'Model rapid growth and steady decay.', physics: 'Nuclear decay', physicsHref: '/block-4/4-6' },
    { code: 'M4.2', title: 'Complex Numbers', summary: 'Extend the number line into a plane.', physics: 'Waves and circuits', physicsHref: '/block-2/2-6' },
    { code: 'M4.3', title: 'Matrices', summary: 'Transform many connected quantities at once.', physics: 'Quantum states', physicsHref: '/block-4/4-5' },
    { code: 'M4.4', title: 'Multivariable Calculus', summary: 'Track change in more than one direction.', physics: 'Electric fields', physicsHref: '/block-2/2-1' },
    { code: 'M4.5', title: 'Probability', summary: 'Reason clearly when outcomes are uncertain.', physics: 'Quantum measurement', physicsHref: '/block-4/4-5' },
    { code: 'M4.6', title: 'Statistics & Uncertainty', summary: 'Use data while respecting measurement limits.', physics: 'Experimental physics', physicsHref: '/diagnostic-map' },
  ]},
  { number: 5, symbol: 'P', title: 'Probability & Data', description: 'Turn measurements into evidence and reliable conclusions.', lessons: [
    { code: 'M5.1', title: 'Reading Data', summary: 'Understand tables, charts, and distributions.', physics: 'Experimental results', physicsHref: '/diagnostic-map' },
    { code: 'M5.2', title: 'Mean & Spread', summary: 'Describe the centre and variation of a data set.', physics: 'Repeated measurements', physicsHref: '/diagnostic-map' },
    { code: 'M5.3', title: 'Probability Rules', summary: 'Calculate how likely an outcome is.', physics: 'Quantum probability', physicsHref: '/block-4/4-5' },
    { code: 'M5.4', title: 'Measurement Error', summary: 'Separate random variation from systematic error.', physics: 'Laboratory work', physicsHref: '/block-1/1-1' },
    { code: 'M5.5', title: 'Uncertainty', summary: 'Report what a measurement can honestly tell us.', physics: 'Experimental physics', physicsHref: '/diagnostic-map' },
    { code: 'M5.6', title: 'Fitting a Model', summary: 'Find a mathematical pattern that matches real data.', physics: 'Motion graphs', physicsHref: '/block-1/1-1' },
  ]},
  { number: 6, symbol: '∇', title: 'Mathematical Physics', description: 'Bring the full toolkit together for advanced physical systems.', lessons: [
    { code: 'M6.1', title: 'Differential Equations', summary: 'Describe how a system changes from one instant to the next.', physics: 'Oscillations', physicsHref: '/block-2/2-5' },
    { code: 'M6.2', title: 'Partial Derivatives', summary: 'Measure change in one direction at a time.', physics: 'Thermodynamics', physicsHref: '/block-3/3-3' },
    { code: 'M6.3', title: 'Gradients & Fields', summary: 'Find the direction of fastest spatial change.', physics: 'Electric fields', physicsHref: '/block-2/2-1' },
    { code: 'M6.4', title: 'Vector Calculus', summary: 'Describe flow, sources, and circulation.', physics: 'Electrodynamics', physicsHref: '/block-4/4-2' },
    { code: 'M6.5', title: 'Linear Operators', summary: 'Treat mathematical actions as reusable objects.', physics: 'Quantum mechanics', physicsHref: '/block-4/4-5' },
    { code: 'M6.6', title: 'Symmetry & Invariance', summary: 'Use what stays unchanged to reveal physical laws.', physics: 'Relativity', physicsHref: '/block-3/3-5' },
  ]},
];
