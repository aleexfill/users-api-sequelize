import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [ProfileModule],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
