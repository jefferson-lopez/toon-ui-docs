import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { LandingDemo } from "@/components/landing-demo";
import { buildPageMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { repoUrl } from "@/lib/shared";

const benefits = [
  {
    title: "Better than plain chat text",
    description:
      "Let the model show actions, forms, and next steps inside the conversation instead of forcing users through long chat messages.",
    icon: Wand2,
  },
  {
    title: "Collect input inside the chat",
    description:
      "Ask for structured input without sending the user to a separate screen or breaking the assistant flow.",
    icon: ShieldCheck,
  },
  {
    title: "Guide end users clearly",
    description:
      "Present choices, confirmations, and recommendations in a format the end user can understand and act on quickly.",
    icon: Sparkles,
  },
  {
    title: "Structured UI, not frontend generation",
    description:
      "The model writes ToonUI for chat. Your product renders real components and keeps ownership of styling, logic, and rules.",
    icon: Code2,
  },
];

const toonUiExample = [
  'alert success "Product deleted":',
  '  text "Candy was deleted successfully."',
  'card "Recommended actions":',
  '  text "Choose what you want to do next."',
  '  button primary "Create product" reply="start-create-product"',
  '  button secondary "View inventory" reply="show-products-again"',
].join("\n");

const comparisonRows = [
  {
    format: "ToonUI",
    thinking: "Describe interface intent with a small, chat-first language.",
    words: 30,
    chars: 270,
    note: "Smallest surface area in this example.",
  },
  {
    format: "JSON UI",
    thinking:
      "Think about structure, nesting, keys, arrays, and renderer conventions.",
    words: 82,
    chars: 908,
    note: "About 63% more words and 70% more characters than ToonUI in this example.",
  },
  {
    format: "React UI",
    thinking:
      "Think about components, props, handlers, layout, and implementation details.",
    words: 45,
    chars: 592,
    note: "About 33% more words and 54% more characters than ToonUI in this example.",
  },
];

function renderToonUiCode(code: string) {
  return code.split("\n").map((line, index) => {
    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch?.[0] ?? "";
    const trimmed = line.trim();

    if (!trimmed) {
      return <div key={index}>&nbsp;</div>;
    }

    const tokens = trimmed.match(/\s+|"(?:[^"\\]|\\.)*"|[^\s"]+/g) ?? [];
    let nonWhitespaceIndex = 0;

    return (
      <div key={index}>
        <span className="text-muted-foreground/60">
          {indent.replace(/ /g, " ")}
        </span>
        {tokens.map((token, tokenIndex) => {
          if (/^\s+$/.test(token)) {
            return <span key={tokenIndex}>{token.replace(/ /g, " ")}</span>;
          }

          const currentIndex = nonWhitespaceIndex;
          nonWhitespaceIndex += 1;

          let className = "text-violet-700";

          if (token.startsWith('"')) {
            className = "text-amber-700";
          } else if (currentIndex === 0) {
            className = "text-sky-700";
          } else if (
            currentIndex === 1 &&
            /^[a-z]+$/i.test(token) &&
            !token.includes("=")
          ) {
            className = "text-emerald-700";
          }

          return (
            <span key={tokenIndex} className={className}>
              {token}
            </span>
          );
        })}
      </div>
    );
  });
}

const useCases = [
  {
    title: "Guide users with clear next steps",
    href: "/docs/guides/ui-patterns",
    cta: "See UI patterns",
  },
  {
    title: "Collect structured data inside chat",
    href: "/docs/language/node-reference#form",
    cta: "Learn forms",
  },
  {
    title: "Show confirmations before important actions",
    href: "/docs/language/node-reference#confirm",
    cta: "Learn confirm",
  },
  {
    title: "Turn model output into usable interface blocks",
    href: "/docs/getting-started/quickstart",
    cta: "Open quickstart",
  },
  {
    title: "Render UI from model intent instead of fragile generated code",
    href: "/docs/guides/build-a-real-flow",
    cta: "Build a real flow",
  },
  {
    title: "Make conversational flows feel like part of the product",
    href: "/docs/reference/events-and-messages",
    cta: "See events",
  },
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
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 py-10 md:px-10">
      <header className="flex items-center justify-between gap-4">
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

      <section className="space-y-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center space-y-6 text-center">
          <span className="inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
            Structured UI for end-user chat inside apps
          </span>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Give your AI a{" "}
              <span className="text-primary">language for chat UI</span>{" "}
              instead of frontend generation.
            </h1>

            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              ToonUI lets an LLM respond inside your product chat with forms,
              buttons, choices, confirmations, and other structured UI blocks
              that help end users understand what to do next.
            </p>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground md:text-base">
              Your app still owns rendering, actions, APIs, validation,
              permissions, and business rules. The model describes interface
              intent. Your product stays in control.
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
            <Button asChild variant="outline">
              <Link href={repoUrl} target="_blank" rel="noreferrer">
                View repository
              </Link>
            </Button>
          </div>
        </div>

        <LandingDemo />
      </section>

      <section className="rounded-3xl border bg-card">
        <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map(({ title, description, icon: Icon }, index) => (
            <article key={title} className="p-5 md:p-6 xl:p-6">
              <div className="mb-4 inline-flex rounded-lg border p-2 text-primary">
                <Icon className="size-4" />
              </div>
              <h2 className="mb-2 font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 md:p-8">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
            <Code2 className="size-4" />
            The AI writes chat UI intent. Your product renders the interface.
          </div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Let the model describe UI for the chat, then render it safely in
            your product.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
            Instead of asking the model to generate frontend implementation,
            it returns ToonUI. Your renderer transforms that response into real
            UI that matches your product, design system, and interaction rules.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border">
            <div className="border-b px-4 py-3 text-sm font-medium">
              ToonUI code
            </div>
            <pre className="overflow-x-auto bg-transparent p-4 text-sm leading-6 text-foreground">
              <code>{renderToonUiCode(toonUiExample)}</code>
            </pre>
          </div>

          <div className="overflow-hidden rounded-2xl border">
            <div className="border-b px-4 py-3 text-sm font-medium">
              Rendered UI
            </div>
            <div className="space-y-4 p-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
                <p className="text-sm font-medium">Product deleted</p>
                <p className="mt-1 text-sm text-emerald-900/80">
                  Candy was deleted successfully.
                </p>
              </div>

              <div className="rounded-2xl border p-4">
                <p className="font-medium">Recommended actions</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose what you want to do next.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button size="sm">Create product</Button>
                  <Button size="sm" variant="outline">
                    View inventory
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 md:p-8">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
            <ShieldCheck className="size-4" />
            Less UI overhead for the model
          </div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            ToonUI gives the model less to write and less to think about.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
            With ToonUI, the model focuses on interface intent. It does not need
            to spend as much output on JSON nesting, component trees, props, or
            implementation details. In the example above, ToonUI is materially
            shorter than the equivalent JSON UI and React UI representations.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border">
          <div className="grid border-b bg-muted/30 md:grid-cols-[1.1fr_1.8fr_0.7fr_0.7fr_1.4fr]">
            <div className="p-4 text-sm font-medium">Format</div>
            <div className="p-4 text-sm font-medium">
              What the model has to think about
            </div>
            <div className="p-4 text-sm font-medium">Words</div>
            <div className="p-4 text-sm font-medium">Chars</div>
            <div className="p-4 text-sm font-medium">Takeaway</div>
          </div>

          {comparisonRows.map((row, index) => (
            <div
              key={row.format}
              className="grid border-b last:border-b-0 md:grid-cols-[1.1fr_1.8fr_0.7fr_0.7fr_1.4fr]"
            >
              <div className="p-4 text-sm font-medium">{row.format}</div>
              <div className="p-4 text-sm text-muted-foreground">
                {row.thinking}
              </div>
              <div className="p-4 text-sm text-muted-foreground">
                {row.words}
              </div>
              <div className="p-4 text-sm text-muted-foreground">
                {row.chars}
              </div>
              <div className="p-4 text-sm text-muted-foreground">
                {row.note}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Comparison based on the same sample UI expressed three ways: ToonUI, a
          JSON UI schema, and React component markup. Savings vary by renderer
          and prompt, but the pattern is consistent: ToonUI removes structural
          noise so the model can focus on the interaction itself.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/docs/concepts/mental-model">
              Learn the mental model
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs/reference/prompt-api">
              See prompt architecture
            </Link>
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 md:p-8">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
            <CheckCircle2 className="size-4" />
            What ToonUI helps AI do better
          </div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Give AI a better way to guide users and collect information inside
            the conversation.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
            ToonUI helps AI move beyond plain text by turning model intent into
            usable interface blocks your product can render, validate, and
            handle safely.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {useCases.map((useCase) => (
            <div key={useCase.title} className="rounded-2xl border p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">{useCase.title}</p>
              </div>
              <div className="mt-4">
                <Button asChild size="sm" variant="outline">
                  <Link href={useCase.href}>{useCase.cta}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/docs/guides/build-a-real-flow">
              Build a real ToonUI flow
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs/guides/custom-adapter">Customize the UI</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
