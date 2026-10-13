import { useEffect, useRef } from 'react';
import { Seat } from './Seat';
import { Center } from './Center';
import { useGame } from '../store/useGame';
import { useTable } from '../store/useTable';
import { KINGDOMS } from '../lib/game';
import { dealCards } from '../lib/effects';

export function Table() {
  const { rounds, kingdom, totals, name, face } = useTable();
  const fx = useGame((s) => s.fx);
  const tableRef = useRef<HTMLElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const avatarRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);

  useEffect(() => {
    if (!fx.dealId || !tableRef.current || !centerRef.current) return;
    return dealCards(tableRef.current, centerRef.current, avatarRefs.current, kingdom?.captain ?? 0);
  }, [fx.dealId]); // eslint-disable-line react-hooks/exhaustive-deps

  const max = Math.max(...totals);
  const seat = (i: number) => (
    <Seat
      key={i}
      index={i}
      name={name(i)}
      face={face(i)}
      total={totals[i]}
      captain={!!kingdom && kingdom.index < KINGDOMS && kingdom.captain === i}
      leader={rounds.length > 0 && totals[i] === max}
      delta={fx.deltas ? { value: fx.deltas.values[i], id: fx.deltas.id } : null}
      unlucky={fx.unlucky.includes(i)}
      avatarRef={(el) => {
        avatarRefs.current[i] = el;
      }}
    />
  );

  return (
    <main ref={tableRef} className="table" aria-label="Card table">
      {seat(2)}
      {seat(3)}
      <Center ref={centerRef} />
      {seat(1)}
      {seat(0)}
    </main>
  );
}
