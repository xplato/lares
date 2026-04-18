import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, LayoutGroup } from "motion/react";

interface WidgetGroupContextValue {
  activeId: string | null;
  toggle: (id: string) => void;
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

  const toggle = useCallback((id: string) => {
    setActiveId((current) => (current === id ? null : id));
  }, []);

  const value = useMemo(() => ({ activeId, toggle }), [activeId, toggle]);

  return (
    <WidgetGroupContext.Provider value={value}>
      <LayoutGroup>
        <div className="grid grid-cols-3 grid-rows-2 gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {children}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </WidgetGroupContext.Provider>
  );
}
