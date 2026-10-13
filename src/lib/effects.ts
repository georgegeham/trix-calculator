export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Flies three rounds of card backs from the centre of the table to each seat. Returns a cleanup. */
export function dealCards(
  table: HTMLElement,
  center: HTMLElement,
  avatars: (HTMLElement | null)[],
  captain: number,
): () => void {
  if (reducedMotion()) return () => {};
  const tr = table.getBoundingClientRect();
  const cr = center.getBoundingClientRect();
  const ox = cr.left + cr.width / 2 - tr.left;
  const oy = cr.top + cr.height / 2 - tr.top;
  const targets = avatars.map((el) => {
    if (!el) return [ox, oy];
    const r = el.getBoundingClientRect();
    return [r.left + r.width / 2 - tr.left, r.top + r.height / 2 - tr.top];
  });

  const timers: number[] = [];
  const cards: HTMLElement[] = [];
  let n = 0;
  for (let round = 0; round < 3; round++) {
    for (let j = 0; j < 4; j++) {
      const seat = (captain + 1 + j) % 4;
      const delay = n++ * 70;
      const card = document.createElement('span');
      card.className = 'flycard';
      card.style.transform = `translate(${ox}px, ${oy}px)`;
      table.appendChild(card);
      cards.push(card);
      void card.offsetWidth;
      timers.push(
        window.setTimeout(() => {
          const [x, y] = targets[seat];
          card.style.transform = `translate(${x + Math.random() * 16 - 8}px, ${y + Math.random() * 10 - 5}px) rotate(${Math.random() * 50 - 25}deg)`;
        }, 20 + delay),
        window.setTimeout(() => (card.style.opacity = '0'), 640 + delay),
        window.setTimeout(() => card.remove(), 1050 + delay),
      );
    }
  }
  return () => {
    timers.forEach(clearTimeout);
    cards.forEach((c) => c.remove());
  };
}

export function confetti(): () => void {
  if (reducedMotion()) return () => {};
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return () => {};
  }
  const dpr = window.devicePixelRatio || 1;
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  const colors = ['#e2ae46', '#c3313e', '#1f6e51', '#fffdf6', '#3d6fb6'];
  const bits = Array.from({ length: 150 }, () => ({
    x: W / 2 + (Math.random() - 0.5) * 140,
    y: H * 0.38,
    vx: (Math.random() - 0.5) * 10,
    vy: -Math.random() * 10 - 3,
    r: Math.random() * 3,
    vr: (Math.random() - 0.5) * 0.3,
    w: 6 + Math.random() * 6,
    h: 4 + Math.random() * 4,
    c: colors[Math.floor(Math.random() * colors.length)],
  }));

  const start = performance.now();
  const life = 2800;
  let raf = 0;
  const frame = (now: number) => {
    const t = now - start;
    ctx.clearRect(0, 0, W, H);
    for (const b of bits) {
      b.vy += 0.22;
      b.vx *= 0.99;
      b.x += b.vx;
      b.y += b.vy;
      b.r += b.vr;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.r);
      ctx.globalAlpha = Math.max(0, 1 - t / life);
      ctx.fillStyle = b.c;
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
    }
    if (t < life) raf = requestAnimationFrame(frame);
    else canvas.remove();
  };
  raf = requestAnimationFrame(frame);
  return () => {
    cancelAnimationFrame(raf);
    canvas.remove();
  };
}
