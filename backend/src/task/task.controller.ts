import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { TaskService } from './task.service';
import { CreateTaskDto, GetTasksPaginatedDto, UpdateTaskDto } from './dto';

@UseGuards(JwtGuard)
@Controller('api')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @HttpCode(201)
  @Post('/task/')
  @UseInterceptors(NoFilesInterceptor())
  async createTask(@GetUser('id') userId: number, @Body() dto: CreateTaskDto) {
    return this.taskService.createTask(userId, dto);
  }

  @HttpCode(200)
  @Put('/task/:id')
  @UseInterceptors(NoFilesInterceptor())
  async updateTask(
    @GetUser('id') owner_id: number,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.updateTask(owner_id, taskId, dto);
  }

  @HttpCode(200)
  @Delete('/task/:id')
  async deleteTask(
    @GetUser('id') owner_id: number,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.deleteTask(owner_id, taskId);
  }

  @HttpCode(200)
  @Get('/task/:id')
  async getTaskById(
    @GetUser('id') owner_id: number,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.getTaskById(owner_id, taskId);
  }

  @HttpCode(200)
  @Post('/tasks/')
  async getTasksPaginated(
    @GetUser('id') userId: number,
    @Body() dto: GetTasksPaginatedDto,
  ) {
    return this.taskService.getTasksPaginated(userId, dto);
  }
}
