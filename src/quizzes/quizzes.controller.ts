import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/requests/create-quiz.dto';
import { UpdateQuizDto } from './dto/requests/update-quiz.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';
import { QuizDto } from './dto/responses/quiz.dto';
import { ApiOperation, ApiBody, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @ApiOperation({ summary: '소분류 small 카테고리의 퀴즈 전체 조회', description: 'Role: public' })
  @ApiParam({ name: 'smallCategoryId', description: 'small 카테고리 id' })
  @Get('all/:smallCategoryId')
  @Roles('public')
  findAll(@Param('smallCategoryId') smallCategoryId: string): Promise<QuizDto[]> {
    return this.quizzesService.findAll(+smallCategoryId);
  }

  @Get('random/:smallCategoryId')
  @ApiOperation({ summary: '소분류 small 카테고리의 랜덤 퀴즈', description: 'Role: public' })
  @ApiParam({ name: 'smallCategoryId', description: 'small 카테고리 id' })
  @Roles('public')
  findRandom(@Param('smallCategoryId') smallCategoryId: string): Promise<QuizDto | null> {
    return this.quizzesService.findRandom(+smallCategoryId);
  }

  @ApiOperation({ summary: '퀴즈 id로 퀴즈 조회', description: 'Role: public' })
  @ApiParam({ name: 'id', description: '퀴즈 id' })
  @Get(':id')
  @Roles('public')
  findOne(@Param('id') id: string): Promise<QuizDto> {
    return this.quizzesService.findOne(+id);
  }

  @ApiOperation({ summary: '퀴즈 생성' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateQuizDto })
  @Post()
  create(@CurrentUser() currentUser: User, @Body() createQuizDto: CreateQuizDto): Promise<void> {
    return this.quizzesService.create(currentUser, createQuizDto);
  }

  @ApiOperation({ summary: '퀴즈 id로 퀴즈 수정' })
  @ApiBearerAuth('access-token')
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
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: '퀴즈 id' })
  @Delete(':id')
  remove(@CurrentUser() currentUser: User, @Param('id') id: string): Promise<void> {
    return this.quizzesService.remove(currentUser, +id);
  }
}
