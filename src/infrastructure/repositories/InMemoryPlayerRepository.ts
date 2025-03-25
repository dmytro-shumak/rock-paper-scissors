import type { Player } from '@/core/domain/entities/Player';
import type { IPlayerRepository } from '@/core/domain/repositories/IPlayerRepository';

export class InMemoryPlayerRepository implements IPlayerRepository {
  private players: Map<string, Player> = new Map();

  async createPlayer(player: Player): Promise<void> {
    this.players.set(player.id, player);
  }

  async getPlayer(id: string): Promise<Player | null> {
    return this.players.get(id) || null;
  }

  async updatePlayer(player: Player): Promise<void> {
    this.players.set(player.id, player);
  }

  async deletePlayer(id: string): Promise<void> {
    this.players.delete(id);
  }

  async findPlayerByUsername(username: string): Promise<Player | null> {
    return (
      Array.from(this.players.values()).find(
        (player) => player.username === username
      ) || null
    );
  }
}
