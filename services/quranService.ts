
import { Surah, SurahDetail } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const fetchAllSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${BASE_URL}/surah`);
    if (!response.ok) throw new Error('Failed to fetch Surahs');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchSurahDetail = async (number: number): Promise<SurahDetail> => {
  try {
    // Fetch Arabic text, Bengali translation, and Audio in parallel
    // Changed 'bn-bengali' to 'bn.bengali' (Muhiuddin Khan) which is the standard identifier
    const response = await fetch(`${BASE_URL}/surah/${number}/editions/quran-uthmani,bn.bengali,ar.alafasy`);
    
    if (!response.ok) throw new Error('Failed to fetch Surah detail');
    const data = await response.json();
    
    // Robustly find data by edition identifier rather than relying on index
    const arabicData = data.data.find((d: any) => d.edition.identifier === 'quran-uthmani');
    const bengaliData = data.data.find((d: any) => d.edition.identifier === 'bn.bengali');
    const audioData = data.data.find((d: any) => d.edition.identifier === 'ar.alafasy');

    if (!arabicData || !bengaliData || !audioData) {
        throw new Error('Failed to load all required editions (Text, Translation, or Audio)');
    }

    const ayahs = arabicData.ayahs.map((ayah: any, index: number) => ({
      number: ayah.number,
      text: ayah.text,
      // Ensure we are grabbing the corresponding verse from other editions
      translation: bengaliData.ayahs[index] ? bengaliData.ayahs[index].text : 'Translation unavailable',
      audio: audioData.ayahs[index] ? audioData.ayahs[index].audio : '',
      numberInSurah: ayah.numberInSurah,
    }));

    return {
      number: arabicData.number,
      name: arabicData.name,
      englishName: arabicData.englishName,
      englishNameTranslation: arabicData.englishNameTranslation,
      revelationType: arabicData.revelationType,
      numberOfAyahs: arabicData.numberOfAyahs,
      ayahs: ayahs,
    };
  } catch (error) {
    console.error("Error in fetchSurahDetail:", error);
    throw error;
  }
};
