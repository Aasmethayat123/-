import React, { useState } from 'react';
import { Language, PlayerStats } from '../types';
import { AVATARS } from '../utils/gameState';
import { getCurrentAwarenessLevel } from '../data/gamificationData';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Heart, 
  Send, 
  Bookmark, 
  ShieldCheck, 
  Users, 
  Zap, 
  ArrowRight,
  Award,
  Crown
} from 'lucide-react';

interface GlobalImpactLeaderboardProps {
  language: Language;
  playerStats: PlayerStats;
  onBackToMap?: () => void;
}

interface LeaderboardUser {
  id: string;
  name: string;
  avatarChar: string;
  avatarColor: string;
  title: string;
  xp: number;
  streak: number;
  mantra: string;
  cheersReceived: number;
  country: string;
}

const INITIAL_TOP_USERS: LeaderboardUser[] = [
  {
    id: 'u1',
    name: 'مريم الزهراني',
    avatarChar: '🕊️',
    avatarColor: 'from-emerald-400 to-teal-600',
    title: 'الحكيمة الساكنة',
    xp: 1420,
    streak: 28,
    mantra: '«الهموم تأكلك حين تحاول أن تكون حارساً للكون؛ كن حارساً لسعيك فقط وسلّم الباقي»',
    cheersReceived: 84,
    country: '🇸🇦'
  },
  {
    id: 'u2',
    name: 'يوسف العبدالله',
    avatarChar: '⚡',
    avatarColor: 'from-amber-400 to-orange-500',
    title: 'مستوعب العواصف',
    xp: 1280,
    streak: 21,
    mantra: '«الجبل لا يُنقل دفعة واحدة، بل حجراً بعد حجر. ابدأ بخمس دقائق فقط»',
    cheersReceived: 62,
    country: '🇰🇼'
  },
  {
    id: 'u3',
    name: 'نور الهدى',
    avatarChar: '🌸',
    avatarColor: 'from-pink-400 to-rose-500',
    title: 'حارسة الحدود',
    xp: 1150,
    streak: 18,
    mantra: '«حدودك ليست أنانية، بل صيانة لبابك الداخلي حتى تفيض بالحب دون استنزاف»',
    cheersReceived: 51,
    country: '🇪🇬'
  },
  {
    id: 'u4',
    name: 'سالم المهيري',
    avatarChar: '🌊',
    avatarColor: 'from-sky-400 to-blue-600',
    title: 'فاحص الأفكار',
    xp: 990,
    streak: 14,
    mantra: '«أفكارك ليست أوامر عسكرية ولا حقائق مطلقة؛ هي مجرد اقتراحات عابرة في الرأس»',
    cheersReceived: 39,
    country: '🇦🇪'
  },
  {
    id: 'u5',
    name: 'ريم القحطاني',
    avatarChar: '🌿',
    avatarColor: 'from-teal-400 to-emerald-600',
    title: 'حارسة الحدود',
    xp: 880,
    streak: 12,
    mantra: '«لا أحد يزهر بالقسوة؛ كلمي نفسك كما تكلمين أحب الناس إليكِ»',
    cheersReceived: 33,
    country: '🇸🇦'
  },
  {
    id: 'u6',
    name: 'أحمد شريف',
    avatarChar: '☀️',
    avatarColor: 'from-yellow-400 to-amber-600',
    title: 'المستيقظ للأنفاس',
    xp: 760,
    streak: 10,
    mantra: '«الزفير الطويل هو كابح الطوارئ الطبيعي للجهاز العصبي»',
    cheersReceived: 27,
    country: '🇪🇬'
  },
  {
    id: 'u7',
    name: 'شهد التميمي',
    avatarChar: '🕯️',
    avatarColor: 'from-violet-400 to-purple-600',
    title: 'المستيقظة للأنفاس',
    xp: 690,
    streak: 9,
    mantra: '«الظلام لا يملك قوة حقيقية، هو مجرد غياب للنور؛ ونورك في صدرك»',
    cheersReceived: 24,
    country: '🇯🇴'
  },
  {
    id: 'u8',
    name: 'طارق بن خالد',
    avatarChar: '🦁',
    avatarColor: 'from-rose-400 to-red-600',
    title: 'فاحص الأفكار',
    xp: 610,
    streak: 7,
    mantra: '«الشجاعة ليست غياب الخوف، بل التحرك برفق مع وجوده»',
    cheersReceived: 19,
    country: '🇲🇦'
  },
  {
    id: 'u9',
    name: 'دلال الصباح',
    avatarChar: '🪞',
    avatarColor: 'from-indigo-400 to-blue-600',
    title: 'المستيقظة للأنفاس',
    xp: 540,
    streak: 6,
    mantra: '«قريب بما يكفي للدفء، وبعيد بما يكفي لحفظ السلام والكرامة»',
    cheersReceived: 16,
    country: '🇰🇼'
  },
  {
    id: 'u10',
    name: 'عمر الفاروق',
    avatarChar: '⚓',
    avatarColor: 'from-cyan-400 to-teal-600',
    title: 'المستيقظ للأنفاس',
    xp: 490,
    streak: 5,
    mantra: '«يومك يسع لشيء واحد في اللحظة؛ لا تحمل الغد في قلب اليوم»',
    cheersReceived: 14,
    country: '🇶🇦'
  }
];

export const GlobalImpactLeaderboard: React.FC<GlobalImpactLeaderboardProps> = ({
  language,
  playerStats,
  onBackToMap
}) => {
  const isAr = language === 'ar';
  
  const [users, setUsers] = useState<LeaderboardUser[]>(INITIAL_TOP_USERS);
  const [cheeredUserIds, setCheeredUserIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'xp' | 'streak' | 'mantras'>('xp');

  const currentAvatar = AVATARS[language].find(a => a.id === playerStats.avatarId) || AVATARS[language][0];
  const playerAwareness = getCurrentAwarenessLevel(playerStats.xp, language);

  // Merge the player into the list to show their authentic ranking!
  const currentPlayerUser: LeaderboardUser = {
    id: 'current_player',
    name: isAr ? `${currentAvatar.name} (أنتِ 🌿)` : `${currentAvatar.name} (You 🌿)`,
    avatarChar: currentAvatar.avatarChar,
    avatarColor: currentAvatar.color,
    title: playerAwareness.title,
    xp: playerStats.xp,
    streak: playerStats.streak,
    mantra: isAr ? '«أنا في مساري الخاص، أنمو برفق ووعي كل يوم»' : '«Growing gently at my own pace every single day»',
    cheersReceived: 42,
    country: '📍'
  };

  // Sort based on active tab
  const sortedUsers = [...users];
  if (!sortedUsers.some(u => u.id === 'current_player')) {
    sortedUsers.push(currentPlayerUser);
  }

  if (activeTab === 'streak') {
    sortedUsers.sort((a, b) => b.streak - a.streak);
  } else {
    sortedUsers.sort((a, b) => b.xp - a.xp);
  }

  // Find player's rank
  const playerRank = sortedUsers.findIndex(u => u.id === 'current_player') + 1;

  // Take top 10
  const top10 = sortedUsers.slice(0, 10);

  const handleSendCheer = (userId: string) => {
    if (cheeredUserIds.includes(userId)) return;

    soundManager.playHarmonicAffirmation();
    triggerConfetti(0.5, 0.3);

    setCheeredUserIds(prev => [...prev, userId]);
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, cheersReceived: u.cheersReceived + 1 };
      }
      return u;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              {isAr ? '← كل الألعاب' : '← All Games'}
            </button>
          )}
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            {isAr ? 'لوحة التأثير والسكينة العالمية 🏆🌍' : 'Global Impact Leaderboard 🏆🌍'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
          <Trophy className="w-4 h-4 fill-amber-400" />
          <span>{isAr ? `ترتيبك الحالي: #${playerRank}` : `Your Rank: #${playerRank}`}</span>
        </div>
      </div>

      {/* Hero Supportive Ethos Banner */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block">
          {isAr ? 'منافسة شريفة قائمة على الدعم والسكينة المشتركة' : 'Supportive Competitive Circles'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          {isAr ? 'صُنّاع الأثر والوعي اليومي 🌿' : 'Daily Impact & Awareness Circle 🌿'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {isAr
            ? 'هذه اللوحة ليست للمقارنة السلبية أو الاستعراض؛ بل هي دائرة ضوء تجمع من يختارون التنفس الواعي وتهدئة أنفسهم كل يوم.'
            : 'Not toxic comparison, but a mutual circle of practitioners committing to daily somatic and cognitive calm.'}
        </p>
      </div>

      {/* Current Player Status Bar */}
      <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border-2 border-amber-400/80 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-start w-full sm:w-auto">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentAvatar.color} text-white flex items-center justify-center text-2xl shadow-inner border border-amber-300`}>
            {currentAvatar.avatarChar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-stone-900">
                {currentAvatar.name} ({isAr ? 'مكانكِ في اللوحة' : 'Your Position'})
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-stone-950">
                #{playerRank}
              </span>
            </div>
            <p className="text-xs text-stone-600 font-medium">
              {playerAwareness.title} · {playerStats.xp} XP · 🔥 {playerStats.streak} {isAr ? 'أيام تتابع' : 'days streak'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-white/80 px-3.5 py-1.5 rounded-2xl border border-emerald-200 shrink-0">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{isAr ? 'أنتِ جزء من دائرة السكينة المشتركة 🌿' : 'You are part of the calm circle 🌿'}</span>
        </div>
      </div>

      {/* Sorting Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-stone-200/60 rounded-2xl text-xs font-bold max-w-md mx-auto">
        <button
          onClick={() => {
            soundManager.playSoftTap();
            setActiveTab('xp');
          }}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'xp' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {isAr ? 'أعلى نقاط الوعي (XP) ⚡' : 'Top XP ⚡'}
        </button>
        <button
          onClick={() => {
            soundManager.playSoftTap();
            setActiveTab('streak');
          }}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'streak' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {isAr ? 'أطول تتابع يومي 🔥' : 'Longest Streaks 🔥'}
        </button>
      </div>

      {/* Top 10 Leaderboard List */}
      <div className="space-y-3">
        {top10.map((user, idx) => {
          const rank = idx + 1;
          const isPlayer = user.id === 'current_player';
          const isCheered = cheeredUserIds.includes(user.id);

          return (
            <div
              key={user.id}
              className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isPlayer
                  ? 'border-amber-400 bg-amber-50/70 shadow-md ring-2 ring-amber-300/40'
                  : rank === 1
                  ? 'border-amber-300 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent shadow-xs'
                  : 'border-stone-200 bg-white hover:border-stone-300 shadow-xs'
              }`}
            >
              {/* Rank, Avatar & Info */}
              <div className="flex items-center gap-3.5 text-start">
                {/* Rank Badge */}
                <div className="w-8 flex items-center justify-center font-extrabold text-sm font-mono shrink-0">
                  {rank === 1 ? (
                    <span className="text-2xl" title="المركز الأول">🥇</span>
                  ) : rank === 2 ? (
                    <span className="text-2xl" title="المركز الثاني">🥈</span>
                  ) : rank === 3 ? (
                    <span className="text-2xl" title="المركز الثالث">🥉</span>
                  ) : (
                    <span className="text-stone-400 font-bold">#{rank}</span>
                  )}
                </div>

                {/* Avatar Icon */}
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${user.avatarColor} text-white flex items-center justify-center text-xl shadow-xs shrink-0`}>
                  {user.avatarChar}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-stone-900">
                      {user.name}
                    </h3>
                    <span className="text-xs">{user.country}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium block">
                    {user.title}
                  </span>
                </div>
              </div>

              {/* Mantra Quote Preview */}
              <div className="hidden lg:block max-w-xs text-xs text-stone-600 font-serif italic line-clamp-2 text-start">
                {user.mantra}
              </div>

              {/* Stats & Interactive Cheer Action */}
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <div className="text-start sm:text-end text-xs">
                  <div className="flex items-center gap-2 font-mono font-bold text-stone-900">
                    <span className="text-amber-600 flex items-center gap-0.5">
                      <Zap className="w-3.5 h-3.5 fill-amber-500" />
                      {user.xp} XP
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-orange-600 flex items-center gap-0.5">
                      <Flame className="w-3.5 h-3.5 fill-orange-500" />
                      {user.streak}d
                    </span>
                  </div>
                </div>

                {/* Interactive Cheer Button */}
                {!isPlayer ? (
                  <button
                    onClick={() => handleSendCheer(user.id)}
                    disabled={isCheered}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs ${
                      isCheered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200'
                    }`}
                    title={isAr ? 'أرسلي نسمة سلام وتشجيع' : 'Send Peaceful Cheer'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isCheered ? 'text-emerald-600 fill-emerald-600' : 'text-stone-400'}`} />
                    <span>{user.cheersReceived}</span>
                    <span className="hidden sm:inline">{isCheered ? (isAr ? 'أرسلتِ ✓' : 'Sent ✓') : (isAr ? 'نسمة سلام' : 'Cheer')}</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-xl">
                    {isAr ? 'أنتِ هنا 🌿' : 'You 🌿'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
