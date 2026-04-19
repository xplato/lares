import "./App.css";

import { useCallback, useEffect, useState } from "react";
import { BoltIcon, TimerIcon } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Toaster } from "sonner";

import Card from "./components/layout/Card";
import Section from "./components/layout/Section";
import Widget from "./components/layout/Widget";
import WidgetGroup from "./components/layout/WidgetGroup";
import { SettingsPage } from "./components/settings";
import Theme from "./components/settings/Theme";
import { Button } from "./components/ui/button";
import ActiveTimerCard from "./components/widgets/ActiveTimerCard";
import CreateTimerWidget from "./components/widgets/CreateTimerWidget";
import useDynamicBackground from "./hooks/useDynamicBackground";
import useTimers from "./hooks/useTimers";
import { isCompleted } from "./lib/timers";
import WeatherCard from "./modules/weather/WeatherCard";

const LAYOUT_TRANSITION = { type: "spring", stiffness: 380, damping: 36 } as const;
const ITEM_INITIAL = { opacity: 0, scale: 0.95 };
const ITEM_ANIMATE = { opacity: 1, scale: 1 };
const ITEM_EXIT = { opacity: 0, scale: 0.95 };

function AppContent() {
  const [showSettings, setShowSettings] = useState(false);
  const timers = useTimers();
  const { setMode } = useDynamicBackground();

  const toggleSettings = useCallback(() => {
    setShowSettings((prev) => !prev);
  }, []);

  // Global keyboard shortcut: Cmd+, to toggle settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ",") {
        e.preventDefault();
        toggleSettings();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSettings]);

  // Drive background mode from completed timers.
  useEffect(() => {
    const anyCompleted = timers.some((t) => isCompleted(t));
    setMode(anyCompleted ? "success" : "default");
  }, [timers, setMode]);

  if (showSettings) {
    return <SettingsPage onBack={toggleSettings} />;
  }

  return (
    <div className="flex h-full flex-col">
      <div data-tauri-drag-region className="h-10 w-full">
        <div
          data-tauri-drag-region
          className="border-border grid h-10 grid-cols-3 border-b"
        >
          <div
            data-tauri-drag-region
            className="flex flex-row items-center justify-start"
          ></div>
          <div
            data-tauri-drag-region
            className="flex flex-row items-center justify-center"
          >
            <p className="text-sm">Lares</p>
          </div>
          <div
            data-tauri-drag-region
            className="flex flex-row items-center justify-end pr-2"
          >
            <Button
              onClick={() => setShowSettings(true)}
              size="icon-sm"
              variant="ghost"
              className="text-neutral-500"
            >
              <BoltIcon />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-12 pt-24">
        <div className="flex flex-col items-start justify-start gap-32">
          <Section title="Today">
            <LayoutGroup id="today-grid">
              <motion.div layout className="grid grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout" initial={false}>
                  {timers.map((t) => (
                    <motion.div
                      key={t.id}
                      layout
                      initial={ITEM_INITIAL}
                      animate={ITEM_ANIMATE}
                      exit={ITEM_EXIT}
                      transition={LAYOUT_TRANSITION}
                    >
                      <ActiveTimerCard timer={t} />
                    </motion.div>
                  ))}
                  <motion.div
                    key="inbox"
                    layout
                    initial={ITEM_INITIAL}
                    animate={ITEM_ANIMATE}
                    exit={ITEM_EXIT}
                    transition={LAYOUT_TRANSITION}
                  >
                    <Card
                      title="Review inbox"
                      subtitle="Updated just now"
                      upperMetaContent={"hi"}
                      lowerMetaContent={"bye"}
                    >
                      <div className="bg-foreground/5 h-76 rounded-xl"></div>
                    </Card>
                  </motion.div>
                  <motion.div
                    key="widgets"
                    initial={ITEM_INITIAL}
                    animate={ITEM_ANIMATE}
                    exit={ITEM_EXIT}
                    transition={LAYOUT_TRANSITION}
                  >
                    <WidgetGroup>
                      <Widget
                        icon={<TimerIcon className="size-full" />}
                        label="Timer"
                      >
                        <CreateTimerWidget />
                      </Widget>
                    </WidgetGroup>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          </Section>
          <Section title="Weather">
            <div className="grid grid-cols-2 gap-8">
              <WeatherCard />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Theme />
      <Toaster />
      <main className="h-full">
        <AppContent />
      </main>
    </>
  );
}

export default App;
