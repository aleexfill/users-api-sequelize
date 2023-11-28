import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway()
export class EventGateway {
  @WebSocketServer()
  server: Socket;

  constructor(private readonly socketService: SocketService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    this.socketService.emitEvent('logout', { socketId: client.id });
  }

  @SubscribeMessage('user-online')
  handleUserOnline(client: Socket, payload: any) {
    this.socketService.emitEvent('user-online', payload);
  }
}
