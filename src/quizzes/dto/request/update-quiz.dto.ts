import { PartialType, PickType } from '@nestjs/swagger';
import { CreateQuizDto } from './create-quiz.dto';

export class UpdateQuizDto extends PickType(PartialType(CreateQuizDto), [
  'question',
  'choice',
  'answer',
  'solution',
] as const) {}
