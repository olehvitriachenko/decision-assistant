export type Analysis = {
  id: string;
  decision_id: string;
  category: string;
  confidence: number;
  biases: string[];
  alternatives: string[];
  summary: string;
  created_at: string;
};

export type CreateAnalysisInput = {
  decisionId: string;
  category: string;
  confidence: number;
  biases: string[];
  alternatives: string[];
  summary: string;
};

export type InsertAnalysisIfGenerationMatchesInput = CreateAnalysisInput & {
  expectedGeneration: number;
};
