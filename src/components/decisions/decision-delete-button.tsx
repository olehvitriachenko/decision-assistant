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
  DialogFooter,
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
        <DialogHeader className="items-center text-center sm:items-start sm:text-left">
          <span
            className={cn(
              "mb-1 inline-flex size-10 items-center justify-center rounded-md",
              "bg-destructive/10 text-destructive"
            )}
          >
            <Trash2 aria-hidden="true" />
          </span>
          <DialogTitle>{m.decisions.detail.deleteConfirm}</DialogTitle>
          <DialogDescription className="text-balance">
            {m.decisions.detail.deleteDescription}
          </DialogDescription>
        </DialogHeader>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <DialogFooter className="flex w-full flex-row gap-2 sm:justify-normal [&>*]:min-w-0 [&>*]:flex-1">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            {m.decisions.detail.cancel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="size-4" aria-hidden="true" />
            )}
            {isPending ? m.decisions.detail.deleting : m.decisions.detail.delete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
