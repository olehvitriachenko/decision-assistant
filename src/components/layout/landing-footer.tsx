import Link from "next/link";
import { Sparkles } from "lucide-react";

import { routes } from "@/lib/config/routes";
import { m } from "@/lib/i18n/uk";
import { iconSurfaceClassName } from "@/lib/ui/surface-classes";
import { cn } from "@/lib/utils";

const footerLinks = [
  { href: "#features", label: m.landing.featuresTitle },
  { href: "#how-it-works", label: m.product.howItWorksTitle },
  { href: "#top", label: m.landing.footer.toTop },
] as const;

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,12rem)] sm:gap-10">
          <div className="space-y-3">
            <Link
              href={routes.home}
              className="inline-flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80"
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
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
              {m.meta.description}
            </p>
          </div>

          <nav aria-label={m.landing.footer.pageNav} className="space-y-3">
            <p className="text-sm font-medium">{m.landing.footer.pageNav}</p>
            <ul className="space-y-2 text-sm">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {m.landing.footer.copyright(year)}
          </p>
          <p className="max-w-xl text-xs leading-relaxed text-muted-foreground text-pretty sm:text-right">
            {m.landing.footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
