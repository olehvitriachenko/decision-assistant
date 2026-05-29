"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List, Menu, Plus, Sparkles } from "lucide-react";

import { routes } from "@/lib/config/routes";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { href: routes.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: routes.decisions, label: "Decisions", icon: List },
] as const;

function isActivePath(pathname: string, href: string) {
  if (pathname === href) {
    return true;
  }

  if (href === routes.decisions) {
    return (
      pathname.startsWith("/decisions/") && pathname !== routes.decisionsNew
    );
  }

  return false;
}

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href={routes.dashboard}
          className="flex items-center gap-2.5 rounded-lg pr-2 transition-opacity hover:opacity-80"
        >
          <span className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-muted/50">
            <Sparkles className="size-4 text-foreground" aria-hidden="true" />
          </span>
          <span className="hidden font-semibold tracking-tight sm:inline">
            Decision Assistant
          </span>
        </Link>

        <Separator orientation="vertical" className="mx-1 hidden h-5 md:block" />

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main"
        >
          {navLinks.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                isActivePath(pathname, link.href) &&
                  "bg-muted text-foreground"
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />

          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href={routes.decisionsNew}>
              <Plus className="size-4" aria-hidden="true" />
              New Decision
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 md:hidden">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isActivePath(pathname, link.href);

                return (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={cn(isActive && "bg-muted font-medium")}
                    >
                      <Icon aria-hidden="true" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={routes.decisionsNew}>
                  <Plus aria-hidden="true" />
                  New Decision
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
