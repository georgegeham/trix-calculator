import type { Doubles, GameId, PendingRound, QueenId, RoundInput, UnluckyEvent } from '../types';

export interface GameInfo {
  name: string;
  glyph: string;
  red?: boolean;
  small?: boolean;
  rule: string;
}

export const GAMES: Record<GameId, GameInfo> = {
  trix: { name: 'Trix', glyph: 'J', rule: 'Finishing order: +200, +150, +100, +50. Always alone.' },
  diamonds: { name: 'Diamonds', glyph: '♦', red: true, rule: '−10 for every diamond taken.' },
  king: { name: 'King of hearts', glyph: 'K♥', red: true, small: true, rule: '−75 to whoever takes it. Can be doubled.' },
  queens: { name: 'Queens', glyph: 'Q', rule: '−25 per queen taken. Can be doubled.' },
  lutoosh: { name: 'Lutoosh', glyph: '✕', rule: '−10 for every trick taken.' },
};

export const ORDER: GameId[] = ['trix', 'diamonds', 'king', 'queens', 'lutoosh'];

export const QUEENS: { id: QueenId; suit: string; red?: boolean }[] = [
  { id: 'S', suit: '♠' },
  { id: 'H', suit: '♥', red: true },
  { id: 'D', suit: '♦', red: true },
  { id: 'C', suit: '♣' },
];

export const PTS = {
  trix: [200, 150, 100, 50],
  trixJack: 400,
  diamond: -10,
  trick: -10,
  king: -75,
  kingDoubled: -150,
  kingBonus: 75,
  queen: -25,
  queenDoubled: -50,
  queenBonus: 25,
} as const;

export const PLACES = ['1st', '2nd', '3rd', '4th'];
export const CARDS_PER_SUIT = 13;
export const TRICKS_PER_ROUND = 13;

export const noDoubles = (): Doubles => ({ king: null, queens: { S: null, H: null, D: null, C: null } });

export const emptyInput = (): RoundInput => ({
  ranks: [0, 0, 0, 0],
  jack: false,
  diamonds: [0, 0, 0, 0],
  tricks: [0, 0, 0, 0],
  king: null,
  queens: { S: null, H: null, D: null, C: null },
});

export const needsDoubles = (games: GameId[]) => games.includes('king') || games.includes('queens');

/** Trix is always played alone; any other games can be combined. */
export function toggleGame(selected: GameId[], id: GameId): GameId[] {
  if (id === 'trix') return selected.includes('trix') ? [] : ['trix'];
  const rest: GameId[] = selected.filter((g) => g !== 'trix');
  const next = rest.includes(id) ? rest.filter((g) => g !== id) : [...rest, id];
  return ORDER.filter((g) => next.includes(g));
}

/** Points for one round. A doubler who takes their own card pays the doubled penalty and gets no bonus. */
export function scoreRound(games: GameId[], doubles: Doubles, d: RoundInput): number[] {
  const s = [0, 0, 0, 0];
  const has = (g: GameId) => games.includes(g);

  if (has('trix')) {
    d.ranks.forEach((rank, p) => {
      if (rank) s[p] += rank === 1 && d.jack ? PTS.trixJack : PTS.trix[rank - 1];
    });
  }
  if (has('diamonds')) d.diamonds.forEach((n, p) => (s[p] += n * PTS.diamond));
  if (has('lutoosh')) d.tricks.forEach((n, p) => (s[p] += n * PTS.trick));

  if (has('king') && d.king != null) {
    const taker = d.king;
    const by = doubles.king;
    if (by == null) s[taker] += PTS.king;
    else {
      s[taker] += PTS.kingDoubled;
      if (by !== taker) s[by] += PTS.kingBonus;
    }
  }

  if (has('queens')) {
    for (const q of QUEENS) {
      const taker = d.queens[q.id];
      if (taker == null) continue;
      const by = doubles.queens[q.id];
      if (by == null) s[taker] += PTS.queen;
      else {
        s[taker] += PTS.queenDoubled;
        if (by !== taker) s[by] += PTS.queenBonus;
      }
    }
  }
  return s.map((v) => v + 0);
}

/** Players who doubled a card and then took it themselves. */
export function unluckyEvents(round: PendingRound, d: RoundInput): UnluckyEvent[] {
  const events: UnluckyEvent[] = [];
  const { games, doubles } = round;
  if (games.includes('king') && doubles.king != null && d.king === doubles.king) {
    events.push({ player: d.king, card: 'king' });
  }
  if (games.includes('queens')) {
    for (const q of QUEENS) {
      const by = doubles.queens[q.id];
      if (by != null && d.queens[q.id] === by) events.push({ player: by, card: q.id });
    }
  }
  return events;
}

const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

export function inputProblems(games: GameId[], d: RoundInput): string[] {
  const out: string[] = [];
  const has = (g: GameId) => games.includes(g);
  if (has('trix') && (d.ranks.some((r) => !r) || new Set(d.ranks).size !== 4)) {
    out.push('Give every player a finishing place in Trix.');
  }
  if (has('diamonds') && sum(d.diamonds) !== CARDS_PER_SUIT) {
    out.push(`Diamonds add up to ${sum(d.diamonds)}. They should total ${CARDS_PER_SUIT}.`);
  }
  if (has('lutoosh') && sum(d.tricks) !== TRICKS_PER_ROUND) {
    out.push(`Tricks add up to ${sum(d.tricks)}. They should total ${TRICKS_PER_ROUND}.`);
  }
  if (has('king') && d.king == null) out.push('Choose who took the king of hearts.');
  if (has('queens') && QUEENS.some((q) => d.queens[q.id] == null)) out.push('Choose who took each queen.');
  return out;
}

export const fmt = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0');
export const sign = (n: number) => (n < 0 ? 'neg' : n > 0 ? 'pos' : '');
