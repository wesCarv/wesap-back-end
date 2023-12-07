import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export const roundOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundOfHashing,
    );

    createUserDto.password = hashedPassword;

    return this.prisma.user.create({ data: createUserDto });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
