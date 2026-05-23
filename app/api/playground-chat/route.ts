import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { createToonProtocol } from "@toon-ui/core";
import { playgroundToonComponentKeys } from "@/lib/toon-catalog";

type PlaygroundMessageMetadata = {
  displayContent?: string;
  kind?: "text" | "ui_reply" | "ui_submit";
};

const createPlaygroundToonProtocol = createToonProtocol as unknown as (options: {
  components: typeof playgroundToonComponentKeys;
}) => ReturnType<typeof createToonProtocol>;

const toon = createPlaygroundToonProtocol({
  components: playgroundToonComponentKeys,
});
const modelId = process.env.OPENAI_PLAYGROUND_MODEL ?? "gpt-4o-mini";

const system = [
  toon.prompt,
  "You are the live demo assistant for the ToonUI documentation playground.",
  "This playground is for end-user chat experiences inside apps, not frontend generation.",
  `The active ToonUI catalog is: ${playgroundToonComponentKeys.join(", ")}.`,
  "Respond like a real product assistant inside a chat surface.",
  "Use ToonUI when structured UI reduces friction for the user.",
  "Only use components from the active catalog. Do not invent components.",
  "Keep responses concise, useful, and realistic.",
  "You may return plain markdown only when structured UI is unnecessary.",
  "When the user sends a structured submit or reply event, treat it as real user intent coming from the UI.",
  "Never mention internal implementation unless the user explicitly asks about it.",
].join("\n\n");

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      {
        error:
          "Missing OPENAI_API_KEY. Add it to your .env.local to use the live playground.",
      },
      { status: 500 },
    );
  }

  try {
    const { messages } = (await request.json()) as {
      messages: UIMessage<PlaygroundMessageMetadata>[];
    };

    const result = streamText({
      model: openai(modelId),
      system,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected playground server error.",
      },
      { status: 500 },
    );
  }
}
