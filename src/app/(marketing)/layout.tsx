import { redirect } from "next/navigation";

import { LandingFooter } from "@/components/layout/landing-footer";
import { LandingHeader } from "@/components/layout/landing-header";
import { routes } from "@/lib/config/routes";
import { getUser } from "@/lib/supabase/auth";

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (user) {
    redirect(routes.dashboard);
  }

  return (
    <div className="flex flex-1 flex-col">
      <LandingHeader />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
      <LandingFooter />
    </div>
  );
}
