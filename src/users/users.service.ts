import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // user 정보 조회

  // user 정보 수정

  // 본인이 남긴 댓글 모두 가져오기
}
