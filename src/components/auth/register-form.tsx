"use client";

import Link from "next/link";
import { useActionState, type KeyboardEvent } from "react";

import { routes } from "@/lib/config/routes";
import { signUp, type AuthActionState } from "@/lib/actions/auth";
import { m } from "@/lib/i18n/uk";
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

const initialState: AuthActionState = {};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter" || event.shiftKey || isPending) {
      return;
    }

    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    event.preventDefault();
    event.currentTarget.requestSubmit();
  }

  return (
    <Card className="w-full max-w-md border-border/60 bg-card/80 backdrop-blur-sm">
      <CardHeader className="px-6 pt-6 pb-2 sm:px-8 sm:pt-8">
        <CardTitle>{m.auth.createAccount}</CardTitle>
        <CardDescription>{m.auth.createAccountDescription}</CardDescription>
      </CardHeader>
      <form action={formAction} onKeyDown={handleKeyDown}>
        <CardContent className="space-y-5 px-6 sm:px-8">
          {state.error ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">{m.common.email}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(state.fieldErrors?.email)}
              required
            />
            {state.fieldErrors?.email?.map((message) => (
              <p key={message} className="text-sm text-destructive">
                {message}
              </p>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{m.common.password}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={Boolean(state.fieldErrors?.password)}
              required
            />
            {state.fieldErrors?.password?.map((message) => (
              <p key={message} className="text-sm text-destructive">
                {message}
              </p>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-5 border-t-0 bg-transparent px-6 pt-2 pb-6 sm:px-8 sm:pb-8">
          <Button type="submit" className="h-10 w-full" disabled={isPending}>
            {isPending ? m.auth.creatingAccount : m.auth.createAccount}
          </Button>
          <p className="text-sm text-muted-foreground">
            {m.auth.hasAccount}{" "}
            <Link href={routes.login} className="text-primary underline-offset-4 hover:underline">
              {m.auth.signIn}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
