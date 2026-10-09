export type DiagnosticOption={label:string};
export type DiagnosticItem={
  id:string;
  concept:string;
  misconception:string;
  difficulty:'introductory'|'developing'|'challenging';
  prompt:string;
  answers:DiagnosticOption[];
  reasons:DiagnosticOption[];
  correctAnswer:number;
  correctReason:number;
  explanation:string;
};

export const kinematicsDiagnostic:DiagnosticItem[]=[
  {
    id:'KIN-01',concept:'Position and velocity signs',difficulty:'introductory',
    misconception:'A positive position means the object must be moving in the positive direction.',
    prompt:'A car is at +30 m and is moving to the left. Which statement is correct?',
    answers:[{label:'Its position and velocity are both positive.'},{label:'Its position is positive, but its velocity is negative.'},{label:'Its position is negative, but its velocity is positive.'}],
    reasons:[{label:'Position tells where the car is; velocity tells how its position is changing.'},{label:'Any object to the right of zero must have positive velocity.'},{label:'Moving left makes every measurement negative.'}],
    correctAnswer:1,correctReason:0,
    explanation:'The car is still to the right of zero, so its position is positive. Moving left makes its velocity negative.'
  },
  {
    id:'KIN-02',concept:'Speed and velocity',difficulty:'introductory',
    misconception:'Speed and velocity are identical quantities.',
    prompt:'Car A moves right at 10 m/s. Car B moves left at 10 m/s. What do they share?',
    answers:[{label:'The same velocity, but different speeds.'},{label:'Neither speed nor velocity is the same.'},{label:'The same speed, but different velocities.'}],
    reasons:[{label:'Direction changes speed but not velocity.'},{label:'Speed tells only how fast; velocity also includes direction.'},{label:'The word “velocity” is simply another word for speed.'}],
    correctAnswer:2,correctReason:1,
    explanation:'Both speedometers read 10 m/s. Their velocities differ because the cars move in opposite directions.'
  },
  {
    id:'KIN-03',concept:'Acceleration and braking',difficulty:'developing',
    misconception:'Negative acceleration always means an object is moving backward.',
    prompt:'A car is moving right and slowing down. What are the signs of its velocity and acceleration?',
    answers:[{label:'Velocity positive; acceleration negative.'},{label:'Velocity and acceleration both negative.'},{label:'Velocity negative; acceleration positive.'}],
    reasons:[{label:'Braking immediately makes the car move backward.'},{label:'Slowing down means velocity must already be zero.'},{label:'The car still moves right, but acceleration points against that motion.'}],
    correctAnswer:0,correctReason:2,
    explanation:'The velocity remains positive until the car stops. The negative acceleration reduces that positive velocity.'
  },
  {
    id:'KIN-04',concept:'Position–time graph slope',difficulty:'developing',
    misconception:'The height of a position–time graph shows the object’s speed.',
    prompt:'A position–time graph rises in a straight, steep line. What does that mean?',
    answers:[{label:'The object is stopped at a large position.'},{label:'The object has constant positive acceleration.'},{label:'The object moves in the positive direction at constant velocity.'}],
    reasons:[{label:'A high line always means high speed.'},{label:'A constant positive slope means a constant positive velocity.'},{label:'Every rising line must curve upward.'}],
    correctAnswer:2,correctReason:1,
    explanation:'Velocity is the slope of the position–time graph. A straight line has constant slope, so the velocity is constant.'
  },
  {
    id:'KIN-05',concept:'Zero velocity',difficulty:'introductory',
    misconception:'An object with zero velocity must be located at position zero.',
    prompt:'The position–time graph is flat at 40 m for three seconds. What is happening?',
    answers:[{label:'The object is stopped at 40 m.'},{label:'The object moves at 40 m/s.'},{label:'The object has returned to 0 m.'}],
    reasons:[{label:'Its position is not changing, so its velocity is zero.'},{label:'A flat graph always lies on the zero axis.'},{label:'The graph height is the velocity.'}],
    correctAnswer:0,correctReason:0,
    explanation:'The object can be stopped anywhere. A flat position line means no change in position and therefore zero velocity.'
  },
  {
    id:'KIN-06',concept:'Constant acceleration',difficulty:'developing',
    misconception:'Constant acceleration means constant velocity.',
    prompt:'A car has a constant acceleration of +3 m/s². What happens to its velocity each second?',
    answers:[{label:'It stays at 3 m/s.'},{label:'It increases by 3 m every second.'},{label:'It increases by 3 m/s each second.'}],
    reasons:[{label:'Acceleration and velocity use the same units.'},{label:'Acceleration measures the change in velocity per second.'},{label:'Constant acceleration means nothing changes.'}],
    correctAnswer:2,correctReason:1,
    explanation:'The unit m/s² means “metres per second of velocity added each second.”'
  },
  {
    id:'KIN-07',concept:'Horizontal projectile motion',difficulty:'developing',
    misconception:'Gravity gradually reduces a projectile’s horizontal velocity.',
    prompt:'Ignoring air resistance, what happens to a basketball’s horizontal velocity after launch?',
    answers:[{label:'It stays constant.'},{label:'It steadily decreases to zero.'},{label:'It increases because gravity pulls it forward.'}],
    reasons:[{label:'Gravity acts equally in every direction.'},{label:'Any object in the air must lose all of its velocity.'},{label:'Gravity acts vertically, so there is no horizontal acceleration.'}],
    correctAnswer:0,correctReason:2,
    explanation:'Gravity changes the vertical velocity. With air resistance ignored, nothing changes the horizontal velocity.'
  },
  {
    id:'KIN-08',concept:'Projectile at peak height',difficulty:'challenging',
    misconception:'At the top of a projectile’s path, both velocity and acceleration are zero.',
    prompt:'At the highest point of a basketball’s flight, what is true?',
    answers:[{label:'Velocity and acceleration are both zero.'},{label:'Acceleration points upward before the ball falls.'},{label:'Vertical velocity is zero, but acceleration is still downward.'}],
    reasons:[{label:'Gravity continues pulling downward even during the instant the ball stops rising.'},{label:'An object cannot accelerate when its velocity is zero.'},{label:'The ball needs an upward force to begin falling.'}],
    correctAnswer:2,correctReason:0,
    explanation:'The vertical velocity is zero for an instant at the peak, but gravity still provides about 9.8 m/s² of downward acceleration.'
  },
  {
    id:'KIN-09',concept:'Two-dimensional motion',difficulty:'developing',
    misconception:'Horizontal and vertical projectile motions must change one another.',
    prompt:'Why can we study a basketball’s horizontal and vertical motion separately?',
    answers:[{label:'The ball moves horizontally first and vertically afterward.'},{label:'The two velocity components follow different rules and combine to make one path.'},{label:'Only the vertical motion is real.'}],
    reasons:[{label:'An object cannot move in two directions at the same time.'},{label:'Horizontal motion stops whenever vertical motion changes.'},{label:'Gravity changes the vertical component but, without air resistance, not the horizontal component.'}],
    correctAnswer:1,correctReason:2,
    explanation:'The ball moves horizontally and vertically at the same time. Treating the components separately makes the curved motion easier to understand.'
  },
  {
    id:'KIN-10',concept:'Stopping distance',difficulty:'challenging',
    misconception:'Stopping distance includes only the distance travelled after the brake is pressed.',
    prompt:'A driver takes time to react before braking. Which distances belong in the total stopping distance?',
    answers:[{label:'Braking distance only.'},{label:'Reaction distance plus braking distance.'},{label:'Reaction distance only.'}],
    reasons:[{label:'Distance travelled before touching the brake does not count.'},{label:'The car keeps moving during the reaction time and continues moving while the brakes slow it.'},{label:'The car stops at the instant the brake is pressed.'}],
    correctAnswer:1,correctReason:1,
    explanation:'Stopping begins when the hazard is noticed, not when the brake is pressed. Both parts of the motion use road.'
  }
];
