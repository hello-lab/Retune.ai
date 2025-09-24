"use client";
import { usePerformance } from "@/contexts/PerformanceContext";
import { Button } from "@/components/ui/button";

export function PerformanceToggle() {
  const { highPerformanceMode, togglePerformanceMode } = usePerformance();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={togglePerformanceMode}
      title={`Switch to ${highPerformanceMode ? 'normal' : 'high performance'} mode`}
      className="h-8 w-8 px-0"
    >
      {highPerformanceMode ? "🚀" : "🎨"}
    </Button>
  );
}