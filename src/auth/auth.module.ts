import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { WsAuthGuard } from './jwt-ws-auth.guard';
import { jwtConfig } from '../config/jwt.config';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync(jwtConfig),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, WsAuthGuard],
})
export class AuthModule {}
