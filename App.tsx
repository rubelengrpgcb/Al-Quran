import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Header } from './components/Header';
import { SurahCard } from './components/SurahCard';
import { DetailView } from './components/DetailView';
import { Surah, AppView } from './types';
import { fetchAllSurahs } from './services/quranService';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await fetchAllSurahs();
        setSurahs(data);
        setFilteredSurahs(data);
        setLoading(false);
      } catch (err) {
        setError("Could not load Surah list. Please check your connection.");
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSearch = (query: string) => {
    const lower = query.toLowerCase();
    const filtered = surahs.filter(s => 
      s.englishName.toLowerCase().includes(lower) || 
      s.englishNameTranslation.toLowerCase().includes(lower) ||
      s.number.toString().includes(lower)
    );
    setFilteredSurahs(filtered);
  };

  const handleSurahClick = (surah: Surah) => {
    setSelectedSurah(surah);
    setView(AppView.DETAIL);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedSurah(null);
    setView(AppView.HOME);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onSearch={handleSearch} goHome={handleBack} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading Holy Quran...</p>
          </div>
        ) : error ? (
           <div className="flex flex-col items-center justify-center h-64 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h2>
            <p className="text-slate-500">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Retry
            </button>
          </div>
        ) : view === AppView.HOME ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10">
                   <svg width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#FFFFFF" d="M45.7,-76.3C58.9,-69.3,69.1,-55.5,76.5,-40.8C83.9,-26.1,88.5,-10.5,86.1,3.9C83.7,18.3,74.3,31.5,63.9,42.7C53.5,53.9,42.1,63.1,29.3,69.5C16.5,75.9,2.3,79.5,-10.8,77.8C-23.9,76.1,-35.9,69.1,-46.7,60.2C-57.5,51.3,-67.1,40.5,-73.4,27.8C-79.7,15.1,-82.7,0.5,-79.3,-12.9C-75.9,-26.3,-66.1,-38.5,-54.3,-46.3C-42.5,-54.1,-28.7,-57.5,-14.9,-60.1C-1.1,-62.7,12.7,-64.5,25.9,-66.2" transform="translate(100 100)" />
                   </svg>
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl font-serif font-bold mb-2">Welcome to QuranHikmah</h2>
                    <p className="text-emerald-100 text-lg mb-6">Explore the Holy Quran with Bengali translations and gain deeper understanding through AI-powered Tafsir.</p>
                    <div className="flex gap-4 text-sm font-medium">
                        <div className="px-3 py-1 bg-emerald-800/50 rounded-lg border border-emerald-600/30">114 Surahs</div>
                        <div className="px-3 py-1 bg-emerald-800/50 rounded-lg border border-emerald-600/30">Bengali Meaning</div>
                        <div className="px-3 py-1 bg-emerald-800/50 rounded-lg border border-emerald-600/30">Gemini Tafsir</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSurahs.map((surah) => (
                <SurahCard 
                  key={surah.number} 
                  surah={surah} 
                  onClick={handleSurahClick} 
                />
              ))}
            </div>
          </div>
        ) : selectedSurah ? (
          <DetailView surah={selectedSurah} onBack={handleBack} />
        ) : null}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p className="font-serif text-emerald-900 font-bold mb-2">QuranHikmah</p>
          <p>Powered by api.alquran.cloud & Google Gemini</p>
          <p className="mt-2">Created for educational purposes</p>
        </div>
      </footer>
    </div>
  );
};

export default App;