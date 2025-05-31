import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import OpenAI from "openai";
import { sendDM } from 'src/third_party/slack';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createFeedbackDto: CreateFeedbackDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createFeedbackDto.userId },
    });
    if (!user) throw new Error('User not found');

    return await this.prisma.feedback.create({ data: createFeedbackDto });
  }

  async sendFeedback(createFeedbackDto: CreateFeedbackDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createFeedbackDto.userId },
    });
    if (!user) throw new Error('User not found');

    const team = await this.prisma.team.findFirst({
      where: {
        users: {
          some: { id: createFeedbackDto.userId },
        },
      },
    });
    if (!team) throw new Error('Team not found for user');

    const leader = await this.prisma.user.findUnique({
      where: { id: team.leaderId },
    });
    if (!leader) throw new Error('Leader not found');

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = process.env.PROMPT;
    const responseOpenai = await openai.chat.completions.create({
      model: 'gpt-4', // ou 'gpt-3.5-turbo'
      messages: [
        { role: 'user', content: prompt + `Transcrição fornecida: ${createFeedbackDto.message}` }
      ],
      temperature: 0.7,
    });
  
    const feedback = await this.prisma.feedback.create({
      data: {
        userId: createFeedbackDto.userId,
        message: responseOpenai.choices[0].message.content,
      },
    });

    sendDM("U08UMRX2SG6", feedback.message);

    return feedback
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
