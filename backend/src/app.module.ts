import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
<<<<<<< Updated upstream
import { EnterpriseModule } from './enterprise/enterprise.module';

@Module({
  imports: [UserModule, PrismaModule, EnterpriseModule],
=======
import { TeamModule } from './team/team.module';

@Module({
  imports: [UserModule, PrismaModule, TeamModule],
>>>>>>> Stashed changes
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
