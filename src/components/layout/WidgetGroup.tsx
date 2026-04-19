import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface WidgetGroupContextValue {
  activeId: string | null;
  toggle: (id: string) => void;
  deactivate: () => void;
}

const WidgetGroupContext = createContext<WidgetGroupContextValue | null>(null);

export function useWidgetGroup() {
  const ctx = useContext(WidgetGroupContext);
  if (!ctx) {
    throw new Error("Widget must be rendered inside a WidgetGroup");
  }
  return ctx;
}

export default function WidgetGroup({ children }: PropsWithChildren) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [parent] = useAutoAnimate({ duration: 200, easing: "ease-out" });

  const toggle = useCallback((id: string) => {
    setActiveId((current) => (current === id ? null : id));
  }, []);

  const deactivate = useCallback(() => setActiveId(null), []);

  const value = useMemo(
    () => ({ activeId, toggle, deactivate }),
    [activeId, toggle, deactivate],
  );

  return (
    <WidgetGroupContext.Provider value={value}>
      <div ref={parent} className="grid grid-cols-8 gap-4">
        {children}
      </div>
    </WidgetGroupContext.Provider>
  );
}
