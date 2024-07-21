import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuizDto {
  @ApiProperty({ description: '문제를 등록하려는 소분류 smallCategory id', required: true, example: 1 })
  @IsNotEmpty()
  @IsNumber()
  smallCategoryId: number;

  @ApiProperty({ description: '문제', required: true, example: 'What is the capital of Korea?' })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({
    description: '객관식 항목',
    required: true,
    example: { '1': 'Seoul', '2': 'Busan', '3': 'Jeju', '4': 'Seongju' },
  })
  @IsNotEmpty()
  choice: Prisma.InputJsonValue;

  @ApiProperty({ description: '정답', required: true, example: '1' })
  @IsNotEmpty()
  @IsString()
  answer: string;

  @ApiProperty({ description: '풀이', required: true, example: 'Seoul is the capital of Korea.' })
  @IsNotEmpty()
  @IsString()
  solution: string;

  constructor(
    smallCategoryId: number,
    question: string,
    choice: Prisma.InputJsonValue,
    answer: string,
    solution: string,
  ) {
    this.smallCategoryId = smallCategoryId;
    this.question = question;
    this.choice = choice;
    this.answer = answer;
    this.solution = solution;
  }
}
