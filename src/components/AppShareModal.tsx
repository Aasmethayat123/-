import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  CheckCircle2,
  X,
  MessageCircle,
  Send,
  Mail,
  Link2,
  Compass,
} from 'lucide-react';
import { GameMode, Language } from '../types';
import {
  buildShareInvitation,
  copyTextToClipboard,
  getModeDisplayTitle,
} from '../utils/appLifecycle';
import { soundManager } from '../utils/audio';

interface AppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: GameMode;
  language: Language;
}

interface ShareToastState {
  message: string;
  variant: 'success' | 'info';
}

export const AppShareModal: React.FC<AppShareModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  language,
}) => {
  const isAr = language === 'ar';
  const hasSpecificMode = currentMode !== 'map';
  const [scope, setScope] = useState<'app' | 'current'>(hasSpecificMode ? 'current' : 'app');
  const [copiedType, setCopiedType] = useState<'link' | 'full' | null>(null);
  const [toast, setToast] = useState<ShareToastState | null>(null);

  const copiedTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const triggerToast = useCallback((message: string, variant: 'success' | 'info' = 'success') => {
    setToast({ message, variant });
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3400);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setScope(currentMode !== 'map' ? 'current' : 'app');
      setCopiedType(null);
    }
  }, [isOpen, currentMode]);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current !== null) {
        window.clearTimeout(copiedTimerRef.current);
      }
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const invitation = buildShareInvitation(currentMode, scope, isAr);
  const fullMessage = `${invitation.text}\n${invitation.url}`;
  const currentModeTitle = getModeDisplayTitle(currentMode, isAr);

  const markCopied = (type: 'link' | 'full') => {
    setCopiedType(type);
    if (copiedTimerRef.current !== null) {
      window.clearTimeout(copiedTimerRef.current);
    }
    copiedTimerRef.current = window.setTimeout(() => {
      setCopiedType((prev) => (prev === type ? null : prev));
    }, 2800);
  };

  const copyUrlToClipboard = async (urlToCopy: string): Promise<boolean> => {
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      try {
        await navigator.clipboard.writeText(urlToCopy);
        return true;
      } catch {
        // Fall back to document selection copy if Clipboard API is restricted by permissions policy
      }
    }
    return copyTextToClipboard(urlToCopy);
  };

  const handleWebShare = async () => {
    soundManager.playSoftTap();

    const shareData: ShareData = {
      title: invitation.title,
      text: invitation.text,
      url: invitation.url,
    };

    const canInvokeWebShare =
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function' &&
      (typeof navigator.canShare !== 'function' || navigator.canShare(shareData));

    if (canInvokeWebShare) {
      try {
        await navigator.share(shareData);
        triggerToast(
          isAr ? 'تمت مشاركة رابط التطبيق بنجاح' : 'App link shared successfully',
          'success'
        );
        onClose();
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }

    // Fallback directly to instant clipboard copy
    const copied = await copyUrlToClipboard(invitation.url);
    markCopied('link');
    triggerToast(
      isAr
        ? 'تم نسخ رابط التطبيق إلى الحافظة بنجاح ✓'
        : 'App URL copied to clipboard ✓',
      'success'
    );
  };

  const handleCopy = async (type: 'link' | 'full') => {
    soundManager.playSoftTap();
    const ok =
      type === 'link'
        ? await copyUrlToClipboard(invitation.url)
        : await copyTextToClipboard(fullMessage);

    if (ok) {
      markCopied(type);
      triggerToast(
        type === 'link'
          ? isAr
            ? 'تم نسخ رابط التطبيق إلى الحافظة بنجاح'
            : 'App URL copied to clipboard'
          : isAr
          ? 'تم نسخ رسالة الدعوة والرابط إلى الحافظة'
          : 'Invitation and URL copied to clipboard',
        'success'
      );
    }
  };

  const encodedUrl = encodeURIComponent(invitation.url);
  const encodedText = encodeURIComponent(invitation.text);
  const encodedFull = encodeURIComponent(fullMessage);

  const socialChannels = [
    {
      id: 'whatsapp',
      label: isAr ? 'واتساب' : 'WhatsApp',
      href: `https://wa.me/?text=${encodedFull}`,
      icon: MessageCircle,
      className:
        'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/70',
    },
    {
      id: 'telegram',
      label: isAr ? 'تيليجرام' : 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      icon: Send,
      className:
        'bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 dark:hover:bg-sky-900/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/70',
    },
    {
      id: 'facebook',
      label: isAr ? 'فيسبوك' : 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Share2,
      className:
        'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/70',
    },
    {
      id: 'x',
      label: isAr ? 'منصة X' : 'X / Post',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      icon: Compass,
      className:
        'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700',
    },
    {
      id: 'sms',
      label: isAr ? 'رسالة SMS' : 'SMS',
      href: `sms:?&body=${encodedFull}`,
      icon: MessageCircle,
      className:
        'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800/70',
    },
    {
      id: 'email',
      label: isAr ? 'البريد' : 'Email',
      href: `mailto:?subject=${encodeURIComponent(invitation.title)}&body=${encodedFull}`,
      icon: Mail,
      className:
        'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700',
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="app-share-modal-title"
        >
          <div
            className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white dark:bg-stone-900 border-t sm:border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-2xl space-y-4 text-start max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile grab handle */}
            <div className="w-10 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto -mt-1 mb-1 sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3
                    id="app-share-modal-title"
                    className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-serif truncate"
                  >
                    {isAr ? 'مشاركة التطبيق مع من تحب' : 'Share Nesma Hayat'}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                    {isAr
                      ? 'انشر مساحة هادئة للتوازن النفسي والألعاب التفاعلية'
                      : 'Share a calm interactive space for mental clarity'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label={isAr ? 'إغلاق نافذة المشاركة' : 'Close share dialog'}
                className="min-w-[44px] min-h-[44px] -me-2 flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Share Scope Selector (if inside a specific game/mode) */}
            {hasSpecificMode && (
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800/80">
                <button
                  type="button"
                  onClick={() => setScope('current')}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    scope === 'current'
                      ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{isAr ? 'التجربة الحالية' : 'Current View'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScope('app')}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    scope === 'app'
                      ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{isAr ? 'التطبيق بالكامل' : 'Entire App'}</span>
                </button>
              </div>
            )}

            {/* Invitation Preview */}
            <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 p-3.5 space-y-2.5">
              {scope === 'current' && hasSpecificMode && (
                <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  {isAr
                    ? `الرابط يفتح مباشرة: ${currentModeTitle}`
                    : `Opens directly: ${currentModeTitle}`}
                </div>
              )}
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {invitation.text}
              </p>
              <div
                dir="ltr"
                className="pt-2 border-t border-stone-200/70 dark:border-stone-700/70 flex items-center gap-2 text-[11px] font-mono text-stone-600 dark:text-stone-300"
              >
                <Link2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate select-all">{invitation.url}</span>
              </div>
            </div>

            {/* Primary Web Share Action (with automatic URL clipboard fallback) & Secondary Copy Controls */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleWebShare}
                className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                <span>
                  {isAr ? 'مشاركة الرابط والوصف الآن' : 'Share Link & Description'}
                </span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy('link')}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copiedType === 'link' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{isAr ? 'تم نسخ الرابط ✓' : 'URL Copied ✓'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 shrink-0" />
                      <span>{isAr ? 'نسخ الرابط فقط' : 'Copy URL'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy('full')}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copiedType === 'full' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{isAr ? 'تم نسخ الدعوة ✓' : 'Invitation Copied ✓'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 shrink-0" />
                      <span>{isAr ? 'نسخ مع الوصف' : 'Copy with Description'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Social Channels */}
            <div className="pt-1 space-y-2">
              <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400">
                {isAr ? 'أو أرسل مباشرة عبر:' : 'Or send directly via:'}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {socialChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <a
                      key={channel.id}
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundManager.playSoftTap()}
                      className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${channel.className}`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{channel.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-stone-900 dark:bg-stone-800 text-white px-4 py-3 shadow-xl border border-stone-700/80 flex items-center justify-between gap-3 animate-fade-in"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2
              className={`w-4 h-4 shrink-0 ${
                toast.variant === 'success' ? 'text-emerald-400' : 'text-amber-400'
              }`}
            />
            <span className="text-xs font-bold leading-snug truncate">{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label={isAr ? 'إغلاق الإشعار' : 'Dismiss notification'}
            className="p-1 text-stone-400 hover:text-white rounded-lg cursor-pointer shrink-0 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};


