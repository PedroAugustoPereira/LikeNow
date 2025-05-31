import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { TeamModule } from './team/team.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    TeamModule,
    EnterpriseModule,
    FeedbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
