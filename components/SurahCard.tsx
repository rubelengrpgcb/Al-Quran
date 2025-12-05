import React from 'react';
import { Surah } from '../types';
import { ArrowRight, Star } from 'lucide-react';

interface SurahCardProps {
  surah: Surah;
  onClick: (surah: Surah) => void;
}

export const SurahCard: React.FC<SurahCardProps> = ({ surah, onClick }) => {
  return (
    <div 
      onClick={() => onClick(surah)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
         <Star className="w-24 h-24 text-emerald-800" fill="currentColor" />
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 font-bold border-2 border-emerald-100 font-arabic text-lg relative">
            <span className="absolute text-[10px] top-0.5 text-emerald-300">★</span>
            {surah.number}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors">
              {surah.englishName}
            </h3>
            <p className="text-sm text-slate-500 font-bengali">{surah.englishNameTranslation}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-arabic text-2xl text-slate-800">{surah.name.replace('سُورَةُ ', '')}</p>
          <p className="text-xs text-slate-400 mt-1">{surah.numberOfAyahs} Ayahs</p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between relative z-10">
        <span className={`text-xs px-2 py-1 rounded-md font-medium ${surah.revelationType === 'Meccan' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
          {surah.revelationType}
        </span>
        <div className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-sm font-medium">
          Read <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </div>
  );
};