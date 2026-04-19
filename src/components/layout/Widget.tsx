import { useId } from "react";

import { cn } from "@/lib/utils";

import { Text } from "../ui/text";
import { useWidgetGroup } from "./WidgetGroup";

type ChildrenOrRender =
  | { children?: React.ReactNode; render?: never }
  | { children?: never; render: (isActive: boolean) => React.ReactNode };

interface Props {
  icon: React.ReactNode;
  label: string;
}

export default function Widget({
  icon,
  label,
  children,
  render,
}: Props & ChildrenOrRender) {
  const id = useId();
  const { activeId, toggle } = useWidgetGroup();

  const isActive = activeId === id;
  const isHidden = activeId !== null && !isActive;

  if (isHidden) return null;

  return (
    <div
      onClick={() => toggle(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle(id);
        }
      }}
      className={cn(
        "bg-foreground/5 hover:bg-foreground/8 text-foreground flex cursor-pointer flex-col items-start justify-between gap-4 rounded-xl p-8 transition-colors duration-300 outline-none",
        isActive && "cursor-default col-span-3",
      )}
    >
      {render ? (
        render(isActive)
      ) : (
        <>
          {!isActive && (
            <>
              <div className="flex size-12 items-center justify-center">
                {icon}
              </div>
              <div>
                <Text className="text-2xl font-medium">{label}</Text>
              </div>
            </>
          )}

          {isActive && children && (
            <div className="w-full cursor-default">{children}</div>
          )}
        </>
      )}
    </div>
  );
}
