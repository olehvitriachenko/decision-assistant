"use client";

import { useState, type ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePrefersHover } from "@/hooks/use-prefers-hover";
import { cn } from "@/lib/utils";

type HintProps = {
  label: string;
  description: string;
  ariaHint: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function Hint({
  label,
  description,
  ariaHint,
  children,
  className,
  contentClassName,
}: HintProps) {
  const prefersHover = usePrefersHover();
  const [open, setOpen] = useState(false);

  if (!prefersHover) {
    return (
      <div className={cn("space-y-1", className)}>
        {children}
        <p className="text-xs leading-relaxed text-pretty text-muted-foreground">
          {description}
        </p>
      </div>
    );
  }

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`${label}. ${ariaHint}`}
          className={cn(
            "inline-flex cursor-help rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
          )}
          onClick={() => setOpen((current) => !current)}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        className={cn(
          "max-w-[18rem] px-3 py-2 text-sm leading-relaxed font-normal",
          contentClassName
        )}
      >
        {description}
      </TooltipContent>
    </Tooltip>
  );
}
