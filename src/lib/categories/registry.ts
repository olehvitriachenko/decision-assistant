import { z } from "zod";

type CategoryDefinition = {
  key: string;
  slug: string;
  labelUk: string;
  descriptionUk: string;
  aliases: string[];
};

const GENERIC_CATEGORY_DESCRIPTION = "Загальна категорія рішень.";

function defineCategory(
  key: string,
  labelUk: string,
  descriptionUk: string,
  aliases: string[] = []
): CategoryDefinition {
  const slug = key.trim().toLowerCase().replace(/\s+/g, "-");

  return {
    key,
    slug,
    labelUk,
    descriptionUk,
    aliases: [key, slug, key.toLowerCase(), ...aliases],
  };
}

export const DECISION_CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  defineCategory(
    "Career",
    "Кар'єра",
    "Рішення, пов'язані з роботою, кар'єрним розвитком, зміною роботодавця або професійним ростом.",
    ["career", "job", "work", "employment", "profession"]
  ),
  defineCategory(
    "Finance",
    "Фінанси",
    "Рішення щодо грошей, інвестицій, заощаджень, кредитів або особистого бюджету.",
    ["finance", "money", "investing", "investment", "savings", "budget"]
  ),
  defineCategory(
    "Education",
    "Освіта",
    "Рішення про навчання, освіту, курси, університет або професійну перекваліфікацію.",
    ["education", "learning", "study", "school", "university"]
  ),
  defineCategory(
    "Health",
    "Здоров'я",
    "Рішення щодо здоров'я, лікування, медичних процедур або способу життя з фокусом на здоров'я.",
    ["health", "medical", "medicine", "wellness", "mental health"]
  ),
  defineCategory(
    "Relationships",
    "Стосунки",
    "Рішення про стосунки, партнерство, шлюб, розлучення або міжособистісні конфлікти.",
    ["relationship", "relationships", "dating", "marriage", "partner"]
  ),
  defineCategory(
    "Business",
    "Бізнес",
    "Рішення про власну справу, стартап, компанію або підприємницьку діяльність.",
    ["business", "startup", "entrepreneurship", "company"]
  ),
  defineCategory(
    "Personal Safety",
    "Особиста безпека",
    "Рішення, пов'язані з фізичною безпекою, війною, евакуацією, мобілізацією або ризиками для життя.",
    [
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
    ]
  ),
  defineCategory(
    "Legal",
    "Право",
    "Рішення щодо правового статусу, віз, імміграції, законодавчих обмежень або юридичних питань.",
    [
      "legal",
      "law",
      "immigration",
      "visa",
      "visas",
      "regulation",
      "regulations",
      "compliance",
      "litigation",
    ]
  ),
  defineCategory(
    "Housing",
    "Житло",
    "Рішення щодо житла, оренди, купівлі нерухомості або переїзду.",
    ["housing", "home", "rent", "apartment", "moving", "relocation"]
  ),
  defineCategory(
    "Lifestyle",
    "Стиль життя",
    "Особисті звички, хобі або життєві вибори, які не належать до конкретнішої категорії.",
    ["lifestyle", "hobby", "hobbies", "routine"]
  ),
  defineCategory(
    "Travel",
    "Подорожі",
    "Рішення про подорожі, відпустку, туристичні поїздки або тимчасові переїзди.",
    ["travel", "trip", "vacation", "tourism"]
  ),
  defineCategory(
    "Family",
    "Сім'я",
    "Рішення про сім'ю, дітей, батьківство або догляд за близькими.",
    ["family", "parenting", "children", "childcare"]
  ),
  defineCategory(
    "Technology",
    "Технології",
    "Рішення про софт, гаджети, цифрові інструменти або технологічні покупки.",
    ["technology", "tech", "software", "digital", "gadgets"]
  ),
  defineCategory(
    "Other",
    "Інше",
    GENERIC_CATEGORY_DESCRIPTION,
    ["other", "general", "personal", "misc", "miscellaneous"]
  ),
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

export function getCategoryDescription(category: string) {
  const normalized = normalizeCategory(category);
  return (
    definitionByKey.get(normalized)?.descriptionUk ?? GENERIC_CATEGORY_DESCRIPTION
  );
}

export function getCategoryFilterOptions() {
  return [
    {
      slug: "all" as const,
      labelUk: "Усі категорії",
      descriptionUk: null,
    },
    ...DECISION_CATEGORY_DEFINITIONS.map((definition) => ({
      slug: definition.slug as DecisionCategorySlug,
      labelUk: definition.labelUk,
      descriptionUk: definition.descriptionUk,
    })),
  ];
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
