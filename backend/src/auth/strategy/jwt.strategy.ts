import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(
    configService: ConfigService,
    private prismaService: PrismaService
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  } 
  async validate(payload: {
    sub: number;
    username: string;
    iat: number
    exp: number
  }) { 
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.sub
      },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
        updated_at: true
      }
    })
    return user
  }
}