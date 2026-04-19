import { PropsWithChildren, useId } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { Text } from "../ui/text";
import { useWidgetGroup } from "./WidgetGroup";

interface Props {
  icon: React.ReactNode;
  label: string;
}

export default function Widget({
  icon,
  label,
  children,
}: PropsWithChildren<Props>) {
  const id = useId();
  const { activeId, toggle } = useWidgetGroup();

  const isActive = activeId === id;
  const isHidden = activeId !== null && !isActive;

  if (isHidden) return null;

  // Render as motion.div (not button) so children can host interactive
  // elements like the timer keypad without nesting buttons.
  return (
    <motion.div
      layout
      onClick={isActive ? undefined : () => toggle(id)}
      role={isActive ? undefined : "button"}
      tabIndex={isActive ? undefined : 0}
      onKeyDown={
        isActive
          ? undefined
          : (e) => {
              if (e.target !== e.currentTarget) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(id);
              }
            }
      }
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 36 }}
      style={{ borderRadius: 12, overflow: "hidden" }}
      className={cn(
        "bg-foreground/5 hover:bg-foreground/8 text-foreground flex cursor-pointer flex-col items-start justify-between gap-4 p-8 transition-colors duration-300 outline-none",
        isActive && "cursor-default col-span-3",
      )}
    >
      {!isActive && (
        <>
          <div className="flex size-12 items-center justify-center">{icon}</div>
          <div>
            <Text className="text-2xl font-medium">{label}</Text>
          </div>
        </>
      )}

      {isActive && children && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full cursor-default"
        >
          {children}
        </div>
      )}
    </motion.div>
  );
}
