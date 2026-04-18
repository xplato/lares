import { PropsWithChildren, useId } from "react";
import { AnimatePresence, motion } from "motion/react";

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

  return (
    <motion.button
      layout
      onClick={() => toggle(id)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 36 }}
      style={{ borderRadius: 12 }}
      className={cn(
        "bg-foreground/5 hover:bg-foreground/8 text-foreground flex flex-col items-start justify-between gap-4 p-8 transition-colors duration-300",
        isActive && "col-span-3 row-span-2",
      )}
    >
      <motion.div
        layout="position"
        className="flex size-12 items-center justify-center"
      >
        {icon}
      </motion.div>

      <motion.div layout="position">
        <Text className="text-2xl font-medium">{label}</Text>
      </motion.div>

      <AnimatePresence initial={false}>
        {isActive && children && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
