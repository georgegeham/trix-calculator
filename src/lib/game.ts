import type { GameId, GameState, Kingdom, Player, Round } from '../types';
import { DEFAULT_FACES } from './faces';

export const KINGDOMS = 4;
export const GAMES_PER_KINGDOM = 5;

export const usedIn = (rounds: Round[], kingdom: number): GameId[] =>
  rounds.filter((r) => r.kingdom === kingdom).flatMap((r) => r.games);

/** The kingdom in play: it moves on once all five games are played, and the crown passes to the next seat. */
export function currentKingdom(s: Pick<GameState, 'players' | 'first' | 'rounds'>): Kingdom | null {
  if (s.players.length !== 4) return null;
  let index = 0;
  while (index < KINGDOMS && usedIn(s.rounds, index).length >= GAMES_PER_KINGDOM) index++;
  return {
    index,
    captain: (s.first + index) % 4,
    used: index < KINGDOMS ? usedIn(s.rounds, index) : [],
  };
}

export function totals(rounds: Round[]): number[] {
  const t = [0, 0, 0, 0];
  for (const r of rounds) r.scores.forEach((v, i) => (t[i] += v));
  return t;
}

export const playerName = (players: Player[], i: number) => players[i]?.name ?? `Player ${i + 1}`;
export const playerFace = (players: Player[], i: number) => players[i]?.face ?? DEFAULT_FACES[i];
