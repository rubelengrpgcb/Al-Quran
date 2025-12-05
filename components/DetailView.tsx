
import React, { useEffect, useState, useRef } from 'react';
import { Surah, SurahDetail, TafsirResponse } from '../types';
import { fetchSurahDetail } from '../services/quranService';
import { getAyahTafsir, getSurahSummary } from '../services/geminiService';
import { ArrowLeft, BookOpen, Loader2, Sparkles, X, PlayCircle, PauseCircle, Mic } from 'lucide-react';

interface DetailViewProps {
  surah: Surah;
  onBack: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ surah, onBack }) => {
  const [detail, setDetail] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  
  // Tafsir & Pronunciation State
  const [activeTafsirAyah, setActiveTafsirAyah] = useState<number | null>(null);
  const [tafsirData, setTafsirData] = useState<TafsirResponse | null>(null);
  const [loadingTafsir, setLoadingTafsir] = useState(false);

  // Audio State
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const data = await fetchSurahDetail(surah.number);
        if (mounted) {
            setDetail(data);
            setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [surah.number]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleGenerateSummary = async () => {
    if (summary) return;
    setLoadingSummary(true);
    try {
      const text = await getSurahSummary(surah.englishName);
      setSummary(text);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleGetTafsir = async (ayahNumber: number, text: string, translation: string) => {
    // If clicking the same ayah, close it
    if (activeTafsirAyah === ayahNumber) {
        closeTafsir();
        return;
    }

    setActiveTafsirAyah(ayahNumber);
    setTafsirData(null);
    setLoadingTafsir(true);
    try {
      const data = await getAyahTafsir(surah.englishName, ayahNumber, text, translation);
      setTafsirData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTafsir(false);
    }
  };

  const closeTafsir = () => {
    setActiveTafsirAyah(null);
    setTafsirData(null);
  };

  const toggleAudio = (ayahNumber: number, audioUrl: string) => {
    if (playingAyah === ayahNumber) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAyah(null);
    } else {
      // Play new
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setPlayingAyah(null);
      };
      
      audio.play().catch(e => console.error("Error playing audio:", e));
      setPlayingAyah(ayahNumber);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 animate-pulse">Loading Surah Al-{surah.englishName}...</p>
      </div>
    );
  }

  if (!detail) return <div className="text-center p-10 text-red-500">Failed to load content.</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Navigation & Header */}
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center text-emerald-700 hover:text-emerald-900 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-emerald-50"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to List
        </button>
        <div className="text-right">
           <h1 className="text-3xl font-bold text-emerald-950 font-serif">{detail.englishName}</h1>
           <p className="text-emerald-600">{detail.englishNameTranslation} • {detail.revelationType}</p>
        </div>
      </div>

      {/* Bismillah */}
      <div className="bg-emerald-950 rounded-2xl p-8 mb-8 text-center text-emerald-50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50"></div>
        <p className="font-arabic text-4xl leading-loose mb-2">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        <p className="text-emerald-200/80 font-bengali text-sm">দয়াময়, পরম করুণাময় আল্লাহ্‌র নামে</p>
        
        {/* AI Summary Button */}
        <div className="mt-6 flex justify-center">
            {!summary && !loadingSummary && (
                <button 
                    onClick={handleGenerateSummary}
                    className="flex items-center space-x-2 bg-emerald-800/50 hover:bg-emerald-800 text-emerald-100 px-4 py-2 rounded-full text-sm transition-all border border-emerald-700/50 backdrop-blur-sm"
                >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Generate AI Summary & Tafsir</span>
                </button>
            )}
            {loadingSummary && (
                <div className="flex items-center space-x-2 text-emerald-200 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating summary & tafsir...</span>
                </div>
            )}
        </div>
        {summary && (
            <div className="mt-6 bg-emerald-900/50 p-4 rounded-xl text-left border border-emerald-800/50 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <p className="text-emerald-100 font-bengali leading-relaxed text-sm md:text-base whitespace-pre-wrap">{summary}</p>
                </div>
            </div>
        )}
      </div>

      {/* Ayahs List */}
      <div className="space-y-6">
        {detail.ayahs.map((ayah) => (
          <div 
            key={ayah.number} 
            id={`ayah-${ayah.numberInSurah}`}
            className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-300 ${activeTafsirAyah === ayah.numberInSurah ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-md' : 'border-slate-100 hover:border-emerald-200'}`}
          >
            {/* Header: Number & Actions */}
            <div className="flex justify-between items-start mb-4 border-b border-slate-50 pb-3">
                <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold font-arabic">
                        {ayah.numberInSurah.toLocaleString('ar-EG')}
                    </span>
                    
                    {/* Audio Player Button */}
                    <button
                        onClick={() => toggleAudio(ayah.numberInSurah, ayah.audio)}
                        className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${playingAyah === ayah.numberInSurah ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'}`}
                        title="Play Recitation"
                    >
                        {playingAyah === ayah.numberInSurah ? (
                            <PauseCircle className="w-5 h-5" />
                        ) : (
                            <PlayCircle className="w-5 h-5" />
                        )}
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                     <button 
                        onClick={() => handleGetTafsir(ayah.numberInSurah, ayah.text, ayah.translation)}
                        className={`flex items-center space-x-1 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${activeTafsirAyah === ayah.numberInSurah ? 'bg-emerald-600 text-white' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                     >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Tafsir & Reading</span>
                     </button>
                </div>
            </div>

            {/* Arabic Text */}
            <p className="text-right font-arabic text-3xl md:text-4xl leading-[2.5] text-slate-800 mb-6 dir-rtl" dir="rtl">
              {ayah.text}
            </p>

            {/* Bengali Translation */}
            <div className="text-slate-600 font-bengali text-lg leading-relaxed border-l-4 border-emerald-500 pl-4 py-1 bg-slate-50/50 rounded-r-lg">
              {ayah.translation}
            </div>

            {/* Tafsir Panel (Inline) */}
            {activeTafsirAyah === ayah.numberInSurah && (
                <div className="mt-6 pt-6 border-t border-emerald-100 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-emerald-50 rounded-xl p-6 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-emerald-900 font-bold flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-emerald-600" />
                                Gemini Analysis
                            </h3>
                            <button onClick={closeTafsir} className="text-emerald-400 hover:text-emerald-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {loadingTafsir ? (
                            <div className="py-8 text-center space-y-3">
                                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                                <p className="text-emerald-700 font-medium animate-pulse">Analysing Ayah & Generating Pronunciation...</p>
                            </div>
                        ) : tafsirData ? (
                            <div className="space-y-6">
                                {/* Pronunciation Section */}
                                <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm">
                                    <h4 className="flex items-center text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
                                        <Mic className="w-3 h-3 mr-1" />
                                        Bengali Pronunciation
                                    </h4>
                                    <p className="text-lg text-slate-800 font-bengali">{tafsirData.pronunciation}</p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Context</h4>
                                    <p className="text-sm text-emerald-800 italic">{tafsirData.context}</p>
                                </div>
                                
                                <div>
                                    <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Interpretation (Tafsir)</h4>
                                    <p className="text-emerald-900 font-bengali leading-relaxed">{tafsirData.tafsir}</p>
                                </div>

                                <div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {tafsirData.keyThemes.map((theme, i) => (
                                            <span key={i} className="text-xs bg-white text-emerald-700 px-2 py-1 rounded border border-emerald-200">
                                                #{theme}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-red-500">Failed to load content.</p>
                        )}
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
