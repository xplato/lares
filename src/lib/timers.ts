import store from "./store";

export type TimerStatus = "running" | "paused";

export interface Timer {
  id: string;
  durationMs: number;
  startedAt: number;
  pausedAt: number | null;
  accumulatedPauseMs: number;
  status: TimerStatus;
}

const STORAGE_KEY = "timers";
const TICK_MS = 250;

type Listener = () => void;

let timers: Timer[] = [];
let initialized = false;
let initPromise: Promise<void> | null = null;
const listeners = new Set<Listener>();
let tickInterval: ReturnType<typeof setInterval> | null = null;

function notify() {
  // Replace ref so useSyncExternalStore detects change.
  timers = timers.slice();
  listeners.forEach((l) => l());
}

async function persist() {
  try {
    await store.set(STORAGE_KEY, timers);
    await store.save();
  } catch (e) {
    console.error("Failed to persist timers", e);
  }
}

function ensureInitialized() {
  if (initialized) return;
  if (initPromise) return;
  initPromise = (async () => {
    try {
      const stored = await store.get<Timer[]>(STORAGE_KEY);
      if (Array.isArray(stored) && stored.length > 0) {
        timers = stored;
      }
    } catch (e) {
      console.error("Failed to load timers", e);
    } finally {
      initialized = true;
      notify();
      maybeStartTick();
    }
  })();
}

function maybeStartTick() {
  if (tickInterval !== null) return;
  if (timers.some((t) => t.status === "running")) {
    tickInterval = setInterval(notify, TICK_MS);
  }
}

function maybeStopTick() {
  if (tickInterval === null) return;
  if (!timers.some((t) => t.status === "running")) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
}

export function getTimers(): Timer[] {
  return timers;
}

export function subscribeTimers(listener: Listener): () => void {
  ensureInitialized();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function createTimer(durationMs: number): Timer {
  const t: Timer = {
    id: crypto.randomUUID(),
    durationMs,
    startedAt: Date.now(),
    pausedAt: null,
    accumulatedPauseMs: 0,
    status: "running",
  };
  timers = [...timers, t];
  persist();
  notify();
  maybeStartTick();
  return t;
}

export function pauseTimer(id: string) {
  const now = Date.now();
  let changed = false;
  timers = timers.map((t) => {
    if (t.id !== id || t.status !== "running") return t;
    changed = true;
    return { ...t, status: "paused", pausedAt: now };
  });
  if (!changed) return;
  persist();
  notify();
  maybeStopTick();
}

export function resumeTimer(id: string) {
  const now = Date.now();
  let changed = false;
  timers = timers.map((t) => {
    if (t.id !== id || t.status !== "paused" || t.pausedAt === null) return t;
    changed = true;
    return {
      ...t,
      status: "running",
      pausedAt: null,
      accumulatedPauseMs: t.accumulatedPauseMs + (now - t.pausedAt),
    };
  });
  if (!changed) return;
  persist();
  notify();
  maybeStartTick();
}

export function removeTimer(id: string) {
  const next = timers.filter((t) => t.id !== id);
  if (next.length === timers.length) return;
  timers = next;
  persist();
  notify();
  maybeStopTick();
}

function elapsedRunningMs(t: Timer, now: number): number {
  const reference =
    t.status === "paused" && t.pausedAt !== null ? t.pausedAt : now;
  return Math.max(0, reference - t.startedAt - t.accumulatedPauseMs);
}

export function getRemainingMs(t: Timer, now: number = Date.now()): number {
  return Math.max(0, t.durationMs - elapsedRunningMs(t, now));
}

export function isCompleted(t: Timer, now: number = Date.now()): boolean {
  return elapsedRunningMs(t, now) >= t.durationMs;
}
