import { Avatar } from '../Avatar';
import { useTable } from '../../store/useTable';

interface Props {
  index: number;
  pressed: boolean;
  onClick: () => void;
}

export function PlayerChip({ index, pressed, onClick }: Props) {
  const { name, face } = useTable();
  return (
    <button type="button" className="chip" aria-pressed={pressed} onClick={onClick}>
      <Avatar face={face(index)} seed={index} />
      <span className="chip-name">{name(index)}</span>
    </button>
  );
}

export function NoneChip({ pressed, onClick }: Omit<Props, 'index'>) {
  return (
    <button type="button" className="chip" aria-pressed={pressed} onClick={onClick}>
      <span className="none-ico" aria-hidden="true">–</span>
      <span className="chip-name">None</span>
    </button>
  );
}
