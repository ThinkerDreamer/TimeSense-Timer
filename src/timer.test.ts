import { describe, expect, test } from 'vitest';
import {
  formatTime,
  pause,
  remainingMs,
  reset,
  resume,
  ringColor,
  settle,
  splitDuration,
  start,
  toDurationMs,
} from './timer';

const MIN = 60_000;

describe('timer state', () => {
  test('counts down from the end time, not a counter', () => {
    const state = start(25 * MIN, 1000);
    expect(remainingMs(state, 1000)).toBe(25 * MIN);
    // e.g. a background tab that didn't tick for 10 minutes
    expect(remainingMs(state, 1000 + 10 * MIN)).toBe(15 * MIN);
  });

  test('pause keeps the remaining time, resume picks it up', () => {
    const running = start(10 * MIN, 0);
    const paused = pause(running, 4 * MIN);
    expect(remainingMs(paused, 100 * MIN)).toBe(6 * MIN);

    const resumed = resume(paused, 100 * MIN);
    expect(remainingMs(resumed, 101 * MIN)).toBe(5 * MIN);
  });

  test('settles into done once the end time passes', () => {
    const running = start(MIN, 0);
    expect(settle(running, MIN - 1)).toBe(running);
    expect(settle(running, MIN + 500)).toEqual({
      status: 'done',
      durationMs: MIN,
      endedAt: MIN,
    });
  });

  test('reset keeps the duration for the next round', () => {
    const done = settle(start(25 * MIN, 0), 25 * MIN);
    expect(reset(done)).toEqual({
      status: 'idle',
      durationMs: 25 * MIN,
    });
  });

  test('pause and resume ignore the wrong states', () => {
    const idle = reset(start(MIN, 0));
    expect(pause(idle, 0)).toBe(idle);
    expect(resume(idle, 0)).toBe(idle);
  });
});

describe('formatting', () => {
  test('formats hours, minutes and seconds', () => {
    expect(formatTime(0)).toBe('00:00:00');
    expect(formatTime(toDurationMs(1, 0, 0))).toBe('01:00:00');
    expect(formatTime(toDurationMs(0, 25, 3))).toBe('00:25:03');
  });

  test('rounds up partial seconds', () => {
    expect(formatTime(1)).toBe('00:00:01');
    expect(formatTime(59_001)).toBe('00:01:00');
  });

  test('splits a duration back into fields', () => {
    expect(splitDuration(toDurationMs(1, 2, 3))).toEqual([1, 2, 3]);
  });
});

describe('ring color', () => {
  test('goes green to orange to red', () => {
    expect(ringColor(1)).toBe('rgb(93, 217, 193)');
    expect(ringColor(0.33)).toBe('rgb(255, 190, 134)');
    expect(ringColor(0.12)).toBe('rgb(255, 114, 159)');
    expect(ringColor(0)).toBe('rgb(255, 114, 159)');
  });
});
