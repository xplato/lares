import { CheckIcon, PauseIcon, PlayIcon, TimerIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import {
  getRemainingMs,
  isCompleted,
  pauseTimer,
  removeTimer,
  resumeTimer,
  type Timer,
} from "@/lib/timers";
import { cn } from "@/lib/utils";

interface Props {
  timer: Timer;
}

function formatRemaining(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function ActiveTimerCard({ timer }: Props) {
  const remaining = getRemainingMs(timer);
  const completed = isCompleted(timer);
  const paused = timer.status === "paused";
  const progress = Math.min(
    1,
    Math.max(0, 1 - remaining / timer.durationMs),
  );

  return (
    <div
      className={cn(
        "bg-foreground/5 flex h-full flex-col gap-4 rounded-xl p-6 transition-colors duration-700",
        completed && "bg-emerald-500/10",
      )}
    >
      <div className="flex items-center gap-3">
        <TimerIcon
          className={cn(
            "size-5 shrink-0 transition-colors duration-700",
            completed
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-foreground/40",
          )}
        />
        <Text className="text-2xl font-medium tabular-nums">
          {completed ? "Done" : formatRemaining(remaining)}
        </Text>
      </div>

      <Progress
        value={progress * 100}
        className={cn("h-1.5", completed && "[&_[data-slot=progress-indicator]]:bg-emerald-500")}
      />

      <div className="flex items-center gap-2">
        {completed ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => removeTimer(timer.id)}
          >
            <CheckIcon />
            Dismiss
          </Button>
        ) : (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                paused ? resumeTimer(timer.id) : pauseTimer(timer.id)
              }
            >
              {paused ? <PlayIcon /> : <PauseIcon />}
              {paused ? "Resume" : "Pause"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeTimer(timer.id)}
            >
              <XIcon />
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
