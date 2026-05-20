"use client";

import { type ComponentProps } from "react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";

export function Message({
  className,
  from,
  ...props
}: ComponentProps<"div"> & { from: "user" | "assistant" }) {
  return (
    <div
      className={cn(
        "flex w-full",
        from === "user" ? "justify-end" : "justify-start",
        className,
      )}
      data-role={from}
      {...props}
    />
  );
}

export function MessageContent({
  className,
  from,
  ...props
}: ComponentProps<"div"> & { from?: "user" | "assistant" }) {
  return (
    <div
      className={cn(
        "max-w-190",
        from === "user"
          ? "max-w-170 bg-secondary rounded-md text-primary! p-3"
          : "rounded-bl-md border-slate-200 bg-white text-slate-900",
        className,
      )}
      {...props}
    />
  );
}

export function MessageResponse({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  const content = typeof children === "string" ? children : "";

  return (
    <div className={cn("[&_p]:my-0 [&_p]:leading-7", className)} {...props}>
      <Streamdown>{content}</Streamdown>
    </div>
  );
}
