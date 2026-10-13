import { useEffect, useState } from 'react';
import { Avatar } from './Avatar';
import { Cloud, Crown } from './Cards';
import { useTween } from '../hooks/useTween';
import { fmt, sign } from '../lib/rules';

interface Props {
  index: number;
  name: string;
  face: number;
  total: number;
  captain: boolean;
  leader: boolean;
  delta: { value: number; id: number } | null;
  unlucky: boolean;
  avatarRef: (el: HTMLDivElement | null) => void;
}

export function Seat({ index, name, face, total, captain, leader, delta, unlucky, avatarRef }: Props) {
  const shown = useTween(total);
  const [floating, setFloating] = useState<{ value: number; id: number } | null>(null);

  useEffect(() => {
    if (!delta || !delta.value) return;
    setFloating(delta);
    const t = setTimeout(() => setFloating(null), 2100);
    return () => clearTimeout(t);
  }, [delta?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const classes = ['seat', captain && 'is-captain', unlucky && 'is-unlucky'].filter(Boolean).join(' ');
  return (
    <div
      className={classes}
      data-seat={index}
      role="group"
      aria-label={`${name}, ${fmt(total)} points${captain ? ', holds the kingdom' : ''}`}
    >
      <div className="bob" style={{ animationDelay: `${(-index * 0.85).toFixed(2)}s` }}>
        <Crown />
        {unlucky && (
          <div className="seat-cloud">
            <Cloud />
          </div>
        )}
        <div className="av-wrap" ref={avatarRef}>
          <Avatar face={face} seed={index} sad={unlucky} />
        </div>
        {floating && (
          <span key={floating.id} className={`delta ${sign(floating.value)}`}>
            {fmt(floating.value)}
          </span>
        )}
      </div>
      <div className="seat-name">{name}</div>
      <div className={`seat-score ${sign(total)}${leader ? ' lead' : ''}`}>{fmt(shown)}</div>
    </div>
  );
}
