"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  decisionsListHref,
  type DecisionListQuery,
} from "@/lib/config/decision-list-params";
import { useDecisionsNavigation } from "@/components/decisions/decisions-navigation-context";
import { m } from "@/lib/i18n/uk";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function DecisionsPagination({
  page,
  totalPages,
  total,
  query,
}: {
  page: number;
  totalPages: number;
  total: number;
  query: DecisionListQuery;
}) {
  const { navigate } = useDecisionsNavigation();

  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  function goToPage(nextPage: number) {
    navigate(decisionsListHref({ page: nextPage, ...query }), {
      scrollToTop: true,
    });
  }

  return (
    <nav
      className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left"
      aria-label={m.decisions.pagination.ariaLabel}
    >
      <p className="text-sm text-muted-foreground">
        {m.decisions.pagination.pageInfo(page, totalPages, total)}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          aria-disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          {m.common.previous}
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((pageNumber) => (
            <Button
              key={pageNumber}
              variant={pageNumber === page ? "default" : "ghost"}
              size="sm"
              className={cn("min-w-8")}
              aria-current={pageNumber === page ? "page" : undefined}
              onClick={() => goToPage(pageNumber)}
            >
              {pageNumber}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          aria-disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
        >
          {m.common.next}
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
