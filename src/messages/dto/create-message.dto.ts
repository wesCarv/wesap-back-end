import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  about: string;

  @ApiProperty()
  userId: number;
}
