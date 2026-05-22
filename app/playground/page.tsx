import type { Metadata } from "next";
import Link from "next/link";
import { ToonPlayground } from "@/components/toon-playground";
import { buildPageMetadata } from "@/lib/metadata";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildPageMetadata({
  title: "Try ToonUI Live in the Playground",
  description:
    "Write ToonUI, preview the rendered interface instantly, and learn how AI-generated UI behaves before you ship it.",
  path: "/playground",
  keywords: [
    "ToonUI playground",
    "interactive docs",
    "ToonUI syntax",
    "AI playground",
    "component catalog",
  ],
});

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6 md:px-10">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Toon<span className="text-primary">UI</span>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2">
          <Button asChild size="sm">
            <Link href="/playground">Try playground</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/docs">Docs</Link>
          </Button>

          <ThemeToggle />
        </nav>
      </header>
      <ToonPlayground />
    </main>
  );
}
