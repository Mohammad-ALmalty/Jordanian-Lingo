
import React, { useState } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { Phrase } from '../../types';

interface AddPhraseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (phrase: Omit<Phrase, 'id'>) => void;
  currentLevel: number;
}

export const AddPhraseModal: React.FC<AddPhraseModalProps> = ({ isOpen, onClose, onSave, currentLevel }) => {
  const [formData, setFormData] = useState({
    english: '',
    arabic: '',
    transliteration: '',
    category: 'Social' as Phrase['category']
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.english || !formData.arabic) return;
    onSave({ ...formData, level: currentLevel });
    setFormData({ english: '', arabic: '', transliteration: '', category: 'Social' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800">
        <div className="p-8 border-b border-gray-50 dark:border-zinc-800 flex justify-between items-center">
          <h3 className="text-2xl font-black dark:text-white">Add New Phrase</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-6 h-6 dark:text-white" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400">English Meaning</label>
            <input 
              required
              value={formData.english}
              onChange={e => setFormData({...formData, english: e.target.value})}
              className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 focus:ring-2 ring-[#e2725b] outline-none dark:text-white"
              placeholder="e.g. How are you?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400">Arabic (Ammiya)</label>
            <input 
              required
              dir="rtl"
              value={formData.arabic}
              onChange={e => setFormData({...formData, arabic: e.target.value})}
              className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 focus:ring-2 ring-[#e2725b] outline-none text-2xl font-black arabic-font dark:text-white"
              placeholder="كيف حالك؟"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400">Pronunciation (Transliteration)</label>
            <input 
              value={formData.transliteration}
              onChange={e => setFormData({...formData, transliteration: e.target.value})}
              className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 focus:ring-2 ring-[#e2725b] outline-none dark:text-white"
              placeholder="e.g. Keif halak?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as any})}
                className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 outline-none dark:text-white appearance-none"
              >
                {['Greetings', 'Food', 'Social', 'Market', 'Slang'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-[#e2725b] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#c65e4a] transition-colors shadow-lg shadow-orange-500/20">
                <Save className="w-5 h-5" /> Save Phrase
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
