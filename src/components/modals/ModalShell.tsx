import { useEffect, useRef, type ReactNode } from 'react';
import { game } from '../../store/useGame';

interface Props {
  children: ReactNode;
  dismissible: boolean;
  onDismiss?: () => void;
}

export function ModalShell({ children, dismissible, onDismiss }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
    document.body.classList.add('locked');
    return () => document.body.classList.remove('locked');
  }, []);

  useEffect(() => {
    if (!dismissible) return;
    const close = onDismiss ?? game().closeModal;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [dismissible, onDismiss]);

  return (
    <div
      className="scrim"
      onMouseDown={(e) => {
        if (dismissible && e.target === e.currentTarget) (onDismiss ?? game().closeModal)();
      }}
    >
      <div ref={ref} className="sheet in" role="dialog" aria-modal="true" aria-labelledby="m-title" tabIndex={-1}>
        {children}
      </div>
    </div>
  );
}
