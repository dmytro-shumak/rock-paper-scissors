import type { Game } from '@/core/domain/entities/Game';
import type { IGameRepository } from '@/core/domain/repositories/IGameRepository';

export class InMemoryGameRepository implements IGameRepository {
  private games: Map<string, Game> = new Map();

  async createGame(game: Game): Promise<void> {
    this.games.set(game.id, game);
  }

  async getGame(id: string): Promise<Game | null> {
    return this.games.get(id) || null;
  }

  async updateGame(game: Game): Promise<void> {
    this.games.set(game.id, game);
  }

  async deleteGame(id: string): Promise<void> {
    this.games.delete(id);
  }

  async findAvailableGame(): Promise<Game | null> {
    return Array.from(this.games.values()).find(
      (game) => !game.player2 && game.getStatus() === 'waiting'
    ) || null;
  }
} 