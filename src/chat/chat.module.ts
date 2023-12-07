import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessagesService } from 'src/messages/messages.service';
import { ChatGateway } from './chat.gateway';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ChatGateway, ChatService, MessagesService, JwtService],
  imports: [PrismaModule],
})
export class ChatModule {}
