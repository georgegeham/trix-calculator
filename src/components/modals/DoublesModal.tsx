import { useState } from 'react';
import { ModalShell } from './ModalShell';
import { NoneChip, PlayerChip } from './PlayerChip';
import { GameCard, QueenCard } from '../Cards';
import { game } from '../../store/useGame';
import { QUEENS } from '../../lib/rules';
import type { Doubles, GameId } from '../../types';

function DoublerRow({ value, onChange }: { value: number | null; onChange: (v: number | null) => void }) {
  return (
    <div className="pick pick5">
      <NoneChip pressed={value == null} onClick={() => onChange(null)} />
      {[0, 1, 2, 3].map((i) => (
        <PlayerChip key={i} index={i} pressed={value === i} onClick={() => onChange(i)} />
      ))}
    </div>
  );
}

export function DoublesModal({ games, doubles }: { games: GameId[]; doubles: Doubles }) {
  const [d, setD] = useState<Doubles>(doubles);

  return (
    <ModalShell dismissible>
      <header className="m-head">
        <p className="m-eyebrow">Before the cards are played</p>
        <h2 id="m-title">Any doubles?</h2>
        <p className="m-sub">Whoever holds the card can double it. Pick the player who doubled, or leave it on None.</p>
      </header>
      <div className="m-body">
        {games.includes('king') && (
          <section className="group">
            <div className="group-head">
              <GameCard id="king" />
              <div>
                <p className="group-title">King of hearts</p>
                <p className="group-hint">Doubled: taker −150, doubler +75</p>
              </div>
            </div>
            <DoublerRow value={d.king} onChange={(king) => setD((x) => ({ ...x, king }))} />
          </section>
        )}
        {games.includes('queens') && (
          <section className="group">
            <div className="group-head">
              <GameCard id="queens" />
              <div>
                <p className="group-title">Queens</p>
                <p className="group-hint">Doubled: taker −50, doubler +25 for that queen</p>
              </div>
            </div>
            {QUEENS.map((q) => (
              <div key={q.id} className="q-row">
                <QueenCard id={q.id} />
                <DoublerRow value={d.queens[q.id]} onChange={(v) => setD((x) => ({ ...x, queens: { ...x.queens, [q.id]: v } }))} />
              </div>
            ))}
          </section>
        )}
      </div>
      <footer className="m-foot">
        <button type="button" className="btn" onClick={() => game().openModal({ type: 'choose', preset: games })}>Back</button>
        <button type="button" className="btn btn-primary btn-grow" onClick={() => game().startRound(games, d)}>Start round</button>
      </footer>
    </ModalShell>
  );
}
