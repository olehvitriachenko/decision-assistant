"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/config/routes";
import { m } from "@/lib/i18n/uk";
import { headerSurfaceClassName, iconSurfaceClassName } from "@/lib/ui/surface-classes";
import { cn } from "@/lib/utils";

export function LandingHeader() {
  return (
    <header className={cn("sticky top-0 z-50 border-b", headerSurfaceClassName)}>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href={routes.home}
          className="flex items-center gap-2.5 rounded-lg pr-2 transition-opacity hover:opacity-80"
        >
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-lg",
              iconSurfaceClassName
            )}
          >
            <Sparkles className="size-4 text-foreground" aria-hidden="true" />
          </span>
          <span className="font-semibold tracking-tight">{m.nav.appName}</span>
        </Link>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href={routes.login}>{m.landing.signIn}</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={routes.register}>{m.landing.createAccount}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
