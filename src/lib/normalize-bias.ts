import { getBiasDisplayLabel } from "@/lib/i18n/bias-labels";

const BIAS_CANONICAL_LABELS: Record<string, string> = {
  overconfidence: "Overconfidence Bias",
  "overconfidence bias": "Overconfidence Bias",
  fomo: "Fear of Missing Out",
  "fear of missing out": "Fear of Missing Out",
  "status quo": "Status Quo Bias",
  "status quo bias": "Status Quo Bias",
  "sunk cost": "Sunk Cost Fallacy",
  "sunk cost fallacy": "Sunk Cost Fallacy",
  "sunk cost bias": "Sunk Cost Fallacy",
  "confirmation bias": "Confirmation Bias",
  confirmation: "Confirmation Bias",
  "anchoring bias": "Anchoring Bias",
  anchoring: "Anchoring Bias",
  "availability heuristic": "Availability Heuristic",
  availability: "Availability Heuristic",
  "recency bias": "Recency Bias",
  recency: "Recency Bias",
  "loss aversion": "Loss Aversion",
  "optimism bias": "Optimism Bias",
  optimism: "Optimism Bias",
  "pessimism bias": "Pessimism Bias",
  pessimism: "Pessimism Bias",
  "hindsight bias": "Hindsight Bias",
  hindsight: "Hindsight Bias",
  "bandwagon effect": "Bandwagon Effect",
  bandwagon: "Bandwagon Effect",
  "herd mentality": "Bandwagon Effect",
  "negativity bias": "Negativity Bias",
  negativity: "Negativity Bias",
  "self-serving bias": "Self-Serving Bias",
  "self serving bias": "Self-Serving Bias",
  "planning fallacy": "Planning Fallacy",
  "dunning-kruger effect": "Dunning-Kruger Effect",
  "dunning kruger effect": "Dunning-Kruger Effect",
  "dunning-kruger": "Dunning-Kruger Effect",
  "ambiguity effect": "Ambiguity Effect",
  ambiguity: "Ambiguity Effect",
  "ambiguity bias": "Ambiguity Effect",
  "herding bias": "Herding Bias",
  "herding effect": "Herding Bias",
  herding: "Herding Bias",
  "framing bias": "Framing Bias",
  framing: "Framing Bias",
  "survivorship bias": "Survivorship Bias",
  survivorship: "Survivorship Bias",
  "outcome bias": "Outcome Bias",
  outcome: "Outcome Bias",
  "affect heuristic": "Affect Heuristic",
  "default effect": "Default Effect",
  "default bias": "Default Effect",
  "illusion of control": "Illusion of Control",
};

function normalizeLookupKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function extractBiasCandidates(value: string) {
  const trimmed = value.trim();
  const candidates = new Set<string>([trimmed]);

  const withoutParentheses = trimmed.replace(/\s*\([^)]*\)/g, " ").trim();

  if (withoutParentheses) {
    candidates.add(withoutParentheses);
  }

  const parentheticalMatches = trimmed.matchAll(/\(([^)]+)\)/g);

  for (const match of parentheticalMatches) {
    if (match[1]) {
      candidates.add(match[1].trim());
    }
  }

  const beforeParentheses = trimmed.split("(")[0]?.trim();

  if (beforeParentheses) {
    candidates.add(beforeParentheses);
  }

  return [...candidates];
}

function formatFallbackBiasLabel(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => {
      if (part.length <= 4 && part === part.toUpperCase()) {
        return part;
      }

      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ");
}

function lookupCanonicalLabel(key: string) {
  if (key in BIAS_CANONICAL_LABELS) {
    return BIAS_CANONICAL_LABELS[key];
  }

  const withoutBiasSuffix = key.replace(/\s+bias$/, "");

  if (withoutBiasSuffix !== key && withoutBiasSuffix in BIAS_CANONICAL_LABELS) {
    return BIAS_CANONICAL_LABELS[withoutBiasSuffix];
  }

  const withBiasSuffix = `${key} bias`;

  if (withBiasSuffix in BIAS_CANONICAL_LABELS) {
    return BIAS_CANONICAL_LABELS[withBiasSuffix];
  }

  return null;
}

const CANONICAL_TO_STABLE_KEY: Record<string, string> = {
  "Fear of Missing Out": "fomo",
  "Ambiguity Effect": "ambiguity effect",
  "Herding Bias": "herding bias",
  "Bandwagon Effect": "bandwagon effect",
};

function getStableBiasKey(canonicalLabel: string) {
  return CANONICAL_TO_STABLE_KEY[canonicalLabel] ?? canonicalLabel.toLowerCase();
}

export function normalizeBias(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  for (const candidate of extractBiasCandidates(trimmed)) {
    const lookupKey = normalizeLookupKey(candidate);
    const canonicalLabel = lookupCanonicalLabel(lookupKey);

    if (canonicalLabel) {
      const stableKey = getStableBiasKey(canonicalLabel);
      return {
        key: stableKey,
        label: getBiasDisplayLabel(stableKey, canonicalLabel),
      };
    }
  }

  const fallbackKey = normalizeLookupKey(
    trimmed.replace(/\s*\([^)]*\)/g, " ").trim() || trimmed
  );
  const canonicalLabel = formatFallbackBiasLabel(fallbackKey);
  const stableKey = getStableBiasKey(canonicalLabel);

  return {
    key: stableKey,
    label: getBiasDisplayLabel(stableKey, canonicalLabel),
  };
}
