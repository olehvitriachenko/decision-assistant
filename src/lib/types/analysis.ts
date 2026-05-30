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

export type InsertAnalysisIfGenerationMatchesInput = {
  decisionId: string;
  expectedGeneration: number;
  category: string;
  confidence: number;
  biases: string[];
  alternatives: string[];
  summary: string;
};
