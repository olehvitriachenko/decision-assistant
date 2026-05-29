import { DecisionForm } from "@/components/decisions/decision-form";
import { PageContainer } from "@/components/layout/page-container";

export default function NewDecisionPage() {
  return (
    <PageContainer className="max-w-2xl">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">New Decision</h1>
        <p className="text-sm text-muted-foreground">
          Describe your situation and we&apos;ll analyze it with AI.
        </p>
      </div>
      <DecisionForm />
    </PageContainer>
  );
}
