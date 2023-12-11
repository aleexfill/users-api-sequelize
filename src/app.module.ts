import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import * as dotenv from 'dotenv';
import { DatabaseModule } from './modules/database/database.module';
import { SocketModule } from './modules/socket/socket.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

dotenv.config();

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    SocketModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 60000,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
