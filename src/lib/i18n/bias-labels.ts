export const biasLabelsUk: Record<string, string> = {
  fomo: "Страх втратити можливість (FOMO)",
  "status quo bias": "Упередження статус-кво",
  "overconfidence bias": "Упередження надмірної впевненості",
  "confirmation bias": "Підтверджувальне упередження",
  "sunk cost fallacy": "Помилка невідновлюваних витрат",
  "anchoring bias": "Якірне упередження",
  "availability heuristic": "Евристика доступності",
  "recency bias": "Упередження недавності",
  "loss aversion": "Неприйняття втрат",
  "optimism bias": "Оптимістичне упередження",
  "pessimism bias": "Песимістичне упередження",
  "hindsight bias": "Упередження задним числом",
  "bandwagon effect": "Ефект натовпу",
  "herding bias": "Упередження стадності",
  "ambiguity effect": "Ефект неоднозначності",
  "negativity bias": "Негативне упередження",
  "self-serving bias": "Егоцентричне упередження",
  "planning fallacy": "Планувальна помилка",
  "dunning-kruger effect": "Ефект Даннінга — Кrugerа",
  "framing bias": "Ефект фрейму",
  "survivorship bias": "Упередження виживання",
  "outcome bias": "Упередження результату",
  "affect heuristic": "Евристика афекту",
  "default effect": "Ефект дефолту",
  "illusion of control": "Ілюзія контролю",
};

export function getBiasDisplayLabel(stableKey: string, fallback: string) {
  const normalizedKey = stableKey.trim().toLowerCase();

  if (biasLabelsUk[normalizedKey]) {
    return biasLabelsUk[normalizedKey];
  }

  const withoutBiasSuffix = normalizedKey.replace(/\s+bias$/, "");

  if (withoutBiasSuffix !== normalizedKey && biasLabelsUk[withoutBiasSuffix]) {
    return biasLabelsUk[withoutBiasSuffix];
  }

  const withBiasSuffix = `${normalizedKey} bias`;

  if (biasLabelsUk[withBiasSuffix]) {
    return biasLabelsUk[withBiasSuffix];
  }

  return fallback;
}
