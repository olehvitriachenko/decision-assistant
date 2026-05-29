import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { routes } from "@/lib/config/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function decisionsPageHref(page: number) {
  return page <= 1 ? routes.decisions : `${routes.decisions}?page=${page}`;
}

export function DecisionsPagination({
  page,
  totalPages,
  total,
}: {
  page: number;
  totalPages: number;
  total: number;
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
            <Link href={decisionsPageHref(page - 1)}>
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
                href={decisionsPageHref(pageNumber)}
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
            <Link href={decisionsPageHref(page + 1)}>
              Next
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </Button>
      </div>
    </nav>
  );
}
