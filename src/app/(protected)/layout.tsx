import { redirect } from "next/navigation";

import { routes } from "@/lib/config/routes";
import { getUser } from "@/lib/supabase/auth";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (!user) {
    redirect(routes.login);
  }

  return children;
}
