import { normalizeBias } from "@/lib/normalize-bias";

export type BiasDescription = {
  title: string;
  description: string;
};

const biasDescriptions: Record<string, BiasDescription> = {
  fomo: {
    title: "Страх втратити можливість (FOMO)",
    description:
      "Можливо, ви відчуваєте тиск діяти швидко через страх упустити можливість.",
  },
  "status quo bias": {
    title: "Упередження статус-кво",
    description:
      "Можливо, ви віддаєте перевагу поточній ситуації лише тому, що вона звична.",
  },
  "overconfidence bias": {
    title: "Упередження надмірної впевненості",
    description:
      "Можливо, ви переоцінюєте свою здатність передбачити результат.",
  },
  "confirmation bias": {
    title: "Підтверджувальне упередження",
    description:
      "Можливо, ви надаєте перевагу інформації, що підтверджує ваші переконання.",
  },
  "sunk cost fallacy": {
    title: "Помилка невідновлюваних витрат",
    description:
      "Можливо, ви продовжуєте обраний шлях через те, що вже інвестували.",
  },
  "anchoring bias": {
    title: "Якірне упередження",
    description:
      "Можливо, ви надто сильно спираєтесь на першу отриману інформацію.",
  },
  "availability heuristic": {
    title: "Евристика доступності",
    description:
      "Можливо, ви оцінюєте ймовірність за прикладами, що найлегше згадуються.",
  },
  "recency bias": {
    title: "Упередження недавності",
    description:
      "Можливо, ви надмірно зважаєте на найновіші події чи інформацію.",
  },
  "loss aversion": {
    title: "Неприйняття втрат",
    description:
      "Можливо, ви уникаєте дій, бо потенційні втрати здаються болючішими за виграші.",
  },
  "optimism bias": {
    title: "Оптимістичне упередження",
    description:
      "Можливо, ви очікуєте кращий результат, ніж це підтверджують наявні дані.",
  },
  "pessimism bias": {
    title: "Песимістичне упередження",
    description:
      "Можливо, ви очікуєте гірший результат, ніж це підтверджують наявні дані.",
  },
  "hindsight bias": {
    title: "Упередження задним числом",
    description:
      "Можливо, ви сприймаєте минулі події так, ніби їх було легше передбачити.",
  },
  "bandwagon effect": {
    title: "Ефект натовпу",
    description:
      "Можливо, ви схиляєтесь до вибору, бо інші роблять те саме.",
  },
  "negativity bias": {
    title: "Негативне упередження",
    description:
      "Можливо, ви більше зосереджуєтесь на ризиках, ніж на збалансованих компромісах.",
  },
  "self-serving bias": {
    title: "Егоцентричне упередження",
    description:
      "Можливо, ви приписуєте успіх собі, а невдачі — зовнішнім факторам.",
  },
  "planning fallacy": {
    title: "Планувальна помилка",
    description:
      "Можливо, ви недооцінюєте, скільки часу займе рішення або його наслідки.",
  },
  "dunning-kruger effect": {
    title: "Ефект Даннінга — Кrugerа",
    description:
      "Можливо, ви менше усвідомлюєте складність рішення, ніж воно є насправді.",
  },
  "ambiguity effect": {
    title: "Ефект неоднозначності",
    description:
      "Можливо, ви уникаєте варіантів з невизначеними наслідками, навіть якщо вони кращі.",
  },
  "herding bias": {
    title: "Упередження стадності",
    description:
      "Можливо, ви орієнтуєтесь на поведінку інших, а не на власний аналіз ситуації.",
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
