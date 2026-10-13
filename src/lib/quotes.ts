import type { CardKey } from '../types';

/** Egyptian card names, with the card's grammatical gender and what the double was worth. */
export const AR_CARDS: Record<CardKey, { name: string; feminine: boolean; bonus: number; penalty: number }> = {
  king: { name: 'شايب الكوبة', feminine: false, bonus: 75, penalty: 150 },
  S: { name: 'بنت البستوني', feminine: true, bonus: 25, penalty: 50 },
  H: { name: 'بنت الكوبة', feminine: true, bonus: 25, penalty: 50 },
  D: { name: 'بنت الديناري', feminine: true, bonus: 25, penalty: 50 },
  C: { name: 'بنت السباتي', feminine: true, bonus: 25, penalty: 50 },
};

/**
 * {masc|fem} follows the player's gender, [masc|fem] follows the card's.
 * {name}, {card}, {bonus} and {penalty} are filled in.
 */
export const QUOTES: string[] = [
  '{name} {دبّل|دبّلت} {card} {ودفع|ودفعت} التمن {بنفسه|بنفسها}. طبّاخ السم بيدوقه.',
  'من حفر حفرة لأخيه وقع فيها… و{name} {حفرها|حفرتها} {بإيده|بإيدها} {ونزل|ونزلت} فيها.',
  '{name} {جه يكحّلها عماها|جت تكحّلها عمتها}.',
  '{card} [مرضيش|مرضيتش] [يسيب|تسيب] {name}. حب من أول دبل.',
  'المنحوس منحوس ولو علّقوا على راسه فانوس. صح يا {name}؟',
  'قليل البخت يلاقي العضم في الكرشة… و{name} {لقى|لقت} {card}.',
  'على نفسها جنت براقش… وعلى {نفسه جنى|نفسها جنت} {name}.',
  '{name} {راح يصطاد… اتصاد|راحت تصطاد… اتصادت}.',
  'بإيدي لا بإيد عمرو. {name} {اختار|اختارت} أقصر طريق للخسارة.',
  'يا فرحة ما تمّت، خدها الغراب وطار… والـ{bonus} طاروا معاها يا {name}.',
  '{name} {عمل|عملت} الفخ {ونام|ونامت} فيه.',
  'حد يقول لـ{name} إن الدبل بيتعمل على الخصم مش على {نفسه|نفسها}.',
  '{name} {قرر يدفع|قررت تدفع} الضريبة مرتين.',
  'الخطة كانت حلوة على الورق يا {name}.',
  'حتى الكوتشينة بقت بتضحك على {name}.',
  'اقفلوا الشبابيك… نحس {name} معدي.',
  'جت الحزينة تفرح ملقتلهاش مطرح… {name} {كان مستني|كانت مستنية} {bonus} زيادة {وخد|وخدت} {penalty} ناقص.',
  '{name} {وقع|وقعت} في شر {أعماله|أعمالها}، و{card} [شاهد|شاهدة].',
  'مبروك يا {name}، {كسبت|كسبتي} جايزة أحسن دبل… على نفسك.',
  '{card} [رجع|رجعت] {لصاحبه|لصاحبته} بالحضن.',
  'النحس مش صدفة… النحس اسمه {name}.',
  'يا {name}، الدبل كان المفروض يبقى فخ للناس… مش سرير {ليك|ليكي}.',
  'اللي يلعب بالنار تحرق صوابعه… و{name} {مسك|مسكت} الولّاعة {بإيده|بإيدها}.',
  '{name} {دبّل|دبّلت} عشان {يكسب|تكسب} {bonus}… {ورجع|ورجعت} {شايل|شايلة} {penalty} ناقص.',
];

export const arNum = (n: number) => n.toLocaleString('ar-EG');

/** Fills a template for a player and card. Leaves {name} in place so the UI can isolate it for bidi. */
export function fillQuote(template: string, female: boolean, card: CardKey): string {
  const c = AR_CARDS[card];
  return template
    .replace(/\{([^{}|]*)\|([^{}|]*)\}/g, (_, m: string, f: string) => (female ? f : m))
    .replace(/\[([^[\]|]*)\|([^[\]|]*)\]/g, (_, m: string, f: string) => (c.feminine ? f : m))
    .replace(/\{card\}/g, c.name)
    .replace(/\{bonus\}/g, arNum(c.bonus))
    .replace(/\{penalty\}/g, arNum(c.penalty));
}

export function pickQuote(female: boolean, card: CardKey, avoid = -1, rnd: () => number = Math.random) {
  let index = Math.floor(rnd() * QUOTES.length);
  if (index === avoid) index = (index + 1) % QUOTES.length;
  return { index, text: fillQuote(QUOTES[index], female, card) };
}
