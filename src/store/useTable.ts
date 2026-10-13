import { useMemo } from 'react';
import { useGame } from './useGame';
import { currentKingdom, playerFace, playerName, totals } from '../lib/game';

/** Derived view of the game: current kingdom, totals and player lookups. */
export function useTable() {
  const players = useGame((s) => s.players);
  const first = useGame((s) => s.first);
  const rounds = useGame((s) => s.rounds);
  return useMemo(
    () => ({
      players,
      rounds,
      kingdom: currentKingdom({ players, first, rounds }),
      totals: totals(rounds),
      name: (i: number) => playerName(players, i),
      face: (i: number) => playerFace(players, i),
    }),
    [players, first, rounds],
  );
}
