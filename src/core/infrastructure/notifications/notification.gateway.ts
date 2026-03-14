import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { type JwtSocketPayload } from '../../domain/contracts/jwt-socket-payload.contract';
import { type NotificationPayload } from '../../domain/contracts/notification-payload.contract';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private readonly userSocketMap = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(): void {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket): Promise<void> {
    const handshake = client.handshake;
    const headers = handshake.headers;
    const auth = handshake.auth as Record<string, string>;

    const token = auth?.token || headers?.authorization?.split(' ')[1];
    if (!token) {
      this.logger.warn(`Client ${client.id} attempted connection without token`);
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify<JwtSocketPayload>(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });

      client.data = { userId: payload.sub, email: payload.email };
      this.addUserSocket(payload.sub, client.id);
      await client.join(`user:${payload.sub}`);

      this.logger.log(`Client ${client.id} connected as user ${payload.sub}`);
    } catch {
      this.logger.warn(`Client ${client.id} provided invalid token`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = (client.data as Record<string, string>)?.userId;
    if (userId) {
      this.removeUserSocket(userId, client.id);
      this.logger.log(`Client ${client.id} (user ${userId}) disconnected`);
    }
  }

  @SubscribeMessage('ping')
  handlePing(): string {
    return 'pong';
  }

  broadcast(event: string, payload: NotificationPayload): void {
    this.server.emit(event, payload);
  }

  emitToUser(userId: string, event: string, payload: NotificationPayload): void {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  private addUserSocket(userId: string, socketId: string): void {
    const sockets = this.userSocketMap.get(userId) ?? new Set<string>();
    sockets.add(socketId);
    this.userSocketMap.set(userId, sockets);
  }

  private removeUserSocket(userId: string, socketId: string): void {
    const sockets = this.userSocketMap.get(userId);
    if (!sockets) {
      return;
    }

    sockets.delete(socketId);
    if (sockets.size === 0) {
      this.userSocketMap.delete(userId);
    }
  }
}
