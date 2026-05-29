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
  confidence: z.number().int().min(0).max(100),
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
- confidence: an integer from 0 to 100 estimating how well-supported the stated decision appears based on the provided information
- biases: an array of possible cognitive biases that may be influencing the decision; return an empty array if none are apparent
- alternatives: an array of reasonable alternatives the user may have missed; include at least one when possible
- summary: a concise 2-4 sentence summary of the situation, key trade-offs, and recommendation framing

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
