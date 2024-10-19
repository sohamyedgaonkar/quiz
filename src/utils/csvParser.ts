import Papa from 'papaparse';
import { Question } from '../types';

export const parseCSV = (csvContent: string): Question[] => {
  const { data } = Papa.parse(csvContent, { header: true });
  return data.map((row: any, index: number) => ({
    id: index.toString(),
    question: row.question,
    options: [row.option1, row.option2, row.option3, row.option4],
    correctAnswer: row.correctAnswer,
    difficulty: row.difficulty,
  }));
};