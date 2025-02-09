import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './contact/contact.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const hostname = configService.get<string>('MAIL_HOST'); 
        return { transport: {
          host: hostname,
          port: 1025,
          secure: false,
        },}
      }, 
    }),
    AuthModule,
    UserModule,
    TaskModule,
    ContactModule,
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
})
export class AppModule {}
