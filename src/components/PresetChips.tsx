import React from 'react';
import { PRESET_SENTENCES } from '../data/presets';

interface PresetChipsProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export const PresetChips: React.FC<PresetChipsProps> = ({ onSelect, disabled }) => {
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        Try an example sentence:
      </p>
      <div className="flex flex-wrap gap-2">
        {PRESET_SENTENCES.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(preset.text)}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-all text-left flex items-center gap-1.5 font-medium disabled:opacity-50"
          >
            <span>"{preset.text}"</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-600 font-bold">
              {preset.level}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
