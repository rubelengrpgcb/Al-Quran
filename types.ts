
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | any;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: {
    number: number;
    text: string; // Arabic
    translation: string; // Bengali
    audio: string; // Audio URL
    numberInSurah: number;
  }[];
}

export enum AppView {
  HOME = 'HOME',
  DETAIL = 'DETAIL',
}

export interface TafsirResponse {
  tafsir: string;
  keyThemes: string[];
  context: string;
  pronunciation: string; // Bengali Transliteration
}
