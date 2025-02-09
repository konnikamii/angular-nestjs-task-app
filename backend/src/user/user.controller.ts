import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { ChangePasswordDto, GetUsersDto } from './dto';

@UseGuards(JwtGuard)
@Controller('api')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @Get('/user/')
  getUser(@GetUser('') user: User) {
    return user;
  }

  @HttpCode(200)
  @Post('/users/')
  async getUsers(@Body() dto: GetUsersDto) {
    return this.userService.getUsers(dto);
  }

  @HttpCode(200)
  @Put('/change-password/')
  @UseInterceptors(NoFilesInterceptor())
  async changePassword(@GetUser() user: User, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(user, dto);
  }
}
