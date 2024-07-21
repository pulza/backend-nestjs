import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/requests/create-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { CommentDto } from './dto/responses/comment.dto';
import { UpdateCommentDto } from './dto/requests/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(user: User, quizId: number, createCommentDto: CreateCommentDto): Promise<void> {
    await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        userId: user.id,
        quizId,
      },
    });
  }

  async update(user: User, id: number, updateCommentDto: UpdateCommentDto): Promise<void> {
    await this.prisma.comment.update({
      where: {
        userId: user.id,
        id,
      },
      data: {
        content: updateCommentDto.content,
      },
    });
  }

  async findAll(quizId: number): Promise<CommentDto[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        quizId,
      },
      include: {
        user: true,
      },
    });
    return comments.map((comment) => {
      return new CommentDto(comment);
    });
  }

  async remove(user: User, id: number): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        userId: user.id,
        id,
      },
    });
  }
}
