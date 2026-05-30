import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

import {
  biasRegistryKeySchema,
  getBiasPromptWhitelist,
  normalizeAnalysisBiases,
} from "@/lib/biases/registry";
import {
  categoryRegistryKeySchema,
  getCategoryPromptGuidance,
  normalizeCategory,
} from "@/lib/categories/registry";

const MODEL = "gpt-4.1-mini";

export const analyzeDecisionInputSchema = z.object({
  title: z.string().trim().min(1),
  situation: z.string().trim().min(1),
  decision: z.string().trim().min(1),
  thoughts: z.string().trim().optional(),
});

export const decisionAnalysisSchema = z.object({
  category: z.preprocess(
    (value) => (typeof value === "string" ? normalizeCategory(value) : value),
    categoryRegistryKeySchema
  ).describe("Exactly one decision category from the allowed list."),
  confidence: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe(
      "Integer 0-100: how well-supported the stated decision is based only on the provided information. Use the full range with granular values (e.g. 23, 58, 84). 0-39=low, 40-69=medium, 70-100=high."
    ),
  biases: z
    .array(biasRegistryKeySchema)
    .describe(
      "Cognitive bias keys from the allowed whitelist only. Return [] if none apply."
    ),
  alternatives: z.array(z.string().trim().min(1)),
  summary: z.string().trim().min(1),
});

export type AnalyzeDecisionInput = z.infer<typeof analyzeDecisionInputSchema>;
export type DecisionAnalysis = z.infer<typeof decisionAnalysisSchema>;

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing required environment variable: OPENAI_API_KEY");
  }

  return new OpenAI({ apiKey });
}

function buildUserPrompt(input: AnalyzeDecisionInput) {
  const sections = [
    `Назва: ${input.title}`,
    `Ситуація: ${input.situation}`,
    `Рішення, яке розглядається: ${input.decision}`,
  ];

  if (input.thoughts) {
    sections.push(`Додаткові міркування: ${input.thoughts}`);
  }

  return sections.join("\n\n");
}

const SYSTEM_PROMPT = `Ти — помічник з аналізу рішень.

Проаналізуй контекст рішення користувача та поверни структурований JSON:
- category: ${getCategoryPromptGuidance()}
- confidence: ціле число від 0 до 100 (див. шкалу нижче)
- biases: масив ключів когнітивних упереджень ТІЛЬКИ зі списку нижче (копіюй ключ дослівно, без змін):
${getBiasPromptWhitelist()}
  Якщо жодне не підходить — поверни порожній масив [].
  Не додавай ключів поза цим списком.
- alternatives: масив розумних альтернатив українською, які користувач міг упустити; додай хоча б одну, коли це можливо
- summary: стислий підсумок українською (2–4 речення): ситуація, ключові компроміси та рамка рекомендації

## Шкала confidence

Оцінюй, наскільки обґрунтованим виглядає заявлене рішення ЛИШЕ на основі наданої інформації.
Це якість міркувань і повнота даних — не оптимізм щодо майбутнього.

Використовуй весь діапазон 0–100. Не застосовуй типову середину (50–65). Різні входи мають давати різні оцінки. Надавай перевагу конкретним значенням (27, 58, 83), а не круглим числам на 0 або 5, якщо вони не підходять ідеально.

### Низький (0–39): слабо обґрунтовано
- Бракує ключових фактів, обмежень або стейкхолдерів
- Емоційне обґрунтування без критеріїв
- Ігноруються компроміси, ризики або альтернативи

### Середній (40–69): частково обґрунтовано
- Є критерії, але важливі невідомі залишаються
- Компроміси згадані, але не зважені
- Альтернативи не оцінені серйозно

### Високий (70–100): добре обґрунтовано
- Критерії рішення зрозумілі
- Враховані факти, обмеження та компроміси
- 85–100 — лише для винятково повного міркування (рідко)

Будь практичним, нейтральним і конкретним. Не вигадуй факти, яких немає в контексті.`;

export async function analyzeDecision(
  input: AnalyzeDecisionInput
): Promise<DecisionAnalysis> {
  const parsedInput = analyzeDecisionInputSchema.safeParse(input);

  if (!parsedInput.success) {
    throw new Error(
      `Invalid decision analysis input: ${parsedInput.error.message}`
    );
  }

  const client = getOpenAIClient();

  const completion = await client.chat.completions.parse({
    model: MODEL,
    temperature: 0.2,
    max_completion_tokens: 500,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(parsedInput.data) },
    ],
    response_format: zodResponseFormat(
      decisionAnalysisSchema,
      "decision_analysis"
    ),
  });

  const parsed = completion.choices[0]?.message?.parsed;

  if (!parsed) {
    throw new Error("OpenAI returned an empty or unparsable analysis response");
  }

  const validated = decisionAnalysisSchema.safeParse(parsed);

  if (!validated.success) {
    throw new Error(
      `Decision analysis validation failed: ${validated.error.message}`
    );
  }

  return {
    ...validated.data,
    category: normalizeCategory(validated.data.category),
    biases: normalizeAnalysisBiases(validated.data.biases),
  };
}
