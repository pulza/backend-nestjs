import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/request/create-quiz.dto';
import { UpdateQuizDto } from './dto/request/update-quiz.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { QuizDto } from './dto/response/quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async findAll(smallCategoryId: number): Promise<QuizDto[]> {
    const quizzes = await this.prisma.quiz.findMany({
      where: { smallCategoryId },
      orderBy: { id: 'desc' },
    });

    return quizzes.map((quiz) => {
      return new QuizDto(quiz);
    });
  }

  async findOne(id: number): Promise<QuizDto> {
    const quiz = await this.prisma.quiz.findUniqueOrThrow({
      where: { id },
    });

    return new QuizDto(quiz);
  }

  async create(user: User, createQuizDto: CreateQuizDto): Promise<void> {
    await this.prisma.smallCategory.findUniqueOrThrow({
      where: { id: createQuizDto.smallCategoryId },
    });

    await this.prisma.quiz.create({
      data: { ...createQuizDto, userId: user.id },
    });
  }

  async update(user: User, id: number, updateQuizDto: UpdateQuizDto): Promise<void> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id, userId: user.id },
    });
    if (!quiz) throw new HttpException('', HttpStatus.BAD_REQUEST);

    await this.prisma.quiz.update({
      where: { id },
      data: updateQuizDto,
    });
  }

  async remove(user: User, id: number): Promise<void> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id, userId: user.id },
    });
    if (!quiz) throw new HttpException('', HttpStatus.BAD_REQUEST);

    await this.prisma.quiz.delete({
      where: { id },
    });
  }
}
