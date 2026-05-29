"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useActionState, useState } from "react";

import {
  createDecision,
  type CreateDecisionActionState,
} from "@/lib/actions/decisions";
import { m } from "@/lib/i18n/uk";
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

export function DecisionForm() {
  const [state, formAction, isPending] = useActionState(
    createDecision,
    initialState
  );
  const [values, setValues] = useState(emptyFormValues);

  const hasError = hasFormErrors(state);
  const canSubmit = isCreateDecisionFormFilled(values);

  return (
    <Card className="w-full border-border/60 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base">{m.decisions.form.title}</CardTitle>
        <CardDescription>{m.decisions.form.description}</CardDescription>
      </CardHeader>

      <form action={formAction} className="space-y-0">
        <CardContent className="space-y-6">
          {hasError && state.error ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}

          <fieldset className="space-y-6" disabled={isPending}>
            <div className="space-y-2">
              <Label htmlFor="title">{m.decisions.form.fieldTitle}</Label>
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
                placeholder={m.decisions.form.fieldTitlePlaceholder}
                aria-invalid={Boolean(state.fieldErrors?.title)}
                required
              />
              <p className="text-xs text-muted-foreground">
                {m.decisions.form.fieldTitleHelp}
              </p>
              {state.fieldErrors?.title?.map((message) => (
                <p key={message} className="text-sm text-destructive">
                  {message}
                </p>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="situation">{m.decisions.form.fieldSituation}</Label>
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
                placeholder={m.decisions.form.fieldSituationPlaceholder}
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
              <Label htmlFor="decision">{m.decisions.form.fieldDecision}</Label>
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
                placeholder={m.decisions.form.fieldDecisionPlaceholder}
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
              <Label htmlFor="thoughts">{m.decisions.form.fieldThoughts}</Label>
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
                placeholder={m.decisions.form.fieldThoughtsPlaceholder}
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
        </CardContent>

        <CardFooter className="sticky bottom-0 border-t border-border/60 bg-card/95 p-4 backdrop-blur-sm">
          <Button
            type="submit"
            size="lg"
            className="h-11 w-full"
            disabled={!canSubmit || isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="size-4" aria-hidden="true" />
            )}
            {isPending ? m.decisions.form.saving : m.decisions.form.submit}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
