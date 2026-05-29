"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";

import { routes } from "@/lib/config/routes";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { href: routes.dashboard, label: "Dashboard" },
  { href: routes.decisions, label: "Decisions" },
] as const;

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href={routes.home}
          className="flex items-center gap-2.5 rounded-lg pr-2 transition-opacity hover:opacity-80"
        >
          <span className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-muted/50">
            <Sparkles className="size-4 text-foreground" aria-hidden="true" />
          </span>
          <span className="hidden font-semibold tracking-tight sm:inline">
            Decision Assistant
          </span>
        </Link>

        <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                (pathname === link.href ||
                  (link.href === routes.decisions &&
                    pathname.startsWith("/decisions/") &&
                    pathname !== routes.decisionsNew)) &&
                  "bg-muted text-foreground"
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={routes.decisionsNew}>
              <Plus className="size-4" aria-hidden="true" />
              New Decision
            </Link>
          </Button>
          <Button asChild size="icon-sm" className="sm:hidden">
            <Link href={routes.decisionsNew} aria-label="New Decision">
              <Plus className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
