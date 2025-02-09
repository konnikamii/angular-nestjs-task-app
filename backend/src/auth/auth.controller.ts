import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('/api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(201)
  @Post('/register/')
  @UseInterceptors(NoFilesInterceptor())
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(200)
  @Post('/login/')
  @UseInterceptors(NoFilesInterceptor())
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
