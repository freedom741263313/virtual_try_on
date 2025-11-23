import React, { useState } from 'react';
import { StyleOption } from '../types';
import { STYLES } from '../constants';
import { Sparkles, Send } from 'lucide-react';

interface StyleSelectorProps {
  onSelect: (style: StyleOption) => void;
  onCustomSelect: (prompt: string) => void;
  selectedId: string | null;
  disabled: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ onSelect, onCustomSelect, selectedId, disabled }) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim() && !disabled) {
      onCustomSelect(customPrompt.trim());
    }
  };

  return (
    <div className="w-full flex-1 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-6">
      
      {/* Custom Input Section */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/10 shadow-inner">
        <h3 className="text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-purple-400" />
          Custom Style
        </h3>
        <form onSubmit={handleCustomSubmit} className="flex flex-col gap-2">
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Describe outfit (e.g., 'Green velvet suit with a gold tie')..."
            disabled={disabled}
            className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none h-20"
          />
          <button
            type="submit"
            disabled={disabled || !customPrompt.trim()}
            className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 border border-white/5"
          >
            <Send className="w-3 h-3" />
            Generate Custom Look
          </button>
        </form>
      </div>

      {/* Preset Section */}
      <div>
        <h3 className="text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider sticky top-0 bg-slate-900 py-2 z-10">
          Preset Styles
        </h3>
        <div className="grid grid-cols-3 gap-2 pb-4">
          {STYLES.map((style) => {
            const isSelected = selectedId === style.id;
            return (
              <button
                key={style.id}
                onClick={() => onSelect(style)}
                disabled={disabled}
                className={`
                  group relative flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 aspect-square
                  ${isSelected 
                    ? 'bg-white/10 ring-2 ring-purple-500 shadow-lg shadow-purple-500/20' 
                    : 'bg-white/5 hover:bg-white/10 hover:scale-105 ring-1 ring-white/10'}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-lg mb-2
                  bg-gradient-to-br ${style.color} shadow-lg
                `}>
                  {style.icon}
                </div>
                <span className={`text-[10px] text-center font-medium leading-tight ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                  {style.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};