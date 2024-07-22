import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';
import { UserDto } from './dto/response/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findOne(@CurrentUser() user: User){
      return new UserDto(user)
  }
}
