import React from 'react';
import { Language } from '../types';
import { AVATARS } from '../utils/gameState';
import { soundManager } from '../utils/audio';
import { X, Check } from 'lucide-react';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentAvatarId: string;
  onSelectAvatar: (id: string) => void;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  language,
  currentAvatarId,
  onSelectAvatar
}) => {
  if (!isOpen) return null;

  const isAr = language === 'ar';
  const avatars = AVATARS[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative text-start"
        role="dialog"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            {isAr ? 'شخصيات نسمة حياة' : 'Character Roster'}
          </span>
          <h2 className="text-2xl font-extrabold text-stone-900 mt-1">
            {isAr ? 'اختر شخصيتك في اللعبة 🎮' : 'Choose Your Character 🎮'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {isAr
              ? 'لكل شخصية نمط تفكير فريد ورحلة وعي خاصة بها:'
              : 'Each character has a unique thought pattern and inner journey:'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {avatars.map((av) => {
            const isSelected = av.id === currentAvatarId;
            return (
              <button
                key={av.id}
                onClick={() => {
                  soundManager.playSoftTap();
                  onSelectAvatar(av.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border-2 text-start transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${av.color} text-2xl flex items-center justify-center shadow-xs shrink-0`}>
                  {av.avatarChar}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-stone-900 text-sm">
                      {av.name}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-700" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 block">
                    {av.title}
                  </span>
                  <p className="text-[11px] text-stone-500 leading-snug line-clamp-2">
                    {av.personality}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            {isAr ? 'إغلاق واختيار' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
