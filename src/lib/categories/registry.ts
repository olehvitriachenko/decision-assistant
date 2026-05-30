import { z } from "zod";

type CategoryDefinition = {
  key: string;
  slug: string;
  labelUk: string;
  aliases: string[];
};

function defineCategory(
  key: string,
  labelUk: string,
  aliases: string[] = []
): CategoryDefinition {
  const slug = key.trim().toLowerCase().replace(/\s+/g, "-");

  return {
    key,
    slug,
    labelUk,
    aliases: [key, slug, key.toLowerCase(), ...aliases],
  };
}

export const DECISION_CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  defineCategory("Career", "Кар'єра", [
    "career",
    "job",
    "work",
    "employment",
    "profession",
  ]),
  defineCategory("Finance", "Фінанси", [
    "finance",
    "money",
    "investing",
    "investment",
    "savings",
    "budget",
  ]),
  defineCategory("Education", "Освіта", [
    "education",
    "learning",
    "study",
    "school",
    "university",
  ]),
  defineCategory("Health", "Здоров'я", [
    "health",
    "medical",
    "medicine",
    "wellness",
    "mental health",
  ]),
  defineCategory("Relationships", "Стосунки", [
    "relationship",
    "relationships",
    "dating",
    "marriage",
    "partner",
  ]),
  defineCategory("Business", "Бізнес", [
    "business",
    "startup",
    "entrepreneurship",
    "company",
  ]),
  defineCategory("Personal Safety", "Особиста безпека", [
    "personal safety",
    "safety",
    "risk",
    "security",
    "war",
    "evacuation",
    "mobilization",
    "danger",
    "threat",
    "violence",
  ]),
  defineCategory("Legal", "Право", [
    "legal",
    "law",
    "immigration",
    "visa",
    "visas",
    "regulation",
    "regulations",
    "compliance",
    "litigation",
  ]),
  defineCategory("Housing", "Житло", [
    "housing",
    "home",
    "rent",
    "apartment",
    "moving",
    "relocation",
  ]),
  defineCategory("Lifestyle", "Стиль життя", [
    "lifestyle",
    "hobby",
    "hobbies",
    "routine",
  ]),
  defineCategory("Travel", "Подорожі", [
    "travel",
    "trip",
    "vacation",
    "tourism",
  ]),
  defineCategory("Family", "Сім'я", [
    "family",
    "parenting",
    "children",
    "childcare",
  ]),
  defineCategory("Technology", "Технології", [
    "technology",
    "tech",
    "software",
    "digital",
    "gadgets",
  ]),
  defineCategory("Other", "Інше", [
    "other",
    "general",
    "personal",
    "misc",
    "miscellaneous",
  ]),
];

export const DECISION_CATEGORY_KEYS = DECISION_CATEGORY_DEFINITIONS.map(
  (definition) => definition.key
) as [string, ...string[]];

export const categoryRegistryKeySchema = z.enum(DECISION_CATEGORY_KEYS);

export type DecisionCategory = (typeof DECISION_CATEGORY_KEYS)[number];

export const decisionCategorySlugs = DECISION_CATEGORY_DEFINITIONS.map(
  (definition) => definition.slug
) as [string, ...string[]];

export type DecisionCategorySlug = (typeof decisionCategorySlugs)[number];

export const decisionCategoryFilterOptions = [
  "all",
  ...decisionCategorySlugs,
] as const;

export type DecisionCategoryFilter =
  (typeof decisionCategoryFilterOptions)[number];

const definitionByKey = new Map<string, CategoryDefinition>();
const aliasToKey = new Map<string, DecisionCategory>();

for (const definition of DECISION_CATEGORY_DEFINITIONS) {
  definitionByKey.set(definition.key, definition);

  for (const alias of definition.aliases) {
    aliasToKey.set(normalizeLookupKey(alias), definition.key);
  }
}

function normalizeLookupKey(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, " ");
}

export function normalizeCategory(value: string): DecisionCategory {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Other";
  }

  const directKey = definitionByKey.get(trimmed);

  if (directKey) {
    return directKey.key as DecisionCategory;
  }

  const resolved = aliasToKey.get(normalizeLookupKey(trimmed));

  if (resolved) {
    return resolved;
  }

  return "Other";
}

export function getCategorySlug(category: string) {
  const normalized = normalizeCategory(category);
  return definitionByKey.get(normalized)?.slug ?? "other";
}

export function getCategoryLabel(category: string) {
  const normalized = normalizeCategory(category);
  return definitionByKey.get(normalized)?.labelUk ?? normalized;
}

export function getCategoryFilterLabels(): Record<
  DecisionCategoryFilter,
  string
> {
  const labels = {
    all: "Усі категорії",
  } as Record<DecisionCategoryFilter, string>;

  for (const definition of DECISION_CATEGORY_DEFINITIONS) {
    labels[definition.slug as DecisionCategoryFilter] = definition.labelUk;
  }

  return labels;
}

export function matchesDecisionCategoryFilter(
  analysisCategory: string | null | undefined,
  filter: DecisionCategoryFilter
) {
  if (filter === "all") {
    return true;
  }

  if (!analysisCategory) {
    return false;
  }

  return getCategorySlug(analysisCategory) === filter;
}

export function getCategoryPromptWhitelist() {
  return DECISION_CATEGORY_KEYS.map((key) => `- ${key}`).join("\n");
}

export function getCategoryPromptGuidance() {
  return `Обери РІВНО ОДНУ категорію зі списку нижче. Копіюй назву дослівно (англійською, з великої літери):

${getCategoryPromptWhitelist()}

Правила класифікації:
- Personal Safety: фізична небезпека, війна, евакуація, загрози життю, небезпечне середовище, мобілізація, особиста безпека.
- Legal: імміграція, візи, правовий статус, обмеження, регуляції, compliance.
- Career: робота, звільнення, пропозиції про роботу, кар'єра.
- Finance: заощадження, інвестиції, борги, бюджет, гроші.
- Education: навчання, університет, курси, освіта.
- Business: стартап, власна справа, бізнес-рішення.
- Housing: оренда, купівля житла, переїзд, житло.
- Relationships: стосунки, партнер, шлюб, розлучення.
- Family: діти, батьки, сімейні рішення.
- Health: здоров'я, лікування, медицина.
- Travel: подорожі, відпустка, переїзд у туристичному контексті.
- Technology: софт, гаджети, цифрові інструменти.
- Lifestyle: використовуй ЛИШЕ якщо жодна конкретніша категорія не підходить (хобі, побутові звички без доменної специфіки).
- Other: лише якщо контекст не вкладається в жодну категорію вище.

Не використовуй загальні ярлики на кшталт "Personal" або "General" — обери найконкретнішу категорію.`;
}
