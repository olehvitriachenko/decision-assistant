import { redirect } from "next/navigation";

import { getUser } from "@/lib/supabase/auth";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      {children}
    </div>
  );
}
