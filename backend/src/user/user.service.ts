import { Injectable, BadRequestException  } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangePasswordDto, GetUsersDto } from './dto';
import * as argon from 'argon2';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUsers(dto: GetUsersDto) {
    if (dto.type === 'user_tasks') {
      const usersWithTasks = await this.prismaService.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          updated_at: true,
          created_at: true,
          Task: true,
        },
      });
      return usersWithTasks.map(user => ({
        ...user,
        tasks: user.Task,
        Task: undefined,
      }));
    } else {
      const usersWithoutTasks = await this.prismaService.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          updated_at: true,
          created_at: true,
        },
      });
      return usersWithoutTasks;
    }
  }

  async changePassword(user: User, dto: ChangePasswordDto) {
    const currentPassword = await this.prismaService.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        password: true,
      },
    });
    if (!currentPassword) {
      throw new BadRequestException('User not found');
    }
    const passwordMatches = await argon.verify(currentPassword.password, dto.old_password);
    if (!passwordMatches) {
      throw new BadRequestException('Old password incorrect');
    }

    const hashedPasswordNew = await argon.hash(dto.new_password);
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPasswordNew,
      },
    });
    return {detail: "Successfully changed password"};
  }
}