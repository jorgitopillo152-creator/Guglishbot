import React from 'react';
import { Sparkles, Award, CircleAlert, CheckSquare, Search, Lightbulb } from 'lucide-react';

export const HowItWorksCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center space-x-2.5 text-blue-600 mb-3">
        <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
        <h2 className="text-base font-bold text-slate-800">How it works</h2>
      </div>

      <p className="text-slate-600 text-sm mb-4 leading-relaxed">
        Type <span className="font-semibold text-blue-600 underline decoration-blue-300 decoration-2">one English sentence</span> below and I'll help you:
      </p>

      <ul className="space-y-3 text-sm text-slate-700">
        <li className="flex items-start space-x-3">
          <span className="text-base leading-none mt-0.5">🏅</span>
          <span className="font-medium">
            Detect your sentence's <strong className="text-slate-900 font-semibold">CEFR level (A1–C2)</strong>
          </span>
        </li>

        <li className="flex items-start space-x-3">
          <span className="text-base leading-none mt-0.5">🔴</span>
          <span className="font-medium">
            <strong className="text-slate-900 font-semibold">Highlight incorrect words in red</strong>
          </span>
        </li>

        <li className="flex items-start space-x-3">
          <span className="text-base leading-none mt-0.5">✅</span>
          <span className="font-medium">
            <strong className="text-slate-900 font-semibold">Correct your grammar</strong>
          </span>
        </li>

        <li className="flex items-start space-x-3">
          <span className="text-base leading-none mt-0.5">🔍</span>
          <span className="font-medium">
            <strong className="text-slate-900 font-semibold">Explain what changed & why</strong>
          </span>
        </li>

        <li className="flex items-start space-x-3">
          <span className="text-base leading-none mt-0.5">💡</span>
          <span className="font-medium">
            <strong className="text-slate-900 font-semibold">Show 3 alternative phrasings</strong>
          </span>
        </li>
      </ul>
    </div>
  );
};
