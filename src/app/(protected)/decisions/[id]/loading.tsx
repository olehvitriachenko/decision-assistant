import Link from "next/link";

import { routes } from "@/lib/config/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export default function DecisionDetailLoading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <Button asChild variant="outline" disabled>
          <Link href={routes.dashboard}>Back to dashboard</Link>
        </Button>
        <Skeleton className="h-5 w-24" />
      </div>

      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
