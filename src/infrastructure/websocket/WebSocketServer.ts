import type { Server } from 'node:http';
import { Game } from '@/core/domain/entities/Game';
import { Player } from '@/core/domain/entities/Player';
import type { Choice } from '@/core/domain/entities/Player';
import type { IGameRepository } from '@/core/domain/repositories/IGameRepository';
import type { IPlayerRepository } from '@/core/domain/repositories/IPlayerRepository';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketServer as WSServer, WebSocket } from 'ws';

type WebSocketMessage =
  | { type: 'join'; username: string }
  | { type: 'choice'; choice: Choice }
  | { type: 'reset' };

type Client = WebSocket & {
  id: string;
  player?: Player;
  game?: Game;
};

export class WebSocketServer {
  private wss: WSServer;
  private clients: Map<string, Client> = new Map();

  constructor(
    server: Server,
    private gameRepository: IGameRepository,
    private playerRepository: IPlayerRepository
  ) {
    this.wss = new WSServer({ server });
    this.setupWebSocket();
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws: Client) => {
      ws.id = uuidv4();
      this.clients.set(ws.id, ws);

      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message);
          await this.handleMessage(ws, data);
        } catch (error) {
          this.sendError(ws, 'Invalid message format');
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
      });
    });
  }

  private async handleMessage(
    ws: Client,
    data: WebSocketMessage
  ): Promise<void> {
    switch (data.type) {
      case 'join':
        await this.handleJoin(ws, data.username);
        break;
      case 'choice':
        await this.handleChoice(ws, data.choice);
        break;
      case 'reset':
        await this.handleReset(ws);
        break;
      default:
        this.sendError(ws, 'Unknown message type');
    }
  }

  private async handleJoin(ws: Client, username: string): Promise<void> {
    try {
      const existingPlayer =
        await this.playerRepository.findPlayerByUsername(username);
      if (existingPlayer) {
        this.sendError(ws, 'Username already taken');
        return;
      }

      const player = new Player(uuidv4(), username);
      await this.playerRepository.createPlayer(player);
      ws.player = player;

      const availableGame = await this.gameRepository.findAvailableGame();
      if (availableGame) {
        availableGame.addPlayer(player);
        ws.game = availableGame;
        await this.gameRepository.updateGame(availableGame);
        this.broadcastGameState(availableGame);
      } else {
        const newGame = new Game(uuidv4(), player);
        await this.gameRepository.createGame(newGame);
        ws.game = newGame;
      }

      this.sendToClient(ws, {
        type: 'joined',
        player: player,
        game: ws.game,
      });
    } catch (error) {
      this.sendError(ws, 'Failed to join game');
    }
  }

  private async handleChoice(ws: Client, choice: Choice): Promise<void> {
    if (!ws.player || !ws.game) {
      this.sendError(ws, 'Not in a game');
      return;
    }

    try {
      ws.game.makeChoice(ws.player, choice);
      await this.gameRepository.updateGame(ws.game);
      this.broadcastGameState(ws.game);
    } catch (error) {
      this.sendError(ws, 'Invalid choice');
    }
  }

  private async handleReset(ws: Client): Promise<void> {
    if (!ws.game) {
      this.sendError(ws, 'Not in a game');
      return;
    }

    try {
      ws.game.reset();
      await this.gameRepository.updateGame(ws.game);
      this.broadcastGameState(ws.game);
    } catch (error) {
      this.sendError(ws, 'Failed to reset game');
    }
  }

  private handleDisconnect(ws: Client): void {
    if (ws.game) {
      this.broadcastGameState(ws.game);
    }
    this.clients.delete(ws.id);
  }

  private broadcastGameState(game: Game): void {
    const message = {
      type: 'gameState',
      game: game,
    };

    this.clients.forEach((client) => {
      if (client.game?.id === game.id) {
        this.sendToClient(client, message);
      }
    });
  }

  private sendToClient(ws: Client, message: unknown): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private sendError(ws: Client, message: string): void {
    this.sendToClient(ws, {
      type: 'error',
      message,
    });
  }
}
