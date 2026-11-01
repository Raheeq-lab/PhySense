/** Braking only: the origin is where the brake is applied, after reaction. */
export const INITIAL_VELOCITY = 15;
export const BRAKING_ACCELERATION = -6;
export const STOP_TIME = 2.5;
export const STOP_DISTANCE = 18.75;

export function brakingAt(seconds: number) {
  const t = Math.max(0, Math.min(STOP_TIME, Number.isFinite(seconds) ? seconds : 0));
  return {
    t,
    velocity: INITIAL_VELOCITY + BRAKING_ACCELERATION * t,
    position: INITIAL_VELOCITY * t + 0.5 * BRAKING_ACCELERATION * t * t,
    acceleration: t < STOP_TIME ? BRAKING_ACCELERATION : 0,
  };
}
