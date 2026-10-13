import { useEffect } from 'react';
import { ModalShell } from './ModalShell';
import { Avatar } from '../Avatar';
import { game } from '../../store/useGame';
import { useTable } from '../../store/useTable';
import { confetti } from '../../lib/effects';
import { fmt, PLACES, sign } from '../../lib/rules';

export function GameOverModal() {
  const { totals, name, face, rounds } = useTable();
  useEffect(() => confetti(), []);

  const order = [0, 1, 2, 3].sort((a, b) => totals[b] - totals[a]);
  const best = totals[order[0]];
  const winners = order.filter((p) => totals[p] === best);
  const title = winners.length > 1 ? `${winners.map(name).join(' and ')} share the win` : `${name(winners[0])} wins`;

  return (
    <ModalShell dismissible>
      <header className="m-head">
        <p className="m-eyebrow">Four kingdoms · {rounds.length} rounds</p>
        <h2 id="m-title">{title}</h2>
      </header>
      <div className="m-body">
        <ol className="final">
          {order.map((p, i) => (
            <li key={p} className={`final-row${totals[p] === best ? ' win' : ''}`}>
              <span className="final-place">{PLACES[i]}</span>
              <Avatar face={face(p)} seed={p} />
              <span className="final-name">{name(p)}</span>
              <span className={`final-score ${sign(totals[p])}`}>{fmt(totals[p])}</span>
            </li>
          ))}
        </ol>
      </div>
      <footer className="m-foot">
        <button type="button" className="btn" onClick={() => game().closeModal()}>Score sheet</button>
        <button type="button" className="btn btn-primary btn-grow" onClick={() => game().openModal({ type: 'setup' })}>New game</button>
      </footer>
    </ModalShell>
  );
}
