import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const MODEL = "gpt-4.1-mini";

export const analyzeDecisionInputSchema = z.object({
  title: z.string().trim().min(1),
  situation: z.string().trim().min(1),
  decision: z.string().trim().min(1),
  thoughts: z.string().trim().optional(),
});

export const decisionAnalysisSchema = z.object({
  category: z.string().trim().min(1),
  confidence: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe(
      "Integer 0-100: how well-supported the stated decision is based only on the provided information. Use the full range with granular values (e.g. 23, 58, 84). 0-39=low, 40-69=medium, 70-100=high."
    ),
  biases: z.array(z.string().trim().min(1)),
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
    `Title: ${input.title}`,
    `Situation: ${input.situation}`,
    `Decision under consideration: ${input.decision}`,
  ];

  if (input.thoughts) {
    sections.push(`Additional thoughts: ${input.thoughts}`);
  }

  return sections.join("\n\n");
}

const SYSTEM_PROMPT = `You are a decision analysis assistant.

Analyze the user's decision context and return structured JSON with:
- category: a short label for the type of decision (e.g. career, finance, relationship, health, education, lifestyle)
- confidence: an integer from 0 to 100 (see rubric below)
- biases: an array of possible cognitive biases that may be influencing the decision; return an empty array if none are apparent
- alternatives: an array of reasonable alternatives the user may have missed; include at least one when possible
- summary: a concise 2-4 sentence summary of the situation, key trade-offs, and recommendation framing

## Confidence rubric

Score how well-supported the user's stated decision appears based ONLY on the information they provided.
This measures reasoning quality and information completeness — not optimism about future outcomes.

Use the full 0-100 range. Do not default to middle scores (50-65). Different inputs should produce meaningfully different scores. Prefer specific values (e.g. 27, 58, 83) over round numbers ending in 0 or 5 unless they fit exactly.

### Low (0-39): poorly supported
The decision lacks a solid basis in what was shared. Typical signals:
- Critical facts, constraints, or stakeholders are missing or vague
- Strong emotional framing with little evidence or criteria
- Major trade-offs, risks, or alternatives are ignored
- The conclusion feels premature relative to the uncertainty described
- 0-15: almost no usable basis in the provided context
- 16-39: some direction but major gaps undermine confidence

### Medium (40-69): partially supported
There is reasonable thinking, but important gaps or tensions remain. Typical signals:
- Some criteria or context are present, but key unknowns are unaddressed
- Trade-offs are mentioned but not weighed clearly
- Alternatives exist but were not seriously evaluated
- Support is mixed — plausible path, but not clearly the best-supported one
- 40-54: weak-to-moderate support with substantial uncertainty
- 55-69: decent support, but meaningful reservations remain

### High (70-100): well supported
The decision follows clearly from the provided context. Typical signals:
- Decision criteria are stated or inferable
- Relevant facts, constraints, and trade-offs are considered
- Remaining uncertainty is acknowledged and proportionate
- The chosen option is reasonably justified vs. obvious alternatives
- 70-84: solid support with minor gaps
- 85-100: exceptionally clear and complete reasoning (use sparingly — most real decisions should not score here)

Be practical, neutral, and specific to the input. Do not invent facts not supported by the context.`;

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

  return validated.data;
}
