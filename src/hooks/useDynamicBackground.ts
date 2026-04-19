import { useSyncExternalStore } from "react";

export type BackgroundMode = "default" | "success" | "warning" | "error";

type Listener = () => void;

let currentMode: BackgroundMode = "default";
const listeners = new Set<Listener>();

function applyToDom(mode: BackgroundMode) {
  if (typeof document === "undefined") return;
  if (mode === "default") {
    delete document.documentElement.dataset.bgMode;
  } else {
    document.documentElement.dataset.bgMode = mode;
  }
}

function setMode(mode: BackgroundMode) {
  if (mode === currentMode) return;
  currentMode = mode;
  applyToDom(mode);
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return currentMode;
}

export default function useDynamicBackground() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { mode, setMode };
}
