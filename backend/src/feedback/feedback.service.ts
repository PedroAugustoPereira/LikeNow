import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import OpenAI from 'openai';
import { sendDM } from 'src/third_party/slack';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async sendFeedback(createFeedbackDto: CreateFeedbackDto) {
    if (createFeedbackDto.senderUserId !== null) {
      const user = await this.prisma.user.findUnique({
        where: { id: createFeedbackDto.senderUserId },
      });

      if (!user) {
        return 'Sender user not found';
      }
    }

    const team = await this.prisma.team.findFirst({
      where: {
        users: {
          some: { id: createFeedbackDto.receiverUserId },
        },
      },
    });
    if (!team) return 'Team not found for user';

    const receiverUser = await this.prisma.user.findUnique({
      where: { id: createFeedbackDto.receiverUserId },
    });
    if (!receiverUser) return 'Receiver user not found';

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = process.env.PROMPT;
    const responseOpenai = await openai.chat.completions.create({
      model: 'gpt-4', 
      messages: [
        {
          role: 'user',
          content:
            prompt + `Transcrição fornecida: ${createFeedbackDto.message}`,
        },
      ],
      temperature: 0.7,
    });

    const feedback = await this.prisma.feedback.create({
      data: {
        receiverUserId: createFeedbackDto.receiverUserId,
        senderUserId: createFeedbackDto.senderUserId || 'anonymous',
        message: responseOpenai.choices[0].message.content,
      },
    });

    sendDM('U08UMRX2SG6', feedback.message);

    return feedback;
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
