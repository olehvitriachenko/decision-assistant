import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { routes } from "@/lib/config/routes";
import { getUser } from "@/lib/supabase/auth";
import { Button } from "@/components/ui/button";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (user) {
    redirect(routes.dashboard);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-8 sm:py-16">
      <div className="flex w-full max-w-md flex-col gap-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
          <Link href={routes.home}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </Link>
        </Button>
        {children}
      </div>
    </div>
  );
}
