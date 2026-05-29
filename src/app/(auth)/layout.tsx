import { redirect } from "next/navigation";

import { routes } from "@/lib/config/routes";
import { getUser } from "@/lib/supabase/auth";

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
    <div className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
      {children}
    </div>
  );
}
