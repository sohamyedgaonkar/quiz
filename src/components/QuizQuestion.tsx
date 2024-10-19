import React from 'react';
import { Question } from '../types';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, onAnswer }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{question.question}</h2>
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            className="w-full text-left p-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => onAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;