import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import * as dotenv from 'dotenv';
import { DatabaseModule } from './modules/database/database.module';

dotenv.config();

@Module({
  imports: [DatabaseModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
