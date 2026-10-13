import { describe, expect, it } from 'vitest';
import { emptyInput, inputProblems, noDoubles, scoreRound, toggleGame, unluckyEvents } from './rules';
import { currentKingdom } from './game';
import type { GameId, Round } from '../types';

describe('scoreRound', () => {
  it('scores Trix by finishing order', () => {
    const d = { ...emptyInput(), ranks: [2, 1, 4, 3] };
    expect(scoreRound(['trix'], noDoubles(), d)).toEqual([150, 200, 50, 100]);
  });

  it('gives +400 to 1st place on a jack finish', () => {
    const d = { ...emptyInput(), ranks: [1, 2, 3, 4], jack: true };
    expect(scoreRound(['trix'], noDoubles(), d)).toEqual([400, 150, 100, 50]);
  });

  it('charges −10 per diamond and per trick', () => {
    const d = { ...emptyInput(), diamonds: [5, 0, 8, 0], tricks: [1, 2, 3, 7] };
    expect(scoreRound(['diamonds'], noDoubles(), d)).toEqual([-50, 0, -80, 0]);
    expect(scoreRound(['lutoosh'], noDoubles(), d)).toEqual([-10, -20, -30, -70]);
  });

  it('handles the king of hearts undoubled, doubled, and doubled by the taker', () => {
    const d = { ...emptyInput(), king: 2 };
    expect(scoreRound(['king'], noDoubles(), d)).toEqual([0, 0, -75, 0]);
    expect(scoreRound(['king'], { ...noDoubles(), king: 0 }, d)).toEqual([75, 0, -150, 0]);
    expect(scoreRound(['king'], { ...noDoubles(), king: 2 }, d)).toEqual([0, 0, -150, 0]);
  });

  it('scores each queen with its own double', () => {
    const d = { ...emptyInput(), queens: { S: 0, H: 1, D: 1, C: 3 } };
    const doubles = { king: null, queens: { S: 2, H: 1, D: null, C: null } };
    // Q♠ doubled by 2, taken by 0: 0 −50, 2 +25. Q♥ doubled and taken by 1: −50, no bonus. Q♦ −25. Q♣ −25.
    expect(scoreRound(['queens'], doubles, d)).toEqual([-50, -75, 25, -25]);
  });

  it('adds up mixed rounds', () => {
    const d = { ...emptyInput(), diamonds: [13, 0, 0, 0], tricks: [0, 13, 0, 0], king: 3 };
    expect(scoreRound(['diamonds', 'king', 'lutoosh'], noDoubles(), d)).toEqual([-130, -130, 0, -75]);
  });
});

describe('unluckyEvents', () => {
  it('flags only doublers who took their own card', () => {
    const pending = { games: ['king', 'queens'] as GameId[], doubles: { king: 1, queens: { S: 2, H: null, D: 0, C: null } } };
    const d = { ...emptyInput(), king: 1, queens: { S: 3, H: 0, D: 0, C: 1 } };
    expect(unluckyEvents(pending, d)).toEqual([
      { player: 1, card: 'king' },
      { player: 0, card: 'D' },
    ]);
  });
});

describe('toggleGame', () => {
  it('keeps Trix on its own', () => {
    expect(toggleGame(['diamonds', 'queens'], 'trix')).toEqual(['trix']);
    expect(toggleGame(['trix'], 'lutoosh')).toEqual(['lutoosh']);
    expect(toggleGame(['lutoosh'], 'diamonds')).toEqual(['diamonds', 'lutoosh']);
  });
});

describe('inputProblems', () => {
  it('requires complete entries', () => {
    expect(inputProblems(['trix', 'diamonds', 'king', 'queens', 'lutoosh'], emptyInput())).toHaveLength(5);
    const ok = { ...emptyInput(), diamonds: [3, 3, 3, 4] };
    expect(inputProblems(['diamonds'], ok)).toEqual([]);
  });
});

describe('currentKingdom', () => {
  const round = (kingdom: number, games: GameId[]): Round => ({
    kingdom, captain: 0, games, doubles: noDoubles(), input: emptyInput(), scores: [0, 0, 0, 0], unlucky: [],
  });
  const players = [0, 1, 2, 3].map((i) => ({ name: `P${i}`, face: i }));

  it('passes the crown after five games and ends after four kingdoms', () => {
    expect(currentKingdom({ players, first: 2, rounds: [] })).toEqual({ index: 0, captain: 2, used: [] });
    const k1 = [round(0, ['trix']), round(0, ['diamonds', 'king', 'queens', 'lutoosh'])];
    expect(currentKingdom({ players, first: 2, rounds: k1 })?.captain).toBe(3);
    const all = [0, 1, 2, 3].map((k) => round(k, ['trix', 'diamonds', 'king', 'queens', 'lutoosh']));
    expect(currentKingdom({ players, first: 2, rounds: all })?.index).toBe(4);
  });
});
