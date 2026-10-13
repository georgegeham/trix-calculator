import { useEffect, useState } from 'react';
import { ModalShell } from './ModalShell';
import { Avatar } from '../Avatar';
import { CardFace, Cloud } from '../Cards';
import { game, useGame } from '../../store/useGame';
import { useTable } from '../../store/useTable';
import { isFemale } from '../../lib/faces';
import { pickQuote } from '../../lib/quotes';
import { fmt, PTS } from '../../lib/rules';
import { speakArabic, stopSpeaking, useArabicVoice } from '../../lib/speech';
import type { UnluckyEvent } from '../../types';

function QuoteText({ text, name }: { text: string; name: string }) {
  const parts = text.split('{name}');
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <bdi>{name}</bdi>}
        </span>
      ))}
    </>
  );
}

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" stroke="none" />
      {on ? (
        <>
          <path d="M16 9.5a3.5 3.5 0 0 1 0 5" />
          <path d="M18.5 7a7 7 0 0 1 0 10" />
        </>
      ) : (
        <path d="M17 9.5l5 5M22 9.5l-5 5" />
      )}
    </svg>
  );
}

export function UnluckyModal({ events, thenGameOver }: { events: UnluckyEvent[]; thenGameOver: boolean }) {
  const { name, face } = useTable();
  const voiceOn = useGame((s) => s.voice);
  const { supported, voice, loaded } = useArabicVoice();
  const roll = (prev: number[] = []) => events.map((e, i) => pickQuote(isFemale(face(e.player)), e.card, prev[i] ?? -1));
  const [quotes, setQuotes] = useState(() => roll());
  const [rollId, setRollId] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  const players = new Set(events.map((e) => e.player));
  const single = players.size === 1;
  const spoken = quotes.map((q, i) => q.text.replace(/\{name\}/g, name(events[i].player)));

  const say = () => speakArabic(spoken, { onStart: () => setSpeaking(true), onEnd: () => setSpeaking(false) });

  useEffect(() => {
    if (voiceOn) say();
    return () => {
      stopSpeaking();
      setSpeaking(false);
    };
  }, [rollId, voiceOn]); // eslint-disable-line react-hooks/exhaustive-deps

  const finish = () => (thenGameOver ? game().openModal({ type: 'over' }) : game().closeModal());

  return (
    <ModalShell dismissible={!thenGameOver}>
      <header className="m-head">
        <p className="m-eyebrow">Doubled it, then took it</p>
        <h2 id="m-title">{single ? `Unlucky, ${name(events[0].player)}` : 'Bad luck all round'}</h2>
      </header>
      <div className="m-body">
        {events.map((e, i) => (
          <figure key={i} className="unlucky">
            <div className="sad">
              <Cloud />
              <div className="sad-av">
                <Avatar face={face(e.player)} seed={e.player} sad />
              </div>
            </div>
            {!single && <p className="u-name">{name(e.player)}</p>}
            <div className="u-card">
              <CardFace card={e.card} />
              <span className="u-pts">{fmt(e.card === 'king' ? PTS.kingDoubled : PTS.queenDoubled)}</span>
            </div>
            <blockquote key={`${rollId}-${i}`} className={`quote${speaking ? ' speaking' : ''}`} lang="ar" dir="rtl">
              <QuoteText text={quotes[i].text} name={name(e.player)} />
            </blockquote>
          </figure>
        ))}
        {voiceOn && supported && loaded && !voice && (
          <p className="voice-hint">This device has no Arabic voice, so the proverb is read with the default voice. Add an Arabic voice in your system’s speech settings to hear it properly.</p>
        )}
        {voiceOn && !supported && <p className="voice-hint">This browser can’t read text aloud.</p>}
      </div>
      <footer className="m-foot">
        <button
          type="button"
          className="btn btn-icon"
          aria-pressed={voiceOn}
          aria-label={voiceOn ? 'Mute the proverbs' : 'Read the proverbs aloud'}
          title={voiceOn ? 'Mute' : 'Read aloud'}
          onClick={() => game().toggleVoice()}
        >
          <SpeakerIcon on={voiceOn} />
        </button>
        {voiceOn && supported && (
          <button type="button" className="btn" onClick={say}>Hear it again</button>
        )}
        <button
          type="button"
          className="btn"
          lang="ar"
          onClick={() => {
            setQuotes((q) => roll(q.map((x) => x.index)));
            setRollId((n) => n + 1);
          }}
        >
          واحدة كمان
        </button>
        <button type="button" className="btn btn-primary btn-grow" onClick={finish}>
          {thenGameOver ? 'Continue' : 'Back to the table'}
        </button>
      </footer>
    </ModalShell>
  );
}
