import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TeamController],
  providers: [TeamService],
  imports: [PrismaService],
  exports: [TeamService],
})
export class TeamModule {}
