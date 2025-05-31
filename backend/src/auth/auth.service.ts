//src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    console.log('Attempting login for email:', email);

    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      console.log('User not found for email:', email);
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    console.log('User found, comparing passwords');
    console.log(password);
    console.log(user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      throw new UnauthorizedException('Invalid password');
    }

    console.log('Login successful for user:', email);
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
      user_id: user.id,
    };
  }
}
