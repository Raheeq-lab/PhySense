export const lessons=[
  {id:'block-1/1-1',number:'1.1',title:'Kinematics',block:'Block 1'},
  {id:'block-1/1-2',number:'1.2',title:'Forces',block:'Block 1'},
  {id:'block-1/1-3',number:'1.3',title:'Circular Motion',block:'Block 1'},
  {id:'block-1/1-4',number:'1.4',title:'Work & Energy',block:'Block 1'},
  {id:'block-1/1-5',number:'1.5',title:'Momentum',block:'Block 1'},
  {id:'block-1/1-6',number:'1.6',title:'Calculus for Motion',block:'Block 1'},
  {id:'block-2/2-1',number:'2.1',title:'Electric Fields',block:'Block 2'},
  {id:'block-2/2-2',number:'2.2',title:'Electric Potential',block:'Block 2'},
  {id:'block-2/2-3',number:'2.3',title:'Magnetism',block:'Block 2'},
  {id:'block-2/2-4',number:'2.4',title:'Induction',block:'Block 2'},
  {id:'block-2/2-5',number:'2.5',title:'Oscillations',block:'Block 2'},
  {id:'block-2/2-6',number:'2.6',title:'Waves',block:'Block 2'},
  {id:'block-3/3-1',number:'3.1',title:'Gravitation & Orbits',block:'Block 3'},
  {id:'block-3/3-2',number:'3.2',title:'Fluids & Pressure',block:'Block 3'},
  {id:'block-3/3-3',number:'3.3',title:'Thermal Physics',block:'Block 3'},
  {id:'block-3/3-4',number:'3.4',title:'Geometric Optics',block:'Block 3'},
  {id:'block-3/3-5',number:'3.5',title:'Special Relativity',block:'Block 3'},
  {id:'block-3/3-6',number:'3.6',title:'Introductory Quantum Physics',block:'Block 3'},
  {id:'block-4/4-1',number:'4.1',title:'Analytical Mechanics',block:'Block 4'},
  {id:'block-4/4-2',number:'4.2',title:'Classical Electrodynamics',block:'Block 4'},
  {id:'block-4/4-3',number:'4.3',title:'Statistical Mechanics',block:'Block 4'},
  {id:'block-4/4-4',number:'4.4',title:'General Relativity',block:'Block 4'},
  {id:'block-4/4-5',number:'4.5',title:'Quantum Mechanics',block:'Block 4'},
  {id:'block-4/4-6',number:'4.6',title:'Nuclear & Particle Physics',block:'Block 4'},
] as const;

export type LessonId=(typeof lessons)[number]['id'];
export const lessonIds=new Set<string>(lessons.map(lesson=>lesson.id));
