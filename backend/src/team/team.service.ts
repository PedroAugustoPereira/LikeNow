import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createTeamDto: CreateTeamDto) {
    const { name, leaderId, enterpriseId } = createTeamDto;

    if (!leaderId) throw new Error('Leader ID is required');
    const leader = await this.prisma.user.findUnique({
      where: { id: leaderId },
    });
    if (!leader) throw new Error('Leader not found');

    return await this.prisma.team.create({
      data: {
        name,
        liderId: leaderId,        
        enterpriseId,     
      },
    });
  }

  async findAll() {
    return await this.prisma.team.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.team.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    return await this.prisma.team.update({
      where: { id },
      data: updateTeamDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.team.delete({
      where: { id },
    });
  }
}
