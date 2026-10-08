// Timer state is plain data so it can be saved to localStorage and
// shared between the main window and the pop-out window.
//
// A running timer stores the timestamp it ends at, not a counter, so it
// stays accurate when the browser throttles timers in background tabs.

export type TimerState =
  | { status: 'idle'; durationMs: number }
  | { status: 'running'; durationMs: number; endsAt: number }
  | { status: 'paused'; durationMs: number; remainingMs: number }
  | { status: 'done'; durationMs: number; endedAt: number };

export const initialState: TimerState = {
  status: 'idle',
  durationMs: 0,
};

export function start(durationMs: number, now: number): TimerState {
  return { status: 'running', durationMs, endsAt: now + durationMs };
}

export function pause(state: TimerState, now: number): TimerState {
  if (state.status !== 'running') return state;
  return {
    status: 'paused',
    durationMs: state.durationMs,
    remainingMs: Math.max(0, state.endsAt - now),
  };
}

export function resume(state: TimerState, now: number): TimerState {
  if (state.status !== 'paused') return state;
  return {
    status: 'running',
    durationMs: state.durationMs,
    endsAt: now + state.remainingMs,
  };
}

// Reset keeps the duration so the next round can start without
// typing the time again.
export function reset(state: TimerState): TimerState {
  return { status: 'idle', durationMs: state.durationMs };
}

// Turns a running timer whose end time has passed into a finished one.
export function settle(state: TimerState, now: number): TimerState {
  if (state.status === 'running' && now >= state.endsAt) {
    return {
      status: 'done',
      durationMs: state.durationMs,
      endedAt: state.endsAt,
    };
  }
  return state;
}

export function remainingMs(state: TimerState, now: number): number {
  switch (state.status) {
    case 'idle':
      return state.durationMs;
    case 'running':
      return Math.max(0, state.endsAt - now);
    case 'paused':
      return state.remainingMs;
    case 'done':
      return 0;
  }
}

export function toDurationMs(
  hours: number,
  minutes: number,
  seconds: number,
): number {
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

export function splitDuration(ms: number): [number, number, number] {
  const total = Math.round(ms / 1000);
  return [
    Math.floor(total / 3600),
    Math.floor((total % 3600) / 60),
    total % 60,
  ];
}

// Rounds up, so the label shows 00:00:01 until the very end.
export function formatTime(ms: number): string {
  const total = Math.ceil(ms / 1000);
  return [
    Math.floor(total / 3600),
    Math.floor((total % 3600) / 60),
    total % 60,
  ]
    .map(unit => String(unit).padStart(2, '0'))
    .join(':');
}

// Ring colour stops, as a fraction of the time remaining.
const COLOR_STOPS: [number, string][] = [
  [1, '#5dd9c1'], // green
  [0.33, '#ffbe86'], // orange
  [0.12, '#ff729f'], // red
  [0, '#ff729f'],
];

function hexToRgb(hex: string): number[] {
  return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
}

// Blends smoothly between the colour stops, the same way the
// react-countdown-circle-timer version did.
export function ringColor(fractionLeft: number): string {
  const f = Math.min(1, Math.max(0, fractionLeft));
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const [hiAt, hiColor] = COLOR_STOPS[i];
    const [loAt, loColor] = COLOR_STOPS[i + 1];
    if (f <= hiAt && f >= loAt) {
      const t = (hiAt - f) / (hiAt - loAt);
      const hi = hexToRgb(hiColor);
      const lo = hexToRgb(loColor);
      const rgb = hi.map((c, j) => Math.round(c + (lo[j] - c) * t));
      return `rgb(${rgb.join(', ')})`;
    }
  }
  return COLOR_STOPS[0][1];
}
