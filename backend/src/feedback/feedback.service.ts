import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createFeedbackDto.userId },
    });
    if (!user) throw new Error('User not found');

    return await this.prisma.feedback.create({ data: createFeedbackDto });
  }

  async findAll() {
    return await this.prisma.feedback.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.feedback.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return await this.prisma.feedback.delete({
      where: { id },
    });
  }
}
