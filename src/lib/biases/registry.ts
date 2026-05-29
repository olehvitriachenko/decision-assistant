import { z } from "zod";

import { m } from "@/lib/i18n/uk";

export type BiasDescription = {
  title: string;
  description: string;
};

type BiasDefinition = {
  key: string;
  aliases: string[];
  labelUk: string;
  descriptionUk: string;
};

function defineBias(
  key: string,
  labelUk: string,
  descriptionUk: string,
  aliases: string[] = []
): BiasDefinition {
  return {
    key,
    labelUk,
    descriptionUk,
    aliases: [key, ...aliases],
  };
}

export const BIAS_DEFINITIONS: BiasDefinition[] = [
  defineBias(
    "fomo",
    "Страх втратити можливість (FOMO)",
    "Можливо, ви відчуваєте тиск діяти швидко через страх упустити можливість.",
    ["fear of missing out"]
  ),
  defineBias(
    "status quo bias",
    "Упередження статус-кво",
    "Можливо, ви віддаєте перевагу поточній ситуації лише тому, що вона звична.",
    ["status quo"]
  ),
  defineBias(
    "overconfidence bias",
    "Упередження надмірної впевненості",
    "Можливо, ви переоцінюєте свою здатність передбачити результат.",
    ["overconfidence"]
  ),
  defineBias(
    "confirmation bias",
    "Підтверджувальне упередження",
    "Можливо, ви надаєте перевагу інформації, що підтверджує ваші переконання.",
    ["confirmation"]
  ),
  defineBias(
    "sunk cost fallacy",
    "Помилка невідновлюваних витрат",
    "Можливо, ви продовжуєте обраний шлях через те, що вже інвестували.",
    ["sunk cost", "sunk cost bias"]
  ),
  defineBias(
    "anchoring bias",
    "Якірне упередження",
    "Можливо, ви надто сильно спираєтесь на першу отриману інформацію.",
    ["anchoring"]
  ),
  defineBias(
    "availability heuristic",
    "Евристика доступності",
    "Можливо, ви оцінюєте ймовірність за прикладами, що найлегше згадуються.",
    ["availability"]
  ),
  defineBias(
    "recency bias",
    "Упередження недавності",
    "Можливо, ви надмірно зважаєте на найновіші події чи інформацію.",
    ["recency"]
  ),
  defineBias(
    "loss aversion",
    "Неприйняття втрат",
    "Можливо, ви уникаєте дій, бо потенційні втрати здаються болючішими за виграші."
  ),
  defineBias(
    "optimism bias",
    "Оптимістичне упередження",
    "Можливо, ви очікуєте кращий результат, ніж це підтверджують наявні дані.",
    ["optimism"]
  ),
  defineBias(
    "pessimism bias",
    "Песимістичне упередження",
    "Можливо, ви очікуєте гірший результат, ніж це підтверджують наявні дані.",
    ["pessimism"]
  ),
  defineBias(
    "hindsight bias",
    "Упередження задним числом",
    "Можливо, ви сприймаєте минулі події так, ніби їх було легше передбачити.",
    ["hindsight"]
  ),
  defineBias(
    "bandwagon effect",
    "Ефект натовпу",
    "Можливо, ви схиляєтесь до вибору, бо інші роблять те саме.",
    ["bandwagon", "herd mentality"]
  ),
  defineBias(
    "herding bias",
    "Упередження стадності",
    "Можливо, ви орієнтуєтесь на поведінку інших, а не на власний аналіз ситуації.",
    ["herding", "herding effect"]
  ),
  defineBias(
    "ambiguity effect",
    "Ефект неоднозначності",
    "Можливо, ви уникаєте варіантів з невизначеними наслідками, навіть якщо вони кращі.",
    ["ambiguity", "ambiguity bias"]
  ),
  defineBias(
    "appeal to novelty",
    "Упередження новизни",
    "Можливо, ви переоцінюєте новий варіант лише тому, що він здається свіжим або сучасним.",
    ["appeal to novelty bias", "novelty"]
  ),
  defineBias(
    "negativity bias",
    "Негативне упередження",
    "Можливо, ви більше зосереджуєтесь на ризиках, ніж на збалансованих компромісах.",
    ["negativity"]
  ),
  defineBias(
    "self-serving bias",
    "Егоцентричне упередження",
    "Можливо, ви приписуєте успіх собі, а невдачі — зовнішнім факторам.",
    ["self serving bias"]
  ),
  defineBias(
    "planning fallacy",
    "Планувальна помилка",
    "Можливо, ви недооцінюєте, скільки часу займе рішення або його наслідки."
  ),
  defineBias(
    "dunning-kruger effect",
    "Ефект Даннінга — Кrugerа",
    "Можливо, ви менше усвідомлюєте складність рішення, ніж воно є насправді.",
    ["dunning kruger effect", "dunning-kruger"]
  ),
  defineBias(
    "framing bias",
    "Ефект фрейму",
    "Можливо, формулювання проблеми спотворює ваше сприйняття варіантів.",
    ["framing"]
  ),
  defineBias(
    "survivorship bias",
    "Упередження виживання",
    "Можливо, ви враховуєте лише успішні приклади і ігноруєте тих, хто не досяг результату.",
    ["survivorship"]
  ),
  defineBias(
    "outcome bias",
    "Упередження результату",
    "Можливо, ви оцінюєте якість рішення лише за результатом, а не за процесом.",
    ["outcome"]
  ),
  defineBias(
    "affect heuristic",
    "Евристика афекту",
    "Можливо, ви спираєтесь на поточні емоції, а не на об’єктивні критерії."
  ),
  defineBias(
    "default effect",
    "Ефект дефолту",
    "Можливо, ви схиляєтесь до варіанту, який подано як стандартний або найпростіший.",
    ["default bias"]
  ),
  defineBias(
    "illusion of control",
    "Ілюзія контролю",
    "Можливо, ви переоцінюєте свій контроль над ситуацією або її результатом."
  ),
];

export const BIAS_REGISTRY_KEYS = BIAS_DEFINITIONS.map(
  (definition) => definition.key
) as [string, ...string[]];

export const biasRegistryKeySchema = z.enum(BIAS_REGISTRY_KEYS);

const definitionByKey = new Map<string, BiasDefinition>();
const aliasToKey = new Map<string, string>();

for (const definition of BIAS_DEFINITIONS) {
  definitionByKey.set(definition.key, definition);

  for (const alias of definition.aliases) {
    aliasToKey.set(normalizeLookupKey(alias), definition.key);
  }

  const withoutBiasSuffix = definition.key.replace(/\s+bias$/, "");

  if (withoutBiasSuffix !== definition.key) {
    aliasToKey.set(normalizeLookupKey(withoutBiasSuffix), definition.key);
  }

  if (!definition.key.endsWith(" bias")) {
    aliasToKey.set(normalizeLookupKey(`${definition.key} bias`), definition.key);
  }
}

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

  for (const match of trimmed.matchAll(/\(([^)]+)\)/g)) {
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

function resolveBiasKey(value: string) {
  for (const candidate of extractBiasCandidates(value)) {
    const key = aliasToKey.get(normalizeLookupKey(candidate));

    if (key) {
      return key;
    }
  }

  return null;
}

export type NormalizedBias = {
  key: string;
  label: string;
};

export function getBiasRegistryKeys() {
  return [...BIAS_REGISTRY_KEYS];
}

export function getBiasPromptWhitelist() {
  return BIAS_REGISTRY_KEYS.map((key) => `- ${key}`).join("\n");
}

export function getBiasDefinition(key: string) {
  return definitionByKey.get(key) ?? null;
}

export function normalizeBias(value: string): NormalizedBias | null {
  const key = resolveBiasKey(value);

  if (!key) {
    return null;
  }

  const definition = definitionByKey.get(key);

  if (!definition) {
    return null;
  }

  return {
    key: definition.key,
    label: definition.labelUk,
  };
}

export function normalizeAnalysisBiases(rawBiases: string[]) {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const rawBias of rawBiases) {
    const resolved = normalizeBias(rawBias);

    if (!resolved || seen.has(resolved.key)) {
      continue;
    }

    seen.add(resolved.key);
    normalized.push(resolved.key);
  }

  return normalized;
}

export function getBiasDescriptionByKey(key: string): BiasDescription {
  const definition = definitionByKey.get(key);

  if (!definition) {
    return {
      title: key,
      description: m.decisions.analysis.genericBiasDescription,
    };
  }

  return {
    title: definition.labelUk,
    description: definition.descriptionUk,
  };
}

export function getBiasDescription(rawBias: string): BiasDescription {
  const normalized = normalizeBias(rawBias);

  if (!normalized) {
    return {
      title: rawBias.trim(),
      description: m.decisions.analysis.genericBiasDescription,
    };
  }

  return getBiasDescriptionByKey(normalized.key);
}
