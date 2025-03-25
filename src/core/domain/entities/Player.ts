export type PlayerStatus = 'in-game' | 'made-choice' | 'out-of-game';

export type Choice = 'rock' | 'paper' | 'scissors';

export class Player {
  constructor(
    public readonly id: string,
    public username: string,
    public status: PlayerStatus = 'out-of-game',
    public choice?: Choice,
    public score = 0
  ) {}

  public makeChoice(choice: Choice): void {
    this.choice = choice;
    this.status = 'made-choice';
  }

  public reset(): void {
    this.choice = undefined;
    this.status = 'in-game';
  }

  public incrementScore(): void {
    this.score += 1;
  }
} 