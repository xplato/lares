import "./App.css";

import { useCallback, useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { BoltIcon, TimerIcon } from "lucide-react";
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
import WeatherWidget from "./modules/weather/WeatherWidget";


function AppContent() {
  const [showSettings, setShowSettings] = useState(false);
  const timers = useTimers();
  const { setMode } = useDynamicBackground();
  const [sectionRef] = useAutoAnimate({ duration: 200, easing: "ease-out" });

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
            <div ref={sectionRef} className="flex flex-col gap-4">
              {timers.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {timers.map((t) => (
                    <ActiveTimerCard key={t.id} timer={t} />
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Card
                  title="Review inbox"
                  subtitle="Updated just now"
                  upperMetaContent={"hi"}
                  lowerMetaContent={"bye"}
                >
                  <div className="bg-foreground/5 h-76 rounded-xl"></div>
                </Card>
              </div>
              <WidgetGroup>
                <Widget
                  icon={<TimerIcon className="size-full" />}
                  label="Timer"
                >
                  <CreateTimerWidget />
                </Widget>
                <Widget
                  icon={null}
                  label="Weather"
                  render={(isActive) => (
                    <WeatherWidget isActive={isActive} />
                  )}
                />
              </WidgetGroup>
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
