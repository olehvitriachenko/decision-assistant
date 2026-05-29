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
};

export type DecisionListItem = Pick<
  Decision,
  "id" | "title" | "status" | "created_at"
>;
