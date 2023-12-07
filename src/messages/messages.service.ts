import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  create(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: createMessageDto,
      include: {
        user: true,
      },
    });
  }

  findAll() {
    return this.prisma.message.findMany({
      orderBy: [{ createdAt: 'desc' }],
      include: {
        user: true,
      },
    });
  }
}
