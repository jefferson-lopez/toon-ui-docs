import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Code2, ShieldCheck } from "lucide-react";
import { LandingDemo } from "@/components/landing-demo";
import { InstallCommand } from "@/components/install-command";
import { CodePanel } from "@/components/code-panel";
import { buildPageMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const serverSnippet = `import { createToonProtocol } from "@toon-ui/core";

const toon = createToonProtocol({
  components: ["card", "confirm", "form", "field", "button"],
});

const system = toon.prompt;`;

const modelSnippet = `form "Create product":
  field name text "Name" required
  field price number "Price" required
  button primary "Create" submit`;

const clientSnippet = `import { ToonMessage } from "@toon-ui/react";

<ToonMessage
  content={assistantMessage}
  runtime={toonRuntime}
  onReply={(payload) => sendToModel(toon.messages.toModelMessage(payload))}
  onSubmit={(payload) => sendToModel(toon.messages.toModelMessage(payload))}
/>`;

const safetyPoints = [
  "Prompt generated from your active catalog",
  "React renders only registered components",
  "No hidden default UI or surprise components",
  "Your app owns actions, permissions, validation, and APIs",
] as const;

const nonGoals = [
  "agent framework",
  "tool executor",
  "backend workflow engine",
  "React generator",
  "v0 replacement",
  "design-system replacement",
] as const;

const recommendedStack = [
  "AI SDK",
  "AI Elements",
  "shadcn/ui",
  "@toon-ui/core on the server",
  "@toon-ui/react on the client",
] as const;

export const metadata: Metadata = buildPageMetadata({
  title: "Build AI Interfaces Inside Chat",
  description:
    "Turn LLM responses into forms, buttons, confirmations, and structured UI for end-user chat experiences your product can render safely with ToonUI.",
  path: "/",
  keywords: [
    "AI interfaces",
    "AI-generated UI",
    "AI-native UI",
    "ToonUI docs",
    "UI language",
    "LLM UX",
  ],
});

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-14 px-6 py-10 md:px-10">
      <header className="flex items-center justify-between gap-4">
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

      <section className="space-y-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center space-y-6 text-center">
          <span className="inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
            Semantic UI for AI chat. Not frontend generation.
          </span>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Let AI describe UI. Your app renders it.
            </h1>

            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              ToonUI lets models describe chat UI while your app keeps control
              of components, actions, validation, and APIs.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/docs">
                Read the docs
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/playground">Try playground</Link>
            </Button>
          </div>
        </div>

        <LandingDemo />
      </section>

      <section className="rounded-3xl border bg-card p-6 md:p-8">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
            <Code2 className="size-4" />
            Three pieces, one controlled loop
          </div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Core creates the rules. The model writes ToonUI. React renders your components.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <article className="overflow-hidden rounded-2xl border">
            <div className="border-b px-4 py-3">
              <p className="text-sm font-medium">1. Server catalog</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Generate the prompt from enabled components.
              </p>
            </div>
            <CodePanel
              code={serverSnippet}
              language="ts"
              showLanguage={false}
              className="rounded-none border-0"
            />
          </article>

          <article className="overflow-hidden rounded-2xl border">
            <div className="border-b px-4 py-3">
              <p className="text-sm font-medium">2. Model output</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Semantic UI, not production React.
              </p>
            </div>
            <CodePanel
              code={modelSnippet}
              language="toon-ui"
              showLanguage={false}
              className="rounded-none border-0"
            />
          </article>

          <article className="overflow-hidden rounded-2xl border">
            <div className="border-b px-4 py-3">
              <p className="text-sm font-medium">3. React renderer</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Render real components and send structured events.
              </p>
            </div>
            <CodePanel
              code={clientSnippet}
              language="tsx"
              showLanguage={false}
              className="rounded-none border-0"
            />
          </article>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6 md:p-8">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
            <ShieldCheck className="size-4" />
            Catalog-driven safety
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            The AI only sees the UI vocabulary you enable.
          </h2>
          <div className="mt-6 grid gap-3">
            {safetyPoints.map((point) => (
              <div key={point} className="flex gap-3 rounded-2xl border p-4">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6 md:p-8">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
            <Code2 className="size-4" />
            What ToonUI is not
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            It does not take over your architecture.
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {nonGoals.map((item) => (
              <span
                key={item}
                className="rounded-full border px-3 py-1 text-sm text-muted-foreground"
              >
                Not a {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border bg-card p-6 md:p-8">
          <div className="mb-4 text-sm font-medium text-primary">
            Recommended path
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Start with the React stack most teams can copy.
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {recommendedStack.map((item) => (
              <span
                key={item}
                className="rounded-full border px-3 py-1 text-sm text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6 md:p-8">
          <div className="mb-4 text-sm font-medium text-primary">
            Install ToonUI
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Install core for the server and react for the client.
          </h2>
          <div className="mt-8">
            <InstallCommand command="npm install @toon-ui/core @toon-ui/react" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/docs/getting-started/start-here">
                Start guide
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/playground">Open playground</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
