import { ApiProperty } from '@nestjs/swagger';
import { Quiz } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export class QuizDto {
  @ApiProperty({ description: '퀴즈 id', required: true, example: 1 })
  id: number;

  @ApiProperty({ description: '소분류 smallCategory id', required: true, example: 1 })
  smallCategoryId: number;

  @ApiProperty({ description: '문제', required: true, example: '이것은 문제입니다.' })
  question: string;

  @ApiProperty({ description: '선택지', required: true, example: { a: '선택지1', b: '선택지2' } })
  choice: JsonValue;

  @ApiProperty({ description: '정답', required: true, example: '1' })
  answer: any;

  @ApiProperty({ description: '해설', required: true, example: '이것은 해설입니다.' })
  solution: string;

  constructor(quiz: Quiz) {
    this.id = quiz.id;
    this.smallCategoryId = quiz.smallCategoryId;
    this.question = quiz.question;
    this.choice = quiz.choice;
    this.answer = quiz.answer;
    this.solution = quiz.solution;
  }
}
