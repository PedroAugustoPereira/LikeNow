import { Module } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [EnterpriseController],
  providers: [EnterpriseService],
  imports: [PrismaModule],
  exports: [EnterpriseService],
})
export class EnterpriseModule {}
