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
  understanding?:{prompt:string;options:DiagnosticOption[];correct:number;explanation:string};
  explanation:string;
};

export const kinematicsDiagnostic:DiagnosticItem[]=[
  {
    id:'KIN-01',concept:'Where the car is and which way it moves',difficulty:'introductory',
    misconception:'A car to the right of zero must always be moving right.',
    prompt:'A car uses GO and reaches +30 m. It stops, then uses REVERSE and starts moving left. Which answer is correct now?',
    answers:[{label:'The car is at +30 m and moving right.'},{label:'The car is at +30 m but moving left.'},{label:'The car is at −30 m and moving right.'}],
    reasons:[{label:'The car is still to the right of zero, but REVERSE makes it move left toward zero.'},{label:'A car at +30 m must always move right.'},{label:'As soon as the car moves left, its position becomes negative.'}],
    correctAnswer:1,correctReason:0,
    understanding:{prompt:'What big physics idea does this motion show?',options:[{label:'Position tells where the car is. Velocity tells which way it is moving.'},{label:'A positive position means the car must move right.'},{label:'BRAKE and REVERSE always mean the same thing.'}],correct:0,explanation:'This is 1D Kinematics. Position and velocity describe different parts of the motion. The car can be to the right of zero while moving left.'},
    explanation:'GO moved the car to +30 m, which is to the right of zero. BRAKE slowed the car until it stopped; braking did not instantly make it move left. REVERSE then made the car move left toward zero, so its velocity became negative. Its position stays positive until it passes 0 m.'
  },
  {
    id:'KIN-02',concept:'Speed and velocity',difficulty:'introductory',
    misconception:'Speed and velocity are identical quantities.',
    prompt:'Car A moves right at 10 m/s. Car B moves left at 10 m/s. What is the same?',
    answers:[{label:'Their velocities are the same, but their speeds are different.'},{label:'Their speeds and velocities are both different.'},{label:'Their speeds are the same, but their velocities are different.'}],
    reasons:[{label:'Direction changes speed, but not velocity.'},{label:'Speed tells us how fast. Velocity tells us how fast and which way.'},{label:'Speed and velocity always mean exactly the same thing.'}],
    correctAnswer:2,correctReason:1,
    understanding:{prompt:'What big physics idea does this example show?',options:[{label:'Two objects can have the same speed but different velocities because they move in different directions.'},{label:'Objects with the same speed must always have the same velocity.'},{label:'Direction changes speed, but it never changes velocity.'}],correct:0,explanation:'This is 1D Kinematics. Speed tells only how fast. Velocity tells how fast and in which direction.'},
    explanation:'Both speedometers read 10 m/s. Their velocities differ because the cars move in opposite directions.'
  },
  {
    id:'KIN-03',concept:'Acceleration and braking',difficulty:'developing',
    misconception:'Negative acceleration always means an object is moving backward.',
    prompt:'A car is moving right but slowing down. Which answer is correct?',
    answers:[{label:'Velocity is positive. Acceleration is negative.'},{label:'Velocity and acceleration are both negative.'},{label:'Velocity is negative. Acceleration is positive.'}],
    reasons:[{label:'Braking makes the car move backward straight away.'},{label:'A slowing car must already have stopped.'},{label:'The car still moves right, but its acceleration acts toward the left and slows it.'}],
    correctAnswer:0,correctReason:2,
    understanding:{prompt:'What big physics idea does this example show?',options:[{label:'Velocity tells which way the car moves now. Acceleration tells how that velocity is changing.'},{label:'Negative acceleration always means the car is already moving backward.'},{label:'A moving car cannot have acceleration in the opposite direction.'}],correct:0,explanation:'This is 1D Kinematics. The car can move right while acceleration acts left. The leftward acceleration reduces the rightward velocity until the car stops.'},
    explanation:'The car still moves right, so its velocity is positive. Its acceleration acts to the left, so the car slows down.'
  },
  {
    id:'KIN-04',concept:'Reading a position–time graph',difficulty:'developing',
    misconception:'The height of a position–time graph shows the object’s speed.',
    prompt:'A graph shows time along the bottom and position up the side. Its straight line goes up by the same amount every second. What does this mean?',
    answers:[{label:'The object is stopped.'},{label:'The object is speeding up.'},{label:'The object moves in the positive direction at a steady velocity.'}],
    reasons:[{label:'A high line always means a high speed.'},{label:'The line goes up by the same amount each second, so the velocity stays the same.'},{label:'Every line going up must be curved.'}],
    correctAnswer:2,correctReason:1,
    understanding:{prompt:'What big physics idea does this graph show?',options:[{label:'On a position–time graph, slope tells velocity. A straight rising line means steady positive velocity.'},{label:'The height of the line tells speed. A higher line always means faster movement.'},{label:'Any line going upward means the object must be speeding up.'}],correct:0,explanation:'This is graph reading in 1D Kinematics. The slope means how much position changes each second. When the slope stays the same, velocity stays the same.'},
    explanation:'Time is along the bottom. Position is up the side. The line rises by the same amount during every second, so position changes at a steady rate. That means steady positive velocity. The steepness of the line is called its slope.'
  },
  {
    id:'KIN-05',concept:'Zero velocity',difficulty:'introductory',
    misconception:'An object with zero velocity must be located at position zero.',
    prompt:'A position–time graph stays flat at 40 m for three seconds. During all three seconds, the object remains 40 m from zero. What is happening?',
    answers:[{label:'The object is stopped at 40 m.'},{label:'The object moves at 40 m/s.'},{label:'The object has returned to 0 m.'}],
    reasons:[{label:'The position does not change, so the object is not moving.'},{label:'A flat line must always be at 0 m.'},{label:'The height of the line tells us the velocity.'}],
    correctAnswer:0,correctReason:0,
    understanding:{prompt:'What big physics idea does this graph show?',options:[{label:'An object can be stopped away from zero. A flat position–time line means zero velocity.'},{label:'A flat line means the object is always at position zero.'},{label:'A line at 40 m means the object moves at 40 m/s.'}],correct:0,explanation:'This is graph reading in 1D Kinematics. The height of the line tells position. Its slope tells velocity. A flat line has zero slope, so velocity is zero.'},
    explanation:'The graph stays at 40 m, so the object remains 40 m from zero. Its position does not change during the three seconds. No change in position means zero velocity, so the object is stopped. It does not need to be at 0 m to be stopped.'
  },
  {
    id:'KIN-06',concept:'Constant acceleration',difficulty:'developing',
    misconception:'Constant acceleration means constant velocity.',
    prompt:'A car has an acceleration of +3 m/s². What happens to its velocity every second?',
    answers:[{label:'It stays at 3 m/s.'},{label:'It increases by 3 m every second.'},{label:'It increases by 3 m/s each second.'}],
    reasons:[{label:'Acceleration and velocity are the same thing.'},{label:'Acceleration tells us how much velocity changes every second.'},{label:'Constant acceleration means the velocity cannot change.'}],
    correctAnswer:2,correctReason:1,
    explanation:'+3 m/s² means the car gains 3 m/s of velocity every second.'
  },
  {
    id:'KIN-07',concept:'Side-to-side motion of a thrown ball',difficulty:'developing',
    misconception:'Gravity gradually reduces a thrown ball’s side-to-side velocity.',
    prompt:'Imagine there is no air resistance. After a basketball is thrown, what happens to its side-to-side velocity?',
    answers:[{label:'It stays constant.'},{label:'It steadily decreases to zero.'},{label:'It increases because gravity pulls it forward.'}],
    reasons:[{label:'Gravity pulls in every direction.'},{label:'Anything in the air must lose all its velocity.'},{label:'Gravity pulls downward, not sideways. So the side-to-side velocity stays the same.'}],
    correctAnswer:0,correctReason:2,
    explanation:'Gravity changes the ball’s up-and-down velocity. When we ignore air resistance, nothing changes its side-to-side velocity.'
  },
  {
    id:'KIN-08',concept:'Thrown ball at its highest point',difficulty:'challenging',
    misconception:'At the top of a thrown ball’s path, both velocity and acceleration are zero.',
    prompt:'A basketball reaches the highest point of its path. What is true at that moment?',
    answers:[{label:'Velocity and acceleration are both zero.'},{label:'Acceleration points upward before the ball falls.'},{label:'Vertical velocity is zero, but acceleration is still downward.'}],
    reasons:[{label:'The ball stops moving upward for one moment, but gravity still pulls it downward.'},{label:'An object cannot accelerate when it stops for one moment.'},{label:'An upward force is needed to make the ball fall.'}],
    correctAnswer:2,correctReason:0,
    explanation:'For one moment, the ball is not moving up or down. But gravity is still pulling it downward, so its downward acceleration is about 9.8 m/s².'
  },
  {
    id:'KIN-09',concept:'Two-dimensional motion',difficulty:'developing',
    misconception:'A thrown ball’s side-to-side and up-and-down movements must change one another.',
    prompt:'Why can we look at a basketball’s side-to-side and up-and-down movements separately?',
    answers:[{label:'The ball moves sideways first and moves up or down later.'},{label:'The two movements follow different rules, then join to make one curved path.'},{label:'Only the up-and-down movement is real.'}],
    reasons:[{label:'An object cannot move in two directions at the same time.'},{label:'Side-to-side movement stops when up-and-down movement changes.'},{label:'Gravity changes the up-and-down movement. If we ignore air resistance, it does not change the side-to-side movement.'}],
    correctAnswer:1,correctReason:2,
    explanation:'The ball moves side to side and up or down at the same time. Studying each movement on its own makes the curved path easier to understand.'
  },
  {
    id:'KIN-10',concept:'Stopping distance',difficulty:'challenging',
    misconception:'Stopping distance includes only the distance travelled after the brake is pressed.',
    prompt:'A driver sees danger. The driver takes some time to press the brake. What must we add to find the full stopping distance?',
    answers:[{label:'Only the distance travelled after pressing the brake.'},{label:'Distance travelled before pressing the brake, plus distance travelled while braking.'},{label:'Only the distance travelled before pressing the brake.'}],
    reasons:[{label:'Movement before the driver presses the brake does not count.'},{label:'The car moves while the driver reacts. It also moves while the brakes slow it down.'},{label:'The car stops as soon as the driver presses the brake.'}],
    correctAnswer:1,correctReason:1,
    explanation:'The car moves before the driver presses the brake and while the brakes slow it down. We must add both distances.'
  }
];
