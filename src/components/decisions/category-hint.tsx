"use client";

import { CircleAlert } from "lucide-react";
import { type ReactNode } from "react";

import { getCategoryDescription, getCategoryLabel } from "@/lib/categories/registry";
import { m } from "@/lib/i18n/uk";
import { categoryOutlineBadgeClassName } from "@/lib/ui/surface-classes";
import { Hint } from "@/components/ui/hint";
import { usePrefersHover } from "@/hooks/use-prefers-hover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CategoryHint({
  category,
  size = "sm",
  className,
  companion,
  variant = "badge",
}: {
  category: string;
  size?: "sm" | "md";
  className?: string;
  companion?: ReactNode;
  variant?: "badge" | "section";
}) {
  const prefersHover = usePrefersHover();
  const label = getCategoryLabel(category);
  const description = getCategoryDescription(category);

  if (variant === "section") {
    return (
      <div className={cn("space-y-1", className)}>
        <p className="text-xl font-semibold tracking-tight text-balance">{label}</p>
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          {description}
        </p>
      </div>
    );
  }

  const badgeClassName = cn(
    "inline-flex items-center justify-center leading-none py-0",
    size === "md" ? "h-6 px-2.5 text-xs" : "h-5",
    categoryOutlineBadgeClassName
  );

  const badge = (
    <Badge variant="outline" className={badgeClassName}>
      {label}
    </Badge>
  );

  const hintBadge = (
    <Badge
      variant="outline"
      className={cn(badgeClassName, "gap-1 pl-2 pr-1.5")}
    >
      {label}
      <CircleAlert
        className={cn(
          "size-3 shrink-0 text-muted-foreground transition-colors",
          "group-hover:text-primary group-focus-visible:text-primary dark:group-hover:text-foreground"
        )}
        aria-hidden="true"
      />
    </Badge>
  );

  if (!prefersHover) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex flex-wrap items-center gap-2">
          {companion}
          {badge}
        </div>
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Hint
        label={label}
        description={description}
        ariaHint={m.decisions.analysis.categoryHint}
      >
        {hintBadge}
      </Hint>
      {companion}
    </div>
  );
}
