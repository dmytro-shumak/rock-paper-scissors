import type { Game } from '../entities/Game';

export interface IGameRepository {
  createGame(game: Game): Promise<void>;
  getGame(id: string): Promise<Game | null>;
  updateGame(game: Game): Promise<void>;
  deleteGame(id: string): Promise<void>;
  findAvailableGame(): Promise<Game | null>;
} 