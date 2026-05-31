"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { deleteDecision } from "@/lib/actions/decisions";
import { m } from "@/lib/i18n/uk";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function DecisionDeleteButton({ decisionId }: { decisionId: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);

    startTransition(async () => {
      const result = await deleteDecision(decisionId);

      if (result.error) {
        setError(result.error);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isPending) {
          return;
        }

        setOpen(nextOpen);

        if (!nextOpen) {
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={m.decisions.detail.delete}
          className={cn(
            "shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive",
            "size-9 px-0 sm:size-auto sm:px-2.5"
          )}
        >
          <Trash2 className="size-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">{m.decisions.detail.delete}</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "gap-0 overflow-hidden p-0",
          "w-[calc(100%-2rem)] max-w-none",
          "max-[374px]:w-[calc(100%-1rem)]",
          "sm:w-full sm:max-w-md"
        )}
        onInteractOutside={(event) => {
          if (isPending) {
            event.preventDefault();
          }
        }}
        onEscapeKeyDown={(event) => {
          if (isPending) {
            event.preventDefault();
          }
        }}
      >
        <div className="space-y-3 px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
          <DialogHeader className="items-center gap-2.5 text-center sm:items-start sm:gap-3 sm:text-left">
            <span
              className={cn(
                "inline-flex size-10 shrink-0 items-center justify-center rounded-lg sm:size-11",
                "bg-destructive/10 text-destructive"
              )}
            >
              <Trash2 className="size-4 sm:size-5" aria-hidden="true" />
            </span>
            <DialogTitle className="text-base">{m.decisions.detail.deleteConfirm}</DialogTitle>
            <DialogDescription className="text-balance text-sm leading-relaxed sm:text-base">
              {m.decisions.detail.deleteDescription}
            </DialogDescription>
          </DialogHeader>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>
        <div className="flex flex-row gap-2 border-t border-border/60 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4">
          <Button
            type="button"
            variant="outline"
            className="min-w-0 flex-1"
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            {m.decisions.detail.cancel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="min-w-0 flex-1"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                {m.decisions.detail.deleting}
              </>
            ) : (
              m.decisions.detail.delete
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
