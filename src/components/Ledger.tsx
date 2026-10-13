import { Fragment } from 'react';
import { Avatar } from './Avatar';
import { GameCard } from './Cards';
import { game, useGame } from '../store/useGame';
import { useTable } from '../store/useTable';
import { fmt, GAMES, sign } from '../lib/rules';

export function Ledger() {
  const { players, rounds, totals, name, face } = useTable();
  const fresh = useGame((s) => s.fx.freshRound);
  const max = Math.max(...totals);
  const empty = players.length !== 4 || rounds.length === 0;

  return (
    <section aria-labelledby="ledger-h">
      <div className="ledger-head">
        <h2 id="ledger-h">Score sheet</h2>
        {rounds.length > 0 && (
          <button className="btn btn-small" type="button" onClick={() => game().openModal({ type: 'confirm-undo' })}>
            Undo last round
          </button>
        )}
      </div>
      <div className="ledger-wrap">
        {empty ? (
          <div className="empty">
            <p className="empty-title">No rounds yet</p>
            <p>Each round you score lands here, grouped by kingdom, with running totals at the bottom.</p>
          </div>
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th scope="col" className="rn">#</th>
                <th scope="col" className="gm">Games</th>
                {[0, 1, 2, 3].map((i) => (
                  <th key={i} scope="col">
                    <span className="ph-in">
                      <Avatar face={face(i)} />
                      <span>{name(i)}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rounds.map((r, idx) => {
                const newKingdom = idx === 0 || rounds[idx - 1].kingdom !== r.kingdom;
                const doubled = r.doubles.king != null || Object.values(r.doubles.queens).some((v) => v != null);
                const unlucky = r.unlucky ?? [];
                return (
                  <Fragment key={idx}>
                    {newKingdom && (
                      <tr className="kg">
                        <th colSpan={6} scope="rowgroup">
                          <span className="kg-in">
                            <Avatar face={face(r.captain)} />
                            Kingdom {r.kingdom + 1} · {name(r.captain)}
                          </span>
                        </th>
                      </tr>
                    )}
                    <tr className={idx === fresh ? 'fresh' : undefined}>
                      <td className="rn">{idx + 1}</td>
                      <td className="gm">
                        <span className="gm-in">
                          {r.games.map((g) => (
                            <GameCard key={g} id={g} small title={GAMES[g].name} />
                          ))}
                          {doubled && <span className="x2" title="Doubled">×2</span>}
                          {unlucky.length > 0 && (
                            <span className="nahs" lang="ar" title={`${unlucky.map((e) => name(e.player)).join(', ')} doubled a card and took it`}>
                              منحوس
                            </span>
                          )}
                        </span>
                      </td>
                      {r.scores.map((v, i) => (
                        <td key={i} className={`num ${sign(v)}`}>{fmt(v)}</td>
                      ))}
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={2} scope="row">Total</th>
                {totals.map((v, i) => (
                  <td key={i} className={`num ${sign(v)}${v === max ? ' lead' : ''}`}>{fmt(v)}</td>
                ))}
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </section>
  );
}
