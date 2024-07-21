import { ApiProperty } from '@nestjs/swagger';
import { Comment, User } from '@prisma/client';

export class CommentDto {
  @ApiProperty({
    description: '댓글 id',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '작성자 이름',
    type: String,
  })
  createUserName: string;

  @ApiProperty({
    description: '댓글 내용',
    type: String,
  })
  content: string;

  @ApiProperty({
    description: '생성일',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일',
    type: Date,
  })
  updatedAt: Date;

  constructor(comment: Comment & { user: User }) {
    this.id = comment.id;
    this.createUserName = comment.user.name;
    this.content = comment.content;
    this.createdAt = comment.createdAt;
    this.updatedAt = comment.updatedAt;
  }
}
