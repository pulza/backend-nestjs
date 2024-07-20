import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/request/create-quiz.dto';
import { UpdateQuizDto } from './dto/request/update-quiz.dto';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { User } from '@prisma/client';
import { QuizDto } from './dto/response/quiz.dto';
import { ApiOperation, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @ApiOperation({ summary: '카테고리의 퀴즈 전체 조회', description: 'Role: public' })
  @ApiParam({ name: 'categoryId', description: '카테고리 id' })
  @Get('all/:categoryId')
  @Roles('public')
  findAll(@Param('categoryId') categoryId: string): Promise<QuizDto[]> {
    return this.quizzesService.findAll(+categoryId);
  }

  @ApiOperation({ summary: '퀴즈 id로 퀴즈 조회', description: 'Role: public' })
  @ApiParam({ name: 'id', description: '퀴즈 id' })
  @Get(':id')
  @Roles('public')
  findOne(@Param('id') id: string): Promise<QuizDto> {
    return this.quizzesService.findOne(+id);
  }

  @ApiOperation({ summary: '퀴즈 생성' })
  @ApiBody({ type: CreateQuizDto })
  @Post()
  create(@CurrentUser() currentUser: User, @Body() createQuizDto: CreateQuizDto): Promise<void> {
    return this.quizzesService.create(currentUser, createQuizDto);
  }

  @ApiOperation({ summary: '퀴즈 id로 퀴즈 수정' })
  @ApiParam({ name: 'id', description: '퀴즈 id' })
  @ApiBody({ type: UpdateQuizDto })
  @Patch(':id')
  update(
    @CurrentUser() currentUser: User,
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ): Promise<void> {
    return this.quizzesService.update(currentUser, +id, updateQuizDto);
  }

  @ApiOperation({ summary: '퀴즈 id로 퀴즈 삭제' })
  @ApiParam({ name: 'id', description: '퀴즈 id' })
  @Delete(':id')
  remove(@CurrentUser() currentUser: User, @Param('id') id: string): Promise<void> {
    return this.quizzesService.remove(currentUser, +id);
  }
}
