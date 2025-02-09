import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    const existingUsername = await this.prismaService.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (existingUser || existingUsername) {
      throw new ForbiddenException('Username or email already exists');
    }
    const hashedPassword = await argon.hash(dto.password);
    const user = await this.prismaService.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: dto.email ? { email: dto.email } : { username: dto.username },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const access_token = await this.signToken(user.id, user.username);
    return { access_token: access_token, token_type: 'Bearer' };
  }

  signToken(id: number, username: string): Promise<string> {
    const payload = { sub: id, username: username };
    return this.jwtService.signAsync(payload);
  }
}
