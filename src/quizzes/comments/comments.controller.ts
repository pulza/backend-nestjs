import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/requests/create-comment.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';
import { UpdateCommentDto } from './dto/requests/update-comment.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentDto } from './dto/responses/comment.dto';

@ApiTags('quiz comments')
@Controller('quizzes/:quizId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: '댓글 생성' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'quizId', description: '퀴즈 id' })
  @ApiBody({ type: CreateCommentDto })
  @Post()
  create(
    @CurrentUser() user: User,
    @Param('quizId') quizId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<void> {
    return this.commentsService.create(user, quizId, createCommentDto);
  }

  @ApiOperation({ summary: '댓글 조회', description: 'Role: public' })
  @ApiParam({ name: 'quizId', description: '퀴즈 id' })
  @ApiResponse({ type: CommentDto, isArray: true })
  @Get()
  findAll(@Param('quizId') quizId: number): Promise<CommentDto[]> {
    return this.commentsService.findAll(quizId);
  }

  @ApiOperation({ summary: '댓글 수정' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: '댓글 id' })
  @ApiBody({ type: UpdateCommentDto })
  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<void> {
    return this.commentsService.update(user, +id, updateCommentDto);
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: '댓글 id' })
  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
    return this.commentsService.remove(user, +id);
  }
}
