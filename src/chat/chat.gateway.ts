import { UseGuards, Logger, UnauthorizedException } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  // WsResponse,
} from '@nestjs/websockets';
import { WsAuthGuard } from 'src/auth/jwt-ws-auth.guard';
import { MessageEntity } from 'src/messages/entities/message.entity';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { MessagesService } from 'src/messages/messages.service';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: 'Authorization, Content-Type',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messagesService: MessagesService,
    private jwtService: JwtService,
  ) {}

  private logger: Logger = new Logger(ChatGateway.name);
  @WebSocketServer() server: Server;

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  public handleDisconnect(client: Socket): void {
    return this.logger.log(`Client dis: ${client.id}`);
  }

  public handleConnection(client: Socket): void {
    return this.logger.log(`Client con: ${client.id}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const request = client.handshake;
    const token =
      this.extractTokenFromHeader(request) ||
      this.extractTokenFromAuth(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    const user: { userId: number } = this.jwtService.decode(token);

    createMessageDto.userId = user.userId;

    const createdMessage = new MessageEntity(
      await this.messagesService.create(createMessageDto),
    );

    this.server.emit('createMessage', createdMessage);
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromAuth(request: any): string | undefined {
    const [type, token] = request.auth.token?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
