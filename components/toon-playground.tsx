"use client";

import type * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import TextareaAutosize from "react-textarea-autosize";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bot,
  CheckCircle2,
  Info,
  LoaderCircle,
  MessageSquarePlus,
  Send,
  User,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  ToonMessage,
  createToonAdapter,
  createToonReactRuntime,
  getToonButtonProps,
  getToonInputProps,
  type ToonAlertComponentProps,
  type ToonBadgeComponentProps,
  type ToonButtonComponentProps,
  type ToonCardComponentProps,
  type ToonConfirmComponentProps,
  type ToonEmptyComponentProps,
  type ToonFieldComponentProps,
  type ToonFormComponentProps,
  type ToonItemComponentProps,
  type ToonListComponentProps,
  type ToonReplyPayload,
  type ToonSubmitPayload,
  type ToonTableComponentProps,
  type ToonTextComponentProps,
} from "@toon-ui/react";
import { MessageResponse } from "@/components/ai-elements/message";
import { CodePanel } from "@/components/code-panel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { playgroundToonComponentKeys } from "@/lib/toon-catalog";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const supportedComponents: Array<{
  name: string;
  description: string;
  code: string;
}> = [
  {
    name: "text",
    description: "Visible copy.",
    code: 'text "Simple supporting copy."',
  },
  {
    name: "heading",
    description: "Semantic hierarchy.",
    code: 'heading 2 "Customer details"',
  },
  {
    name: "separator",
    description: "Visual divider.",
    code: "separator horizontal",
  },
  {
    name: "badge",
    description: "Compact status label.",
    code: 'badge "Active" success',
  },
  {
    name: "card",
    description: "Group content and actions.",
    code: [
      'card "Customer found" description="Premium account":',
      '  text "Jefferson Lopez"',
      '  badge "Active" success',
    ].join("\n"),
  },
  {
    name: "list",
    description: "Structured repeated results.",
    code: [
      'list "Products":',
      '  item "Candy" description="SKU C-001":',
      '    text "Stock: 18 units"',
    ].join("\n"),
  },
  {
    name: "item",
    description: "Single list entry.",
    code: [
      'list "Product":',
      '  item "Candy":',
      '    text "Ready to publish"',
    ].join("\n"),
  },
  {
    name: "table",
    description: "Rows and columns.",
    code: [
      'table "Sales":',
      '  columns: "Date", "Total", "Status"',
      '  row: "May 14", "$25.00", "Paid"',
    ].join("\n"),
  },
  {
    name: "empty",
    description: "Zero-result state.",
    code: [
      'empty "No products found" description="Try another search term":',
      '  text "You can create a product instead."',
      '  button secondary "Create product" reply="start-create-product"',
    ].join("\n"),
  },
  {
    name: "tabs",
    description: "Parallel panels.",
    code: [
      'tabs "Customer profile":',
      '  tab "Summary":',
      '    text "Customer is active."',
      '  tab "History":',
      '    text "Last order was yesterday."',
    ].join("\n"),
  },
  {
    name: "tab",
    description: "Tabs panel child.",
    code: ['tabs "Details":', '  tab "Summary":', '    text "Active"'].join(
      "\n",
    ),
  },
  {
    name: "accordion",
    description: "Progressive disclosure.",
    code: [
      'accordion "Advanced settings":',
      '  section "Inventory":',
      '    text "Sync runs every 15 minutes."',
    ].join("\n"),
  },
  {
    name: "section",
    description: "Accordion section child.",
    code: [
      'accordion "FAQ":',
      '  section "Returns":',
      '    text "Returns are accepted within 30 days."',
    ].join("\n"),
  },
  {
    name: "form",
    description: "Structured input capture.",
    code: [
      'form "Create product":',
      '  field name text "Name" placeholder="Premium chocolate" required',
      '  button primary "Save" submit',
    ].join("\n"),
  },
  {
    name: "field",
    description: "Typed form input.",
    code: [
      'form "Price update":',
      '  field price number "Price" placeholder="12.99" required',
      '  button primary "Update" submit',
    ].join("\n"),
  },
  {
    name: "button",
    description: "Reply or submit trigger.",
    code: 'button primary "Create product" reply="start-create-product"',
  },
  {
    name: "confirm",
    description: "Confirmation flow.",
    code: [
      'confirm warning "Delete customer?" trigger="Review deletion":',
      '  text "This action cannot be undone."',
      '  button secondary "Cancel" reply="cancel"',
      '  button danger "Yes, delete" reply="delete-customer"',
    ].join("\n"),
  },
  {
    name: "alert",
    description: "Important callout.",
    code: [
      'alert success "Product deleted":',
      '  text "Candy was deleted successfully."',
    ].join("\n"),
  },
  {
    name: "progress",
    description: "Deterministic progress.",
    code: 'progress "Importing customers" value=42 max=100',
  },
  {
    name: "loading",
    description: "Transient loading state.",
    code: 'loading "Searching products..."',
  },
  {
    name: "toast",
    description: "Ephemeral result feedback.",
    code: 'toast success "Customer created successfully."',
  },
  {
    name: "dialog",
    description: "Modal content with trigger label.",
    code: [
      'dialog "Customer details" trigger="Open details":',
      '  text "This is modal content."',
    ].join("\n"),
  },
  {
    name: "sheet",
    description: "Edge panel content.",
    code: [
      'sheet "Filters" trigger="Open filters" side="right":',
      '  text "Choose filters to apply."',
    ].join("\n"),
  },
  {
    name: "popover",
    description: "Inline contextual overlay.",
    code: [
      'popover "More details" trigger="Show details":',
      '  text "Average order value: $58"',
    ].join("\n"),
  },
  {
    name: "tooltip",
    description: "Short contextual hint.",
    code: 'tooltip "More context about this metric" trigger="What does this mean?"',
  },
  {
    name: "breadcrumb",
    description: "Hierarchical navigation path.",
    code: [
      "breadcrumb:",
      '  crumb "Home" reply="go-home"',
      '  crumb "Customers" reply="go-customers"',
      '  crumb "Jefferson Lopez"',
    ].join("\n"),
  },
  {
    name: "crumb",
    description: "Breadcrumb child.",
    code: ["breadcrumb:", '  crumb "Customers" reply="go-customers"'].join(
      "\n",
    ),
  },
  {
    name: "pagination",
    description: "Page navigation state.",
    code: "pagination page=2 totalPages=7",
  },
  {
    name: "menu",
    description: "Semantic action list.",
    code: [
      'menu "Quick actions":',
      '  action "Create sale" reply="start-sale"',
      '  action "View inventory" reply="show-inventory"',
    ].join("\n"),
  },
  {
    name: "command",
    description: "Command-palette style actions.",
    code: [
      'command "Jump to" trigger="Open command palette":',
      '  action "Open reports" reply="open-reports"',
      '  action "Create product" reply="start-create-product"',
    ].join("\n"),
  },
  {
    name: "action",
    description: "Menu or command child action.",
    code: [
      'menu "Actions":',
      '  action "Open reports" reply="open-reports" variant="secondary"',
    ].join("\n"),
  },
  {
    name: "chart",
    description: "Trend or comparison visualization.",
    code: [
      'chart bar "Weekly sales" x="Day" y="Revenue":',
      '  series "Store A":',
      '    point "Mon" 1200',
      '    point "Tue" 980',
    ].join("\n"),
  },
  {
    name: "series",
    description: "Chart series child.",
    code: [
      'chart line "Weekly sales":',
      '  series "Store A":',
      '    point "Mon" 24',
    ].join("\n"),
  },
  {
    name: "point",
    description: "Chart point child.",
    code: [
      'chart bar "Weekly sales":',
      '  series "Store A":',
      '    point "Mon" 1200',
    ].join("\n"),
  },
];

const promptPresets = [
  {
    label: "I want to create a product",
    prompt:
      "I want to create a new product in my catalog. Ask me for the right information inside the chat and help me confirm it before saving.",
  },
  {
    label: "I want to review my notes",
    prompt:
      "I want to review my notes and decide what to do next. Show me a useful summary and clear next actions inside the chat.",
  },
  {
    label: "Show me every enabled component",
    prompt:
      "Show me a ToonUI showcase inside the chat using every component enabled in this playground catalog: text, badge, list, item, card, confirm, alert, table, empty, form, field, and button.",
  },
] as const;

type PlaygroundMessageMetadata = {
  displayContent?: string;
  kind?: "text" | "ui_reply" | "ui_submit";
};

type PlaygroundUIMessage = UIMessage<PlaygroundMessageMetadata>;

type InspectorTab = "conversation" | "catalog";
type PlaygroundTab = "chat" | InspectorTab;
type PlaygroundGenericToonProps<
  TNode extends { type: string } = { type: string },
> = {
  node: TNode & Record<string, unknown>;
  children?: React.ReactNode;
  context: {
    sendReply: (payload: ToonReplyPayload) => void;
  };
  disabled?: boolean;
};

const PlaygroundCommandContext = createContext(false);

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function shouldCloseOverlay(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;

  return Boolean(
    target.closest(
      'button, [role="button"], [cmdk-item], input[type="submit"]',
    ),
  );
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
        {node.description ? (
          <p className="text-sm text-muted-foreground">{node.description}</p>
        ) : null}
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
        {node.description ? (
          <FieldDescription>{node.description}</FieldDescription>
        ) : null}
      </CardHeader>
      <CardContent className="grid gap-3">{children}</CardContent>
    </Card>
  );
}

function PlaygroundToonConfirm({
  node,
  children,
  disabled,
}: ToonConfirmComponentProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => setOpen(disabled ? false : nextOpen)}
    >
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant={node.variant === "danger" ? "destructive" : "outline"}
          size="sm"
          className="w-fit rounded-xl"
          disabled={disabled}
        >
          {node.trigger ?? node.title}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{node.title}</AlertDialogTitle>
          {node.description ? (
            <AlertDialogDescription>{node.description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <div
          className={cn(
            "grid gap-3",
            node.variant === "danger" && "text-destructive",
            node.variant === "warning" && "text-amber-600",
          )}
          onClick={(event) => {
            if (shouldCloseOverlay(event.target)) {
              window.setTimeout(() => setOpen(false), 0);
            }
          }}
          onSubmit={() => {
            window.setTimeout(() => setOpen(false), 0);
          }}
        >
          {children}
        </div>
      </AlertDialogContent>
    </AlertDialog>
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
          "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
        node.variant === "info" &&
          "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100",
        node.variant === "warning" &&
          "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
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
    <div className="overflow-hidden rounded-2xl border bg-background">
      <div className="border-b px-4 py-3 text-sm font-medium">{node.title}</div>
      <Table>
        <TableHeader>
          <TableRow>
            {node.columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {node.rows.map((row, rowIndex) => (
            <TableRow key={`${node.title}-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <TableCell
                  key={`${node.title}-${rowIndex}-${cellIndex}`}
                  className="text-muted-foreground"
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
          {node.description ? (
            <FieldDescription>{node.description}</FieldDescription>
          ) : null}
        </CardHeader>
        <CardContent className="grid gap-4">{children}</CardContent>
        {disabled ? <input type="submit" hidden /> : null}
      </form>
    </Card>
  );
}

function PlaygroundToonEmpty({ node, children }: ToonEmptyComponentProps) {
  return (
    <Card className="gap-0 border bg-muted/40 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle>{node.title}</CardTitle>
        {node.description ? (
          <FieldDescription>{node.description}</FieldDescription>
        ) : null}
      </CardHeader>
      {children ? (
        <CardContent className="grid gap-3">{children}</CardContent>
      ) : null}
    </Card>
  );
}

function PlaygroundToonField(props: ToonFieldComponentProps) {
  const inputProps = getToonInputProps(props);
  const targetId = `playground-field-${slugify(props.node.name)}`;
  const value = props.value;
  const optionValues = props.node.options ?? [];

  if (props.node.fieldType === "textarea") {
    return (
      <Field className="gap-2">
        <FieldLabel htmlFor={targetId}>{props.node.label}</FieldLabel>
        <Textarea
          id={targetId}
          name={props.node.name}
          placeholder={props.node.placeholder}
          required={props.node.required}
          disabled={props.disabled}
          value={String(value ?? "")}
          onChange={(event) => props.onChange(event.target.value)}
          className="rounded-xl"
        />
      </Field>
    );
  }

  if (props.node.fieldType === "checkbox") {
    return (
      <Field
        orientation="horizontal"
        className="items-center gap-3 rounded-xl border p-3"
      >
        <Checkbox
          id={targetId}
          name={props.node.name}
          disabled={props.disabled}
          required={props.node.required}
          checked={Boolean(value)}
          onCheckedChange={(checked) => props.onChange(checked === true)}
        />
        <FieldLabel htmlFor={targetId}>{props.node.label}</FieldLabel>
      </Field>
    );
  }

  if (props.node.fieldType === "select" && optionValues.length > 0) {
    return (
      <Field className="gap-2">
        <FieldLabel htmlFor={targetId}>{props.node.label}</FieldLabel>
        <Select
          disabled={props.disabled}
          value={String(value ?? "")}
          onValueChange={(nextValue) => props.onChange(nextValue)}
        >
          <SelectTrigger id={targetId} className="h-10 w-full rounded-xl">
            <SelectValue
              placeholder={props.node.placeholder ?? "Select an option"}
            />
          </SelectTrigger>
          <SelectContent>
            {optionValues.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    );
  }

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

function PlaygroundToonHeading({
  node,
}: PlaygroundGenericToonProps<{
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}>) {
  const Tag = `h${node.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Tag className="text-pretty font-semibold tracking-tight text-foreground">
      {node.text}
    </Tag>
  );
}

function PlaygroundToonSeparator({
  node,
}: PlaygroundGenericToonProps<{
  type: "separator";
  orientation?: "horizontal" | "vertical";
}>) {
  return <Separator orientation={node.orientation ?? "horizontal"} />;
}

function PlaygroundToonTabs({
  node,
}: PlaygroundGenericToonProps<{
  type: "tabs";
  title: string;
  children: Array<{ label: string; children: unknown[] }>;
}>) {
  const first = node.children?.[0];

  return (
    <Card className="gap-0 border bg-muted/40 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle>{node.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={first?.label} className="w-full">
          <TabsList className="flex-wrap">
            {node.children.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.label}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {node.children.map((tab) => (
            <TabsContent key={tab.label} value={tab.label}>
              <div className="grid gap-3">
                {tab.children.map((child, index) => (
                  <PlaygroundInlineNode
                    key={`${tab.label}-${index}`}
                    node={child as Record<string, unknown>}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

function PlaygroundToonTab({
  node,
  children,
}: PlaygroundGenericToonProps<{ type: "tab"; label: string }>) {
  return (
    <Card className="border bg-background shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{node.label}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">{children}</CardContent>
    </Card>
  );
}

function PlaygroundToonAccordion({
  node,
  children,
}: PlaygroundGenericToonProps<{ type: "accordion"; title: string }>) {
  return (
    <div className="rounded-2xl border bg-background px-4 py-3">
      <p className="mb-2 text-sm font-medium">{node.title}</p>
      <Accordion
        type="multiple"
        defaultValue={["section-0"]}
        className="w-full"
      >
        {children}
      </Accordion>
    </div>
  );
}

function PlaygroundToonSection({
  node,
  children,
}: PlaygroundGenericToonProps<{
  type: "section";
  title: string;
  line?: number;
}>) {
  const value = `section-${node.line ?? slugify(node.title)}`;

  return (
    <AccordionItem value={value}>
      <AccordionTrigger>{node.title}</AccordionTrigger>
      <AccordionContent>
        <div className="grid gap-3 pt-2">{children}</div>
      </AccordionContent>
    </AccordionItem>
  );
}

function PlaygroundToonDialog({
  node,
  children,
  disabled,
}: PlaygroundGenericToonProps<{
  type: "dialog";
  title: string;
  trigger?: string;
  description?: string;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => setOpen(disabled ? false : nextOpen)}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit rounded-xl"
          disabled={disabled}
        >
          {node.trigger ?? node.title}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{node.title}</DialogTitle>
          <DialogDescription>
            {node.description ??
              "Modal content generated from the configured ToonUI catalog."}
          </DialogDescription>
        </DialogHeader>
        <div
          className="grid gap-3"
          onClick={(event) => {
            if (shouldCloseOverlay(event.target)) {
              window.setTimeout(() => setOpen(false), 0);
            }
          }}
          onSubmit={() => {
            window.setTimeout(() => setOpen(false), 0);
          }}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PlaygroundToonSheet({
  node,
  children,
  disabled,
}: PlaygroundGenericToonProps<{
  type: "sheet";
  title: string;
  trigger?: string;
  side?: "top" | "right" | "bottom" | "left";
  description?: string;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => setOpen(disabled ? false : nextOpen)}
    >
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit rounded-xl"
          disabled={disabled}
        >
          {node.trigger ?? node.title}
        </Button>
      </SheetTrigger>
      <SheetContent side={node.side ?? "right"}>
        <SheetHeader>
          <SheetTitle>{node.title}</SheetTitle>
          <SheetDescription>
            {node.description ??
              "Panel content generated from the configured ToonUI catalog."}
          </SheetDescription>
        </SheetHeader>
        <div
          className="grid gap-3 px-4 pb-4"
          onClick={(event) => {
            if (shouldCloseOverlay(event.target)) {
              window.setTimeout(() => setOpen(false), 0);
            }
          }}
          onSubmit={() => {
            window.setTimeout(() => setOpen(false), 0);
          }}
        >
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PlaygroundToonPopover({
  node,
  children,
  disabled,
}: PlaygroundGenericToonProps<{
  type: "popover";
  title: string;
  trigger?: string;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => setOpen(disabled ? false : nextOpen)}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit rounded-xl"
          disabled={disabled}
        >
          {node.trigger ?? node.title}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="grid gap-3"
        onClick={(event) => {
          if (shouldCloseOverlay(event.target)) {
            window.setTimeout(() => setOpen(false), 0);
          }
        }}
        onSubmit={() => {
          window.setTimeout(() => setOpen(false), 0);
        }}
      >
        <p className="text-sm font-medium">{node.title}</p>
        {children}
      </PopoverContent>
    </Popover>
  );
}

function PlaygroundToonTooltip({
  node,
}: PlaygroundGenericToonProps<{
  type: "tooltip";
  text: string;
  trigger?: string;
}>) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit rounded-full"
          >
            {node.trigger ?? "More info"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{node.text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function PlaygroundToonProgress({
  node,
}: PlaygroundGenericToonProps<{
  type: "progress";
  label: string;
  value: number;
  max: number;
}>) {
  const percent = Math.max(
    0,
    Math.min(100, Math.round((node.value / node.max) * 100)),
  );

  return (
    <div className="grid gap-2 rounded-xl border bg-background p-3">
      <div className="flex justify-between gap-3 text-sm">
        <span className="font-medium">{node.label}</span>
        <span className="text-muted-foreground">
          {node.value}/{node.max}
        </span>
      </div>
      <Progress value={percent} />
    </div>
  );
}

function PlaygroundToonLoading({
  node,
}: PlaygroundGenericToonProps<{ type: "loading"; text: string }>) {
  return (
    <div className="grid gap-3 rounded-xl border bg-muted/40 p-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <LoaderCircle className="size-4 animate-spin" />
        {node.text}
      </div>
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

function PlaygroundToonToast({
  node,
}: PlaygroundGenericToonProps<{
  type: "toast";
  variant: string;
  text: string;
}>) {
  return (
    <Alert
      variant={node.variant === "danger" ? "destructive" : "default"}
      className="rounded-2xl"
    >
      <AlertTitle className="capitalize">{node.variant}</AlertTitle>
      <AlertDescription>{node.text}</AlertDescription>
    </Alert>
  );
}

function PlaygroundToonBreadcrumb({
  children,
}: PlaygroundGenericToonProps<{ type: "breadcrumb" }>) {
  return (
    <Breadcrumb>
      <BreadcrumbList>{children}</BreadcrumbList>
    </Breadcrumb>
  );
}

function PlaygroundToonCrumb({
  node,
  context,
  disabled,
}: PlaygroundGenericToonProps<{
  type: "crumb";
  label: string;
  action?: { kind: "reply"; value: string };
  line: number;
}>) {
  const content =
    node.action?.kind === "reply" ? (
      <BreadcrumbLink
        href="#"
        aria-disabled={disabled}
        onClick={(event) => {
          event.preventDefault();
          if (disabled || node.action?.kind !== "reply") return;
          context.sendReply({
            kind: "ui_reply",
            eventId: `reply_${node.line}`,
            source: "button",
            component: "button",
            value: node.action.value,
            line: node.line,
            node: node as never,
          });
        }}
      >
        {node.label}
      </BreadcrumbLink>
    ) : (
      <BreadcrumbPage>{node.label}</BreadcrumbPage>
    );

  return (
    <>
      <BreadcrumbItem>{content}</BreadcrumbItem>
      {node.action?.kind === "reply" ? <BreadcrumbSeparator /> : null}
    </>
  );
}

function PlaygroundToonPagination({
  node,
}: PlaygroundGenericToonProps<{
  type: "pagination";
  page: number;
  totalPages: number;
}>) {
  const pages = Array.from(
    { length: Math.min(node.totalPages, 7) },
    (_, index) => index + 1,
  );

  return (
    <Pagination className="justify-start">
      <PaginationContent>
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === node.page}
              onClick={(event) => event.preventDefault()}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
}

function PlaygroundToonMenu({
  node,
  children,
}: PlaygroundGenericToonProps<{ type: "menu"; title: string }>) {
  return (
    <Card className="gap-0 border bg-muted/40 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle>{node.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">{children}</CardContent>
    </Card>
  );
}

function PlaygroundToonCommand({
  node,
  children,
  disabled,
}: PlaygroundGenericToonProps<{
  type: "command";
  title: string;
  trigger?: string;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => setOpen(disabled ? false : nextOpen)}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit rounded-xl"
          disabled={disabled}
        >
          {node.trigger ?? "Open command palette"}
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{node.title}</DialogTitle>
          <DialogDescription>
            Command palette generated from ToonUI actions.
          </DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput placeholder={node.title} />
          <CommandList>
            <CommandEmpty>No action found.</CommandEmpty>
            <CommandGroup
              heading={node.title}
              onClick={(event) => {
                if (shouldCloseOverlay(event.target)) {
                  window.setTimeout(() => setOpen(false), 0);
                }
              }}
            >
              <PlaygroundCommandContext.Provider value>
                {children}
              </PlaygroundCommandContext.Provider>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function PlaygroundToonAction({
  node,
  context,
  disabled,
}: PlaygroundGenericToonProps<{
  type: "action";
  label: string;
  variant?: ToonButtonComponentProps["node"]["variant"];
  action: { kind: "reply"; value: string } | { kind: "submit" };
  line: number;
}>) {
  const isCommandAction = useContext(PlaygroundCommandContext);
  const variant =
    node.variant === "primary"
      ? "default"
      : node.variant === "danger"
        ? "destructive"
        : node.variant === "outline"
          ? "outline"
          : node.variant === "ghost"
            ? "ghost"
            : "secondary";

  const isDisabled = disabled || node.action.kind !== "reply";

  const sendAction = () => {
    if (isDisabled || node.action.kind !== "reply") return;
    context.sendReply({
      kind: "ui_reply",
      eventId: `reply_${node.line}`,
      source: "button",
      component: "button",
      value: node.action.value,
      line: node.line,
      node: node as never,
    });
  };

  if (isCommandAction) {
    return (
      <CommandItem
        disabled={isDisabled}
        onSelect={sendAction}
        className="cursor-pointer"
      >
        {node.label}
      </CommandItem>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      disabled={isDisabled}
      onClick={sendAction}
      className="h-8 rounded-lg"
    >
      {node.label}
    </Button>
  );
}

type PlaygroundChartPointData = {
  label: string;
  value: number;
};

type PlaygroundChartSeriesData = {
  label: string;
  children: PlaygroundChartPointData[];
};

type PlaygroundChartNode = {
  type: "chart";
  title: string;
  description?: string;
  chartType: "bar" | "line" | "area" | "pie" | string;
  children: PlaygroundChartSeriesData[];
};

const playgroundChartColors = [
  "#2563eb",
  "#7c3aed",
  "#0891b2",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#ec4899",
  "#64748b",
];

function getChartSeries(
  node: PlaygroundGenericToonProps<PlaygroundChartNode>["node"],
) {
  return (node.children ?? []).filter(
    (series) => Array.isArray(series.children) && series.children.length > 0,
  );
}

function getSeriesKey(label: string, index: number) {
  return `series_${index}_${slugify(label).replace(/-/g, "_") || "value"}`;
}

function buildCartesianChart(series: PlaygroundChartSeriesData[]) {
  const labels = Array.from(
    new Set(
      series.flatMap((entry) => entry.children.map((point) => point.label)),
    ),
  );
  const seriesMeta = series.map((entry, index) => ({
    label: entry.label,
    key: getSeriesKey(entry.label, index),
    color: playgroundChartColors[index % playgroundChartColors.length],
  }));
  const data = labels.map((label) => {
    const row: Record<string, string | number | undefined> = { label };

    series.forEach((entry, index) => {
      row[seriesMeta[index].key] = entry.children.find(
        (point) => point.label === label,
      )?.value;
    });

    return row;
  });
  const config = seriesMeta.reduce<ChartConfig>((current, entry) => {
    current[entry.key] = {
      label: entry.label,
      color: entry.color,
    };
    return current;
  }, {});

  return { data, config, seriesMeta };
}

function buildPieChart(series: PlaygroundChartSeriesData[]) {
  const points = series.flatMap((entry) =>
    entry.children.map((point) => ({
      label: series.length > 1 ? `${entry.label}: ${point.label}` : point.label,
      value: point.value,
    })),
  );
  const config = points.reduce<ChartConfig>(
    (current, point, index) => {
      const key = getSeriesKey(point.label, index);
      current[key] = {
        label: point.label,
        color: playgroundChartColors[index % playgroundChartColors.length],
      };
      return current;
    },
    {
      value: {
        label: "Value",
      },
    },
  );
  const data = points.map((point, index) => {
    const key = getSeriesKey(point.label, index);
    return {
      ...point,
      key,
      fill: `var(--color-${key})`,
    };
  });

  return { data, config };
}

function PlaygroundBarChart({
  series,
}: {
  series: PlaygroundChartSeriesData[];
}) {
  const { data, config, seriesMeta } = buildCartesianChart(series);

  return (
    <ChartContainer config={config} className="h-[260px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 12, right: 12, left: 0, bottom: 8 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => String(value).slice(0, 12)}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {seriesMeta.map((entry) => (
          <Bar
            key={entry.key}
            dataKey={entry.key}
            fill={`var(--color-${entry.key})`}
            radius={4}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

function PlaygroundLineChart({
  series,
}: {
  series: PlaygroundChartSeriesData[];
}) {
  const { data, config, seriesMeta } = buildCartesianChart(series);

  return (
    <ChartContainer config={config} className="h-[260px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 12, right: 12, left: 0, bottom: 8 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => String(value).slice(0, 12)}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        {seriesMeta.map((entry) => (
          <Line
            key={entry.key}
            dataKey={entry.key}
            type="monotone"
            stroke={`var(--color-${entry.key})`}
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            connectNulls
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

function PlaygroundAreaChart({
  series,
}: {
  series: PlaygroundChartSeriesData[];
}) {
  const { data, config, seriesMeta } = buildCartesianChart(series);

  return (
    <ChartContainer config={config} className="h-[260px] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 12, right: 12, left: 0, bottom: 8 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => String(value).slice(0, 12)}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        {seriesMeta.map((entry) => (
          <Area
            key={entry.key}
            dataKey={entry.key}
            type="monotone"
            fill={`var(--color-${entry.key})`}
            fillOpacity={0.18}
            stroke={`var(--color-${entry.key})`}
            strokeWidth={2.5}
            connectNulls
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}

function PlaygroundPieChart({
  series,
}: {
  series: PlaygroundChartSeriesData[];
}) {
  const { data, config } = buildPieChart(series);

  return (
    <ChartContainer
      config={config}
      className="mx-auto h-[280px] w-full max-w-md"
    >
      <PieChart accessibilityLayer>
        <ChartTooltip
          content={<ChartTooltipContent nameKey="label" hideLabel />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={58}
          outerRadius={92}
          paddingAngle={2}
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.key} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="label" />} />
      </PieChart>
    </ChartContainer>
  );
}

function PlaygroundToonChart({
  node,
}: PlaygroundGenericToonProps<PlaygroundChartNode>) {
  const series = getChartSeries(node);
  const chart =
    node.chartType === "line" ? (
      <PlaygroundLineChart series={series} />
    ) : node.chartType === "area" ? (
      <PlaygroundAreaChart series={series} />
    ) : node.chartType === "pie" ? (
      <PlaygroundPieChart series={series} />
    ) : (
      <PlaygroundBarChart series={series} />
    );

  return (
    <Card className="gap-0 border bg-muted/40 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle>{node.title}</CardTitle>
        {node.description ? (
          <FieldDescription>{node.description}</FieldDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        {series.length ? (
          chart
        ) : (
          <p className="text-sm text-muted-foreground">
            No chart data was provided.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function PlaygroundToonSeries({
  children,
}: PlaygroundGenericToonProps<{ type: "series"; label: string }>) {
  return <div className="grid gap-2">{children}</div>;
}

function PlaygroundToonPoint({
  node,
}: PlaygroundGenericToonProps<{
  type: "point";
  label: string;
  value: number;
}>) {
  return (
    <div className="flex justify-between rounded-md bg-muted px-2 py-1 text-xs">
      <span>{node.label}</span>
      <span>{node.value}</span>
    </div>
  );
}

function PlaygroundInlineNode({ node }: { node: Record<string, unknown> }) {
  if (node.type === "text") {
    return (
      <p className="text-sm text-muted-foreground">
        {String(node.value ?? "")}
      </p>
    );
  }
  if (node.type === "badge") {
    return <Badge variant="secondary">{String(node.label ?? "")}</Badge>;
  }
  if (node.type === "heading") {
    return <p className="font-medium">{String(node.text ?? "")}</p>;
  }
  return (
    <pre className="rounded-md bg-muted p-2 text-xs">
      {JSON.stringify(node, null, 2)}
    </pre>
  );
}

const toon = createToonReactRuntime({
  adapter: createToonAdapter({
    components: {
      text: PlaygroundToonText,
      heading: PlaygroundToonHeading,
      separator: PlaygroundToonSeparator,
      badge: PlaygroundToonBadge,
      list: PlaygroundToonList,
      item: PlaygroundToonItem,
      card: PlaygroundToonCard,
      confirm: PlaygroundToonConfirm,
      alert: PlaygroundToonAlert,
      table: PlaygroundToonTable,
      empty: PlaygroundToonEmpty,
      tabs: PlaygroundToonTabs,
      tab: PlaygroundToonTab,
      accordion: PlaygroundToonAccordion,
      section: PlaygroundToonSection,
      dialog: PlaygroundToonDialog,
      sheet: PlaygroundToonSheet,
      popover: PlaygroundToonPopover,
      tooltip: PlaygroundToonTooltip,
      progress: PlaygroundToonProgress,
      loading: PlaygroundToonLoading,
      toast: PlaygroundToonToast,
      breadcrumb: PlaygroundToonBreadcrumb,
      crumb: PlaygroundToonCrumb,
      pagination: PlaygroundToonPagination,
      menu: PlaygroundToonMenu,
      command: PlaygroundToonCommand,
      action: PlaygroundToonAction,
      chart: PlaygroundToonChart,
      series: PlaygroundToonSeries,
      point: PlaygroundToonPoint,
      form: PlaygroundToonForm,
      field: PlaygroundToonField,
      button: PlaygroundToonButton,
    } as never,
  }),
});

export function ToonPlayground() {
  const [tab, setTab] = useState<InspectorTab>("conversation");
  const [mobileTab, setMobileTab] = useState<PlaygroundTab>("chat");
  const [prompt, setPrompt] = useState("");
  const conversationScrollAreaRef = useRef<HTMLDivElement | null>(null);
  const promptTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { messages, sendMessage, setMessages, status, error } =
    useChat<PlaygroundUIMessage>({
      transport: new DefaultChatTransport({
        api: "/api/playground-chat",
      }),
    });
  const isSending = status === "submitted" || status === "streaming";
  useEffect(() => {
    const viewport =
      conversationScrollAreaRef.current?.querySelector<HTMLElement>(
        '[data-slot="scroll-area-viewport"]',
      );
    if (!viewport) return;
    viewport.scrollTop = viewport.scrollHeight;
  }, [messages, isSending]);

  const markdownTranscript = useMemo(() => {
    return messages
      .map((message) => {
        const text = message.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("\n")
          .trim();
        const header =
          message.role === "assistant" ? "## Assistant" : "## User";
        const meta =
          message.role === "user" &&
          message.metadata?.kind &&
          message.metadata.kind !== "text"
            ? `\n> Structured event: ${message.metadata.kind}`
            : "";

        return `${header}${meta}\n\n${text}`;
      })
      .join("\n\n---\n\n");
  }, [messages]);

  const submitPlainPrompt = useCallback(
    async (nextPrompt: string) => {
      const trimmed = nextPrompt.trim();
      if (!trimmed || isSending) return;

      setPrompt("");
      await sendMessage({
        text: trimmed,
      });
    },
    [isSending, sendMessage],
  );

  const applyPromptPreset = useCallback((value: string) => {
    setPrompt(value);
    setMobileTab("chat");
    requestAnimationFrame(() => {
      promptTextareaRef.current?.focus();
    });
  }, []);

  const handleStructuredEvent = useCallback(
    async (payload: ToonReplyPayload | ToonSubmitPayload) => {
      if (isSending) return;

      const visibleMessage = toon.messages.toUIMessage(payload);
      setMessages((current) => [...current, visibleMessage]);
      await sendMessage();
    },
    [isSending, sendMessage, setMessages],
  );

  const renderToonMarkdown = useCallback(
    (markdown: string) => (
      <MessageResponse className="text-sm text-muted-foreground">
        {markdown}
      </MessageResponse>
    ),
    [],
  );

  const renderToonError = useCallback(
    (toonError: { message: string; details: string[] }) => (
      <Alert variant="destructive" className="rounded-2xl">
        <AlertTitle>Unable to render ToonUI</AlertTitle>
        <AlertDescription>
          {toonError.message}
          {toonError.details.length ? (
            <ul className="mt-2 list-disc pl-5">
              {toonError.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          ) : null}
        </AlertDescription>
      </Alert>
    ),
    [],
  );

  const tabItems: Array<{
    id: PlaygroundTab;
    label: string;
  }> = [
    { id: "chat", label: "Chat" },
    { id: "conversation", label: "Raw Markdown" },
    { id: "catalog", label: "Catalog" },
  ];

  const inspectorPanel =
    tab === "conversation" ? (
      <div className="h-full min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
        <CodePanel
          code={markdownTranscript || "No conversation yet."}
          language="md"
          live
          showLanguage={false}
          className="min-h-full border-0 bg-transparent p-0 shadow-none rounded-none"
          contentClassName="!max-h-none overflow-visible [&>pre]:min-h-full [&>pre]:p-0"
        />
      </div>
    ) : (
      <ScrollArea className="h-full min-h-0 flex-1">
        <div className="px-3 py-3">
          <div className="grid gap-6">
            <div className="grid min-w-0 gap-4 xl:grid-cols-2">
              {supportedComponents.map((component) => (
                <div
                  key={component.name}
                  className="min-w-0 rounded-2xl border p-4"
                >
                  <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-medium">
                        {component.name}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {component.description}
                      </p>
                    </div>
                  </div>
                  <CodePanel
                    code={component.code}
                    language="toon-ui"
                    showLanguage={false}
                    className="max-w-full border-0 rounded-none px-0 [&_code]:whitespace-pre-wrap [&_pre]:overflow-x-hidden [&_pre]:whitespace-pre-wrap [&_pre]:break-words"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    );

  return (
    <section className="flex flex-1 overscroll-none h-full min-h-0 w-full flex-col overflow-hidden bg-background">
      <header className="shrink-0 flex items-center justify-between gap-4 border-b px-4 py-4">
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

      <div className="grid min-h-0 flex-1 gap-0 overflow-hidden lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative flex h-full min-h-0 flex-col border-b lg:border-r lg:border-b-0">
          <div className="z-10 shrink-0 bg-background">
            <div className="hidden h-14 items-center border-b px-4 text-sm font-medium lg:flex">
              Chat
            </div>
            <Tabs
              value={mobileTab}
              onValueChange={(value: string) => {
                const next = value as PlaygroundTab;
                setMobileTab(next);
                if (next !== "chat") {
                  setTab(next as InspectorTab);
                }
              }}
              className="lg:hidden"
            >
              <ScrollArea className="h-12 w-full whitespace-nowrap">
                <TabsList variant="line" className="h-12 w-max min-w-full px-3">
                  {tabItems.map((item) => (
                    <TabsTrigger
                      key={item.id}
                      className="h-full shrink-0"
                      value={item.id}
                      variant="line"
                    >
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </Tabs>
          </div>

          <ScrollArea
            ref={conversationScrollAreaRef}
            className={cn(
              "min-h-0 flex-1",
              mobileTab !== "chat" && "hidden lg:block",
            )}
          >
            <div className="flex min-h-full flex-col gap-4 px-5 pt-5 pb-28">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex w-full max-w-lg flex-col items-center rounded-3xl p-8 text-center">
                    <p className="text-sm leading-5 text-muted-foreground">
                      Ask for a real workflow inside the chat, then inspect the
                      model transcript, the generated ToonUI, and the new
                      catalog-driven prompt layers behind it.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      {promptPresets.map((preset) => (
                        <Button
                          key={preset.label}
                          type="button"
                          variant="ghost"
                          size={"lg"}
                          disabled={isSending}
                          onClick={() => applyPromptPreset(preset.prompt)}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {messages.map((message) => {
                const textContent = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("\n");

                if (message.role === "assistant") {
                  return (
                    <div key={message.id} className="grid gap-2">
                      <div>
                        <ToonMessage
                          content={textContent}
                          runtime={toon}
                          onReply={handleStructuredEvent}
                          onSubmit={handleStructuredEvent}
                          renderMarkdown={renderToonMarkdown}
                          renderError={renderToonError}
                        />
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={message.id}
                    className="ml-auto grid max-w-[90%] gap-2"
                  >
                    <div className="rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground">
                      <p className="whitespace-pre-wrap leading-6">
                        {message.metadata?.displayContent ?? textContent}
                      </p>
                    </div>
                  </div>
                );
              })}

              {isSending ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LoaderCircle className="size-4 animate-spin" />
                  The model is responding…
                </div>
              ) : null}
            </div>
          </ScrollArea>

          <div
            className={cn(
              "pointer-events-none z-20 shrink-0 bg-background px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3",
              mobileTab !== "chat" && "hidden lg:block",
            )}
          >
            <form
              className="pointer-events-auto grid gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                void submitPlainPrompt(prompt);
              }}
            >
              <InputGroup className="min-h-10 z-10 rounded-md">
                <TextareaAutosize
                  ref={promptTextareaRef}
                  data-slot="input-group-control"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  minRows={2}
                  maxRows={3}
                  placeholder="Ask a question"
                  className="flex field-sizing-content min-h-10 h-10 w-full resize-none rounded-md px-3 py-2.5 text-base leading-6 transition-[color,box-shadow] outline-none placeholder:text-muted-foreground md:text-sm"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="sm"
                    variant="default"
                    type="submit"
                    disabled={isSending || !prompt.trim()}
                  >
                    <Send className="size-4" />
                    Send
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
            {error ? (
              <Alert variant="destructive" className="mt-4 rounded-2xl">
                <AlertTitle>Playground error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            ) : null}
          </div>

          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col lg:hidden",
              mobileTab === "chat" && "hidden",
            )}
          >
            {inspectorPanel}
          </div>
        </section>

        <section className="hidden min-h-0 flex-col overflow-hidden lg:flex">
          <div className="z-10 h-14 shrink-0 bg-background">
            <Tabs
              value={tab}
              onValueChange={(value: string) => {
                const next = value as InspectorTab;
                setTab(next);
                setMobileTab(next);
              }}
              className="h-full"
            >
              <ScrollArea className="h-14 w-full whitespace-nowrap">
                <TabsList variant="line" className="h-14 w-max min-w-full px-3">
                  {tabItems
                    .filter((item) => item.id !== "chat")
                    .map((item) => (
                      <TabsTrigger
                        key={item.id}
                        value={item.id}
                        className="h-full shrink-0"
                        variant="line"
                      >
                        {item.label}
                      </TabsTrigger>
                    ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </Tabs>
          </div>

          {inspectorPanel}
        </section>
      </div>
    </section>
  );
}
