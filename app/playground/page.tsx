import type { Metadata } from "next";
import { ToonPlayground } from "@/components/toon-playground";
import { buildPageMetadata } from "@/lib/metadata";

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

export default function PlaygroundPage() {
  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <div className="min-h-0 flex-1">
        <ToonPlayground />
      </div>
    </main>
  );
}
