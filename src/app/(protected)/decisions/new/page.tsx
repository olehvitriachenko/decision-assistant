import { DecisionForm } from "@/components/decisions/decision-form";
import { DecisionsBackLink } from "@/components/decisions/decisions-back-link";
import { PageContainer } from "@/components/layout/page-container";
import { m } from "@/lib/i18n/uk";

export default function NewDecisionPage() {
  return (
    <PageContainer className="max-w-2xl">
      <div className="flex flex-col gap-4">
        <DecisionsBackLink />
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            {m.decisions.newTitle}
          </h1>
          <p className="text-sm text-muted-foreground">
            {m.decisions.newDescription}
          </p>
        </div>
      </div>
      <DecisionForm />
    </PageContainer>
  );
}
