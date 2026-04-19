import { useState } from "react";
import { useWidgetGroup } from "@/components/layout/WidgetGroup";
import { Text } from "@/components/ui/text";
import { createTimer } from "@/lib/timers";
import { cn } from "@/lib/utils";
import { CheckIcon, DeleteIcon } from "lucide-react";

type Key = string;

const KEYS: Key[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "delete",
  "0",
  "enter",
];

const MAX_DIGITS = 4;

export default function CreateTimerWidget() {
  const [value, setValue] = useState("");
  const { deactivate } = useWidgetGroup();

  const minutes = Number(value);
  const canSubmit = Number.isFinite(minutes) && minutes > 0;

  const press = (k: Key) => {
    if (k === "delete") {
      setValue((v) => v.slice(0, -1));
      return;
    }
    if (k === "enter") {
      if (!canSubmit) return;
      createTimer(minutes * 60_000);
      setValue("");
      deactivate();
      return;
    }
    setValue((v) => (v + k).slice(0, MAX_DIGITS));
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-baseline justify-center gap-2">
        <Text
          className={cn(
            "text-5xl font-medium tracking-tight tabular-nums transition-opacity",
            value.length === 0 && "opacity-30",
          )}
        >
          {value || "0"}
        </Text>
        <Text className="text-xl opacity-60">min</Text>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {KEYS.map((k) => {
          const isEnter = k === "enter";
          const isDelete = k === "delete";
          const disabled = isEnter && !canSubmit;
          return (
            <button
              key={k}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                press(k);
              }}
              disabled={disabled}
              className={cn(
                "bg-foreground/5 hover:bg-foreground/10 active:bg-foreground/15 flex h-14 items-center justify-center rounded-lg text-2xl font-medium tabular-nums transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                isEnter &&
                  "bg-primary/15 hover:bg-primary/25 active:bg-primary/30 text-primary",
                isDelete && "text-foreground/70",
              )}
              aria-label={isDelete ? "Delete" : isEnter ? "Start timer" : k}
            >
              {isDelete ? (
                <DeleteIcon className="size-6" />
              ) : isEnter ? (
                <CheckIcon className="size-6" />
              ) : (
                k
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
