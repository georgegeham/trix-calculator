export type GameId = 'trix' | 'diamonds' | 'king' | 'queens' | 'lutoosh';
export type QueenId = 'S' | 'H' | 'D' | 'C';
export type CardKey = 'king' | QueenId;

export interface Player {
  name: string;
  face: number;
}

/** Player index of whoever doubled each card, or null. */
export interface Doubles {
  king: number | null;
  queens: Record<QueenId, number | null>;
}

/** What happened in a round. Ranks use 0 for "not set yet". */
export interface RoundInput {
  ranks: number[];
  jack: boolean;
  diamonds: number[];
  tricks: number[];
  king: number | null;
  queens: Record<QueenId, number | null>;
}

export interface UnluckyEvent {
  player: number;
  card: CardKey;
}

export interface Round {
  kingdom: number;
  captain: number;
  games: GameId[];
  doubles: Doubles;
  input: RoundInput;
  scores: number[];
  unlucky: UnluckyEvent[];
}

export interface PendingRound {
  games: GameId[];
  doubles: Doubles;
}

export interface GameState {
  players: Player[];
  first: number;
  rounds: Round[];
  pending: PendingRound | null;
}

export interface Kingdom {
  /** 0–3 while playing, 4 once the game is over. */
  index: number;
  captain: number;
  used: GameId[];
}
