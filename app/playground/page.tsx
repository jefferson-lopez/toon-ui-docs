import Link from "next/link";
import { ToonPlayground } from "@/components/toon-playground";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6 md:px-10">
        <Link href="/" className="text-xl font-semibold tracking-tight text-foreground">
          Toon<span className="text-primary">UI</span>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2">
          <Button asChild size="sm">
            <Link href="/playground">Try playground</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/docs">Docs</Link>
          </Button>
          <Button variant="outline" size="sm" disabled>
            AI Chat · Soon
          </Button>
          <ThemeToggle />
        </nav>
      </header>
      <ToonPlayground />
    </main>
  );
}
