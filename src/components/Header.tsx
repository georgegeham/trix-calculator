import { game } from '../store/useGame';
import { useTable } from '../store/useTable';
import { KINGDOMS } from '../lib/game';

export function Header() {
  const { kingdom, rounds } = useTable();
  const status = !kingdom
    ? 'Score keeper for four players'
    : kingdom.index === KINGDOMS
      ? `Game over · ${rounds.length} rounds`
      : `Kingdom ${kingdom.index + 1} of ${KINGDOMS} · Round ${rounds.length + 1}`;

  return (
    <header className="top">
      <div className="brand">
        <span className="mc logo" aria-hidden="true">J</span>
        <div>
          <h1>Trix</h1>
          <p className="status">{status}</p>
        </div>
      </div>
      {kingdom && (
        <button className="btn btn-small" type="button" onClick={() => game().requestNewGame()}>
          New game
        </button>
      )}
    </header>
  );
}
