"use client";

import { ArrowUp, Loader2 } from "lucide-react";
import { type ComponentProps, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PromptInputMessage = {
  text: string;
};

export function PromptInput({
  className,
  onSubmit,
  children,
  ...props
}: Omit<ComponentProps<"form">, "onSubmit"> & {
  onSubmit: (message: PromptInputMessage) => void;
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const text = String(formData.get("prompt") ?? "").trim();

    onSubmit({ text });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("rounded-[28px] border  p-4", className)}
      {...props}
    >
      {children}
    </form>
  );
}

export function PromptInputTextarea({
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      name="prompt"
      className={cn(
        "w-full resize-none bg-transparent text-base leading-7 text-slate-900 outline-none placeholder:text-slate-400",
        className,
      )}
      {...props}
    />
  );
}

export function PromptInputSubmit({
  className,
  status = "ready",
  ...props
}: Omit<ComponentProps<typeof Button>, "type"> & {
  status?: "ready" | "streaming";
}) {
  return (
    <Button
      type="submit"
      className={cn("inline-flex items-center gap-2 rounded-full", className)}
      {...props}
    >
      {status === "streaming" ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <ArrowUp className="size-4" />
      )}
      Enviar
    </Button>
  );
}
