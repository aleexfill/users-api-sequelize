import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private io: Server;

  initialize(server) {
    this.io = new Server(server);
  }

  emitEvent(event: string, data: any) {
    this.io.emit(event, data);
  }
}
