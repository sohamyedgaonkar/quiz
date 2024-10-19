export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  incorrectAnswers: Question[];
}