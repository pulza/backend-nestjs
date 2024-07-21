import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/request/create-comment.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';
import { UpdateCommentDto } from './dto/request/update-comment.dto';

@Controller('quizzes/:quizId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@CurrentUser() user: User, @Param('quizId') quizId: number, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(user, quizId, createCommentDto);
  }

  @Get()
  findAll(@Param('quizId') quizId: number) {
    return this.commentsService.findAll(quizId);
  }

  @Patch(':id')
  update(@CurrentUser() user: User, @Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(user, +id, updateCommentDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.commentsService.remove(user, +id);
  }
}
