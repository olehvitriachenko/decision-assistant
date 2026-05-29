"use client";

import { useActionState } from "react";

import {
  createDecision,
  type CreateDecisionActionState,
} from "@/lib/actions/decisions";
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

export function DecisionForm() {
  const [state, formAction, isPending] = useActionState(
    createDecision,
    initialState
  );

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>New decision</CardTitle>
        <CardDescription>
          Describe the situation and the choice you are facing.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state.error ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Should I accept the job offer?"
              aria-invalid={Boolean(state.fieldErrors?.title)}
              required
            />
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
              placeholder="Describe the context and constraints..."
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
              placeholder="What choice are you considering?"
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
              placeholder="Any additional thoughts, concerns, or goals..."
              aria-invalid={Boolean(state.fieldErrors?.thoughts)}
            />
            {state.fieldErrors?.thoughts?.map((message) => (
              <p key={message} className="text-sm text-destructive">
                {message}
              </p>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t-0 bg-transparent p-4 pt-0">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Create decision"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
