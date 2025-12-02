/**
 * Frontend-only types
 * No backend API references
 */

/**
 * Interview question type
 */
export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

/**
 * Local feedback stored on frontend only
 */
export interface InterviewFeedback {
  transcription: string;
  question: string;
  timestamp: string;
  audioUrl: string;
}
