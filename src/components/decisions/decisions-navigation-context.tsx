"use client";

import { createContext, useContext } from "react";

type DecisionsNavigationContextValue = {
  navigate: (href: string, options?: { scrollToTop?: boolean }) => void;
  isPending: boolean;
};

export const DecisionsNavigationContext =
  createContext<DecisionsNavigationContextValue | null>(null);

export function useDecisionsNavigation() {
  const context = useContext(DecisionsNavigationContext);

  if (!context) {
    throw new Error("useDecisionsNavigation must be used within DecisionsPageContent");
  }

  return context;
}
