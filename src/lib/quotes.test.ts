import { describe, expect, it } from 'vitest';
import { AR_CARDS, fillQuote, pickQuote, QUOTES } from './quotes';
import type { CardKey } from '../types';

describe('quotes', () => {
  const cards = Object.keys(AR_CARDS) as CardKey[];

  it('fill completely for every gender and card, leaving only {name}', () => {
    for (const template of QUOTES) {
      for (const female of [false, true]) {
        for (const card of cards) {
          const text = fillQuote(template, female, card).replace(/\{name\}/g, 'X');
          expect(text, template).not.toMatch(/[{}[\]|]/);
        }
      }
    }
  });

  it('uses the right gender forms', () => {
    expect(fillQuote('{دبّل|دبّلت}', false, 'king')).toBe('دبّل');
    expect(fillQuote('{دبّل|دبّلت}', true, 'king')).toBe('دبّلت');
    expect(fillQuote('[رجع|رجعت]', false, 'S')).toBe('رجعت');
  });

  it('never repeats the previous quote', () => {
    const first = pickQuote(false, 'king', -1, () => 0);
    const again = pickQuote(false, 'king', first.index, () => 0);
    expect(again.index).not.toBe(first.index);
  });
});
