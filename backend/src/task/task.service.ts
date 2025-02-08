import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; 
import { CreateTaskDto, GetTasksPaginatedDto, UpdateTaskDto } from './dto';

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}

  async createTask(userId: number, dto: CreateTaskDto) {
    return this.prismaService.task.create({
      data: {
        ...dto,
        owner_id: userId,
      },
    });
  }

  async updateTask(owner_id: number, taskId: number, dto: UpdateTaskDto) {
    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.owner_id !== owner_id) {
      throw new NotFoundException('Task not found');
    }

    return this.prismaService.task.update({
      where: { id: taskId },
      data: dto,
    });
  }

  async deleteTask(owner_id: number,taskId: number) {
    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.owner_id !== owner_id) {
      throw new NotFoundException('Task not found');
    }
    return this.prismaService.task.delete({
      where: { id: taskId },
    });
  }

  async getTaskById(owner_id: number,taskId: number) {
    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.owner_id !== owner_id) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
 
  async getTasksPaginated(owner_id: number, dto: GetTasksPaginatedDto) {
    const { page, page_size, sort_by, sort_type } = dto;
    const skip = (page - 1) * page_size;
    const orderBy = sort_by ? { [sort_by]: sort_type || 'asc' } : {}; 
    const tasks = await this.prismaService.task.findMany({
      where: { owner_id: owner_id },
      skip,
      take: page_size,
      orderBy,
    });

    const total_tasks = await this.prismaService.task.count({
      where: { owner_id: owner_id },
    });

    return {
      total_tasks, 
      tasks,
    };
  }
}