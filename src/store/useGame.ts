import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Doubles, GameId, GameState, Player, RoundInput, UnluckyEvent } from '../types';
import { scoreRound, unluckyEvents } from '../lib/rules';
import { currentKingdom, KINGDOMS, playerName } from '../lib/game';

export type Modal =
  | { type: 'setup' }
  | { type: 'choose'; preset: GameId[] }
  | { type: 'doubles'; games: GameId[]; doubles: Doubles }
  | { type: 'score' }
  | { type: 'unlucky'; events: UnluckyEvent[]; thenGameOver: boolean }
  | { type: 'over' }
  | { type: 'confirm-new' }
  | { type: 'confirm-undo' };

/** One-shot animation triggers for the board. Not persisted. */
export interface Effects {
  deltas: { values: number[]; id: number } | null;
  dealId: number;
  unlucky: number[];
  freshRound: number | null;
}

interface Store extends GameState {
  modal: Modal | null;
  toast: { message: string; id: number } | null;
  fx: Effects;
  /** Read bad-luck proverbs aloud. */
  voice: boolean;
  toggleVoice: () => void;
  openModal: (modal: Modal) => void;
  closeModal: () => void;
  showToast: (message: string) => void;
  requestNewGame: () => void;
  startGame: (players: Player[], first: number) => void;
  startRound: (games: GameId[], doubles: Doubles) => void;
  changeGames: () => void;
  commitRound: (input: RoundInput) => void;
  undoLastRound: () => void;
}

const noEffects = (): Effects => ({ deltas: null, dealId: 0, unlucky: [], freshRound: null });
let seq = 0;

export const useGame = create<Store>()(
  persist(
    (set, get) => ({
      players: [],
      first: 0,
      rounds: [],
      pending: null,
      modal: null,
      toast: null,
      fx: noEffects(),
      voice: true,

      toggleVoice: () => set((s) => ({ voice: !s.voice })),
      openModal: (modal) => set({ modal }),
      closeModal: () => set({ modal: null }),
      showToast: (message) => set({ toast: { message, id: ++seq } }),

      requestNewGame: () => {
        const s = get();
        const k = currentKingdom(s);
        const midGame = k && k.index < KINGDOMS && (s.rounds.length > 0 || s.pending);
        set({ modal: { type: midGame ? 'confirm-new' : 'setup' } });
      },

      startGame: (players, first) => {
        set({ players, first, rounds: [], pending: null, modal: null, fx: noEffects() });
        setTimeout(() => get().openModal({ type: 'choose', preset: [] }), 500);
      },

      startRound: (games, doubles) =>
        set((s) => ({ pending: { games, doubles }, modal: null, fx: { ...s.fx, dealId: ++seq } })),

      changeGames: () => {
        const preset = get().pending?.games ?? [];
        set({ pending: null, modal: { type: 'choose', preset } });
      },

      commitRound: (input) => {
        const s = get();
        const kingdom = currentKingdom(s);
        const pending = s.pending;
        if (!kingdom || !pending) return;

        const scores = scoreRound(pending.games, pending.doubles, input);
        const unlucky = unluckyEvents(pending, input);
        const rounds = [
          ...s.rounds,
          { kingdom: kingdom.index, captain: kingdom.captain, games: pending.games, doubles: pending.doubles, input, scores, unlucky },
        ];
        const unluckyPlayers = [...new Set(unlucky.map((e) => e.player))];
        set({
          rounds,
          pending: null,
          modal: null,
          fx: { ...s.fx, deltas: { values: scores, id: ++seq }, unlucky: unluckyPlayers, freshRound: rounds.length - 1 },
        });
        if (unluckyPlayers.length) setTimeout(() => set((st) => ({ fx: { ...st.fx, unlucky: [] } })), 7000);

        const next = currentKingdom(get());
        const over = next?.index === KINGDOMS;
        if (unlucky.length) setTimeout(() => get().openModal({ type: 'unlucky', events: unlucky, thenGameOver: over }), 1300);
        else if (over) setTimeout(() => get().openModal({ type: 'over' }), 1600);
        if (next && !over && next.index !== kingdom.index) {
          get().showToast(`Kingdom ${next.index + 1}: the crown passes to ${playerName(s.players, next.captain)}`);
        }
      },

      undoLastRound: () => {
        set((s) => ({ rounds: s.rounds.slice(0, -1), pending: null, modal: null, fx: { ...s.fx, freshRound: null } }));
        get().showToast('Round removed');
      },
    }),
    {
      name: 'trix-calculator',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ players: s.players, first: s.first, rounds: s.rounds, pending: s.pending, voice: s.voice }),
    },
  ),
);

export const game = () => useGame.getState();
