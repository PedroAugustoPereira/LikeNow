import { Injectable } from '@nestjs/common';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnterpriseService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEnterpriseDto: CreateEnterpriseDto) {
    return await this.prismaService.enterprise.create({data: createEnterpriseDto,})
  }

  async findAll() {
    return await this.prismaService.enterprise.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.enterprise.findUnique({id: id});
  }

  async update(id: string, updateEnterpriseDto: UpdateEnterpriseDto) {
    return await this.prismaService.enterprise.update({
      where: { id: id },
      data: updateEnterpriseDto,
    });
  }
  async remove(id: number) {
    return await this.prismaService.enterprise.delete({ where: { id: id } });
  }
}
