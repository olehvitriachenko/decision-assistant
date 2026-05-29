import { normalizeBias } from "@/lib/normalize-bias";

export type BiasDescription = {
  title: string;
  description: string;
};

const biasDescriptions: Record<string, BiasDescription> = {
  fomo: {
    title: "Fear of Missing Out",
    description:
      "You may be feeling pressure to act quickly because you fear missing an opportunity.",
  },
  "status quo bias": {
    title: "Status Quo Bias",
    description:
      "You may prefer your current situation simply because it is familiar.",
  },
  "overconfidence bias": {
    title: "Overconfidence Bias",
    description:
      "You may be overestimating your ability to predict the outcome.",
  },
  "confirmation bias": {
    title: "Confirmation Bias",
    description:
      "You may be favoring information that supports what you already believe.",
  },
  "sunk cost fallacy": {
    title: "Sunk Cost Fallacy",
    description:
      "You may be continuing a path because of what you have already invested.",
  },
  "anchoring bias": {
    title: "Anchoring Bias",
    description:
      "You may be relying too heavily on the first piece of information you received.",
  },
  "availability heuristic": {
    title: "Availability Heuristic",
    description:
      "You may be judging likelihood based on examples that come to mind most easily.",
  },
  "recency bias": {
    title: "Recency Bias",
    description:
      "You may be giving too much weight to the most recent events or information.",
  },
  "loss aversion": {
    title: "Loss Aversion",
    description:
      "You may be avoiding action because potential losses feel more painful than gains.",
  },
  "optimism bias": {
    title: "Optimism Bias",
    description:
      "You may be expecting a better outcome than the available evidence supports.",
  },
  "pessimism bias": {
    title: "Pessimism Bias",
    description:
      "You may be expecting a worse outcome than the available evidence supports.",
  },
  "hindsight bias": {
    title: "Hindsight Bias",
    description:
      "You may be treating past events as if they were more predictable than they were.",
  },
  "bandwagon effect": {
    title: "Bandwagon Effect",
    description:
      "You may be leaning toward a choice because others seem to be doing the same.",
  },
  "negativity bias": {
    title: "Negativity Bias",
    description:
      "You may be focusing more on risks and downsides than on balanced trade-offs.",
  },
  "self-serving bias": {
    title: "Self-Serving Bias",
    description:
      "You may be attributing success to yourself and setbacks to external factors.",
  },
  "planning fallacy": {
    title: "Planning Fallacy",
    description:
      "You may be underestimating how long the decision or its consequences will take.",
  },
  "dunning-kruger effect": {
    title: "Dunning-Kruger Effect",
    description:
      "You may have less insight into the decision because you underestimate its complexity.",
  },
};

function lookupBiasDescription(key: string) {
  if (key in biasDescriptions) {
    return biasDescriptions[key];
  }

  const withoutBiasSuffix = key.replace(/\s+bias$/, "");

  if (withoutBiasSuffix !== key && `${withoutBiasSuffix} bias` in biasDescriptions) {
    return biasDescriptions[`${withoutBiasSuffix} bias`];
  }

  return null;
}

export function getBiasDescription(rawBias: string): BiasDescription {
  const normalized = normalizeBias(rawBias);

  if (!normalized) {
    return {
      title: rawBias.trim(),
      description: "",
    };
  }

  const known = lookupBiasDescription(normalized.key);

  if (known) {
    return known;
  }

  return {
    title: normalized.label,
    description: "",
  };
}
