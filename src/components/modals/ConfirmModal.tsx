import { ModalShell } from './ModalShell';
import { game } from '../../store/useGame';
import { useTable } from '../../store/useTable';
import { GAMES } from '../../lib/rules';

export function ConfirmModal({ kind }: { kind: 'new' | 'undo' }) {
  const { rounds } = useTable();
  const last = rounds[rounds.length - 1];

  const copy =
    kind === 'new'
      ? {
          title: 'Start a new game?',
          body: 'The current scores will be cleared. Player names and faces carry over.',
          ok: 'Start new game',
          run: () => game().openModal({ type: 'setup' }),
        }
      : {
          title: 'Undo the last round?',
          body: last
            ? `Round ${rounds.length} (${last.games.map((g) => GAMES[g].name).join(' + ')}) will be removed from the score sheet.`
            : 'There are no rounds to undo.',
          ok: 'Undo round',
          run: () => game().undoLastRound(),
        };

  return (
    <ModalShell dismissible>
      <header className="m-head">
        <h2 id="m-title">{copy.title}</h2>
        <p className="m-sub">{copy.body}</p>
      </header>
      <div className="m-body" />
      <footer className="m-foot">
        <button type="button" className="btn" onClick={() => game().closeModal()}>Cancel</button>
        <button type="button" className="btn btn-danger btn-grow" onClick={copy.run}>{copy.ok}</button>
      </footer>
    </ModalShell>
  );
}
