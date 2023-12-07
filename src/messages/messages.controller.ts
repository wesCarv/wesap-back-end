import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MessageEntity } from './entities/message.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('messages')
@ApiTags('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: MessageEntity })
  async create(@Body() createMessageDto: CreateMessageDto) {
    return new MessageEntity(
      await this.messagesService.create(createMessageDto),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: MessageEntity, isArray: true })
  async findAll() {
    const messages = await this.messagesService.findAll();
    return messages.map((message) => new MessageEntity(message));
  }
}
