import React from 'react';
import { BookOpen, History, Languages, RotateCcw } from 'lucide-react';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  lang: 'es' | 'en';
  onToggleLang: () => void;
  onReset: () => void;
  hasCurrentAnalysis: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  lang,
  onToggleLang,
  onReset,
  hasCurrentAnalysis,
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-4 rounded-t-2xl shadow-sm flex items-center justify-between">
      <div 
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={onReset}
        title="Guglish Bot - Home"
      >
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-inner group-hover:scale-105 transition-transform">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wide flex items-center gap-1.5 leading-none">
            Guglish Bot
          </h1>
          <p className="text-xs text-blue-100 font-medium mt-0.5">
            English Practice
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {hasCurrentAnalysis && (
          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs font-medium"
            title="New sentence"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </button>
        )}

        <button
          onClick={onToggleLang}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs font-medium"
          title="Toggle explanation language"
        >
          <Languages className="w-4 h-4" />
          <span className="uppercase text-xs font-bold px-1 py-0.5 bg-white/20 rounded">
            {lang}
          </span>
        </button>

        <button
          onClick={onOpenHistory}
          className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Practice History"
        >
          <History className="w-4 h-4" />
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-400 text-blue-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
              {historyCount > 9 ? '9+' : historyCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
