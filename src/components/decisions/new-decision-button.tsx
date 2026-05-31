import Link from "next/link";
import { Plus } from "lucide-react";

import { routes } from "@/lib/config/routes";
import { m } from "@/lib/i18n/uk";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function NewDecisionButton({
  className,
  fullWidth = false,
  showLabel = true,
  size = "sm",
}: {
  className?: string;
  fullWidth?: boolean;
  showLabel?: boolean;
  size?: "default" | "sm" | "lg" | "icon-sm";
}) {
  if (!showLabel) {
    return (
      <Button asChild size="icon-sm" className={className}>
        <Link href={routes.decisionsNew} aria-label={m.nav.newDecision}>
          <Plus className="size-4" aria-hidden="true" />
        </Link>
      </Button>
    );
  }

  return (
    <Button
      asChild
      size={size}
      className={cn(fullWidth && "w-full", className)}
    >
      <Link href={routes.decisionsNew}>
        <Plus className="size-4" aria-hidden="true" />
        {m.nav.newDecision}
      </Link>
    </Button>
  );
}
