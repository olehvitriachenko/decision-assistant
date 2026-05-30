import Link from "next/link";
import {
  ArrowRight,
  Brain,
  FileText,
  GitBranch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/config/routes";
import { m } from "@/lib/i18n/uk";
import {
  elevatedSurfaceClassName,
  iconSurfaceClassName,
  softSurfaceClassName,
} from "@/lib/ui/surface-classes";
import { cn } from "@/lib/utils";

const featureIcons: LucideIcon[] = [Brain, GitBranch, ShieldCheck];
const stepIcons: LucideIcon[] = [FileText, Sparkles, Brain];

function stripStepPrefix(title: string) {
  return title.replace(/^\d+\.\s*/, "");
}

export function LandingHomeContent() {
  return (
    <>
      <section
        id="top"
        className="scroll-mt-14 grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-14 lg:py-24"
      >
        <div className="space-y-6">
          <Badge variant="secondary" className="h-7 px-3 text-xs font-medium">
            {m.landing.badge}
          </Badge>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              {m.landing.title}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              {m.landing.subtitle}
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground/90 text-pretty">
              {m.product.goal}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="h-11 px-6">
              <Link href={routes.register}>
                {m.landing.createAccount}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-6">
              <Link href={routes.login}>{m.landing.signIn}</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">{m.landing.heroNote}</p>
        </div>

        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border p-5 sm:p-6",
            elevatedSurfaceClassName
          )}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,oklch(0.72_0.08_264/0.18)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.45_0.08_264/0.22)_0%,transparent_70%)]"
          />

          <div className="relative space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {m.landing.preview.title}
              </p>
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg",
                  iconSurfaceClassName
                )}
              >
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{m.landing.preview.category}</Badge>
              <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                {m.landing.preview.support}
              </Badge>
            </div>

            <p className="text-sm leading-relaxed text-pretty">
              {m.landing.preview.summary}
            </p>

            <div className="space-y-2 border-t border-border/60 pt-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {m.dashboard.biasesTitle}
              </p>
              <p className="text-sm">{m.landing.preview.bias}</p>
            </div>

            <div className="space-y-2 border-t border-border/60 pt-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {m.decisions.analysis.alternatives}
              </p>
              <p className="text-sm text-muted-foreground text-pretty">
                {m.landing.preview.alternative}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-14 space-y-6 pb-16 sm:pb-20">
        <div className="space-y-1">
          <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {m.landing.featuresTitle}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {m.landing.features.map((feature, index) => {
            const Icon = featureIcons[index] ?? Sparkles;

            return (
              <div
                key={feature.title}
                className={cn("rounded-xl border p-5", softSurfaceClassName)}
              >
                <span
                  className={cn(
                    "mb-4 flex size-10 items-center justify-center rounded-lg",
                    iconSurfaceClassName
                  )}
                >
                  <Icon className="size-4.5 text-foreground" aria-hidden="true" />
                </span>
                <h3 className="text-base font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-14 border-t border-border/60 pb-20 pt-16 sm:pb-24"
      >
        <div className="mb-8 max-w-2xl space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            {m.product.howItWorksTitle}
          </h2>
          <p className="text-muted-foreground text-pretty">
            {m.product.howItWorksDescription}
          </p>
        </div>

        <ol className="grid gap-6 lg:grid-cols-3">
          {m.product.steps.map((step, index) => {
            const Icon = stepIcons[index] ?? Sparkles;

            return (
              <li
                key={step.title}
                className={cn("relative rounded-xl border p-5", softSurfaceClassName)}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg",
                      iconSurfaceClassName
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="text-base font-medium">
                  {stripStepPrefix(step.title)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
