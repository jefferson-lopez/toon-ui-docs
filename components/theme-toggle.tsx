"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant={isDark ? "outline" : "default"}
        size="icon"
        aria-label="Switch to light theme"
        onClick={() => setTheme("light")}
      >
        <Sun className="size-4" />
      </Button>
      <Button
        type="button"
        variant={isDark ? "default" : "outline"}
        size="icon"
        aria-label="Switch to dark theme"
        onClick={() => setTheme("dark")}
      >
        <Moon className="size-4" />
      </Button>
    </div>
  );
}
