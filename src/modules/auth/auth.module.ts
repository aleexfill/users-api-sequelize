import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { JwtAuthGuard, RolesGuard } from 'src/shared/guards';
import * as dotenv from 'dotenv';
import { SocketModule } from '../socket/socket.module';

dotenv.config();

const providers = [AuthService, JwtAuthGuard, JwtStrategy, RolesGuard];

@Module({
  imports: [
    UserModule,
    PassportModule,
    SocketModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [...providers],
})
export class AuthModule {}
