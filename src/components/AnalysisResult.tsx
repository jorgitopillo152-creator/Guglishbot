import React, { useState } from 'react';
import { SentenceAnalysisResponse } from '../types';
import {
  Volume2,
  Copy,
  Check,
  Award,
  Sparkles,
  Info,
  Lightbulb,
  Search,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface AnalysisResultProps {
  analysis: SentenceAnalysisResponse;
  lang: 'es' | 'en';
  onNewAnalysis: () => void;
}

const CEFR_COLORS: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  A1: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', bar: 'w-1/6 bg-emerald-500' },
  A2: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', bar: 'w-2/6 bg-teal-500' },
  B1: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', bar: 'w-3/6 bg-blue-500' },
  B2: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', bar: 'w-4/6 bg-indigo-500' },
  C1: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', bar: 'w-5/6 bg-purple-500' },
  C2: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', bar: 'w-full bg-rose-500' },
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, lang, onNewAnalysis }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [activeTooltipIdx, setActiveTooltipIdx] = useState<number | null>(null);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for language learners

    utterance.onstart = () => setSpeakingText(text);
    utterance.onend = () => setSpeakingText(null);
    utterance.onerror = () => setSpeakingText(null);

    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const cefrStyle = CEFR_COLORS[analysis.cefrLevel] || CEFR_COLORS.B1;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* 1. CEFR Level Card */}
      <div className={`p-4 rounded-2xl border ${cefrStyle.border} ${cefrStyle.bg} shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">🏅</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                CEFR Level Detection
              </p>
              <h3 className={`text-lg font-bold ${cefrStyle.text} flex items-center gap-2`}>
                Level {analysis.cefrLevel}
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 font-medium text-slate-700">
                  {analysis.cefrDescription}
                </span>
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className={`text-2xl font-black ${cefrStyle.text}`}>
              {analysis.cefrLevel}
            </span>
          </div>
        </div>

        {/* Level Indicator Bar */}
        <div className="w-full bg-slate-200/70 h-2 rounded-full mt-3 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${cefrStyle.bar}`} />
        </div>
      </div>

      {/* 2. Sentence Analysis: Original with Red Highlighting & Corrected Grammar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        {/* Original Sentence section with RED error highlights */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>🔴</span> Original Sentence
            </span>
            {analysis.isCorrect ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Perfect Grammar!
              </span>
            ) : (
              <span className="text-xs text-rose-600 font-medium">
                Tap red words for corrections
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-base leading-relaxed flex flex-wrap gap-1.5 items-center">
            {analysis.wordTokens.map((token, idx) => {
              if (token.isError) {
                return (
                  <span
                    key={idx}
                    onClick={() => setActiveTooltipIdx(activeTooltipIdx === idx ? null : idx)}
                    className="relative cursor-pointer bg-rose-100 text-rose-700 border border-rose-300 font-semibold px-1.5 py-0.5 rounded-md hover:bg-rose-200 transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="underline decoration-rose-400 decoration-wavy decoration-2">
                      {token.word}
                    </span>
                    {activeTooltipIdx === idx && (
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg z-20 pointer-events-auto">
                        {token.suggestion && (
                          <div className="font-semibold text-emerald-300">
                            Suggested: "{token.suggestion}"
                          </div>
                        )}
                        {token.reason && <div className="text-slate-300 text-[11px] mt-0.5">{token.reason}</div>}
                      </span>
                    )}
                  </span>
                );
              }
              return (
                <span key={idx} className="font-normal text-slate-800">
                  {token.word}
                </span>
              );
            })}
          </div>
        </div>

        {/* Corrected Grammar Section */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>✅</span> Corrected Grammar
            </span>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => speakText(analysis.correctedSentence)}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                  speakingText === analysis.correctedSentence
                    ? 'bg-blue-100 text-blue-700 animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
                title="Listen to pronunciation"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">Listen</span>
              </button>

              <button
                onClick={() => copyToClipboard(analysis.correctedSentence, 'corrected')}
                className="p-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex items-center gap-1"
                title="Copy to clipboard"
              >
                {copiedId === 'corrected' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[11px] text-emerald-600 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-base font-medium leading-relaxed shadow-inner">
            {analysis.correctedSentence}
          </div>
        </div>
      </div>

      {/* 3. 🔍 Explain What Changed & Why */}
      {analysis.explanations && analysis.explanations.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-800 mb-3">
            <span className="text-lg">🔍</span>
            <h3 className="text-base font-bold">Explain what changed & why</h3>
          </div>

          <div className="space-y-3">
            {analysis.explanations.map((exp, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-1.5"
              >
                <div className="flex items-center space-x-2 font-medium">
                  <span className="text-rose-600 line-through bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-xs">
                    {exp.originalPart}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold text-xs">
                    {exp.correctedPart}
                  </span>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">
                  {lang === 'es' ? exp.explanationEs : exp.explanationEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. 💡 Show 3 Alternative Phrasings */}
      {analysis.alternatives && analysis.alternatives.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-slate-800">
              <span className="text-lg">💡</span>
              <h3 className="text-base font-bold">3 Alternative Phrasings</h3>
            </div>
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              Synonym Variants
            </span>
          </div>

          <div className="space-y-3">
            {analysis.alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 hover:border-blue-300 transition-all text-sm space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    {idx + 1}. {alt.label}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => speakText(alt.sentence)}
                      className={`p-1 rounded text-slate-500 hover:text-blue-600 ${
                        speakingText === alt.sentence ? 'text-blue-600 animate-pulse' : ''
                      }`}
                      title="Listen"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(alt.sentence, `alt_${idx}`)}
                      className="p-1 text-slate-500 hover:text-blue-600"
                      title="Copy"
                    >
                      {copiedId === `alt_${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-slate-900 font-medium text-sm leading-snug">
                  "{alt.sentence}"
                </p>

                {alt.synonymsUsed && alt.synonymsUsed.length > 0 && (
                  <div className="flex flex-wrap gap-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-600">Synonyms:</span>
                    {alt.synonymsUsed.map((syn, sIdx) => (
                      <span key={sIdx} className="bg-white border border-slate-200 px-1.5 py-0.2 rounded text-slate-700">
                        {syn}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-slate-500 text-xs italic">
                  {alt.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Overall Learning Tip */}
      {analysis.overallTip && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start space-x-2.5">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-950">Pro Tip: </span>
            {analysis.overallTip}
          </div>
        </div>
      )}

      {/* Action to test another sentence */}
      <div className="pt-2 text-center">
        <button
          onClick={onNewAnalysis}
          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <span>Practice Another Sentence</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
