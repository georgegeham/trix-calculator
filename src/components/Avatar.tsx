import { useId } from 'react';
import { faceAt, SKIN, type Face } from '../lib/faces';

const CURLS: [number, number, number][] = [
  [19, 24, 5], [24, 19, 5.5], [30, 16.5, 5.5], [36, 16.5, 5.5],
  [41, 19, 5.5], [45, 24, 5], [18, 29, 3.5], [46, 29, 3.5],
];
const BRIM = 'M14 28.5Q32 22.5 50 28.5Q50.5 31.5 47 31Q32 26.5 17 31Q13.5 31.5 14 28.5Z';

function BackHair({ f }: { f: Face }) {
  const c = f.hairColor;
  switch (f.hair) {
    case 'long':
      return <path d="M17 30Q15 50 20 58L44 58Q49 50 47 30Z" fill={c} />;
    case 'bob':
      return <path d="M16 30Q15 45 18 48L46 48Q49 45 48 30Z" fill={c} />;
    case 'bun':
      return <circle cx="32" cy="12" r="6.5" fill={c} />;
    default:
      return null;
  }
}

function FrontHair({ f }: { f: Face }) {
  const c = f.hairColor;
  switch (f.hair) {
    case 'short':
      return <path d="M18.5 31Q17 15.5 32 15Q47 15.5 45.5 31Q44 23 38 21.5Q30 24.5 21 23Q19.5 26 18.5 31Z" fill={c} />;
    case 'long':
      return <path d="M18 33Q16.5 15 32 14.5Q47.5 15 46 33Q45 22 36 20Q30 25 22 24Q19 27 18 33Z" fill={c} />;
    case 'curly':
      return <>{CURLS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={c} />)}</>;
    case 'side':
      return <path d="M18.5 30Q18 16 30 15.5Q44 15 46 28Q41 20.5 27 22Q21.5 24 18.5 30Z" fill={c} />;
    case 'bald':
      return <path d="M18.6 31Q18.2 27 19.6 25.5L20.5 33ZM45.4 31Q45.8 27 44.4 25.5L43.5 33Z" fill={c} />;
    case 'hijab':
      return <path d="M17 31Q17 15 32 15Q47 15 47 31Q44 21 32 20.5Q20 21 17 31Z" fill={c} />;
    case 'spiky':
      return <path d="M18.5 31Q17 21 21 17.5L22 11.5L26.5 15.5L29.5 9.5L32.5 14.5L36.5 9.5L38.5 15.5L42.5 11.5L43 18Q47 22 45.5 31Q44 23 32 22Q21 23 18.5 31Z" fill={c} />;
    case 'buzz':
      return <path d="M18.6 30Q18 16.5 32 16Q46 16.5 45.4 30Q44 21.5 32 21Q20 21.5 18.6 30Z" fill={c} opacity={0.9} />;
    case 'slick':
      return <path d="M18.5 30Q17.5 14 33 14.5Q47 15.5 45.5 30Q45 20 37 19Q27 18 21 22Q19.5 25 18.5 30Z" fill={c} />;
    case 'cap':
      return (
        <>
          <path d="M18.6 28.5L20.6 28.5L20.2 34L18.8 33ZM45.4 28.5L43.4 28.5L43.8 34L45.2 33Z" fill={c} />
          <path d="M17.2 28Q17 12 32 12Q47 12 46.8 28Q40 25 32 25Q24 25 17.2 28Z" fill={f.capColor} />
          <path d={BRIM} fill={f.capColor} />
          <path d={BRIM} fill="rgba(0,0,0,.22)" />
          <circle cx="32" cy="12.6" r="1.6" fill="rgba(0,0,0,.25)" />
        </>
      );
    case 'bob':
      return <path d="M17.5 32Q16 14 32 14Q48 14 46.5 32Q46 24 42 22Q32 25.5 22 22Q18 24 17.5 32Z" fill={c} />;
    case 'bun':
      return <path d="M18 32Q16.5 15 32 15Q47.5 15 46 32Q45 22 32 21Q19 22 18 32Z" fill={c} />;
  }
}

interface Props {
  face: number;
  /** Staggers the blink so the table doesn't blink in unison. */
  seed?: number;
  sad?: boolean;
}

export function Avatar({ face, seed = 0, sad = false }: Props) {
  const f = faceAt(face);
  const skin = SKIN[f.skin];
  const c = f.hairColor;
  const clip = `av${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const hijab = f.hair === 'hijab';
  const browColor = hijab || f.hair === 'bald' ? '#3a2a20' : c;

  return (
    <svg className="avatar" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clip}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width="64" height="64" fill={f.bg} />
        <BackHair f={f} />
        <path d="M8 66Q9.5 49 32 48Q54.5 49 56 66Z" fill={f.shirt} />
        {hijab ? (
          <path d="M12 40Q11 11 32 11Q53 11 52 40Q52 52 58 64L6 64Q12 52 12 40Z" fill={c} />
        ) : (
          <>
            <rect x="27" y="41" width="10" height="9" rx="3" fill={skin} />
            <circle cx="18.6" cy="34" r="3" fill={skin} />
            <circle cx="45.4" cy="34" r="3" fill={skin} />
            {f.female && (
              <>
                <circle cx="18.6" cy="38.2" r="1.6" fill="#e2ae46" />
                <circle cx="45.4" cy="38.2" r="1.6" fill="#e2ae46" />
              </>
            )}
          </>
        )}
        <ellipse cx="32" cy="33" rx="13.4" ry="15" fill={skin} />
        <FrontHair f={f} />
        {f.beard && <path d="M18.8 33Q19 50.5 32 50.5Q45 50.5 45.2 33Q43.5 44.5 32 44.5Q20.5 44.5 18.8 33Z" fill={c} />}
        {f.stubble && <path d="M19.5 35Q20 49 32 48.5Q44 49 44.5 35Q43 45.5 32 45.5Q21 45.5 19.5 35Z" fill={c} opacity={0.22} />}
        {f.goatee && <path d="M28.5 44.6Q32 51 35.5 44.6Q32 46.4 28.5 44.6Z" fill={c} />}
        <circle cx="22.8" cy="38.4" r="2.3" fill="#e0605f" opacity={0.22} />
        <circle cx="41.2" cy="38.4" r="2.3" fill="#e0605f" opacity={0.22} />
        {f.shades ? (
          <>
            <g fill="#1d1d22">
              <rect x="21" y="29.6" width="10" height="7" rx="3" />
              <rect x="33" y="29.6" width="10" height="7" rx="3" />
              <rect x="30" y="31" width="4" height="1.6" />
            </g>
            <path d="M23 31.6l3-1.2" stroke="rgba(255,255,255,.45)" strokeWidth={1} strokeLinecap="round" />
          </>
        ) : (
          <>
            <g className="eyes" style={{ animationDelay: `${((seed * 1.37) % 5).toFixed(2)}s` }}>
              <circle cx="26.5" cy="33" r="1.9" fill="#1b1410" />
              <circle cx="37.5" cy="33" r="1.9" fill="#1b1410" />
            </g>
            {f.glasses && (
              <g fill="none" stroke="#1f1f24" strokeWidth={1.4}>
                <circle cx="26.5" cy="33" r="4.4" />
                <circle cx="37.5" cy="33" r="4.4" />
                <path d="M30.9 33h2.2" />
              </g>
            )}
          </>
        )}
        {f.hair !== 'cap' && (
          <path
            d={sad ? 'M23.5 28.8Q26.5 28.6 29.5 26.8M34.5 26.8Q37.5 28.6 40.5 28.8' : 'M23.5 28.6Q26.5 27 29.5 28.4M34.5 28.4Q37.5 27 40.5 28.6'}
            stroke={browColor}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
          />
        )}
        {f.bigMustache && <path d="M24.5 40.4Q28 35.8 32 38.4Q36 35.8 39.5 40.4Q36 39.2 32 40.6Q28 39.2 24.5 40.4Z" fill={c} />}
        {f.mustache && !f.bigMustache && <path d="M26.5 39.6Q29 37.2 32 38.6Q35 37.2 37.5 39.6Q32 40.4 26.5 39.6Z" fill={c} />}
        <path
          d={sad ? 'M28 44.2Q32 40.6 36 44.2' : 'M28 41.2Q32 44.6 36 41.2'}
          stroke={f.female ? '#a83440' : '#6b2b22'}
          strokeWidth={1.7}
          fill="none"
          strokeLinecap="round"
        />
        {sad && <path d="M39.6 38q1.6 2.6 0 3.8q-1.6-1.2 0-3.8Z" fill="#7fb6ec" />}
      </g>
    </svg>
  );
}
