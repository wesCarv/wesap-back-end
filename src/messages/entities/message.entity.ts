import { Message } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class MessageEntity implements Message {
  @ApiProperty()
  id: number;

  @ApiProperty()
  about: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  userId: number | null;

  @ApiProperty({ required: false, type: UserEntity })
  user: UserEntity | null;

  constructor({ user, ...data }: Partial<MessageEntity>) {
    Object.assign(this, data);

    if (user) {
      this.user = new UserEntity(user);
    }
  }
}
