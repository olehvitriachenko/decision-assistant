"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  decisionsListHref,
  type DecisionListQuery,
} from "@/lib/config/decision-list-params";
import { m } from "@/lib/i18n/uk";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function scrollDecisionsListToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

const paginationLinkProps = {
  scroll: false as const,
  onClick: scrollDecisionsListToTop,
};

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
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

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
          asChild
          variant="outline"
          size="sm"
          disabled={page <= 1}
          aria-disabled={page <= 1}
        >
          {page <= 1 ? (
            <span>
              <ChevronLeft className="size-4" aria-hidden="true" />
              {m.common.previous}
            </span>
          ) : (
            <Link
              href={decisionsListHref({ page: page - 1, ...query })}
              {...paginationLinkProps}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              {m.common.previous}
            </Link>
          )}
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((pageNumber) => (
            <Button
              key={pageNumber}
              asChild
              variant={pageNumber === page ? "default" : "ghost"}
              size="sm"
              className={cn("min-w-8")}
            >
              <Link
                href={decisionsListHref({ page: pageNumber, ...query })}
                aria-current={pageNumber === page ? "page" : undefined}
                {...paginationLinkProps}
              >
                {pageNumber}
              </Link>
            </Button>
          ))}
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          aria-disabled={page >= totalPages}
        >
          {page >= totalPages ? (
            <span>
              {m.common.next}
              <ChevronRight className="size-4" aria-hidden="true" />
            </span>
          ) : (
            <Link
              href={decisionsListHref({ page: page + 1, ...query })}
              {...paginationLinkProps}
            >
              {m.common.next}
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </Button>
      </div>
    </nav>
  );
}
