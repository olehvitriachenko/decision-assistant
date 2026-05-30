export type DecisionStatus = "processing" | "completed" | "failed";

export type Decision = {
  id: string;
  user_id: string;
  title: string;
  situation: string;
  decision: string;
  thoughts: string | null;
  status: DecisionStatus;
  created_at: string;
  updated_at: string;
  analysis_locked_at: string | null;
  analysis_generation: number;
};

export type DecisionListItem = {
  id: string;
  title: string;
  decision: string;
  status: DecisionStatus;
  created_at: string;
  analysis_category: string | null;
  analysis_confidence: number | null;
  analysis_bias_count: number | null;
};
