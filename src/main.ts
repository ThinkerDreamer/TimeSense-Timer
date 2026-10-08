import confetti from 'canvas-confetti';
import handpanUrl from './assets/handpan.wav';
import './style.css';
import {
  type TimerState,
  formatTime,
  initialState,
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

const STORAGE_KEY = 'timesense-timer-state';
// A finish older than this (e.g. seen on page load) gets no celebration.
const CELEBRATION_WINDOW_MS = 5000;

const $ = <T extends Element>(selector: string) =>
  document.querySelector<T>(selector)!;

const app = $<HTMLElement>('.app');
const label = $<HTMLElement>('.label');
const remainingPath = $<SVGPathElement>('.ring-remaining');
const form = $<HTMLFormElement>('.controls');
const inputs = {
  hours: $<HTMLInputElement>('#hours'),
  minutes: $<HTMLInputElement>('#minutes'),
  seconds: $<HTMLInputElement>('#seconds'),
};

const isPopout = new URLSearchParams(location.search).has('popout');
app.classList.toggle('is-popout', isPopout);

const sound = new Audio(handpanUrl);
sound.volume = 0.45;

// --- State, shared between windows through localStorage ---

function loadState(): TimerState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // Storage blocked or corrupt: start fresh.
  }
  return initialState;
}

let state = loadState();

function setState(next: TimerState) {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The timer still works in this window without storage.
  }
  onStateChange();
}

// Fires when another window (e.g. the pop-out) changes the state.
window.addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY) return;
  state = loadState();
  onStateChange();
});

// Only one window plays the sound when both are open. The first window
// to ask holds the lock until it closes, then the next one gets it.
let isSoundPlayer = !('locks' in navigator);
navigator.locks?.request(
  'timesense-timer-sound',
  () =>
    new Promise<never>(() => {
      isSoundPlayer = true;
    }),
);

// --- Rendering ---

function renderInputs() {
  const [h, m, s] = splitDuration(state.durationMs);
  // Leave a field alone while it's being typed into.
  const values = { hours: h, minutes: m, seconds: s };
  for (const [key, input] of Object.entries(inputs)) {
    if (document.activeElement === input) continue;
    const value = values[key as keyof typeof values];
    input.value = value ? String(value) : '';
  }
}

function renderTime() {
  const now = Date.now();
  const settled = settle(state, now);
  if (settled !== state) setState(settled);

  const left = remainingMs(state, now);
  const fractionLeft =
    state.durationMs > 0 ? left / state.durationMs : 1;

  const time = formatTime(left);
  if (label.dataset.time !== time) {
    label.dataset.time = time;
    // Each digit gets a span so they can blink while paused,
    // while the colons stay still.
    label.innerHTML = time.replace(
      /\d/g,
      d => `<span class="digit">${d}</span>`,
    );
  }
  remainingPath.style.strokeDashoffset = String(1 - fractionLeft);
  remainingPath.style.stroke = ringColor(fractionLeft);
  remainingPath.style.visibility =
    state.status === 'done' ? 'hidden' : 'visible';

  document.title =
    state.status === 'running' || state.status === 'paused'
      ? `${time} · TimeSense Timer`
      : 'TimeSense Timer';
}

let frame = 0;
let tickInterval = 0;
let endTimeout = 0;

function onStateChange() {
  app.dataset.status = state.status;
  renderInputs();
  renderTime();

  cancelAnimationFrame(frame);
  clearInterval(tickInterval);
  clearTimeout(endTimeout);

  if (state.status === 'running') {
    // Smooth ring while visible. Animation frames stop in background
    // tabs, so the interval keeps the tab title going and the timeout
    // makes sure the end sound plays on time.
    const loop = () => {
      renderTime();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    tickInterval = window.setInterval(renderTime, 1000);
    endTimeout = window.setTimeout(
      renderTime,
      state.endsAt - Date.now(),
    );
  }

  if (state.status === 'done') celebrate(state.endedAt);
}

let lastCelebrated = 0;

function celebrate(endedAt: number) {
  if (endedAt === lastCelebrated) return;
  lastCelebrated = endedAt;
  if (Date.now() - endedAt > CELEBRATION_WINDOW_MS) return;
  if (isSoundPlayer) {
    sound.currentTime = 0;
    sound.play().catch(() => {
      // Autoplay can be blocked in a window that was never clicked.
    });
  }
  if (!document.hidden) confetti();
}

// --- Controls ---

function inputDuration(): number {
  const read = (input: HTMLInputElement) =>
    Math.max(0, Math.floor(Number(input.value) || 0));
  return toDurationMs(
    read(inputs.hours),
    read(inputs.minutes),
    read(inputs.seconds),
  );
}

for (const input of Object.values(inputs)) {
  input.addEventListener('input', () => {
    setState({ status: 'idle', durationMs: inputDuration() });
  });
}

function startOrResume() {
  if (state.status === 'paused') {
    setState(resume(state, Date.now()));
  } else if (state.status === 'idle' || state.status === 'done') {
    const duration = inputDuration();
    if (duration > 0) setState(start(duration, Date.now()));
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  (document.activeElement as HTMLElement | null)?.blur();
  startOrResume();
});
$('.pause').addEventListener('click', () =>
  setState(pause(state, Date.now())),
);
$('.resume').addEventListener('click', startOrResume);
$('.reset').addEventListener('click', () => setState(reset(state)));

// Space starts, pauses and resumes, unless typing in a field
// or pressing a focused button.
document.addEventListener('keydown', event => {
  if (event.code !== 'Space') return;
  const target = event.target as HTMLElement;
  if (target.closest('input, button')) return;
  event.preventDefault();
  if (state.status === 'running') {
    setState(pause(state, Date.now()));
  } else {
    startOrResume();
  }
});

$('.popout').addEventListener('click', () => {
  const url = new URL(location.href);
  url.searchParams.set('popout', '');
  // Named window, so clicking again focuses the existing pop-out.
  window.open(
    url,
    'timesense-timer-popout',
    'popup,width=320,height=420',
  );
});

onStateChange();
