"use client";

import { useEffect, useRef, useState } from "react";
import { createHighlighter, type LanguageRegistration } from "shiki";
import { cn } from "@/lib/utils";

const toonUiShikiLanguage = {
  name: "toon-ui",
  scopeName: "source.toon-ui",
  aliases: ["toonui"],
  repository: {},
  patterns: [
    {
      match:
        "^(\\s*)(text|heading|separator|badge|button|field|card|confirm|form|item|alert|empty|dialog|sheet|popover|list|tabs|accordion|menu|command|tab|section|tooltip|progress|loading|toast|breadcrumb|crumb|pagination|action|table|chart|series|point)\\b",
      captures: {
        "1": { name: "punctuation.whitespace.indent.toon-ui" },
        "2": { name: "keyword.control.toon-ui" },
      },
    },
    {
      match:
        "\\b(primary|secondary|outline|ghost|danger|success|warning|info|neutral|bar|line|area|pie|horizontal|vertical|left|right|top|bottom|text|email|number|password|date|time|textarea|select|checkbox|radio|switch|combobox|otp|slider|multiselect)\\b",
      name: "constant.language.toon-ui",
    },
    {
      match:
        "\\b(description|placeholder|helper|reply|trigger|side|x|y|value|min|max|step|page|totalPages|options|name|variant)=",
      name: "variable.parameter.toon-ui",
    },
    {
      match: "\\b(required|submit)\\b",
      name: "storage.modifier.toon-ui",
    },
    {
      begin: '"',
      end: '"',
      name: "string.quoted.double.toon-ui",
      patterns: [{ match: "\\\\.", name: "constant.character.escape.toon-ui" }],
    },
    {
      match: "\\b-?\\d+(?:\\.\\d+)?\\b",
      name: "constant.numeric.toon-ui",
    },
    {
      match: "[:=]",
      name: "keyword.operator.toon-ui",
    },
  ],
} satisfies LanguageRegistration;

const codePanelHighlighterPromise = createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: [
    toonUiShikiLanguage,
    "txt",
    "md",
    "ts",
    "tsx",
    "bash",
    "shell",
    "json",
  ],
});

function getCodePanelLanguage(language: string) {
  if (language === "toon-ui") return "toon-ui";
  if (language === "sh") return "shell";
  return language;
}

function extractShikiLineHtml(html: string) {
  return Array.from(
    html.matchAll(
      /<span class="line">[\s\S]*?<\/span>(?=\n<span class="line">|<\/code>)/g,
    ),
  ).map(([line]) => line);
}

function replaceShikiLineHtml(html: string, lines: string[]) {
  let index = 0;

  return html.replace(
    /<span class="line">[\s\S]*?<\/span>(?=\n<span class="line">|<\/code>)/g,
    () => {
      const nextLine = lines[index];
      index += 1;
      return nextLine;
    },
  );
}

async function highlightCodePanel(code: string, language: string) {
  const highlighter = await codePanelHighlighterPromise;
  const resolvedLanguage = getCodePanelLanguage(language);

  if (resolvedLanguage !== "md") {
    return highlighter.codeToHtml(code, {
      lang: resolvedLanguage,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
    });
  }

  const markdownHtml = highlighter.codeToHtml(code, {
    lang: "md",
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: false,
  });
  const markdownLines = extractShikiLineHtml(markdownHtml);
  const sourceLines = code.split("\n");

  for (let index = 0; index < sourceLines.length; index += 1) {
    const fenceMatch = sourceLines[index].match(/^```(toon-ui|toonui)\s*$/);
    if (!fenceMatch) continue;

    const contentStart = index + 1;
    let contentEnd = contentStart;
    while (
      contentEnd < sourceLines.length &&
      sourceLines[contentEnd].trim() !== "```"
    ) {
      contentEnd += 1;
    }

    if (contentEnd >= sourceLines.length) break;

    const toonSource = sourceLines.slice(contentStart, contentEnd).join("\n");
    const toonHtml = highlighter.codeToHtml(toonSource, {
      lang: "toon-ui",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
    });
    const toonLines = extractShikiLineHtml(toonHtml);

    toonLines.forEach((lineHtml, lineOffset) => {
      markdownLines[contentStart + lineOffset] = lineHtml;
    });

    index = contentEnd;
  }

  return replaceShikiLineHtml(markdownHtml, markdownLines);
}

export function CodePanel({
  code,
  language = "txt",
  live = false,
  showLanguage = true,
  className,
  contentClassName,
}: {
  code: string;
  language?: string;
  live?: boolean;
  showLanguage?: boolean;
  className?: string;
  contentClassName?: string;
}) {
  const [html, setHtml] = useState<string>("");
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const delay = live ? 80 : 0;

    const timeout = window.setTimeout(() => {
      void highlightCodePanel(code, language).then((nextHtml) => {
        if (!cancelled) setHtml(nextHtml);
      });
    }, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [code, language, live]);

  useEffect(() => {
    if (!live) return;
    const panel = panelRef.current;
    if (!panel) return;
    panel.scrollTop = panel.scrollHeight;
  }, [html, live]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-background",
        className,
      )}
    >
      {showLanguage ? (
        <div className="border-b px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {language}
        </div>
      ) : null}
      <div
        ref={live ? panelRef : undefined}
        className={cn(
          "[&>pre]:m-0 [&>pre]:overflow-x-auto [&>pre]:!bg-transparent [&>pre]:p-4 [&>pre]:text-sm [&>pre]:leading-6",
          live &&
            "max-h-[calc(100vh-14rem)] overflow-y-auto [&>pre]:whitespace-pre-wrap",
          contentClassName,
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
