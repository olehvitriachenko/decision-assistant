import { Brain, FileText, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { m } from "@/lib/i18n/uk";
import { elevatedSurfaceClassName, iconSurfaceClassName } from "@/lib/ui/surface-classes";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stepIcons: LucideIcon[] = [FileText, Sparkles, Brain];

export function AppPurposeIntro({
  showSteps = false,
  className,
}: {
  showSteps?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
        {m.product.intro}
      </p>
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground/90 text-pretty">
        {m.product.goal}
      </p>

      {showSteps ? (
        <Card className={elevatedSurfaceClassName}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{m.product.howItWorksTitle}</CardTitle>
            <CardDescription>{m.product.howItWorksDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {m.product.steps.map((step, index) => {
              const Icon = stepIcons[index] ?? Sparkles;

              return (
                <div key={step.title} className="space-y-2">
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg",
                      iconSurfaceClassName
                    )}
                  >
                    <Icon className="size-4 text-foreground" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
