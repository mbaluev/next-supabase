import { JetBrains_Mono } from 'next/font/google';

const font = JetBrains_Mono({ subsets: ['latin'] });
const GLYPHS = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
const FONT_SIZE = 12;
const TICK_MS = 50;
const FADE_ALPHA = 0.07;
const RESET_CHANCE = 0.02;
const POINTER_RADIUS = 120;
const HOVER_LIGHTNESS_BOOST = 20;

export const ChartMatrixCreate = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = 1;
  let columns = 0;
  let drops: number[] = [];
  let speeds: number[] = [];
  let pointer = { x: 0, y: 0, active: false };
  let rafId: number | null = null;
  let last = 0;
  let acc = 0;
  let paused = false;

  function glyph() {
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  function successHsl() {
    return getComputedStyle(canvas).getPropertyValue('--success').trim();
  }
  function withLightness(hsl: string, delta: number) {
    const [h, s, l] = hsl.split(/\s+/);
    const lightness = Math.min(95, parseFloat(l) + delta);
    return `${h} ${s} ${lightness}%`;
  }
  function seed() {
    columns = Math.max(1, Math.ceil(width / FONT_SIZE));
    drops = Array.from(
      { length: columns },
      () => -Math.floor(Math.random() * (height / FONT_SIZE))
    );
    speeds = Array.from({ length: columns }, () => 1);
  }
  function resize(newWidth: number, newHeight: number) {
    if (!ctx) return;
    width = newWidth;
    height = newHeight;
    dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    seed();
    paused = false;
  }
  function clear() {
    paused = true;
    if (ctx) ctx.clearRect(0, 0, width, height);
  }
  function tick() {
    if (!ctx || columns === 0 || paused) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0, 0, 0, ${FADE_ALPHA})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.font = `${FONT_SIZE}px ${font.style.fontFamily}`;
    ctx.textBaseline = 'top';

    const hsl = successHsl();
    const colorHead = `hsl(${hsl})`;
    const colorHover = `hsl(${withLightness(hsl, HOVER_LIGHTNESS_BOOST)})`;

    for (let i = 0; i < columns; i++) {
      const x = i * FONT_SIZE;
      const y = drops[i] * FONT_SIZE;

      const centerX = x + FONT_SIZE / 2;
      const dist = pointer.active ? Math.abs(centerX - pointer.x) : Infinity;
      const factor = pointer.active && dist < POINTER_RADIUS ? 1 - dist / POINTER_RADIUS : 0;

      ctx.fillStyle = factor > 0 ? colorHover : colorHead;
      if (y >= 0 && y < height) ctx.fillText(glyph(), x, y);

      speeds[i] = 1 + factor * 2;
      drops[i] += speeds[i];

      if (y > height && Math.random() < RESET_CHANCE) {
        drops[i] = -Math.floor(Math.random() * 20);
      }
    }
  }
  function loop(time: number) {
    if (!last) last = time;
    acc += time - last;
    last = time;
    if (acc >= TICK_MS) {
      acc = 0;
      tick();
    }
    rafId = requestAnimationFrame(loop);
  }
  function start() {
    if (rafId != null) return;
    last = 0;
    acc = 0;
    rafId = requestAnimationFrame(loop);
  }
  function stop() {
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  return { resize, clear, start, stop };
};
