import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "@/lib/actions/auth";
import { getDecisionsByUserId } from "@/lib/db/decisions";
import { getUser } from "@/lib/supabase/auth";
import { DecisionsList } from "@/components/decisions/decisions-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const decisions = await getDecisionsByUserId(user.id);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-12">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Signed in as{" "}
                <span className="font-medium text-foreground">{user.email}</span>
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/decisions/new">New decision</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form action={signOut}>
            <Button type="submit" variant="outline">
              Log out
            </Button>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Your decisions</h2>
        <DecisionsList decisions={decisions} />
      </section>
    </div>
  );
}
