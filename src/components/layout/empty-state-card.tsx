import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  action,
  variant = "default",
  iconRounded = "2xl",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    href: string;
    label: string;
    icon?: LucideIcon;
  };
  variant?: "default" | "dashed";
  iconRounded?: "2xl" | "full";
}) {
  const ActionIcon = action?.icon;

  return (
    <Card
      className={cn(
        "backdrop-blur-sm",
        variant === "dashed"
          ? "border-dashed border-border/60 bg-muted/20"
          : "border-border/60 bg-card/50"
      )}
    >
      <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center">
        <span
          className={cn(
            "flex size-12 items-center justify-center border border-border/60 bg-muted/30",
            iconRounded === "full" ? "rounded-full bg-background/80" : "rounded-2xl"
          )}
        >
          <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
        </span>
        <div className="space-y-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <CardDescription className="max-w-md text-balance">{description}</CardDescription>
        </div>
        {action ? (
          <Button asChild>
            <Link href={action.href}>
              {ActionIcon ? (
                <ActionIcon className="size-4" aria-hidden="true" />
              ) : null}
              {action.label}
            </Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
