import { useSyncExternalStore } from "react";

import { getTimers, subscribeTimers, type Timer } from "@/lib/timers";

export default function useTimers(): Timer[] {
  return useSyncExternalStore(subscribeTimers, getTimers, getTimers);
}
