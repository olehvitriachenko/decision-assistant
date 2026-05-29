import { redirect } from "next/navigation";

import { routes } from "@/lib/config/routes";
import { getUser } from "@/lib/supabase/auth";
import { AppHeader } from "@/components/layout/app-header";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (!user) {
    redirect(routes.login);
  }

  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
