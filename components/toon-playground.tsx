"use client";

import { useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Info,
  Sparkles,
  XCircle,
} from "lucide-react";
import {
  ToonMessage,
  createToonAdapter,
  createToonClient,
  getToonButtonProps,
  getToonInputProps,
  type ToonAlertComponentProps,
  type ToonBadgeComponentProps,
  type ToonButtonComponentProps,
  type ToonCardComponentProps,
  type ToonConfirmComponentProps,
  type ToonFieldComponentProps,
  type ToonFormComponentProps,
  type ToonItemComponentProps,
  type ToonListComponentProps,
  type ToonReplyPayload,
  type ToonSubmitPayload,
  type ToonTableComponentProps,
  type ToonTextComponentProps,
} from "@toon-ui/toon-ui";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";

const playgroundEditorTheme = EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: "transparent",
    color: "hsl(var(--foreground))",
    fontSize: "0.875rem",
    lineHeight: "1.5rem",
  },
  ".cm-scroller": {
    minHeight: "420px",
    fontFamily:
      'ui-monospace, SFMono-Regular, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  ".cm-content": {
    minHeight: "420px",
    padding: "1rem 0",
    caretColor: "hsl(var(--foreground))",
  },
  ".cm-line": {
    padding: "0 1rem",
  },
  ".cm-gutters": {
    minHeight: "420px",
    backgroundColor: "transparent",
    color: "hsl(var(--muted-foreground))",
    borderRight: "1px solid hsl(var(--border))",
  },
  ".cm-gutter": {
    backgroundColor: "transparent",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "hsl(var(--foreground))",
  },
  ".cm-activeLine": {
    backgroundColor: "hsl(var(--muted) / 0.45)",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "hsl(var(--primary) / 0.22) !important",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "hsl(var(--foreground))",
  },
  "&.cm-focused": {
    outline: "none",
  },
});

const supportedComponents: Array<{
  name: string;
  description: string;
  code: string;
}> = [
  {
    name: "alert",
    description: "Show status, feedback, or important information.",
    code: [
      'alert success "Product deleted":',
      '  text "Candy was deleted successfully."',
    ].join("\n"),
  },
  {
    name: "text",
    description: "Render supporting copy inside any block.",
    code: 'text "This is a simple supporting message for the user."',
  },
  {
    name: "card",
    description: "Group related content and next actions.",
    code: [
      'card "Recommended actions":',
      '  text "Choose what you want to do next."',
    ].join("\n"),
  },
  {
    name: "button",
    description: "Trigger reply or submit actions from the UI.",
    code: 'button primary "Create product" reply="start-create-product"',
  },
  {
    name: "form",
    description: "Collect structured data without leaving chat.",
    code: [
      'form "Create product":',
      '  field name text "Name" placeholder="Premium chocolate" required',
      '  button primary "Save" submit',
    ].join("\n"),
  },
  {
    name: "field",
    description: "Add typed inputs inside a form.",
    code: [
      'form "Price update":',
      '  field price number "Price" placeholder="12.99" required',
      '  button primary "Update" submit',
    ].join("\n"),
  },
  {
    name: "confirm",
    description: "Ask for explicit confirmation before sensitive actions.",
    code: [
      'confirm danger "Delete product?":',
      '  text "Candy will be removed from inventory."',
      '  button secondary "Cancel" reply="cancel-delete"',
      '  button danger "Yes, delete it" reply="confirm-delete"',
    ].join("\n"),
  },
  {
    name: "list",
    description: "Render structured collections inside chat.",
    code: [
      'list "Available products":',
      '  item "Candy":',
      '    text "Price: $4.50 · Stock: 18 units"',
    ].join("\n"),
  },
  {
    name: "item",
    description: "Represent entries inside a list.",
    code: [
      'list "Product":',
      '  item "Candy":',
      '    text "Ready to publish"',
    ].join("\n"),
  },
  {
    name: "badge",
    description: "Show compact status labels.",
    code: [
      'card "Status":',
      '  badge "Active" success',
    ].join("\n"),
  },
  {
    name: "table",
    description: "Show structured rows and columns for tabular data.",
    code: [
      'table "Sales":',
      '  columns: "Date", "Sale number", "Total", "Status"',
      '  row: "May 14", "S-001", "$25.00", "Paid"',
      '  row: "May 15", "S-002", "$48.00", "Pending"',
    ].join("\n"),
  },
  {
    name: "menu",
    description: "Present a semantic list of next-step actions.",
    code: [
      'menu "Quick actions":',
      '  action "Create sale" reply="start-sale"',
      '  action "View inventory" reply="show-inventory"',
      '  action "Open reports" reply="open-reports"',
    ].join("\n"),
  },
];

const authoringRules = [
  "Output only normal markdown plus optional toon-ui fenced blocks.",
  "Use only official ToonUI components from the catalog.",
  "Use structural child nodes only inside their valid parents.",
  "Do not invent components, props, or raw HTML/JS/CSS.",
  "Keep actions explicit with reply=\"...\" or submit.",
  "If unsure, simplify to a smaller valid UI instead of improvising.",
] as const;

const officialCatalog = [
  "text",
  "heading",
  "separator",
  "card",
  "form",
  "field",
  "button",
  "confirm",
  "list",
  "item",
  "badge",
  "alert",
  "table",
  "empty",
  "tabs",
  "accordion",
  "dialog",
  "sheet",
  "popover",
  "tooltip",
  "progress",
  "loading",
  "toast",
  "breadcrumb",
  "pagination",
  "menu",
  "command",
  "chart",
] as const;

const structuralChildNodes = [
  "crumb",
  "action",
  "tab",
  "section",
  "series",
  "point",
] as const;

const examples = [
  {
    label: "Actions",
    value: [
      'alert success "Product deleted":',
      '  text "Candy was deleted successfully."',
      'card "Recommended actions":',
      '  text "Choose what you want to do next."',
      '  button primary "Create product" reply="start-create-product"',
      '  button secondary "View inventory" reply="show-products-again"',
    ].join("\n"),
  },
  {
    label: "Form",
    value: [
      'form "Create product":',
      '  field name text "Name" placeholder="Premium chocolate" required',
      '  field price number "Price" placeholder="12.99" required',
      '  field stock number "Stock" placeholder="36" required',
      '  button primary "Create product" submit',
    ].join("\n"),
  },
  {
    label: "Confirmation",
    value: [
      'confirm danger "Delete product?":',
      '  text "Candy will be removed from inventory."',
      '  button secondary "Cancel" reply="cancel-delete"',
      '  button danger "Yes, delete it" reply="confirm-delete"',
    ].join("\n"),
  },
  {
    label: "Table",
    value: [
      'table "Sales":',
      '  columns: "Date", "Sale number", "Total", "Status"',
      '  row: "May 14", "S-001", "$25.00", "Paid"',
      '  row: "May 15", "S-002", "$48.00", "Pending"',
    ].join("\n"),
  },
  {
    label: "Menu",
    value: [
      'menu "Quick actions":',
      '  action "Create sale" reply="start-sale"',
      '  action "View inventory" reply="show-inventory"',
      '  action "Open reports" reply="open-reports"',
    ].join("\n"),
  },
] as const;

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

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function PlaygroundToonText({ node }: ToonTextComponentProps) {
  return (
    <p className="m-0 text-sm leading-6 text-muted-foreground">{node.value}</p>
  );
}

function PlaygroundToonBadge({ node }: ToonBadgeComponentProps) {
  const variant =
    node.variant === "success"
      ? "secondary"
      : node.variant === "warning" || node.variant === "danger"
        ? "destructive"
        : "outline";

  return (
    <Badge variant={variant} className="w-fit">
      {node.label}
    </Badge>
  );
}

function PlaygroundToonList({ node, children }: ToonListComponentProps) {
  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium text-foreground">{node.title}</p>
      <ItemGroup className="gap-3">{children}</ItemGroup>
    </div>
  );
}

function PlaygroundToonItem({ node, children }: ToonItemComponentProps) {
  return (
    <Item variant="outline" className="items-start">
      <ItemContent>
        <ItemTitle>{node.title}</ItemTitle>
        {children ? (
          <div className="grid gap-2 text-sm text-muted-foreground">
            {children}
          </div>
        ) : null}
      </ItemContent>
    </Item>
  );
}

function PlaygroundToonCard({ node, children }: ToonCardComponentProps) {
  return (
    <Card className="gap-0 border bg-muted/40 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle>{node.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">{children}</CardContent>
    </Card>
  );
}

function PlaygroundToonConfirm({ node, children }: ToonConfirmComponentProps) {
  return (
    <Card className="gap-0 border bg-muted/40 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle>{node.title}</CardTitle>
      </CardHeader>
      <CardFooter
        className={cn(
          "grid items-stretch gap-3 border-t-0 pt-0",
          node.variant === "danger" && "text-destructive",
          node.variant === "warning" && "text-amber-600",
        )}
      >
        {children}
      </CardFooter>
    </Card>
  );
}

function PlaygroundToonAlert({ node, children }: ToonAlertComponentProps) {
  const Icon =
    node.variant === "success"
      ? CheckCircle2
      : node.variant === "danger"
        ? XCircle
        : node.variant === "warning"
          ? AlertTriangle
          : Info;

  return (
    <Alert
      variant={
        node.variant === "danger" || node.variant === "warning"
          ? "destructive"
          : "default"
      }
      className={cn(
        "rounded-2xl",
        node.variant === "success" &&
          "border-emerald-200 bg-emerald-50 text-emerald-900",
        node.variant === "info" && "border-sky-200 bg-sky-50 text-sky-900",
        node.variant === "warning" &&
          "border-amber-200 bg-amber-50 text-amber-900",
      )}
    >
      <AlertTitle className="flex items-center gap-2">
        <Icon className="size-4" />
        <span>{node.title}</span>
      </AlertTitle>
      <AlertDescription className="grid gap-2">{children}</AlertDescription>
    </Alert>
  );
}

function PlaygroundToonTable({ node }: ToonTableComponentProps) {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <div className="border-b px-4 py-3 text-sm font-medium">{node.title}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-foreground">
            <tr>
              {node.columns.map((column) => (
                <th key={column} className="px-4 py-2 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {node.rows.map((row, rowIndex) => (
              <tr key={`${node.title}-${rowIndex}`} className="border-t">
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${node.title}-${rowIndex}-${cellIndex}`}
                    className="px-4 py-2 text-muted-foreground"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlaygroundToonForm({
  node,
  children,
  submitForm,
  disabled,
}: ToonFormComponentProps) {
  return (
    <Card className="gap-0 border bg-muted/40 shadow-none">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitForm();
        }}
      >
        <CardHeader className="pb-3">
          <CardTitle>{node.title}</CardTitle>
          <FieldDescription>
            Structured fields stay inside the conversation.
          </FieldDescription>
        </CardHeader>
        <CardContent className="grid gap-4">{children}</CardContent>
        {disabled ? <input type="submit" hidden /> : null}
      </form>
    </Card>
  );
}

function PlaygroundToonField(props: ToonFieldComponentProps) {
  const inputProps = getToonInputProps(props);
  const targetId = `playground-field-${slugify(props.node.name)}`;

  return (
    <Field className="gap-2">
      <FieldLabel htmlFor={targetId}>{props.node.label}</FieldLabel>
      <Input {...inputProps} id={targetId} className="h-10 rounded-xl" />
    </Field>
  );
}

function PlaygroundToonButton(props: ToonButtonComponentProps) {
  const variant =
    props.node.variant === "primary"
      ? "default"
      : props.node.variant === "secondary"
        ? "secondary"
        : props.node.variant === "outline"
          ? "outline"
          : props.node.variant === "ghost"
            ? "ghost"
            : props.node.variant === "danger"
              ? "destructive"
              : "outline";

  return (
    <Button
      {...getToonButtonProps(props)}
      variant={variant}
      className="w-fit rounded-xl"
    >
      {props.node.label}
    </Button>
  );
}

const toon = createToonClient({
  adapter: createToonAdapter({
    level: "default",
    components: {
      text: PlaygroundToonText,
      badge: PlaygroundToonBadge,
      list: PlaygroundToonList,
      item: PlaygroundToonItem,
      card: PlaygroundToonCard,
      confirm: PlaygroundToonConfirm,
      alert: PlaygroundToonAlert,
      table: PlaygroundToonTable,
      form: PlaygroundToonForm,
      field: PlaygroundToonField,
      button: PlaygroundToonButton,
    },
  }),
});

export function ToonPlayground() {
  const [code, setCode] = useState(examples[0].value);
  const [copied, setCopied] = useState(false);

  const content = useMemo(() => `\`\`\`toon-ui\n${code}\n\`\`\``, [code]);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  function handleEvent(payload: ToonReplyPayload | ToonSubmitPayload) {
    void payload;
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 md:px-10">
      <div className="max-w-3xl space-y-3">
        <span className="inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
          Playground
        </span>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Try ToonUI
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          Explore the UI language an AI model can return to render forms,
          actions, confirmations, and structured chat interfaces.
        </p>
      </div>

      <div className="rounded-3xl border bg-card p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium">Quick examples</p>
            <p className="text-xs text-muted-foreground">
              Load a sample instantly without scrolling.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {examples.map((example) => (
              <Button
                key={example.label}
                variant={code === example.value ? "default" : "outline"}
                onClick={() => setCode(example.value)}
              >
                {example.label}
              </Button>
            ))}
            <Button asChild variant="outline">
              <a href="#authoring-rules">Authoring rules</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <p className="text-sm font-medium">ToonUI</p>
              <p className="text-xs text-muted-foreground">
                Edit the UI language the model could return.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="size-4" />
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <div className="p-4">
            <div className="overflow-hidden rounded-2xl border bg-background">
              <CodeMirror
                aria-label="ToonUI code editor"
                value={code}
                height="420px"
                basicSetup={{
                  foldGutter: false,
                  highlightActiveLine: true,
                  highlightActiveLineGutter: true,
                  autocompletion: false,
                }}
                extensions={[EditorView.lineWrapping, playgroundEditorTheme]}
                onChange={(value) => setCode(value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border bg-card">
          <div className="border-b px-4 py-3">
            <p className="text-sm font-medium">Rendered UI</p>
            <p className="text-xs text-muted-foreground">
              This is how your product can render the model output.
            </p>
          </div>
          <div className="min-h-[452px] p-4">
            <div className="space-y-4 rounded-2xl bg-background p-4">
              <ToonMessage
                key={code}
                content={content}
                runtime={toon}
                onReply={handleEvent}
                onSubmit={handleEvent}
                renderMarkdown={(markdown) => (
                  <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {markdown}
                  </p>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <section id="authoring-rules" className="rounded-3xl border bg-card p-6 md:p-8">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            AI authoring rules
          </div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            The playground now teaches the contract, not just a few examples.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
            ToonUI output must stay inside normal markdown plus valid{" "}
            <code>toon-ui</code> blocks, using only the official catalog and
            canonical syntax.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Hard rules
            </p>
            <ul className="grid gap-3 text-sm text-muted-foreground">
              {authoringRules.map((rule) => (
                <li key={rule} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Official root components
            </p>
            <div className="flex flex-wrap gap-2">
              {officialCatalog.map((component) => (
                <Badge key={component} variant="outline" className="font-mono text-xs">
                  {component}
                </Badge>
              ))}
            </div>
            <p className="mt-4 mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Structural child nodes
            </p>
            <div className="flex flex-wrap gap-2">
              {structuralChildNodes.map((component) => (
                <Badge key={component} variant="secondary" className="font-mono text-xs">
                  {component}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="all-components" className="rounded-3xl p-6 md:p-8">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            Featured canonical examples
          </div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            These are sample ToonUI blocks from the official language.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
            This section is intentionally a curated sample set. The full
            language is the official catalog above, not only the examples shown
            here.
          </p>
        </div>

        <div className="mt-8 grid gap-6">
          {supportedComponents.map((component) => (
            <div
              key={component.name}
              className="overflow-hidden rounded-2xl border"
            >
              <div className="flex items-center gap-2 border-b px-4 py-3">
                <Badge variant="outline" className="font-mono text-xs">
                  {component.name}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {component.description}
                </p>
              </div>

              <div className="grid gap-0 lg:grid-cols-2">
                <div className="border-b p-4 lg:border-r lg:border-b-0">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    ToonUI code
                  </p>
                  <pre className="overflow-x-auto rounded-xl border bg-transparent p-4 text-xs leading-6 text-foreground">
                    <code>{renderToonUiCode(component.code)}</code>
                  </pre>
                </div>

                <div className="p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Rendered UI
                  </p>
                  <div className="rounded-xl bg-background p-4">
                    <ToonMessage
                      content={`\`\`\`toon-ui
${component.code}
\`\`\``}
                      runtime={toon}
                      onReply={handleEvent}
                      onSubmit={handleEvent}
                      renderMarkdown={(markdown) => (
                        <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                          {markdown}
                        </p>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-start">
          <Button asChild>
            <a href="/docs/language/complete-syntax-reference">
              View complete syntax reference
            </a>
          </Button>
        </div>
      </section>
    </section>
  );
}
