import React, { useState, useEffect } from 'react';
import { parseCSV } from './utils/csvParser';
import { QuizState, Question } from './types';
import QuizQuestion from './components/QuizQuestion';
import QuizResult from './components/QuizResult';
import ProgressBar from './components/ProgressBar';
import { FileText } from 'lucide-react';

const CSV_URL = '/src/utils/quiz_questions.csv';
const TOTAL_QUESTIONS = 10;

const difficultyOrder = ['Easy', 'Medium', 'Hard'];

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    incorrectAnswers: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [currentDifficulty, setCurrentDifficulty] = useState<string>('Easy');

  useEffect(() => {
    fetch(CSV_URL)
      .then((response) => response.text())
      .then((data) => {
        const allQuestions = parseCSV(data);
        setQuizState((prevState) => ({
          ...prevState,
          questions: allQuestions,
        }));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching CSV:', error);
        setLoading(false);
      });
  }, []);

  const getNextQuestion = (difficulty: string): Question | null => {
    return quizState.questions.find(q => q.difficulty === difficulty) || null;
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

    if (answer === currentQuestion.correctAnswer) {
      setQuizState((prevState) => ({ ...prevState, score: prevState.score + 1 }));
      const nextDifficultyIndex = Math.min(difficultyOrder.indexOf(currentDifficulty) + 1, difficultyOrder.length - 1);
      setCurrentDifficulty(difficultyOrder[nextDifficultyIndex]);
    } else {
      setQuizState((prevState) => ({
        ...prevState,
        incorrectAnswers: [...prevState.incorrectAnswers, currentQuestion],
      }));
      const prevDifficultyIndex = Math.max(difficultyOrder.indexOf(currentDifficulty) - 1, 0);
      setCurrentDifficulty(difficultyOrder[prevDifficultyIndex]);
    }

    let nextQuestion = getNextQuestion(currentDifficulty);
    if (!nextQuestion) {
      // If no question found in current difficulty, try other difficulties
      for (const diff of difficultyOrder) {
        nextQuestion = getNextQuestion(diff);
        if (nextQuestion) break;
      }
    }

    if (nextQuestion) {
      const nextIndex = quizState.questions.indexOf(nextQuestion);
      setQuizState((prevState) => ({
        ...prevState,
        currentQuestionIndex: nextIndex,
      }));
    } else {
      // If no more questions, end the quiz
      setQuizState((prevState) => ({
        ...prevState,
        currentQuestionIndex: TOTAL_QUESTIONS,
      }));
    }
  };

  const restartQuiz = () => {
    setQuizState((prevState) => ({
      ...prevState,
      currentQuestionIndex: 0,
      score: 0,
      incorrectAnswers: [],
    }));
    setCurrentDifficulty('Easy');
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  if (quizState.currentQuestionIndex >= TOTAL_QUESTIONS) {
    return (
      <QuizResult
        score={quizState.score}
        totalQuestions={TOTAL_QUESTIONS}
        incorrectAnswers={quizState.incorrectAnswers}
        onRestart={restartQuiz}
      />
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full px-4">
        <div className="flex items-center justify-center mb-6">
          <FileText className="w-8 h-8 text-blue-500 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">CSV Quiz App</h1>
        </div>
        <ProgressBar current={quizState.currentQuestionIndex + 1} total={TOTAL_QUESTIONS} />
        <QuizQuestion
          question={currentQuestion}
          onAnswer={handleAnswer}
        />
        <div className="mt-4 text-center text-gray-600">
          Question {quizState.currentQuestionIndex + 1} of {TOTAL_QUESTIONS}
        </div>
        <div className="mt-2 text-center">
          <span className="text-sm text-gray-500">Current Difficulty: {currentDifficulty}</span>
        </div>
      </div>
    </div>
  );
};

export default App;