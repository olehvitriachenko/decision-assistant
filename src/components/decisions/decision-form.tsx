"use client";

import { Check, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useActionState } from "react";

import {
  createDecision,
  type CreateDecisionActionState,
} from "@/lib/actions/decisions";
import { isCreateDecisionFormFilled } from "@/lib/validations/decision";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: CreateDecisionActionState = {};

type FormValues = {
  title: string;
  situation: string;
  decision: string;
  thoughts: string;
};

const emptyFormValues: FormValues = {
  title: "",
  situation: "",
  decision: "",
  thoughts: "",
};

function hasFormErrors(state: CreateDecisionActionState) {
  if (state.error) {
    return true;
  }

  if (!state.fieldErrors) {
    return false;
  }

  return Object.values(state.fieldErrors).some(
    (messages) => messages && messages.length > 0
  );
}

function AnalysisLoadingPanel({ isRedirecting }: { isRedirecting: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-10 text-center"
      role="status"
      aria-live="polite"
      aria-busy={!isRedirecting}
    >
      <span className="flex size-12 items-center justify-center rounded-full border border-border/60 bg-muted/20">
        {isRedirecting ? (
          <Check className="size-5 text-foreground" aria-hidden="true" />
        ) : (
          <Loader2
            className="size-5 animate-spin text-foreground"
            aria-hidden="true"
          />
        )}
      </span>
      <div className="space-y-1">
        <p className="font-medium">
          {isRedirecting ? "Analysis complete" : "Analyzing your decision"}
        </p>
        <p className="text-sm text-muted-foreground">
          {isRedirecting
            ? "Redirecting to your dashboard..."
            : "This usually takes a few seconds. Please keep this tab open."}
        </p>
      </div>
    </div>
  );
}

export function DecisionForm() {
  const [state, formAction, isPending] = useActionState(
    createDecision,
    initialState
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [values, setValues] = useState(emptyFormValues);

  const showLoading = isAnalyzing || isPending || isRedirecting;
  const hasError = hasFormErrors(state);
  const canSubmit = isCreateDecisionFormFilled(values);

  useEffect(() => {
    if (isPending) {
      setIsAnalyzing(true);
      setIsRedirecting(false);
      return;
    }

    if (isAnalyzing && !hasError) {
      setIsRedirecting(true);
      return;
    }

    if (hasError) {
      setIsAnalyzing(false);
      setIsRedirecting(false);
    }
  }, [isPending, isAnalyzing, hasError]);

  return (
    <Card className="w-full border-border/60 bg-card/80 backdrop-blur-sm">
      {!showLoading ? (
        <CardHeader>
          <CardTitle className="text-base">Decision details</CardTitle>
          <CardDescription>
            Fill in the context below. AI will analyze biases, alternatives, and
            confidence once you submit.
          </CardDescription>
        </CardHeader>
      ) : null}

      <form
        action={formAction}
        className="space-y-0"
        onSubmit={() => {
          setIsAnalyzing(true);
          setIsRedirecting(false);
        }}
      >
        <CardContent className={showLoading ? "p-4 sm:p-6" : "space-y-6"}>
          {hasError && state.error ? (
            <p className="mb-4 text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}

          {showLoading ? (
            <AnalysisLoadingPanel isRedirecting={isRedirecting} />
          ) : (
            <fieldset className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={values.title}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Should I accept the startup job offer?"
                  aria-invalid={Boolean(state.fieldErrors?.title)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  A short name to find this decision later.
                </p>
                {state.fieldErrors?.title?.map((message) => (
                  <p key={message} className="text-sm text-destructive">
                    {message}
                  </p>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="situation">Situation</Label>
                <Textarea
                  id="situation"
                  name="situation"
                  value={values.situation}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      situation: event.target.value,
                    }))
                  }
                  placeholder="Describe the context, constraints, and what is at stake..."
                  className="min-h-32"
                  aria-invalid={Boolean(state.fieldErrors?.situation)}
                  required
                />
                {state.fieldErrors?.situation?.map((message) => (
                  <p key={message} className="text-sm text-destructive">
                    {message}
                  </p>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="decision">Decision</Label>
                <Textarea
                  id="decision"
                  name="decision"
                  value={values.decision}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      decision: event.target.value,
                    }))
                  }
                  placeholder="What choice are you considering?"
                  className="min-h-24"
                  aria-invalid={Boolean(state.fieldErrors?.decision)}
                  required
                />
                {state.fieldErrors?.decision?.map((message) => (
                  <p key={message} className="text-sm text-destructive">
                    {message}
                  </p>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="thoughts">Thoughts (optional)</Label>
                <Textarea
                  id="thoughts"
                  name="thoughts"
                  value={values.thoughts}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      thoughts: event.target.value,
                    }))
                  }
                  placeholder="Goals, concerns, or anything else the AI should consider..."
                  className="min-h-24"
                  aria-invalid={Boolean(state.fieldErrors?.thoughts)}
                />
                {state.fieldErrors?.thoughts?.map((message) => (
                  <p key={message} className="text-sm text-destructive">
                    {message}
                  </p>
                ))}
              </div>
            </fieldset>
          )}
        </CardContent>

        {!showLoading ? (
          <CardFooter className="sticky bottom-0 border-t border-border/60 bg-card/95 p-4 backdrop-blur-sm">
            <Button
              type="submit"
              size="lg"
              className="h-11 w-full"
              disabled={!canSubmit}
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Create & analyze
            </Button>
          </CardFooter>
        ) : null}
      </form>
    </Card>
  );
}
