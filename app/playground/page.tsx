import type { Metadata } from "next";
import Link from "next/link";
import {
  createCatalogCoveragePrompt,
  createCatalogOverviewPrompt,
  createToonProtocol,
} from "@toon-ui/core";
import { ToonPlayground } from "@/components/toon-playground";
import { buildPageMetadata } from "@/lib/metadata";
import { ThemeToggle } from "@/components/theme-toggle";
import { playgroundToonComponentKeys } from "@/lib/toon-catalog";

export const metadata: Metadata = buildPageMetadata({
  title: "Try ToonUI in a Real Chat Playground",
  description:
    "Talk to a real model, inspect the generated ToonUI blocks, and see how structured chat UI works inside a real app flow.",
  path: "/playground",
  keywords: [
    "ToonUI playground",
    "chat playground",
    "structured UI",
    "AI chat app",
    "ToonUI syntax",
  ],
});

function getPromptStats(prompt: string) {
  return {
    characters: prompt.length,
    lines: prompt.split("\n").length,
    words: prompt.trim().split(/\s+/).filter(Boolean).length,
  };
}

export default function PlaygroundPage() {
  const createPlaygroundProtocol = createToonProtocol as unknown as (options: {
    components: typeof playgroundToonComponentKeys;
  }) => ReturnType<typeof createToonProtocol>;
  const createPlaygroundOverviewPrompt =
    createCatalogOverviewPrompt as unknown as (
      catalog: ReturnType<typeof createToonProtocol>["catalog"],
    ) => string;
  const createPlaygroundCoveragePrompt =
    createCatalogCoveragePrompt as unknown as (
      catalog: ReturnType<typeof createToonProtocol>["catalog"],
    ) => string;

  const toon = createPlaygroundProtocol({
    components: playgroundToonComponentKeys,
  });
  const catalogOverviewPrompt = createPlaygroundOverviewPrompt(toon.catalog);
  const catalogCoveragePrompt = createPlaygroundCoveragePrompt(toon.catalog);
  const fullPrompt = toon.prompt;

  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <header className="flex items-center justify-between gap-4 border-b px-4 py-4">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Toon<span className="text-primary">UI</span>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-4 text-sm text-muted-foreground">
          <Link href="/docs" className="transition hover:text-foreground">
            Docs
          </Link>
          <Link href="/playground" className="transition hover:text-foreground">
            Playground
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      <div className="min-h-0 flex-1">
        <ToonPlayground
          catalogOverviewPrompt={catalogOverviewPrompt}
          catalogCoveragePrompt={catalogCoveragePrompt}
          fullPrompt={fullPrompt}
          promptStats={getPromptStats(fullPrompt)}
        />
      </div>
    </main>
  );
}
