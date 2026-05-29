export function getDecisionComplexityScore(
  confidence: number | null,
  biasCount: number | null
) {
  if (confidence === null && biasCount === null) {
    return null;
  }

  const uncertainty = confidence === null ? 50 : 100 - confidence;
  const biases = biasCount ?? 0;

  return uncertainty + biases * 12;
}
