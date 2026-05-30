import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

import { routes } from "@/lib/config/routes";
import { m } from "@/lib/i18n/uk";
import { elevatedSurfaceClassName, iconSurfaceClassName } from "@/lib/ui/surface-classes";
import { cn } from "@/lib/utils";
import { getUser } from "@/lib/supabase/auth";
import { AppPurposeIntro } from "@/components/layout/app-purpose-intro";
import { PageContainer } from "@/components/layout/page-container";
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
    <PageContainer className="max-w-2xl justify-center py-16 sm:py-24">
      <div className="space-y-8 text-center">
        <div className={cn("mx-auto flex size-14 items-center justify-center rounded-2xl", iconSurfaceClassName)}>
          <Sparkles className="size-6" aria-hidden="true" />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {m.landing.title}
          </h1>
          <p className="mx-auto max-w-lg text-base text-muted-foreground text-pretty">
            {m.landing.subtitle}
          </p>
        </div>
        <AppPurposeIntro showSteps className="text-left" />
        <Card className={cn("text-left", elevatedSurfaceClassName)}>
          <CardHeader>
            <CardTitle>{m.landing.getStarted}</CardTitle>
            <CardDescription>{m.landing.getStartedDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 flex-1 px-4 py-2 sm:h-10">
              <Link href={routes.login}>{m.landing.signIn}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 flex-1 px-4 py-2 sm:h-10">
              <Link href={routes.register}>{m.landing.createAccount}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
