import { forwardRef } from 'react';
import { CardBack, GameCard } from './Cards';
import { game, useGame } from '../store/useGame';
import { useTable } from '../store/useTable';
import { KINGDOMS, GAMES_PER_KINGDOM } from '../lib/game';
import { GAMES, ORDER, QUEENS } from '../lib/rules';
import type { Doubles } from '../types';

function doublesNote(d: Doubles, name: (i: number) => string) {
  const parts: string[] = [];
  if (d.king != null) parts.push(`K♥ doubled by ${name(d.king)}`);
  for (const q of QUEENS) {
    const by = d.queens[q.id];
    if (by != null) parts.push(`Q${q.suit} doubled by ${name(by)}`);
  }
  return parts.length ? `. ${parts.join(', ')}` : '';
}

export const Center = forwardRef<HTMLDivElement>(function Center(_, ref) {
  const { kingdom, name } = useTable();
  const pending = useGame((s) => s.pending);

  if (!kingdom) {
    return (
      <div ref={ref} className="center">
        <p className="c-eyebrow">Four players</p>
        <p className="c-title">Ready to deal</p>
        <button className="btn btn-primary" type="button" onClick={() => game().openModal({ type: 'setup' })}>
          Start a game
        </button>
      </div>
    );
  }

  if (kingdom.index === KINGDOMS) {
    return (
      <div ref={ref} className="center">
        <p className="c-eyebrow">All four kingdoms played</p>
        <p className="c-title">Game over</p>
        <div className="c-actions">
          <button className="btn btn-primary" type="button" onClick={() => game().openModal({ type: 'over' })}>
            See results
          </button>
          <button className="btn-link" type="button" onClick={() => game().openModal({ type: 'setup' })}>
            New game
          </button>
        </div>
      </div>
    );
  }

  const left = GAMES_PER_KINGDOM - kingdom.used.length;
  return (
    <div ref={ref} className="center">
      <p className="c-eyebrow">Kingdom {kingdom.index + 1} of {KINGDOMS}</p>
      <p className="c-title">{name(kingdom.captain)}’s kingdom</p>
      <div className="deck">
        {ORDER.map((id) =>
          kingdom.used.includes(id) ? (
            <CardBack key={id} title={`${GAMES[id].name}: played`} />
          ) : (
            <GameCard key={id} id={id} state={pending?.games.includes(id) ? 'active' : 'idle'} title={GAMES[id].name} />
          ),
        )}
      </div>
      {pending ? (
        <>
          <p className="c-note">
            Playing {pending.games.map((g) => GAMES[g].name).join(' + ')}
            {doublesNote(pending.doubles, name)}
          </p>
          <div className="c-actions">
            <button className="btn btn-primary" type="button" onClick={() => game().openModal({ type: 'score' })}>
              Enter scores
            </button>
            <button className="btn-link" type="button" onClick={() => game().changeGames()}>
              Change games
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="c-note">
            {left} game{left === 1 ? '' : 's'} left in this kingdom
          </p>
          <div className="c-actions">
            <button className="btn btn-primary" type="button" onClick={() => game().openModal({ type: 'choose', preset: [] })}>
              Choose games
            </button>
          </div>
        </>
      )}
    </div>
  );
});
