import React, { useState, useEffect } from 'react';
import { SentenceAnalysisResponse } from './types';
import { Header } from './components/Header';
import { HowItWorksCard } from './components/HowItWorksCard';
import { PresetChips } from './components/PresetChips';
import { SentenceInput } from './components/SentenceInput';
import { AnalysisResult } from './components/AnalysisResult';
import { HistoryDrawer } from './components/HistoryDrawer';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<SentenceAnalysisResponse | null>(null);
  const [history, setHistory] = useState<SentenceAnalysisResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load practice history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('guglish_bot_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newAnalysis: SentenceAnalysisResponse) => {
    setHistory((prev) => {
      const updated = [newAnalysis, ...prev.filter((item) => item.originalSentence !== newAnalysis.originalSentence)].slice(0, 30);
      try {
        localStorage.setItem('guglish_bot_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save history', e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('guglish_bot_history');
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  };

  const handleAnalyzeSentence = async (sentence: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze sentence.');
      }

      setCurrentAnalysis(data);
      saveToHistory(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-200/70 py-4 px-3 sm:py-8 flex items-center justify-center font-sans antialiased text-slate-900">
      {/* Outer App Frame mimicking the reference image */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-300/80 overflow-hidden flex flex-col min-h-[720px] relative">
        
        {/* Header */}
        <Header
          historyCount={history.length}
          onOpenHistory={() => setIsHistoryOpen(true)}
          lang={lang}
          onToggleLang={() => setLang((prev) => (prev === 'es' ? 'en' : 'es'))}
          onReset={handleReset}
          hasCurrentAnalysis={!!currentAnalysis}
        />

        {/* Main Content Area */}
        <main className="flex-1 bg-slate-50/80 p-4 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{error}</p>
                <p className="text-[11px] text-rose-600 mt-0.5">
                  Make sure you have configured your GEMINI_API_KEY in the Secrets panel.
                </p>
              </div>
            </div>
          )}

          {currentAnalysis ? (
            <AnalysisResult
              analysis={currentAnalysis}
              lang={lang}
              onNewAnalysis={handleReset}
            />
          ) : (
            <>
              <HowItWorksCard />
              <PresetChips onSelect={handleAnalyzeSentence} disabled={isLoading} />
            </>
          )}
        </main>

        {/* Bottom Input Area */}
        <footer className="p-4 bg-white border-t border-slate-200/80 shadow-lg">
          <SentenceInput onSubmit={handleAnalyzeSentence} isLoading={isLoading} />
        </footer>

        {/* History Drawer */}
        <HistoryDrawer
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onSelectHistory={(item) => setCurrentAnalysis(item)}
          onClearHistory={handleClearHistory}
        />
      </div>
    </div>
  );
}
