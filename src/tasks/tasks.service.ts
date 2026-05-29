import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  // Get all tasks belonging to the logged-in user
  async findAll(userId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Get one task by ID — only if it belongs to the logged-in user
  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.userId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }
    return task;
  }

  // Create a new task for the logged-in user
  async create(dto: CreateTaskDto, userId: string): Promise<Task> {
    const task = this.tasksRepository.create({
      ...dto,
      userId,
    });
    return this.tasksRepository.save(task);
  }

  // Update a task — only if it belongs to the logged-in user
  async update(id: string, dto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.findOne(id, userId);
    Object.assign(task, dto);
    return this.tasksRepository.save(task);
  }

  // Delete a task — only if it belongs to the logged-in user
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const task = await this.findOne(id, userId);
    await this.tasksRepository.remove(task);
    return { message: 'Task deleted successfully' };
  }
}
