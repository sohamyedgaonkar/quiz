import React from 'react';
import { Question } from '../types';

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  incorrectAnswers: Question[];
  onRestart: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ score, totalQuestions, incorrectAnswers, onRestart }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
      <p className="text-lg mb-4">
        You scored {score} out of {totalQuestions}
      </p>
      {incorrectAnswers.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Incorrect Answers:</h3>
          <ul className="list-disc list-inside">
            {incorrectAnswers.map((q) => (
              <li key={q.id} className="mb-2">
                {q.question} (Correct: {q.correctAnswer})
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        onClick={onRestart}
      >
        Restart Quiz
      </button>
    </div>
  );
};

export default QuizResult;