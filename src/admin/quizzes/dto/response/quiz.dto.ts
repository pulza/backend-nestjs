import { Quiz } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export class QuizDto {
  id: number;
  categoryId: number;
  question: string;
  choice: JsonValue;
  answer: any;
  solution: string;

  constructor(quiz: Quiz) {
    this.id = quiz.id;
    this.categoryId = quiz.categoryId;
    this.question = quiz.question;
    this.choice = quiz.choice;
    this.answer = quiz.answer;
    this.solution = quiz.solution;
  }
}
