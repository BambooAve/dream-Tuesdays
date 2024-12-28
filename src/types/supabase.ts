export interface Message {
  id: string;
  content: string;
  role: "assistant" | "user";
  created_at: string;
  session_id: string;
}

export interface Session {
  id: string;
  progress: number;
  created_at: string;
  completed_at: string | null;
  user_id: string;
}