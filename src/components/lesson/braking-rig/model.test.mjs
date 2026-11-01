import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brakingAt } from './model.ts';

test('braking begins at the origin and clamps at rest without reversing', () => {
  assert.deepEqual(brakingAt(0), { t: 0, velocity: 15, position: 0, acceleration: -6 });
  assert.deepEqual(brakingAt(2.5), { t: 2.5, velocity: 0, position: 18.75, acceleration: 0 });
  assert.deepEqual(brakingAt(30), brakingAt(2.5));
  assert.deepEqual(brakingAt(-1), brakingAt(0));
});
test('position increases while velocity decreases throughout braking', () => {
  let previous = brakingAt(0);
  for (let i = 1; i <= 250; i++) {
    const current = brakingAt(i / 100);
    assert.ok(current.position > previous.position);
    assert.ok(current.velocity < previous.velocity);
    const meanVelocity = (current.velocity + previous.velocity) / 2;
    assert.ok(Math.abs((current.position - previous.position) / .01 - meanVelocity) < 1e-9);
    previous = current;
  }
});
test('midpoint has half the velocity but three quarters of the braking distance', () => {
  const middle = brakingAt(1.25);
  assert.equal(middle.velocity, 7.5);
  assert.equal(middle.position, 14.0625);
});
