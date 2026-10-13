import { useState } from 'react';
import { ModalShell } from './ModalShell';
import { PlayerChip } from './PlayerChip';
import { Avatar } from '../Avatar';
import { GameCard, QueenCard } from '../Cards';
import { game, useGame } from '../../store/useGame';
import { useTable } from '../../store/useTable';
import { emptyInput, fmt, GAMES, inputProblems, PLACES, QUEENS, scoreRound, sign } from '../../lib/rules';
import type { GameId, QueenId, RoundInput } from '../../types';

const SEATS = [0, 1, 2, 3];
const LIMIT = 13;
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

export function ScoreModal() {
  const pending = useGame((s) => s.pending);
  const { name, face, rounds } = useTable();
  const [d, setD] = useState<RoundInput>(emptyInput);
  const [tried, setTried] = useState(false);
  if (!pending) return null;

  const { games, doubles } = pending;
  const has = (g: GameId) => games.includes(g);
  const problems = tried ? inputProblems(games, d) : [];
  const preview = scoreRound(games, doubles, d);
  const doubledBy = (by: number | null) => (by == null ? 'Not doubled' : `Doubled by ${name(by)}`);

  const setRank = (p: number, r: number) =>
    setD((x) => {
      const ranks = x.ranks.map((v) => (v === r ? 0 : v));
      ranks[p] = x.ranks[p] === r ? 0 : r;
      return { ...x, ranks };
    });
  const step = (key: 'diamonds' | 'tricks', p: number, dir: 1 | -1) =>
    setD((x) => {
      const n = x[key][p] + dir;
      if (n < 0 || (dir > 0 && sum(x[key]) >= LIMIT)) return x;
      return { ...x, [key]: x[key].map((v, i) => (i === p ? n : v)) };
    });
  const setKing = (p: number) => setD((x) => ({ ...x, king: x.king === p ? null : p }));
  const setQueen = (q: QueenId, p: number) =>
    setD((x) => ({ ...x, queens: { ...x.queens, [q]: x.queens[q] === p ? null : p } }));

  const save = () => {
    if (inputProblems(games, d).length) return setTried(true);
    game().commitRound(d);
  };

  const who = (i: number) => (
    <span className="who">
      <Avatar face={face(i)} seed={i} />
      <span className="who-name">{name(i)}</span>
    </span>
  );

  const counter = (key: 'diamonds' | 'tricks', card: GameId, title: string, what: string) => {
    const total = sum(d[key]);
    return (
      <section className="group">
        <div className="group-head">
          <GameCard id={card} />
          <div>
            <p className="group-title">{title}</p>
            <p className="group-hint">
              {what} · <span className={total === LIMIT ? 'ok' : undefined}>{total} of {LIMIT}</span>
            </p>
          </div>
        </div>
        {SEATS.map((i) => (
          <div key={i} className="srow">
            {who(i)}
            <div className="stepper">
              <button type="button" className={`step${d[key][i] === 0 ? ' dim' : ''}`} aria-label={`One fewer for ${name(i)}`} onClick={() => step(key, i, -1)}>−</button>
              <output className="step-n">{d[key][i]}</output>
              <button type="button" className={`step${total >= LIMIT ? ' dim' : ''}`} aria-label={`One more for ${name(i)}`} onClick={() => step(key, i, 1)}>+</button>
            </div>
          </div>
        ))}
      </section>
    );
  };

  return (
    <ModalShell dismissible>
      <header className="m-head">
        <p className="m-eyebrow">Round {rounds.length + 1} · {games.map((g) => GAMES[g].name).join(' + ')}</p>
        <h2 id="m-title">What happened?</h2>
        <p className="m-sub">Enter what each player took. The points are worked out for you.</p>
      </header>
      <div className="m-body">
        {has('trix') && (
          <section className="group">
            <div className="group-head">
              <GameCard id="trix" />
              <div>
                <p className="group-title">Trix</p>
                <p className="group-hint">Finishing order: 1st +200, 2nd +150, 3rd +100, 4th +50</p>
              </div>
            </div>
            {SEATS.map((i) => (
              <div key={i} className="srow">
                {who(i)}
                <div className="ranks" role="group" aria-label={`Place for ${name(i)}`}>
                  {[1, 2, 3, 4].map((r) => (
                    <button key={r} type="button" className="rank" aria-pressed={d.ranks[i] === r} onClick={() => setRank(i, r)}>
                      {PLACES[r - 1]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button type="button" className="toggle" aria-pressed={d.jack} onClick={() => setD((x) => ({ ...x, jack: !x.jack }))}>
              <span className="toggle-box" aria-hidden="true">{d.jack ? '✓' : ''}</span>
              <span>
                <span className="toggle-title">1st place finished on a jack</span>
                <span className="toggle-hint">Scores +400 instead of +200</span>
              </span>
            </button>
          </section>
        )}
        {has('diamonds') && counter('diamonds', 'diamonds', 'Diamonds', 'Diamonds taken')}
        {has('king') && (
          <section className="group">
            <div className="group-head">
              <GameCard id="king" />
              <div>
                <p className="group-title">Who took the king of hearts?</p>
                <p className="group-hint">{doubledBy(doubles.king)}</p>
              </div>
            </div>
            <div className="pick pick4">
              {SEATS.map((i) => <PlayerChip key={i} index={i} pressed={d.king === i} onClick={() => setKing(i)} />)}
            </div>
          </section>
        )}
        {has('queens') && (
          <section className="group">
            <div className="group-head">
              <GameCard id="queens" />
              <div>
                <p className="group-title">Who took each queen?</p>
                <p className="group-hint">Doubled queens are marked</p>
              </div>
            </div>
            {QUEENS.map((q) => (
              <div key={q.id} className="q-row">
                <QueenCard id={q.id} />
                <div className="group tight">
                  <p className="group-hint">Q{q.suit} · {doubledBy(doubles.queens[q.id])}</p>
                  <div className="pick pick4">
                    {SEATS.map((i) => <PlayerChip key={i} index={i} pressed={d.queens[q.id] === i} onClick={() => setQueen(q.id, i)} />)}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
        {has('lutoosh') && counter('tricks', 'lutoosh', 'Lutoosh', 'Tricks taken')}
      </div>
      <footer className="m-foot">
        <div className="preview" aria-live="polite">
          {SEATS.map((i) => (
            <div key={i} className="pv" title={name(i)}>
              <Avatar face={face(i)} seed={i} />
              <span className={`pv-n ${sign(preview[i])}`}>{fmt(preview[i])}</span>
            </div>
          ))}
        </div>
        {problems.length > 0 && (
          <ul className="errs" role="alert">
            {problems.map((p) => <li key={p}>{p}</li>)}
          </ul>
        )}
        <button type="button" className="btn" onClick={() => game().closeModal()}>Cancel</button>
        <button type="button" className="btn btn-primary btn-grow" onClick={save}>Save round</button>
      </footer>
    </ModalShell>
  );
}
