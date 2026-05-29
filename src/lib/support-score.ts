export type SupportLevel = "low" | "medium" | "high";

export function getSupportLevel(confidence: number): SupportLevel {
  if (confidence >= 70) {
    return "high";
  }

  if (confidence >= 40) {
    return "medium";
  }

  return "low";
}

export const supportLevelLabels: Record<SupportLevel, string> = {
  low: "Low Support",
  medium: "Medium Support",
  high: "High Support",
};

export function formatSupportScore(confidence: number) {
  return `${supportLevelLabels[getSupportLevel(confidence)]} · ${confidence}`;
}

export const supportLevelBadgeClassNames: Record<SupportLevel, string> = {
  low: "border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/20",
  medium:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 dark:bg-amber-500/15",
  high: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-500/15",
};

export function classifySupportScore(confidence: number) {
  const level = getSupportLevel(confidence);

  return {
    level,
    label: supportLevelLabels[level],
    formatted: formatSupportScore(confidence),
    className: supportLevelBadgeClassNames[level],
  };
}
