export type HairStyle =
  | 'short' | 'long' | 'curly' | 'hijab' | 'bald' | 'side'
  | 'spiky' | 'cap' | 'buzz' | 'slick' | 'bob' | 'bun';

export interface Face {
  bg: string;
  shirt: string;
  skin: number;
  hair: HairStyle;
  hairColor: string;
  female?: boolean;
  capColor?: string;
  beard?: boolean;
  stubble?: boolean;
  goatee?: boolean;
  mustache?: boolean;
  bigMustache?: boolean;
  glasses?: boolean;
  shades?: boolean;
}

export const SKIN = ['#f5d0b0', '#e3ab80', '#c68856', '#8d5a3b'];

/** 11 men, 5 women. */
export const FACES: Face[] = [
  { bg: '#f3b562', shirt: '#2f6f8f', skin: 1, hair: 'short', hairColor: '#2b1b12' },
  { bg: '#9fd4c4', shirt: '#c2504b', skin: 0, hair: 'long', hairColor: '#6b3e1f', female: true },
  { bg: '#c9b8f2', shirt: '#2d7a4f', skin: 3, hair: 'curly', hairColor: '#1c1410' },
  { bg: '#a9cdf2', shirt: '#7b3f61', skin: 1, hair: 'hijab', hairColor: '#b8476d', female: true },
  { bg: '#f2a9a2', shirt: '#3d4b8f', skin: 2, hair: 'bald', hairColor: '#2a1e17', beard: true, glasses: true },
  { bg: '#cfe49b', shirt: '#8a5a2b', skin: 2, hair: 'short', hairColor: '#151515', mustache: true },
  { bg: '#f6d77f', shirt: '#2c6e6a', skin: 0, hair: 'long', hairColor: '#b4532a', glasses: true, female: true },
  { bg: '#dccab3', shirt: '#4a4a5a', skin: 1, hair: 'side', hairColor: '#a3a3a3', glasses: true, mustache: true },
  { bg: '#ffc9a8', shirt: '#1f5f8b', skin: 0, hair: 'spiky', hairColor: '#5a3a1e', stubble: true },
  { bg: '#b9e3f0', shirt: '#e9e9e9', skin: 2, hair: 'cap', capColor: '#c0392b', hairColor: '#1a1a1a', goatee: true, mustache: true },
  { bg: '#d6e6a8', shirt: '#5b3b8c', skin: 1, hair: 'buzz', hairColor: '#231a14', beard: true },
  { bg: '#f7b2c4', shirt: '#222831', skin: 1, hair: 'slick', hairColor: '#120d0a', shades: true },
  { bg: '#ffe08a', shirt: '#9c2f2f', skin: 3, hair: 'buzz', hairColor: '#0e0b09', goatee: true, glasses: true },
  { bg: '#c4d7f5', shirt: '#6b4a2b', skin: 2, hair: 'bald', hairColor: '#3a2a20', bigMustache: true },
  { bg: '#f0c3e6', shirt: '#2f7d6d', skin: 2, hair: 'bob', hairColor: '#16110e', female: true },
  { bg: '#bfe8d4', shirt: '#c46a2b', skin: 1, hair: 'bun', hairColor: '#4a2c17', glasses: true, female: true },
];

export const DEFAULT_FACES = [0, 8, 9, 1];

export const faceAt = (i: number): Face => FACES[((i % FACES.length) + FACES.length) % FACES.length];
export const isFemale = (i: number) => !!faceAt(i).female;
