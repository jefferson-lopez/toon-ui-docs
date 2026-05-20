"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Package2,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  ArrowUp,
  Loader2,
} from "lucide-react";
import { DemoPlayer, demo, demoTarget } from "uitodemo";
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
  type ToonTextComponentProps,
} from "@toon-ui/toon-ui";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
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

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type FlowStep =
  | "inventory-request"
  | "awaiting-product-action"
  | "awaiting-delete-confirm"
  | "awaiting-form-submit"
  | "completed";

const INITIAL_STATUS_TEXT = "Waiting for the first message...";
const INITIAL_LAST_INTERACTION = "No ToonUI interaction yet.";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function DemoToonText({ node }: ToonTextComponentProps) {
  return <p className="m-0 text-sm leading-6 text-slate-600">{node.value}</p>;
}

function DemoToonBadge({ node }: ToonBadgeComponentProps) {
  const variant =
    node.variant === "success"
      ? "secondary"
      : node.variant === "warning" || node.variant === "danger"
        ? "destructive"
        : node.variant === "info"
          ? "outline"
          : "outline";

  return (
    <Badge variant={variant} className="w-fit">
      {node.label}
    </Badge>
  );
}

function DemoToonList({ node, children }: ToonListComponentProps) {
  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium text-foreground">{node.title}</p>
      <ItemGroup className="gap-3">{children}</ItemGroup>
    </div>
  );
}

function DemoToonItem({ node, children }: ToonItemComponentProps) {
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

function DemoToonCard({ node, children }: ToonCardComponentProps) {
  return (
    <Card className="gap-0 rounded-2xl border">
      <CardHeader className="pb-3">
        <CardTitle>{node.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">{children}</CardContent>
    </Card>
  );
}

function DemoToonConfirm({ node, children }: ToonConfirmComponentProps) {
  return (
    <Card className="gap-0 rounded-2xl border">
      <CardHeader className="pb-3">
        <CardTitle>{node.title}</CardTitle>
        <FieldDescription>
          Confirma la acción para que el host decida qué hacer después.
        </FieldDescription>
      </CardHeader>
      <CardFooter
        className={cn(
          "grid items-stretch gap-3 border-t-0 bg-transparent pt-0",
          node.variant === "danger" && "text-destructive",
          node.variant === "warning" && "text-amber-600",
        )}
      >
        {children}
      </CardFooter>
    </Card>
  );
}

function DemoToonAlert({ node, children }: ToonAlertComponentProps) {
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

function DemoToonForm({
  node,
  children,
  submitForm,
  disabled,
}: ToonFormComponentProps) {
  return (
    <Card className="gap-0 rounded-2xl border">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitForm();
        }}
      >
        <CardHeader className="pb-3">
          <CardTitle>{node.title}</CardTitle>
          <FieldDescription>
            El formulario vive dentro de ToonUI y el host recibe un submit
            tipado.
          </FieldDescription>
        </CardHeader>
        <CardContent className="grid gap-4">{children}</CardContent>
        {disabled ? <input type="submit" hidden /> : null}
      </form>
    </Card>
  );
}

function DemoToonField(props: ToonFieldComponentProps) {
  const inputProps = getToonInputProps(props);
  const targetId = `toon-field-${slugify(props.node.name)}`;

  return (
    <Field className="gap-2">
      <FieldLabel htmlFor={targetId}>{props.node.label}</FieldLabel>
      <Input
        {...inputProps}
        id={targetId}
        {...demoTarget(targetId)}
        className="h-10 rounded-xl"
      />
    </Field>
  );
}

function DemoToonButton(props: ToonButtonComponentProps) {
  const actionId =
    props.node.action.kind === "reply"
      ? `toon-reply-${slugify(props.node.action.value)}`
      : `toon-submit-${slugify(props.node.label)}`;

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
      {...demoTarget(actionId)}
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
      text: DemoToonText,
      badge: DemoToonBadge,
      list: DemoToonList,
      item: DemoToonItem,
      card: DemoToonCard,
      confirm: DemoToonConfirm,
      alert: DemoToonAlert,
      form: DemoToonForm,
      field: DemoToonField,
      button: DemoToonButton,
    },
  }),
});

const initialPrompt = "show me my products";

const inventoryAssistantMessage = [
  "Sure. Here is the current inventory with ready-to-use actions so you do not have to keep typing if you do not want to.",
  "",
  "```toon-ui",
  'list "Available products":',
  '  item "Candy":',
  '    text "Price: $4.50 · Stock: 18 units"',
  '    button secondary "Edit" reply="edit-candy"',
  '    button danger "Delete" reply="delete-candy"',
  '  item "Premium chocolate":',
  '    text "Price: $12.99 · Stock: 9 units"',
  '    button secondary "Edit" reply="edit-premium-chocolate"',
  '    button danger "Delete" reply="delete-premium-chocolate"',
  '  item "Iced coffee":',
  '    text "Price: $8.25 · Stock: 24 units"',
  '    button secondary "Edit" reply="edit-iced-coffee"',
  '    button danger "Delete" reply="delete-iced-coffee"',
  "```",
].join("\n");

const confirmAssistantMessage = [
  "Before deleting the product, I need explicit confirmation.",
  "",
  "That keeps the intent clear and gives the host a reliable signal to decide whether to execute the real action.",
  "",
  "```toon-ui",
  'confirm danger "Are you sure you want to delete this product?":',
  '  text "The Candy product will be deleted."',
  '  button secondary "Cancel" reply="cancel-delete"',
  '  button danger "Yes, I am sure" reply="confirm-delete"',
  "```",
].join("\n");

const successAssistantMessage = [
  "Done. The host received the confirmation and completed the deletion.",
  "",
  "```toon-ui",
  'alert success "Product deleted successfully":',
  '  text "The Candy product was deleted successfully."',
  'card "Recommended actions":',
  '  text "You can continue without typing again. Choose the next suggested action."',
  '  button primary "Create product" reply="start-create-product"',
  '  button secondary "View updated inventory" reply="show-products-again"',
  '  button secondary "Edit another product" reply="edit-premium-chocolate"',
  "```",
].join("\n");

const createProductMessage = [
  "Great. Let us create a new product with a structured form so the host receives typed data.",
  "",
  "```toon-ui",
  'form "Create product":',
  '  field name text "Name" placeholder="Ex: Premium chocolate" required',
  '  field price number "Price" placeholder="Ex: 12.99" required',
  '  field stock number "Stock" placeholder="Ex: 36" required',
  '  button primary "Create product" submit',
  "```",
].join("\n");

const STREAM_INITIAL_DELAY_MS = 520;
const STREAM_CHARS_PER_TICK = 2;
const STREAM_TICK_MS = 18;
const STREAM_BUFFER_MS = 300;
const CURSOR_RESET_DELAY_MS = 420;
const UI_STREAM_INITIAL_DELAY_MS = 0;
const UI_STREAM_CHARS_PER_TICK = 5;
const UI_STREAM_TICK_MS = 10;

function splitAssistantContent(value: string) {
  const match = value.match(/```toon-ui[\s\S]*$/);

  if (!match || match.index == null) {
    return {
      markdown: value,
      uiBlock: "",
    };
  }

  return {
    markdown: value.slice(0, match.index).trimEnd(),
    uiBlock: match[0],
  };
}

function getStreamPlaybackMs(value: string) {
  const { markdown, uiBlock } = splitAssistantContent(value);
  const markdownChars = markdown.length;
  const uiChars = uiBlock.length;

  return (
    STREAM_INITIAL_DELAY_MS +
    Math.ceil(markdownChars / STREAM_CHARS_PER_TICK) * STREAM_TICK_MS +
    UI_STREAM_INITIAL_DELAY_MS +
    Math.ceil(uiChars / UI_STREAM_CHARS_PER_TICK) * UI_STREAM_TICK_MS +
    STREAM_BUFFER_MS
  );
}

const inventoryMessagePlaybackMs = getStreamPlaybackMs(
  inventoryAssistantMessage,
);
const confirmMessagePlaybackMs = getStreamPlaybackMs(confirmAssistantMessage);
const successMessagePlaybackMs = getStreamPlaybackMs(successAssistantMessage);
const createProductPlaybackMs = getStreamPlaybackMs(createProductMessage);

function getCreatedProductMessage(name: string, price: string, stock: string) {
  return [
    "Done. The host processed the submit action and prepared the next recommended step.",
    "",
    "```toon-ui",
    'alert success "Product created successfully":',
    `  text "The product ${name} was created successfully with price $${price} and initial stock of ${stock} units."`,
    `card "Created product":`,
    `  text "${name}"`,
    '  badge "Active" success',
    '  list "Details":',
    '    item "Price":',
    `      text "$${price}"`,
    '    item "Initial stock":',
    `      text "${stock} units"`,
    '    item "Status":',
    '      text "Ready to publish"',
    '  button secondary "View all products" reply="show-products-again"',
    `  button secondary "Edit ${name}" reply="edit-created-product"`,
    '  button primary "Create another product" reply="start-create-product"',
    "```",
  ].join("\n");
}

const createdProductPlaybackMs = getStreamPlaybackMs(
  getCreatedProductMessage("Chocolate premium", "12.99", "36"),
);

function streamText(
  value: string,
  onUpdate: (next: string) => void,
  onDone: () => void,
  charsPerTick = STREAM_CHARS_PER_TICK,
  tickMs = STREAM_TICK_MS,
) {
  let index = 0;
  const timer = window.setInterval(() => {
    index += charsPerTick;
    onUpdate(value.slice(0, index));

    if (index >= value.length) {
      window.clearInterval(timer);
      onDone();
    }
  }, tickMs);

  return () => window.clearInterval(timer);
}

function createMessage(
  role: ChatMessage["role"],
  content: string,
): ChatMessage {
  return {
    id: `${role}-${Math.random().toString(36).slice(2, 10)}`,
    role,
    content,
  };
}

function humanizeReplyValue(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getReplyChatLabel(payload: ToonReplyPayload) {
  const genericLabels = new Set(["Delete", "Edit"]);

  if (genericLabels.has(payload.node.label)) {
    return humanizeReplyValue(payload.value);
  }

  return payload.node.label;
}

function renderAssistantMarkdown(markdown: string) {
  return <MessageResponse>{markdown}</MessageResponse>;
}

export function LandingDemo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [composerValue, setComposerValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [statusText, setStatusText] = useState(INITIAL_STATUS_TEXT);
  const [lastInteraction, setLastInteraction] = useState(
    INITIAL_LAST_INTERACTION,
  );
  const [flowStep, setFlowStep] = useState<FlowStep>("inventory-request");
  const [isInView, setIsInView] = useState(false);
  const [hasCompletedPlayback, setHasCompletedPlayback] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  const steps = useMemo(
    () =>
      demo()
        .wait(700)
        .focus("chat-input", { cursor: "text" })
        .type("chat-input", initialPrompt, {
          delay: 62,
          cursor: "text",
        })
        .wait(1400)
        .click("send-message", { cursor: "pointer", hover: true })
        .highlight("app", { cursor: "arrow", delay: CURSOR_RESET_DELAY_MS })
        .wait(inventoryMessagePlaybackMs)
        .click("toon-reply-delete-candy", {
          cursor: "pointer",
          hover: true,
        })
        .highlight("app", { cursor: "arrow", delay: CURSOR_RESET_DELAY_MS })
        .wait(confirmMessagePlaybackMs)
        .click("toon-reply-confirm-delete", {
          cursor: "pointer",
          hover: true,
        })
        .highlight("app", { cursor: "arrow", delay: CURSOR_RESET_DELAY_MS })
        .wait(successMessagePlaybackMs)
        .click("toon-reply-start-create-product", {
          cursor: "pointer",
          hover: true,
        })
        .highlight("app", { cursor: "arrow", delay: CURSOR_RESET_DELAY_MS })
        .wait(createProductPlaybackMs)
        .wait(900)
        .focus("toon-field-name", { cursor: "text" })
        .type("toon-field-name", "Chocolate premium", {
          delay: 85,
          cursor: "text",
        })
        .wait(320)
        .wait(140)
        .focus("toon-field-price", { cursor: "text" })
        .type("toon-field-price", "12.99", {
          delay: 115,
          cursor: "text",
        })
        .wait(360)
        .wait(140)
        .focus("toon-field-stock", { cursor: "text" })
        .type("toon-field-stock", "36", {
          delay: 110,
          cursor: "text",
        })
        .wait(420)
        .click("toon-submit-create-product", {
          cursor: "pointer",
          hover: true,
        })
        .highlight("app", { cursor: "arrow", delay: CURSOR_RESET_DELAY_MS })
        .wait(createdProductPlaybackMs)
        .build(),
    [],
  );

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || hasCompletedPlayback) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry?.isIntersecting ?? false);
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasCompletedPlayback]);

  function resetConversation() {
    cleanupRef.current?.();
    cleanupRef.current = null;
    setComposerValue("");
    setMessages([]);
    setStatusText(INITIAL_STATUS_TEXT);
    setLastInteraction(INITIAL_LAST_INTERACTION);
    setFlowStep("inventory-request");
  }

  function appendInteractionMessage(content: string) {
    setMessages((current) => [...current, createMessage("user", content)]);
  }

  function streamAssistantMessage(content: string, onDone?: () => void) {
    const assistantId = `assistant-${Math.random().toString(36).slice(2, 10)}`;
    const { markdown, uiBlock } = splitAssistantContent(content);
    let stopTextStream: (() => void) | null = null;
    let stopUIStream: (() => void) | null = null;

    setMessages((current) => [
      ...current,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    const textDelay = window.setTimeout(() => {
      stopTextStream = streamText(
        markdown,
        (next) => {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? { ...message, content: next }
                : message,
            ),
          );
        },
        () => {
          if (!uiBlock) {
            onDone?.();
            return;
          }

          const uiDelay = window.setTimeout(() => {
            stopUIStream = streamText(
              uiBlock,
              (next) => {
                setMessages((current) =>
                  current.map((message) =>
                    message.id === assistantId
                      ? {
                          ...message,
                          content: markdown ? `${markdown}\n\n${next}` : next,
                        }
                      : message,
                  ),
                );
              },
              () => {
                onDone?.();
              },
              UI_STREAM_CHARS_PER_TICK,
              UI_STREAM_TICK_MS,
            );
          }, UI_STREAM_INITIAL_DELAY_MS);

          cleanupRef.current = () => {
            window.clearTimeout(textDelay);
            window.clearTimeout(uiDelay);
            stopTextStream?.();
            stopUIStream?.();
          };
        },
      );
    }, STREAM_INITIAL_DELAY_MS);

    cleanupRef.current = () => {
      window.clearTimeout(textDelay);
      stopTextStream?.();
      stopUIStream?.();
    };
  }

  function handlePromptSubmit(messageText: string) {
    if (
      !messageText.trim() ||
      flowStep === "awaiting-delete-confirm" ||
      flowStep === "awaiting-form-submit" ||
      flowStep === "completed"
    ) {
      return;
    }

    const userValue = messageText.trim();
    setComposerValue("");
    setMessages((current) => [...current, createMessage("user", userValue)]);

    if (flowStep === "inventory-request") {
      setStatusText("The app asked the model to show the current inventory...");
      setFlowStep("awaiting-product-action");
      streamAssistantMessage(inventoryAssistantMessage, () => {
        setStatusText(
          "The AI responded with a structured list and contextual actions for each product.",
        );
      });
      return;
    }

    if (
      flowStep === "awaiting-product-action" &&
      /delete|remove|elimin|borr/.test(userValue.toLowerCase()) &&
      /candy|dulces/.test(userValue.toLowerCase())
    ) {
      setStatusText("The app asked to confirm deletion of Candy...");
      setFlowStep("awaiting-delete-confirm");
      streamAssistantMessage(confirmAssistantMessage, () => {
        setStatusText(
          "The AI responded with a dangerous confirmation for the sensitive action.",
        );
      });
      return;
    }

    if (
      flowStep === "awaiting-product-action" &&
      /create|new|crear|nuevo/.test(userValue.toLowerCase())
    ) {
      setStatusText("The app sent the request to create a product...");
      setFlowStep("awaiting-form-submit");
      streamAssistantMessage(createProductMessage, () => {
        setStatusText(
          "The AI showed the structured form to create the product.",
        );
      });
      return;
    }
  }

  function handleToonEvent(payload: ToonReplyPayload | ToonSubmitPayload) {
    const interaction = toon.messages.toUIMessage(payload);
    const displayLabel =
      payload.kind === "ui_reply"
        ? getReplyChatLabel(payload)
        : interaction.metadata.displayContent;

    setLastInteraction(displayLabel);
    setStatusText(`Host received the structured event: ${displayLabel}`);
    appendInteractionMessage(displayLabel);

    if (payload.kind === "ui_submit") {
      const name = String(payload.values.name ?? "Product");
      const price = String(payload.values.price ?? "0.00");
      const stock = String(payload.values.stock ?? "0");
      setFlowStep("completed");
      streamAssistantMessage(
        getCreatedProductMessage(name, price, stock),
        () => {
          setStatusText(
            "The host received the structured submit and created the product.",
          );
        },
      );
      return;
    }

    if (payload.value === "delete-candy") {
      setFlowStep("awaiting-delete-confirm");
      streamAssistantMessage(confirmAssistantMessage, () => {
        setStatusText(
          "The AI responded with a dangerous confirmation for the sensitive action.",
        );
      });
      return;
    }

    if (payload.value === "confirm-delete") {
      setFlowStep("awaiting-product-action");
      streamAssistantMessage(successAssistantMessage, () => {
        setStatusText(
          "The host confirmed the deletion and suggested the next step from the UI itself.",
        );
      });
      return;
    }

    if (payload.value === "start-create-product") {
      setFlowStep("awaiting-form-submit");
      streamAssistantMessage(createProductMessage, () => {
        setStatusText(
          "The AI showed the structured form to create the product.",
        );
      });
      return;
    }

    if (payload.value === "show-products-again") {
      setFlowStep("awaiting-product-action");
      streamAssistantMessage(inventoryAssistantMessage, () => {
        setStatusText(
          "The AI showed the inventory again with contextual actions.",
        );
      });
      return;
    }

    if (payload.value === "cancel-delete") {
      streamAssistantMessage(
        [
          "Done. The cancel intent also returned to the host as a structured event.",
          "",
          "```toon-ui",
          'alert info "Deletion canceled":',
          '  text "The user decided not to continue deleting the product."',
          'card "Recommended actions":',
          '  text "You can keep exploring the inventory or create a new product."',
          '  button primary "Create product" reply="start-create-product"',
          '  button secondary "View updated inventory" reply="show-products-again"',
          "```",
        ].join("\n"),
        () => {
          setStatusText("The host received the cancellation.");
        },
      );
      setFlowStep("awaiting-product-action");
      return;
    }

    if (
      payload.value === "edit-premium-chocolate" ||
      payload.value === "edit-created-product" ||
      payload.value === "edit-candy" ||
      payload.value === "edit-iced-coffee"
    ) {
      setFlowStep("awaiting-product-action");
      streamAssistantMessage(
        [
          "Done. In this demo we use the edit action to show how the UI can recommend the next step without forcing the user to type.",
          "",
          "```toon-ui",
          'alert info "Suggested edit":',
          '  text "The edit action was already sent to the host as a typed event."',
          'card "Recommended actions":',
          '  text "For this story, we continue by creating a new product."',
          '  button primary "Create product" reply="start-create-product"',
          '  button secondary "View updated inventory" reply="show-products-again"',
          "```",
        ].join("\n"),
        () => {
          setStatusText(
            "The host received the edit intent and the UI recommended the next action.",
          );
        },
      );
    }
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-[1040px] overflow-hidden"
    >
      <DemoPlayer
        steps={steps}
        isActive={isInView && !hasCompletedPlayback}
        onStatusChange={(status) => {
          if (status !== "completed" || hasCompletedPlayback) return;

          setHasCompletedPlayback(true);
          resetTimerRef.current = window.setTimeout(() => {
            resetConversation();
          }, 400);
        }}
        baseWidth={1040}
        baseHeight={720}
        frameBorderRadius="lg"
        showControls={false}
        cursor={{ enabled: true, hideNativeCursor: false }}
        className="bg-transparent"
      >
        <div className="flex h-[720px] w-[1040px] flex-col overflow-hidden text-slate-900">
          <div className="border-b px-3 py-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold tracking-tight text-slate-950">
                  Toon<span className="text-primary">-UI</span> Demo
                </p>
              </div>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 ">
            <div className="flex min-h-0 flex-col">
              <Conversation className="min-h-0 flex-1">
                <ConversationContent>
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <Message
                        key={message.id}
                        from={
                          message.role === "assistant" ? "assistant" : "user"
                        }
                      >
                        <MessageContent
                          from={
                            message.role === "assistant" ? "assistant" : "user"
                          }
                        >
                          {message.role === "assistant" ? (
                            message.content ? (
                              <ToonMessage
                                content={message.content}
                                runtime={toon}
                                onReply={handleToonEvent}
                                onSubmit={handleToonEvent}
                                renderMarkdown={renderAssistantMarkdown}
                              />
                            ) : null
                          ) : (
                            <p className="whitespace-pre-wrap text-sm leading-6">
                              {message.content}
                            </p>
                          )}
                        </MessageContent>
                      </Message>
                    ))
                  ) : (
                    <ConversationEmptyState
                      icon={<Package2 className="size-6" />}
                      title="Complete conversational flow"
                      description="The demo shows products with contextual actions, deletes Candy with confirmation, and creates a new product from guided recommendations."
                    />
                  )}
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>

              <div className="pl-2 pb-4 pr-4">
                <form
                  className="flex items-center gap-3 rounded-md border p-1"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handlePromptSubmit(composerValue);
                  }}
                >
                  <Input
                    {...demoTarget("chat-input")}
                    value={composerValue}
                    onChange={(event) => setComposerValue(event.target.value)}
                    placeholder="Type the next action you want to take..."
                    className="h-10 rounded-md border-0 bg-transparent shadow-none focus-visible:ring-0"
                  />

                  <Button
                    type="submit"
                    {...demoTarget("send-message")}
                    className="rounded-md"
                    size={"icon"}
                    disabled={
                      !composerValue.trim() ||
                      flowStep === "awaiting-delete-confirm" ||
                      flowStep === "awaiting-form-submit" ||
                      flowStep === "completed"
                    }
                  >
                    {flowStep === "awaiting-delete-confirm" ||
                    flowStep === "awaiting-form-submit" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ArrowUp className="size-4" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DemoPlayer>
    </div>
  );
}
