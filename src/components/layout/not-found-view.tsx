import { FileQuestion } from "lucide-react";

import { routes } from "@/lib/config/routes";
import { m } from "@/lib/i18n/uk";
import { EmptyStateCard } from "@/components/layout/empty-state-card";
import { PageContainer } from "@/components/layout/page-container";

export function NotFoundView({
  title = m.errors.notFoundTitle,
  description = m.errors.notFoundDescription,
  action,
}: {
  title?: string;
  description?: string;
  action: {
    href: string;
    label: string;
  };
}) {
  return (
    <PageContainer className="max-w-lg justify-center py-16">
      <EmptyStateCard
        icon={FileQuestion}
        title={title}
        description={description}
        action={action}
      />
    </PageContainer>
  );
}

export const authenticatedNotFoundAction = {
  href: routes.dashboard,
  label: m.common.goToDashboard,
};

export const publicNotFoundAction = {
  href: routes.home,
  label: m.common.backToHome,
};
