import { useEffect, useState } from 'react';
import { useGame } from '../store/useGame';

export function Toast() {
  const toast = useGame((s) => s.toast);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(t);
  }, [toast?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`toast${visible ? ' show' : ''}`} role="status" aria-live="polite">
      {toast?.message}
    </div>
  );
}
