import React from 'react';
import { BookOpen, Search } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  goHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, goHome }) => {
  return (
    <header className="sticky top-0 z-50 bg-emerald-950 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={goHome}
          >
            <div className="p-2 bg-emerald-800 rounded-lg group-hover:bg-emerald-700 transition-colors">
               <BookOpen className="h-6 w-6 text-emerald-100" />
            </div>
            <span className="ml-3 text-xl font-bold font-serif tracking-wide">QuranHikmah</span>
          </div>
          
          <div className="flex-1 max-w-md ml-4 md:ml-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-emerald-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-emerald-800 rounded-full leading-5 bg-emerald-900 text-emerald-100 placeholder-emerald-400 focus:outline-none focus:bg-emerald-800 focus:border-emerald-500 sm:text-sm transition-colors"
                placeholder="Search Surah (e.g. Fatiha, Yasin)..."
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};