import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable,   UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...newUser } = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: '1234',
        },
      });
      return newUser;
    } catch (error) {
      console.log('Error creating user:', error);
      return null;
    }
  }
  
  async findAll() {
    const users = await this.prisma.user.findMany();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ password, ...user }) => user);
  }

  async findOne(id: string) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    include: {
      teams: {
        select: {
          id: true,
        },
        take: 1, // opcional, garante que só venha 1
      },
    },
  });

  if (!user) throw new Error('User not found');

  const { password, teams, ...userWithoutPassword } = user;

  return {
    ...userWithoutPassword,
    team_id: teams[0]?.id ?? null, // null caso não tenha team
  };
}

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updatePassword(id: string, passwordIn: string) {
    if (passwordIn !== '1234') {
      const user = await this.prisma.user.update({
        where: { id },
        data: { password: bcrypt.hashSync(passwordIn, 10) },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
