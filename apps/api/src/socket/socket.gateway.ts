import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { SocketService } from './socket.service'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server

  private readonly logger = new Logger(SocketGateway.name)

  constructor(private readonly service: SocketService) { }

  public afterInit(server: Server) {
    console.log('SocketGateway afterInit')
    this.service.socket = server
  }

  public handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  public handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  @SubscribeMessage('events')
  handleEvent(@ConnectedSocket() client: Socket, @MessageBody() data: string): string {
    console.log('events', data, client)
    client.emit('events', data)
  }
}
