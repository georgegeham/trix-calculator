import type { CardKey, GameId, QueenId } from '../types';
import { GAMES, QUEENS } from '../lib/rules';

interface GameCardProps {
  id: GameId;
  small?: boolean;
  state?: 'idle' | 'active';
  title?: string;
}

/** A tiny playing card showing a game's glyph. */
export function GameCard({ id, small, state, title }: GameCardProps) {
  const g = GAMES[id];
  const cls = ['mc', g.red && 'red', g.small && 'two', small && 'sm', state].filter(Boolean).join(' ');
  return (
    <span className={cls} title={title} aria-hidden={title ? undefined : true}>
      {g.glyph}
    </span>
  );
}

export function QueenCard({ id }: { id: QueenId }) {
  const q = QUEENS.find((x) => x.id === id)!;
  return (
    <span className={`mc two${q.red ? ' red' : ''}`} aria-hidden="true">
      Q{q.suit}
    </span>
  );
}

export const CardBack = ({ title }: { title: string }) => <span className="mc back" title={title} />;

export const CardFace = ({ card }: { card: CardKey }) =>
  card === 'king' ? <GameCard id="king" /> : <QueenCard id={card} />;

export function Crown() {
  return (
    <svg className="crown" viewBox="0 0 32 20" aria-hidden="true">
      <path d="M2 18L4 5L11 11L16 2L21 11L28 5L30 18Z" />
      <circle cx="16" cy="2.6" r="1.6" />
      <circle cx="4" cy="5" r="1.4" />
      <circle cx="28" cy="5" r="1.4" />
    </svg>
  );
}

export function Cloud() {
  return (
    <svg className="cloud" viewBox="0 0 60 40" aria-hidden="true">
      <g fill="#8e9aa7">
        <circle cx="20" cy="19" r="9" />
        <circle cx="31" cy="14" r="11" />
        <circle cx="42" cy="20" r="8" />
        <rect x="13" y="18" width="36" height="10" rx="5" />
      </g>
      <g stroke="#79b2ea" strokeWidth={2.2} strokeLinecap="round">
        <path className="drop" d="M21 31v5" />
        <path className="drop" d="M31 33v5" style={{ animationDelay: '.35s' }} />
        <path className="drop" d="M41 31v5" style={{ animationDelay: '.7s' }} />
      </g>
    </svg>
  );
}
