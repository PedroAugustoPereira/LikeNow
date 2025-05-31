import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto) {
    const { name, leaderId, enterpriseId, leaderSlackId } = createTeamDto;

    const searchTeam = await this.prisma.team.findFirst({
      where: { name, enterpriseId },
    });
    if (searchTeam) return 'Team already exists';

    if (!leaderId) return null;
    const leader = await this.prisma.user.findUnique({
      where: { id: leaderId },
    });
    if (!leader) return 'Leader not found';

    const enterprise = await this.prisma.enterprise.findUnique({
      where: { id: enterpriseId },
    });
    if (!enterprise) return 'Enterprise not found';

    return await this.prisma.team.create({
      data: {
        name,
        leaderId,
        enterpriseId,
        leaderSlackId,
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

  async findLeader(id: string) {
    const team = await this.findOne(id);
    if (!team) return 'Team not found';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userInfo } = await this.prisma.user.findUnique({
      where: { id: team.leaderId },
    });
    return userInfo;
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
