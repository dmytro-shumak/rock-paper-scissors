import type { Player, Choice } from './Player';

export type GameStatus = 'waiting' | 'in-progress' | 'finished';

export class Game {
  private status: GameStatus = 'waiting';
  private winner: Player | null = null;

  constructor(
    public readonly id: string,
    public player1: Player,
    public player2?: Player
  ) {}

  public addPlayer(player: Player): void {
    if (this.player2) {
      throw new Error('Game is already full');
    }
    this.player2 = player;
    this.status = 'in-progress';
  }

  public makeChoice(player: Player, choice: Choice): void {
    if (this.status !== 'in-progress') {
      throw new Error('Game is not in progress');
    }

    player.makeChoice(choice);

    if (this.player1.status === 'made-choice' && this.player2?.status === 'made-choice') {
      this.determineWinner();
    }
  }

  private determineWinner(): void {
    if (!this.player1.choice || !this.player2?.choice) {
      throw new Error('Both players must make a choice');
    }

    const choices = [this.player1.choice, this.player2.choice];
    const [choice1, choice2] = choices;

    if (choice1 === choice2) {
      this.status = 'finished';
      return;
    }

    const winningCombinations: Record<Choice, Choice> = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper',
    };

    this.winner = winningCombinations[choice1] === choice2 ? this.player1 : this.player2;
    this.winner.incrementScore();
    this.status = 'finished';
  }

  public getStatus(): GameStatus {
    return this.status;
  }

  public getWinner(): Player | null {
    return this.winner;
  }

  public reset(): void {
    this.status = 'in-progress';
    this.winner = null;
    this.player1.reset();
    this.player2?.reset();
  }
} 