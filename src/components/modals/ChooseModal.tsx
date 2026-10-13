import { useState } from 'react';
import { ModalShell } from './ModalShell';
import { GameCard } from '../Cards';
import { game } from '../../store/useGame';
import { useTable } from '../../store/useTable';
import { KINGDOMS } from '../../lib/game';
import { GAMES, needsDoubles, noDoubles, ORDER, toggleGame } from '../../lib/rules';
import type { GameId } from '../../types';

export function ChooseModal({ preset }: { preset: GameId[] }) {
  const { kingdom, name, rounds } = useTable();
  const used = kingdom?.used ?? [];
  const [selected, setSelected] = useState<GameId[]>(() => preset.filter((g) => !used.includes(g)));
  const [error, setError] = useState('');
  if (!kingdom) return null;

  const next = () => {
    if (!selected.length) return setError('Pick at least one game for this round.');
    if (needsDoubles(selected)) game().openModal({ type: 'doubles', games: selected, doubles: noDoubles() });
    else game().startRound(selected, noDoubles());
  };

  return (
    <ModalShell dismissible>
      <header className="m-head">
        <p className="m-eyebrow">Kingdom {kingdom.index + 1} of {KINGDOMS} · Round {rounds.length + 1}</p>
        <h2 id="m-title">{name(kingdom.captain)}’s kingdom</h2>
        <p className="m-sub">Pick one game, or combine any of the four penalty games in the same round. Trix is always played alone.</p>
      </header>
      <div className="m-body">
        <div className="games">
          {ORDER.map((id) => {
            const played = used.includes(id);
            const on = selected.includes(id);
            return (
              <button
                key={id}
                type="button"
                className="game"
                aria-pressed={on}
                disabled={played}
                onClick={() => {
                  setSelected((s) => toggleGame(s, id));
                  setError('');
                }}
              >
                <GameCard id={id} />
                <span>
                  <span className="game-name">{GAMES[id].name}</span>
                  <span className="game-rule">{GAMES[id].rule}</span>
                </span>
                {played ? <span className="tag">Played</span> : <span className="tick" aria-hidden="true">{on ? '✓' : ''}</span>}
              </button>
            );
          })}
        </div>
        {error && <p className="err" role="alert">{error}</p>}
      </div>
      <footer className="m-foot">
        <button type="button" className="btn" onClick={() => game().closeModal()}>Cancel</button>
        <button type="button" className="btn btn-primary btn-grow" onClick={next}>
          {needsDoubles(selected) ? 'Next: doubles' : 'Start round'}
        </button>
      </footer>
    </ModalShell>
  );
}
