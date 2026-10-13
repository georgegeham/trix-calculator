import { Fragment, useRef, useState } from 'react';
import { ModalShell } from './ModalShell';
import { Avatar } from '../Avatar';
import { game, useGame } from '../../store/useGame';
import { DEFAULT_FACES, FACES } from '../../lib/faces';

const SEATS = [0, 1, 2, 3];

export function SetupModal() {
  const players = useGame((s) => s.players);
  const savedFirst = useGame((s) => s.first);
  const prev = players.length === 4 ? players : null;

  const [names, setNames] = useState(() => SEATS.map((i) => prev?.[i].name ?? ''));
  const [faces, setFaces] = useState(() => SEATS.map((i) => prev?.[i].face ?? DEFAULT_FACES[i]));
  const [first, setFirst] = useState(prev ? savedFirst : 0);
  const [picking, setPicking] = useState<number | null>(null);
  const faceButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const label = (i: number) => names[i].trim() || `Player ${i + 1}`;
  const start = () => game().startGame(SEATS.map((i) => ({ name: label(i), face: faces[i] })), first);

  return (
    <ModalShell dismissible={!!prev}>
      <header className="m-head">
        <h2 id="m-title">New game</h2>
        <p className="m-sub">Enter the four players in seating order around the table. Tap a face to pick a different one.</p>
      </header>
      <div className="m-body">
        <div className="setup">
          {SEATS.map((i) => (
            <Fragment key={i}>
              <div className="setup-row">
                <button
                  type="button"
                  className="av-btn"
                  ref={(el) => {
                    faceButtons.current[i] = el;
                  }}
                  aria-expanded={picking === i}
                  aria-label={`Choose a face for player ${i + 1}`}
                  onClick={() => setPicking(picking === i ? null : i)}
                >
                  <Avatar face={faces[i]} seed={i} />
                </button>
                <label className="field">
                  <span className="field-label">Player {i + 1}</span>
                  <input
                    ref={(el) => {
                      inputs.current[i] = el;
                    }}
                    type="text"
                    maxLength={16}
                    autoComplete="off"
                    placeholder={`Player ${i + 1}`}
                    value={names[i]}
                    onChange={(e) => setNames((n) => n.map((v, j) => (j === i ? e.target.value : v)))}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return;
                      e.preventDefault();
                      const nextInput = inputs.current[i + 1];
                      if (nextInput) nextInput.focus();
                      else start();
                    }}
                  />
                </label>
              </div>
              {picking === i && (
                <div className="face-grid" role="group" aria-label={`Faces for player ${i + 1}`}>
                  {FACES.map((_, f) => (
                    <button
                      key={f}
                      type="button"
                      className="face"
                      aria-pressed={faces[i] === f}
                      aria-label={`Face ${f + 1}`}
                      onClick={() => {
                        setFaces((fs) => fs.map((v, j) => (j === i ? f : v)));
                        setPicking(null);
                        faceButtons.current[i]?.focus();
                      }}
                    >
                      <Avatar face={f} seed={f} />
                    </button>
                  ))}
                </div>
              )}
            </Fragment>
          ))}
        </div>
        <div className="group">
          <p className="group-label" id="first-l">Who opens the first kingdom?</p>
          <div className="pick pick4" role="group" aria-labelledby="first-l">
            {SEATS.map((i) => (
              <button key={i} type="button" className="chip" aria-pressed={first === i} onClick={() => setFirst(i)}>
                <Avatar face={faces[i]} seed={i} />
                <span className="chip-name">{label(i)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <footer className="m-foot">
        <button type="button" className="btn btn-primary btn-wide" onClick={start}>
          Deal the cards
        </button>
      </footer>
    </ModalShell>
  );
}
