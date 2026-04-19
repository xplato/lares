import { CheckIcon, PauseIcon, PlayIcon, TimerIcon, XIcon } from "lucide-react";

import Card from "@/components/layout/Card";
import { Button } from "@/components/ui/button";
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

function formatDurationLabel(ms: number): string {
  const minutes = Math.round(ms / 60_000);
  return `${minutes} min timer`;
}

export default function ActiveTimerCard({ timer }: Props) {
  const remaining = getRemainingMs(timer);
  const completed = isCompleted(timer);
  const paused = timer.status === "paused";
  const progress = Math.min(
    1,
    Math.max(0, 1 - remaining / timer.durationMs),
  );

  const status = completed
    ? "Time's up"
    : paused
      ? "Paused"
      : formatDurationLabel(timer.durationMs);

  return (
    <div
      className={cn(
        "rounded-xl transition-colors duration-700",
        completed && "bg-emerald-500/10",
      )}
    >
      <Card
        title={completed ? "Done" : formatRemaining(remaining)}
        subtitle={status}
        lowerMetaContent={
          <div className="flex flex-wrap items-center gap-2">
            {completed ? (
              <Button
                variant="default"
                onClick={() => removeTimer(timer.id)}
              >
                <CheckIcon />
                Dismiss
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() =>
                    paused ? resumeTimer(timer.id) : pauseTimer(timer.id)
                  }
                >
                  {paused ? <PlayIcon /> : <PauseIcon />}
                  {paused ? "Resume" : "Pause"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => removeTimer(timer.id)}
                >
                  <XIcon />
                  Cancel
                </Button>
              </>
            )}
          </div>
        }
      >
        <div
          className={cn(
            "relative flex h-76 items-center justify-center overflow-hidden rounded-xl transition-colors duration-700",
            completed ? "bg-emerald-500/20" : "bg-foreground/5",
          )}
        >
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 transition-all duration-500",
              completed ? "bg-emerald-500/30" : "bg-foreground/5",
            )}
            style={{ height: `${progress * 100}%` }}
          />
          <TimerIcon
            className={cn(
              "relative size-24 transition-colors duration-700",
              completed
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-foreground/40",
            )}
          />
        </div>
      </Card>
    </div>
  );
}
