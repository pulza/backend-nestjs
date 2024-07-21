import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: '댓글 내용',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  constructor(content: string) {
    this.content = content;
  }
}
