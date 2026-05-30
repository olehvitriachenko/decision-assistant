import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { routes } from "@/lib/config/routes";
import { m } from "@/lib/i18n/uk";
import { Button } from "@/components/ui/button";

export function DecisionsBackLink() {
  return (
    <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
      <Link href={routes.decisions}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        {m.decisions.allTitle}
      </Link>
    </Button>
  );
}
