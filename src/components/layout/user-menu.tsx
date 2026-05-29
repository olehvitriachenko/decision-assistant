"use client";

import { LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { signOut } from "@/lib/actions/auth";
import { m } from "@/lib/i18n/uk";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getUserInitials(email: string) {
  const localPart = email.split("@")[0] ?? email;

  if (localPart.length >= 2) {
    return localPart.slice(0, 2).toUpperCase();
  }

  return localPart.slice(0, 1).toUpperCase() || "?";
}

export function UserMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="group relative"
      data-state={open ? "open" : "closed"}
    >
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="size-8 rounded-lg font-medium"
        aria-label={m.auth.accountMenu}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
      >
        {getUserInitials(email)}
      </Button>

      <div
        role="menu"
        className={cn(
          "absolute right-0 top-full z-50 w-56 pt-2",
          "pointer-events-none invisible opacity-0 transition-[opacity,visibility] duration-150 ease-out",
          "group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100",
          "group-data-[state=open]:pointer-events-auto group-data-[state=open]:visible group-data-[state=open]:opacity-100"
        )}
      >
        <div className="overflow-hidden rounded-md border border-border/60 bg-popover text-popover-foreground shadow-md">
          <p className="truncate px-3 py-2 text-sm text-muted-foreground">
            {email}
          </p>
          <div className="h-px bg-border/60" />
          <form action={signOut}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="size-4" aria-hidden="true" />
              {m.auth.logOut}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
