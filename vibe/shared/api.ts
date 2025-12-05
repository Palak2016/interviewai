/**
 * Shared types for InterviewAI
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
 * Confidence score details
 */
export interface ConfidenceScore {
  score: number;
  hesitationWords: number;
  hesitationDetails: string[];
  clarity: number;
}

/**
 * AI Feedback from LLM analysis
 */
export interface InterviewFeedback {
  transcription: string;
  critique: string;
  starAnalysis: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  confidenceScore: ConfidenceScore;
  strengths: string[];
  improvements: string[];
  overallRating: number;
  timestamp: string;
}
