import Link from "next/link";
import { redirect } from "next/navigation";

import { routes } from "@/lib/config/routes";
import { getUser } from "@/lib/supabase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function HomePage() {
  const user = await getUser();

  if (user) {
    redirect(routes.dashboard);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Decision Assistant</CardTitle>
          <CardDescription>
            Capture decisions, track their status, and get AI-powered analysis
            when you are ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href={routes.login}>Sign in</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href={routes.register}>Create account</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
