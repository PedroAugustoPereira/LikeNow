import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService],
  imports: [PrismaModule],
  exports: [FeedbackService],
})
export class FeedbackModule {}
