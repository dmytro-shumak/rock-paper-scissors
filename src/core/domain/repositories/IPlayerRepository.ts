import type { Player } from '../entities/Player';

export interface IPlayerRepository {
  createPlayer(player: Player): Promise<void>;
  getPlayer(id: string): Promise<Player | null>;
  updatePlayer(player: Player): Promise<void>;
  deletePlayer(id: string): Promise<void>;
  findPlayerByUsername(username: string): Promise<Player | null>;
}
