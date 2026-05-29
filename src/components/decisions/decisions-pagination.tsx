import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  decisionsListHref,
  type DecisionListQuery,
} from "@/lib/config/decision-list-params";
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
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Decisions pagination"
    >
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages} · {total} total
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
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
              Previous
            </span>
          ) : (
            <Link href={decisionsListHref({ page: page - 1, ...query })}>
              <ChevronLeft className="size-4" aria-hidden="true" />
              Previous
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
              Next
              <ChevronRight className="size-4" aria-hidden="true" />
            </span>
          ) : (
            <Link href={decisionsListHref({ page: page + 1, ...query })}>
              Next
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </Button>
      </div>
    </nav>
  );
}
