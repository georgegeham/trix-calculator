import { useGame } from '../../store/useGame';
import { SetupModal } from './SetupModal';
import { ChooseModal } from './ChooseModal';
import { DoublesModal } from './DoublesModal';
import { ScoreModal } from './ScoreModal';
import { UnluckyModal } from './UnluckyModal';
import { GameOverModal } from './GameOverModal';
import { ConfirmModal } from './ConfirmModal';

export function ModalHost() {
  const modal = useGame((s) => s.modal);
  if (!modal) return null;
  switch (modal.type) {
    case 'setup':
      return <SetupModal key="setup" />;
    case 'choose':
      return <ChooseModal key="choose" preset={modal.preset} />;
    case 'doubles':
      return <DoublesModal key="doubles" games={modal.games} doubles={modal.doubles} />;
    case 'score':
      return <ScoreModal key="score" />;
    case 'unlucky':
      return <UnluckyModal key="unlucky" events={modal.events} thenGameOver={modal.thenGameOver} />;
    case 'over':
      return <GameOverModal key="over" />;
    case 'confirm-new':
      return <ConfirmModal key="confirm-new" kind="new" />;
    case 'confirm-undo':
      return <ConfirmModal key="confirm-undo" kind="undo" />;
  }
}
