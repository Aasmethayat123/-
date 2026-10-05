import { Scenario } from '../types';

export const SCENARIOS: Record<'en' | 'ar', Scenario[]> = {
  en: [
    {
      id: 'unread-message',
      title: 'The Unread Message',
      category: 'social',
      icon: 'MessageSquare',
      context: 'Everyday communication',
      situation: 'You sent a message to someone, and they haven\'t replied all day.',
      thoughtOptions: [
        {
          id: 't1',
          text: '“They must be upset with me.”',
          type: 'self-blame',
          insight: 'Personalization: Assuming silence is a judgment or punishment aimed at you without proof.'
        },
        {
          id: 't2',
          text: '“Maybe they\'re busy or overwhelmed today.”',
          type: 'open',
          insight: 'Curiosity & Allowance: Remembering that other people have their own complicated days.'
        },
        {
          id: 't3',
          text: '“I always do something wrong.”',
          type: 'catastrophic',
          insight: 'Overgeneralization: Linking a single delayed reply to a permanent perceived flaw.'
        },
        {
          id: 't4',
          text: '“I don\'t know. Maybe I should ask instead of assuming.”',
          type: 'rational',
          insight: 'Reality-testing: Recognizing the gap between what you actually know and what your mind invents.'
        }
      ],
      emotionOptions: [
        { id: 'e1', name: 'Anxiety', intensity: 'high', category: 'anxiety', sensationDescription: 'Tightness in chest, checking phone repeatedly' },
        { id: 'e2', name: 'Sadness', intensity: 'moderate', category: 'sadness', sensationDescription: 'Heavy feeling in shoulders, feeling disconnected' },
        { id: 'e3', name: 'Anger', intensity: 'high', category: 'anger', sensationDescription: 'Heat in the face, feeling dismissed or unimportant' },
        { id: 'e4', name: 'Frustration', intensity: 'moderate', category: 'frustration', sensationDescription: 'Restless fidgeting, impatience' },
        { id: 'e5', name: 'Fear', intensity: 'high', category: 'fear', sensationDescription: 'Nervous stomach knot, fear of rejection' },
        { id: 'e6', name: 'I don\'t know / Numb', intensity: 'mild', category: 'unsure', sensationDescription: 'A foggy, vague discomfort with no clear name' }
      ],
      actionOptions: [
        {
          id: 'a1',
          action: 'Withdraw and go cold',
          category: 'withdraw',
          shortTermResult: 'Feels protective; avoids immediate vulnerability.',
          longTermResult: 'Builds silent walls, increases loneliness, and prevents genuine connection.'
        },
        {
          id: 'a2',
          action: 'Confront them defensively (“Why are you ignoring me?”)',
          category: 'confront',
          shortTermResult: 'Discharges burning anger quickly.',
          longTermResult: 'May put the other person on the defensive if they were genuinely in an emergency or crisis.'
        },
        {
          id: 'a3',
          action: 'Keep re-reading the chat and overanalyzing every word',
          category: 'ruminate',
          shortTermResult: 'Gives an illusion of control through rumination.',
          longTermResult: 'Drains energy, heightens anxiety, and feeds catastrophic spirals.'
        },
        {
          id: 'a4',
          action: 'Gently ask and clarify later with warmth',
          category: 'clarify',
          shortTermResult: 'Requires tolerating temporary uncertainty.',
          longTermResult: 'Opens healthy communication, tests reality, and deepens trust.'
        },
        {
          id: 'a5',
          action: 'Talk to a trusted friend or write it down to ground yourself',
          category: 'support',
          shortTermResult: 'Provides a safe sounding board to release pressure.',
          longTermResult: 'Helps gain perspective before acting impulsively.'
        },
        {
          id: 'a6',
          action: 'Put the phone aside and focus on your own afternoon',
          category: 'pause',
          shortTermResult: 'May feel difficult at first with an urge to check.',
          longTermResult: 'Builds emotional sovereignty; your worth does not depend on someone’s notification.'
        }
      ],
      healthyAlternatives: {
        thought: '“Their silence belongs to their schedule right now, not my worth. I will check in tomorrow without pressure.”',
        emotion: 'Calm curiosity & steady self-compassion',
        action: 'Put the phone face down, take 3 mindful breaths, and continue your day with clarity.',
        explanation: 'When we separate the fact (a message was sent; no reply yet) from the story (they hate me), the emotional charge drops dramatically.'
      }
    },
    {
      id: 'meeting-remark',
      title: 'The Meeting Critique',
      category: 'work',
      icon: 'Briefcase',
      context: 'Professional environment',
      situation: 'During a team meeting, a colleague says: “This proposal is missing key numbers and won’t work as is.”',
      thoughtOptions: [
        {
          id: 'mr_t1',
          text: '“They want to humiliate me in front of the manager.”',
          type: 'catastrophic',
          insight: 'Hostile Attribution: Assuming malicious intent rather than a direct professional critique.'
        },
        {
          id: 'mr_t2',
          text: '“I’m terrible at this job and everyone finally knows it.”',
          type: 'self-blame',
          insight: 'Imposter Syndrome / Catastrophizing: Turning one feedback point into a verdict on your competence.'
        },
        {
          id: 'mr_t3',
          text: '“Their tone was sharp, but the data point is worth examining.”',
          type: 'rational',
          insight: 'Balanced Differentiation: Separating delivery tone from valid constructive content.'
        },
        {
          id: 'mr_t4',
          text: '“I need to understand what specific numbers they feel are missing.”',
          type: 'open',
          insight: 'Curious Inquiry: Shifting from defensive survival mode to collaborative problem-solving.'
        }
      ],
      emotionOptions: [
        { id: 'mr_e1', name: 'Humiliation & Shame', intensity: 'high', category: 'sadness', sensationDescription: 'Heat rising to ears, sinking stomach' },
        { id: 'mr_e2', name: 'Defensive Anger', intensity: 'high', category: 'anger', sensationDescription: 'Clenched jaw, rapid breathing' },
        { id: 'mr_e3', name: 'Anxiety', intensity: 'moderate', category: 'anxiety', sensationDescription: 'Shaky hands, racing pulse' },
        { id: 'mr_e4', name: 'Composed Curiosity', intensity: 'mild', category: 'curiosity', sensationDescription: 'Steady breathing, alert and observant' }
      ],
      actionOptions: [
        {
          id: 'mr_a1',
          action: 'Shut down and remain silent for the rest of the meeting',
          category: 'withdraw',
          shortTermResult: 'Avoids further exposure to critique.',
          longTermResult: 'Leaves your ideas unrepresented and leaves you stewing in resentment.'
        },
        {
          id: 'mr_a2',
          action: 'Snap back defensively attacking their past project',
          category: 'confront',
          shortTermResult: 'Immediate discharge of wounded pride.',
          longTermResult: 'Damages professional standing and escalates workplace tension.'
        },
        {
          id: 'mr_a3',
          action: 'Ask a clarifying question: “Which specific metrics would make this complete?”',
          category: 'clarify',
          shortTermResult: 'Takes courage to lean in calmly.',
          longTermResult: 'Demonstrates executive composure, turns critique into actionable improvement.'
        }
      ],
      healthyAlternatives: {
        thought: '“Feedback on a slide deck is feedback on paper, not a verdict on my human worth.”',
        emotion: 'Grounded focus and professional resilience',
        action: 'Take a slow exhale, thank them for pointing out the data gap, and note down the next action steps.',
        explanation: 'Work critique hurts most when we equate our work with our identity. Keeping them separate preserves calm authority.'
      }
    },
    {
      id: 'gathering-missed',
      title: 'The Gathering Without You',
      category: 'relationship',
      icon: 'Users',
      context: 'Friendship & belonging',
      situation: 'You open social media and see a photo of mutual friends dining together; you were not invited.',
      thoughtOptions: [
        {
          id: 'gm_t1',
          text: '“They have an inner circle and I’m just an outsider they tolerate.”',
          type: 'self-blame',
          insight: 'Core wound of exclusion: We fill information vacuums with our deepest insecurities.'
        },
        {
          id: 'gm_t2',
          text: '“I don’t care at all. I don’t need any of them.”',
          type: 'avoidant',
          insight: 'Protective Detachment: Pretending not to care to numb genuine sadness.'
        },
        {
          id: 'gm_t3',
          text: '“This hurts, but it might have been spontaneous or planned for another reason.”',
          type: 'rational',
          insight: 'Empathetic Reality: Acknowledging genuine hurt without jumping to total exclusion.'
        },
        {
          id: 'gm_t4',
          text: '“I feel left out. When I’m calm, I can reach out to one of them to reconnect.”',
          type: 'open',
          insight: 'Proactive Agency: Choosing connection over bitter isolation.'
        }
      ],
      emotionOptions: [
        { id: 'gm_e1', name: 'Painful Loneliness', intensity: 'high', category: 'sadness', sensationDescription: 'Heavy aching hollow feeling in the chest' },
        { id: 'gm_e2', name: 'Jealousy & Resentment', intensity: 'moderate', category: 'anger', sensationDescription: 'Bitter taste, burning tension' },
        { id: 'gm_e3', name: 'Embarrassment', intensity: 'moderate', category: 'fear', sensationDescription: 'Feeling small, wondering who noticed' },
        { id: 'gm_e4', name: 'Gentle Self-Empathy', intensity: 'mild', category: 'calm', sensationDescription: 'Placing a hand on heart, breathing through the pang' }
      ],
      actionOptions: [
        {
          id: 'gm_a1',
          action: 'Post a passive-aggressive quote on your story',
          category: 'confront',
          shortTermResult: 'Temporary release of stinging frustration.',
          longTermResult: 'Generates drama, alienates friends, and leaves you feeling regretful.'
        },
        {
          id: 'gm_a2',
          action: 'Mute them and vow never to speak to them again',
          category: 'withdraw',
          shortTermResult: 'A sense of righteous pride.',
          longTermResult: 'Erodes relationships over misunderstandings without giving friendship a voice.'
        },
        {
          id: 'gm_a3',
          action: 'Acknowledge the pang, do something kind for yourself, and initiate plans next week',
          category: 'support',
          shortTermResult: 'Honors the sting without punishing anyone.',
          longTermResult: 'Maintains healthy relationships while fostering self-respect.'
        }
      ],
      healthyAlternatives: {
        thought: '“It’s natural to feel a sting when seeing friends gather. But one gathering does not define my friendships.”',
        emotion: 'Tender self-compassion replacing isolation',
        action: 'Treat yourself with warmth, step away from the feed, and reach out to someone you cherish.',
        explanation: 'Belonging starts with welcoming your own feelings without letting social media dictate your self-image.'
      }
    },
    {
      id: 'closed-door',
      title: 'The Silent Door',
      category: 'family',
      icon: 'Home',
      context: 'Home & loved ones',
      situation: 'Your partner or family member arrives home, gives a cold one-word greeting, and closes the bedroom door.',
      thoughtOptions: [
        {
          id: 'cd_t1',
          text: '“What did I do wrong this time? They are always punishing me.”',
          type: 'self-blame',
          insight: 'Taking on guilt: Assuming someone else’s foul mood is an indictment of you.'
        },
        {
          id: 'cd_t2',
          text: '“They have an awful attitude. I’m not going to be spoken to like that.”',
          type: 'catastrophic',
          insight: 'Immediate escalatory counter-attack: Preparing for a fight before knowing the facts.'
        },
        {
          id: 'cd_t3',
          text: '“They had an exhausting or stressful day outside and need space to decompress.”',
          type: 'rational',
          insight: 'Generous interpretation: Recognizing personal boundaries during decompression.'
        },
        {
          id: 'cd_t4',
          text: '“I’ll let them breathe, then offer a cup of tea or a listening ear later.”',
          type: 'open',
          insight: 'Supportive presence: Giving space while keeping the door of care unlocked.'
        }
      ],
      emotionOptions: [
        { id: 'cd_e1', name: 'Walking on Eggshells (Anxiety)', intensity: 'high', category: 'anxiety', sensationDescription: 'Vigilant tension, shallow breathing' },
        { id: 'cd_e2', name: 'Indignant Anger', intensity: 'high', category: 'anger', sensationDescription: 'Pounding pulse, urge to confront immediately' },
        { id: 'cd_e3', name: 'Sadness & Rejection', intensity: 'moderate', category: 'sadness', sensationDescription: 'Feeling unappreciated in your own home' },
        { id: 'cd_e4', name: 'Calm Patience', intensity: 'mild', category: 'calm', sensationDescription: 'Relaxed shoulders, grounded center' }
      ],
      actionOptions: [
        {
          id: 'cd_a1',
          action: 'Bang on the door and demand to know why they are being so rude',
          category: 'confront',
          shortTermResult: 'Forces an immediate interaction.',
          longTermResult: 'Collides with someone who is overwhelmed, triggering an explosive argument.'
        },
        {
          id: 'cd_a2',
          action: 'Give the silent treatment back for the next three days',
          category: 'withdraw',
          shortTermResult: 'Feels like equal retaliation.',
          longTermResult: 'Poisons the household atmosphere and deepens distance.'
        },
        {
          id: 'cd_a3',
          action: 'Give them 30 minutes of quiet, then gently check in: “Rough day? I’m here if you want to vent or just need quiet.”',
          category: 'clarify',
          shortTermResult: 'Requires holding back your own reactive impulse.',
          longTermResult: 'Creates safety in the relationship and defuses tension naturally.'
        }
      ],
      healthyAlternatives: {
        thought: '“Their stress is about their world, not a statement about my worth. I can hold space without absorbing their storm.”',
        emotion: 'Steady peace & empathetic boundary',
        action: 'Continue your evening peacefully, leave a warm drink nearby, and let them approach when ready.',
        explanation: 'Emotional maturity is knowing when not to take someone else’s turbulent weather personally.'
      }
    }
  ],
  ar: [
    {
      id: 'unread-message',
      title: 'الرسالة التي لم يُرد عليها',
      category: 'social',
      icon: 'MessageSquare',
      context: 'التواصل اليومي',
      situation: 'أرسلتَ رسالة إلى شخص مهم بالنسبة لك، ومرّ اليوم بأكمله دون أن يجيب.',
      thoughtOptions: [
        {
          id: 't1',
          text: '«بالتأكيد هو غاضب مني أو متضايق من تصرفاتي.»',
          type: 'self-blame',
          insight: 'الشخصنة (Personalization): افتراض أن صمت الآخرين هو عقاب موجّه إليك دون أي دليل واقعي.'
        },
        {
          id: 't2',
          text: '«ربما يكون مشغولاً للغاية أو يمر بظرف طارئ اليوم.»',
          type: 'open',
          insight: 'الفضول والتفهّم: تذكّر أن للآخرين عوالمهم ومشاغلهم وأيامهم الضاغطة.'
        },
        {
          id: 't3',
          text: '«أنا دائماً أفسد كل العلاقات وأرتكب الأخطاء.»',
          type: 'catastrophic',
          insight: 'التعميم المفرط: تحويل تأخر رسالة واحدة إلى حكم شامل على قيمتك وعلاقاتك.'
        },
        {
          id: 't4',
          text: '«لا أعلم حقيقة السبب، ومن الأفضل أن أستفسر بلطف بدلاً من أن أخمن وأفترض.»',
          type: 'rational',
          insight: 'اختبار الواقع: إدراك الفجوة الكبيرة بين ما نعرفه يقيناً وما ينسجه خيالنا وقلقنا.'
        }
      ],
      emotionOptions: [
        { id: 'e1', name: 'قلق وتوتر', intensity: 'high', category: 'anxiety', sensationDescription: 'ضيق في الصدر وتفقد مستمر للهاتف كل بضع دقائق' },
        { id: 'e2', name: 'حزن وشعور بالرفض', intensity: 'moderate', category: 'sadness', sensationDescription: 'ثقل في الكتفين وانكماش نفسي' },
        { id: 'e3', name: 'غضب واستياء', intensity: 'high', category: 'anger', sensationDescription: 'حرارة في الوجه وشعور بعدم التقدير والتجاهل' },
        { id: 'e4', name: 'إحباط وضجر', intensity: 'moderate', category: 'frustration', sensationDescription: 'تململ وصعوبة في التركيز على المهام' },
        { id: 'e5', name: 'خوف من فقدان العلاقة', intensity: 'high', category: 'fear', sensationDescription: 'انقباض في المعدة وتوقع للأسوأ' },
        { id: 'e6', name: 'لا أعلم / شعور مبهم وغير واضح', intensity: 'mild', category: 'unsure', sensationDescription: 'ضيق غائم في الداخل يصعب تسميته بدقة' }
      ],
      actionOptions: [
        {
          id: 'a1',
          action: 'الانسحاب التام والرد ببرود وجفاء لاحقاً',
          category: 'withdraw',
          shortTermResult: 'يوفر حماية مؤقتة لكبرياء الشخص من شعور الرفض.',
          longTermResult: 'يبني جدراناً صامتة بين الطرفين ويزيد العزلة والتباعد.'
        },
        {
          id: 'a2',
          action: 'مواجهته بهجوم حاد ولوم («لماذا تتجاهلني؟»)',
          category: 'confront',
          shortTermResult: 'تفريغ سريع لشحنة الغضب المشتعلة.',
          longTermResult: 'يضع الطرف الآخر في موقف دفاعي إن كان في أزمة أو ظرف حرج فعلاً.'
        },
        {
          id: 'a3',
          action: 'إعادة قراءة المحادثة مراراً وتكراراً والبحث بين السطور',
          category: 'ruminate',
          shortTermResult: 'يمنح وهماً كاذباً بالتحكم عن طريق الاجترار العقلي.',
          longTermResult: 'يستنزف طاقتك الذهنية ويغذي دوامة القلق والسيناريوهات المظلمة.'
        },
        {
          id: 'a4',
          action: 'السؤال والاستيضاح بمودة عند التواصل المناسب',
          category: 'clarify',
          shortTermResult: 'يتطلب شجاعة وتحملاً لعدم اليقين المؤقت.',
          longTermResult: 'يفتح باب الحوار الصحي، ويختبر الحقيقة، ويوطد الثقة بينكما.'
        },
        {
          id: 'a5',
          action: 'التحدث مع شخص موثوق أو تدوين المشاعر على ورقة',
          category: 'support',
          shortTermResult: 'يفرغ الاحتقان في بيئة آمنة غير متسرعة.',
          longTermResult: 'يساعدك على استعادة الرؤية المتوازنة قبل اتخاذ أي رد فعل مندفع.'
        },
        {
          id: 'a6',
          action: 'وضع الهاتف جانباً والانشغال بيومك واهتماماتك',
          category: 'pause',
          shortTermResult: 'قد يكون صعباً في البداية مع الرغبة المستمرة في التحقق.',
          longTermResult: 'يعزز الاستقرار النفسي؛ فقيمتك لا تعتمد على إشعار من هاتف شخص آخر.'
        }
      ],
      healthyAlternatives: {
        thought: '«صمته يعود إلى يومه وظروفه الخاصة، ولا يحدد قيمتي. سأتواصل معه باطمئنان عندما يحين الوقت المناسب.»',
        emotion: 'هدوء نفسي وفضول متزن وتعاطف مع الذات',
        action: 'ضع هاتفك مقلوباً، خذ 3 أنفاس عميقة واعية، واستكمل نشاطك اليومي بصفاء.',
        explanation: 'عندما نفصل بين الواقعة المجردة (أُرسلت رسالة؛ لم يصل رد بعد) وبين القصة الذهنية (هو يكرهني)، يهدأ الانفعال تلقائياً.'
      }
    },
    {
      id: 'meeting-remark',
      title: 'ملاحظة الاجتماع الحادة',
      category: 'work',
      icon: 'Briefcase',
      context: 'بيئة العمل',
      situation: 'خلال اجتماع مع الفريق، قال زميلك بلهجة حادة: «هذا الاقتراح يفتقر للأرقام الأساسية ولن ينجح بهذه الطريقة.»',
      thoughtOptions: [
        {
          id: 'mr_t1',
          text: '«إنه يتعمد إحراجي والتقليل من شأني أمام المدير والحاضرين.»',
          type: 'catastrophic',
          insight: 'افتراض سوء النية: تفسير النقد المهني المباشر كعداء شخصي موجّه لشخصك.'
        },
        {
          id: 'mr_t2',
          text: '«أنا فاشل في هذا العمل والجميع اكتشف حقيقتي الآن.»',
          type: 'self-blame',
          insight: 'متلازمة الدجال والتهويل: تحويل ملاحظة على ملف أو فكرة إلى حكم نهائي على كفاءتك.'
        },
        {
          id: 'mr_t3',
          text: '«لهجته كانت جافة، لكن الملاحظة حول الأرقام قد تكون نقطة مفيدة للتطوير.»',
          type: 'rational',
          insight: 'الفصل المتزن: التمييز بين أسلوب الإلقاء الحاد وبين القيمة الموضوعية للنقد.'
        },
        {
          id: 'mr_t4',
          text: '«أحتاج أن أفهم بدقة ما هي المؤشرات التي يرى أنها تنقص العرض.»',
          type: 'open',
          insight: 'الفضول البنّاء: الانتقال من حالة الدفاع والتحفز إلى حل المشكلات بوعي.'
        }
      ],
      emotionOptions: [
        { id: 'mr_e1', name: 'خجل وشعور بالصغر', intensity: 'high', category: 'sadness', sensationDescription: 'حرارة في الأذنين وانكماش داخلي' },
        { id: 'mr_e2', name: 'غضب دفاعي ورغبة بالرد', intensity: 'high', category: 'anger', sensationDescription: 'شد في الفك وتسارع في الأنفاس' },
        { id: 'mr_e3', name: 'قلق وتوتر حول المستقبل', intensity: 'moderate', category: 'anxiety', sensationDescription: 'رجفة خفيفة في اليدين ونبض سريع' },
        { id: 'mr_e4', name: 'ثبات وفضول مهني', intensity: 'mild', category: 'curiosity', sensationDescription: 'تنفس هادئ وعينان متيقظتان دون توتر' }
      ],
      actionOptions: [
        {
          id: 'mr_a1',
          action: 'الانطواء والصمت التام طوال باقي الاجتماع',
          category: 'withdraw',
          shortTermResult: 'يحميك من التعرض لأي تعليق إضافي.',
          longTermResult: 'يحرمك من إيصال صوتك ويجعلك تغرق في مشاعر الغبن والاستياء.'
        },
        {
          id: 'mr_a2',
          action: 'الهجوم المرتد وتذكيره بأخطاء مشروعه السابق',
          category: 'confront',
          shortTermResult: 'تفريغ فوري لجرح الكبرياء.',
          longTermResult: 'يسيء لمكانتك المهنية ويشعل صراعاً يضر ببيئة العمل بأكملها.'
        },
        {
          id: 'mr_a3',
          action: 'طرح سؤال استيضاحي هادئ: «ما هي المؤشرات المحددة التي تقترح إضافتها؟»',
          category: 'clarify',
          shortTermResult: 'يتطلب ثباتاً انفعالياً عالياً.',
          longTermResult: 'يظهر نضجك واحترافيتك ويحول النقد إلى خطة عمل ملموسة.'
        }
      ],
      healthyAlternatives: {
        thought: '«الملاحظة موجهة لملف العرض وليست حكماً على قيمتي الإنسانية أو المهنية ككل.»',
        emotion: 'ثقة هادئة وتركيز على التطوير',
        action: 'تنفس ببطء، اشكره على الإشارة لنقطة البيانات، وسجل الملاحظة بهدوء لمناقشتها.',
        explanation: 'يصبح النقد مؤلماً حين ندمج ذواتنا مع ما نقدمه. الفصل بينهما يمنحك القوة والوقار.'
      }
    },
    {
      id: 'gathering-missed',
      title: 'اللقاء الذي غبتَ عنه',
      category: 'relationship',
      icon: 'Users',
      context: 'الصداقة والانتماء',
      situation: 'فتحتَ وسائل التواصل الاجتماعي فرأيتَ صورة تجمع أصدقاءك في مطعم دون أن يخبرك أحد باللقاء.',
      thoughtOptions: [
        {
          id: 'gm_t1',
          text: '«لديهم دائرة مغلقة وأنا لست سوى شخص هامشي يجاملونه.»',
          type: 'self-blame',
          insight: 'جرح الإقصاء: عندما لا نمتلك معلومات كاملة، يملأ عقلنا الفراغ بمخاوفنا الداخلية.'
        },
        {
          id: 'gm_t2',
          text: '«لا أهتم إطلاقاً، أنا لست بحاجة لأي منهم على الإطلاق.»',
          type: 'avoidant',
          insight: 'الانفصال الدفاعي: التظاهر بعدم الاكتراث لتخدير وجع الاستبعاد الحقيقي.'
        },
        {
          id: 'gm_t3',
          text: '«الموقف يؤلمني، لكن قد يكون اللقاء وليد الصدفة أو مرتبطاً بظرف خاص.»',
          type: 'rational',
          insight: 'الواقعية الرحيمة: الاعتراف بالألم مع التريث قبل تصديق رواية المؤامرة.'
        },
        {
          id: 'gm_t4',
          text: '«أشعر بالوحشة الآن، وعندما أهدأ يمكنني مبادرة أحدهم والاطمئنان عليه.»',
          type: 'open',
          insight: 'المبادرة الإيجابية: اختيار التواصل الحقيقي بدلاً من السقوط في المرارة.'
        }
      ],
      emotionOptions: [
        { id: 'gm_e1', name: 'وحشة وألم الاستبعاد', intensity: 'high', category: 'sadness', sensationDescription: 'غصة في الحلق وثقل عميق في القلب' },
        { id: 'gm_e2', name: 'غيرة وحنق', intensity: 'moderate', category: 'anger', sensationDescription: 'شد عصبي وشعور بالظلم' },
        { id: 'gm_e3', name: 'خجل وحرج', intensity: 'moderate', category: 'fear', sensationDescription: 'شعور بالصغر والتساؤل عما إذا كان الآخرون يلاحظون غيابك' },
        { id: 'gm_e4', name: 'احتواء ذاتي وطمأنينة', intensity: 'mild', category: 'calm', sensationDescription: 'وضع اليد على الصدر والتنفس عبر شعور الوحشة برفق' }
      ],
      actionOptions: [
        {
          id: 'gm_a1',
          action: 'نشر عبارات وخواطر مبطنة عن خيانة الأصدقاء وقلة الوفاء',
          category: 'confront',
          shortTermResult: 'تفريغ جزئي للحرقة الداخلية.',
          longTermResult: 'يخلق أجواء مشحونة، ويبعد الأصدقاء، ويشعرك بالندم لاحقاً.'
        },
        {
          id: 'gm_a2',
          action: 'حظر حساباتهم ومقاطعتهم نهائياً دون نقاش',
          category: 'withdraw',
          shortTermResult: 'إحساس زائف بالكرامة والانتصار.',
          longTermResult: 'يقطع أواصر العلاقات بسبب سوء فهم دون منح الصداقة فرصة للتوضيح.'
        },
        {
          id: 'gm_a3',
          action: 'تقبّل الشعور بالوحشة، وإكرام النفس بنشاط محبب، والترتيب للقاء قادم',
          category: 'support',
          shortTermResult: 'يعترف بالألم دون معاقبة أحد أو جلد الذات.',
          longTermResult: 'يحافظ على سلامة العلاقات ويعزز نضجك وتقديرك لنفسك.'
        }
      ],
      healthyAlternatives: {
        thought: '«من الطبيعي أن أشعر بغصة عند رؤية لقائهم، لكن لقاءً واحداً لم أُدعَ إليه لا يمحو صداقاتي ولا يلغي قيمتي.»',
        emotion: 'تعاطف مع الذات وسلام داخلي',
        action: 'ابتعد عن شاشة الهاتف قليلاً، اصنع لنفسك مشروباً دافئاً، وتواصل مع شخص تشعر بالأمان معه.',
        explanation: 'الانتماء يبدأ من تقبل مشاعرك أولاً دون السماح لمنشور عابر بأن يحدد نظرتك لنفسك.'
      }
    },
    {
      id: 'closed-door',
      title: 'الباب المغلق',
      category: 'family',
      icon: 'Home',
      context: 'البيت والعلاقات الأسرية',
      situation: 'عاد شريك حياتك أو أحد أفراد أسرتك للمنزل، وألقى التحية باقتضاب شديد ثم دخل غرفته وأغلق الباب.',
      thoughtOptions: [
        {
          id: 'cd_t1',
          text: '«ما الخطأ الذي ارتكبته أنا مجدداً؟ دائماً يعاملني بجفاء دون مبرر.»',
          type: 'self-blame',
          insight: 'تحمّل وزر الآخرين: افتراض أن تعكر مزاج الطرف الآخر هو اتهام موجه لك بالضرورة.'
        },
        {
          id: 'cd_t2',
          text: '«هذا أسلوب غير لائق ومستفز، ولن أقبل أن يُعاملني بهذه الطريقة أبداً.»',
          type: 'catastrophic',
          insight: 'التصعيد التلقائي: شحن النفس للمعركة قبل معرفة ملابسات اليوم.'
        },
        {
          id: 'cd_t3',
          text: '«يبدو أنه خاض يوماً مرهقاً أو شاقاً في الخارج ويحتاج لحظات من العزلة والهدوء.»',
          type: 'rational',
          insight: 'التماس العذر الإنساني: احترام المساحة الشخصية لتفريغ الضغوط النفسية.'
        },
        {
          id: 'cd_t4',
          text: '«سأمنحه وقتاً ليتنفس، ثم أقدم له كأساً من الشاي أو كلمة طيبة حين يهدأ.»',
          type: 'open',
          insight: 'الحضور الداعم: منح الآخر مساحة آمنة مع إبقاء باب المحبة والاهتمام مفتوحاً.'
        }
      ],
      emotionOptions: [
        { id: 'cd_e1', name: 'تحفز وتوجس وقلق', intensity: 'high', category: 'anxiety', sensationDescription: 'ترقب وتوجس كأنك تمشي على قشور بيض' },
        { id: 'cd_e2', name: 'غضب وشعور بالإهانة', intensity: 'high', category: 'anger', sensationDescription: 'تسارع نبضات القلب ورغبة في الاقتحام للمعاتبة' },
        { id: 'cd_e3', name: 'حزن وشعور بالإهمال', intensity: 'moderate', category: 'sadness', sensationDescription: 'إحساس بعدم التقدير في بيتك' },
        { id: 'cd_e4', name: 'صبر وسكينة واحتواء', intensity: 'mild', category: 'calm', sensationDescription: 'استرخاء في الكتفين وراحة داخلية متزنة' }
      ],
      actionOptions: [
        {
          id: 'cd_a1',
          action: 'طرق الباب بقوة ومطالبته فوراً بتفسير هذا السلوك الجاف',
          category: 'confront',
          shortTermResult: 'يفرض التفاعل بالقوة.',
          longTermResult: 'يصطدم بشخص منهك نفسياً، مما يشعل شجاراً عنيفاً يمكن تفاديه بسهولة.'
        },
        {
          id: 'cd_a2',
          action: 'مقابلته بالصمت العقابي والمعاملة بالمثل للأيام القادمة',
          category: 'withdraw',
          shortTermResult: 'يشعرك بالقصاص المتساوي.',
          longTermResult: 'يسمم أجواء البيت ويزرع جفاءً مزمناً يصعب علاجه.'
        },
        {
          id: 'cd_a3',
          action: 'منحه نصف ساعة من الهدوء التام، ثم الاطمئنان عليه برفق: «هل كان يومك شاقاً؟ أنا هنا متى ما أردت التحدث»',
          category: 'clarify',
          shortTermResult: 'يتطلب ضبطاً للانفعال اللحظي.',
          longTermResult: 'يخلق شعوراً عميقاً بالأمان في العلاقة ويبدد التوتر تلقائياً وبأقل جهد.'
        }
      ],
      healthyAlternatives: {
        thought: '«توتره مرتبط بضغوط عالمه الخارجي وليس تقليلاً من شأني. أستطيع أن أكون مساحة أمان دون أن أمتص عاصفته.»',
        emotion: 'سكينة داخلية وحدود نفسية صحية',
        action: 'أكمل مسائك باطمئنان، وضع له شيئاً دافئاً بالقرب منه، ودعه يقترب متى استعاد طاقته.',
        explanation: 'النضج الانفعالي الحقيقي يكمن في عدم أخذ العواصف النفسية للآخرين كإهانة شخصية.'
      }
    }
  ]
};
