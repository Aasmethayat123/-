import { 
  SeparateItem, 
  FeelingChallengeItem, 
  PerspectiveChallengeItem, 
  BeforeYouReactItem 
} from '../types';

export const SEPARATE_ITEMS: Record<'en' | 'ar', SeparateItem[]> = {
  en: [
    {
      id: 'sep-1',
      statement: '“I am a failure.”',
      correctCategory: 'thought',
      explanation: 'This is a mental judgment/opinion created by your inner critic, not a verifiable fact or pure biological emotion.'
    },
    {
      id: 'sep-2',
      statement: '“My friend hasn’t replied to two text messages sent at 10 AM.”',
      correctCategory: 'fact',
      explanation: 'This is an objective, neutral reality observable on a screen that anyone can verify without interpretation.'
    },
    {
      id: 'sep-3',
      statement: 'A sharp ache in the chest, accompanied by intense nervousness (Anxiety).',
      correctCategory: 'feeling',
      explanation: 'Anxiety is an emotional state and bodily sensation signaling perceived vulnerability or threat.'
    },
    {
      id: 'sep-4',
      statement: '“Everyone in the meeting could tell that I was shaking.”',
      correctCategory: 'thought',
      explanation: 'Mind reading: An assumption of what other people perceived, not an established factual truth.'
    },
    {
      id: 'sep-5',
      statement: '“The presentation lasted 18 minutes, and two questions were asked.”',
      correctCategory: 'fact',
      explanation: 'Pure data: Time and count can be verified by anyone in the room.'
    },
    {
      id: 'sep-6',
      statement: 'A sudden wave of warmth in the cheeks and wishing to disappear (Embarrassment).',
      correctCategory: 'feeling',
      explanation: 'Embarrassment is an authentic emotional experience often felt when feeling exposed or vulnerable.'
    },
    {
      id: 'sep-7',
      statement: '“They are intentionally excluding me because I don’t belong.”',
      correctCategory: 'thought',
      explanation: 'A narrative interpretation created to explain a situation; it may feel true, but it is a mental hypothesis.'
    },
    {
      id: 'sep-8',
      statement: 'A deep sense of disappointment and a lump in the throat (Sadness).',
      correctCategory: 'feeling',
      explanation: 'Sadness is an emotional and somatic response to loss, unmet expectations, or longing.'
    },
    {
      id: 'sep-9',
      statement: '“The doctor said my blood pressure is 118 over 75.”',
      correctCategory: 'fact',
      explanation: 'A measurable medical measurement verified by a physical device.'
    },
    {
      id: 'sep-10',
      statement: '“Nothing will ever get better; things always fall apart.”',
      correctCategory: 'thought',
      explanation: 'Catastrophizing: A predictive cognitive pattern predicting the future based on current emotional distress.'
    }
  ],
  ar: [
    {
      id: 'sep-1',
      statement: '«أنا إنسان فاشل.»',
      correctCategory: 'thought',
      explanation: 'هذه فكرة وحكم ذهني أصدره عقلك على ذاتك، وليست حقيقة موضوعية ولا شعوراً عضوياً.'
    },
    {
      id: 'sep-2',
      statement: '«لم يُجب صديقي على رسالتين أُرسلتا في تمام العاشرة صباحاً.»',
      correctCategory: 'fact',
      explanation: 'هذه حقيقة مجردة وموقف واقعي يمكن لأي شخص أو كاميرا التحقق منه دون أي تأويل.'
    },
    {
      id: 'sep-3',
      statement: 'انقباض حاد في الصدر مع تسارع في دقات القلب وشعور بالتوجس (القلق).',
      correctCategory: 'feeling',
      explanation: 'القلق هو انفعال عاطفي مصحوب باستجابة جسدية حيوية، يعبر عن شعور بالتهديد أو عدم الأمان.'
    },
    {
      id: 'sep-4',
      statement: '«الجميع في الاجتماع لاحظوا ارتباكي واهتزاز صوتي.»',
      correctCategory: 'thought',
      explanation: 'قراءة أفكار الآخرين: افتراض عقلي لما يدور في أذهان الحاضرين دون دليل مثبت.'
    },
    {
      id: 'sep-5',
      statement: '«استمر العرض التقديمي لمدة 18 دقيقة وطُرح خلاله سؤالان.»',
      correctCategory: 'fact',
      explanation: 'معطيات رقمية وواقعية مثبتة يمكن قياسها وتوثيقها دون تأويل شخصي.'
    },
    {
      id: 'sep-6',
      statement: 'حرارة في الوجنتين مع رغبة في التواري عن الأنظار (الخجل والحرج).',
      correctCategory: 'feeling',
      explanation: 'الخجل هو شعور إنساني أصيل يختبره الجسد عند الشعور بالانكشاف أو ارتكاب زلة عفوية.'
    },
    {
      id: 'sep-7',
      statement: '«إنهم يتعمدون إبعادي لأنهم لا يريدونني بينهم.»',
      correctCategory: 'thought',
      explanation: 'قصة سردية ينسجها العقل لتفسير موقف غير واضح؛ قد تبدو مقنعة لكنها تظل فرضية ذهنية وليست حقيقة.'
    },
    {
      id: 'sep-8',
      statement: 'غصة في الحلق وثقل عميق ودموع في العينين (الحزن).',
      correctCategory: 'feeling',
      explanation: 'الحزن انفعال عاطفي طبيعي ومشروع يعبر عن فقدان أو خيبة أمل أو شوق.'
    },
    {
      id: 'sep-9',
      statement: '«أخبرني الطبيب أن قياس ضغط الدم هو 120 على 80.»',
      correctCategory: 'fact',
      explanation: 'نتيجة قياس طبية دقيقة ومحايدة تسجلها الأجهزة.'
    },
    {
      id: 'sep-10',
      statement: '«الأمور لن تتحسن أبداً، وكل ما أبدأه ينتهي بالخراب.»',
      correctCategory: 'thought',
      explanation: 'التهويل والتشاؤم المستقبلي: فكرة تعميمية تصدر في لحظة ألم ولا تمثل المستقبل الواقعي.'
    }
  ]
};

export const FEELING_CHALLENGES: Record<'en' | 'ar', FeelingChallengeItem[]> = {
  en: [
    {
      id: 'feel-1',
      character: 'Karim',
      situation: 'Karim spent all weekend preparing a surprise dinner for his family. When they arrived, people immediately scrolled their phones and barely commented on the meal.',
      clues: ['Slumped posture', 'Loss of appetite', 'Quiet sigh', 'Holding back words'],
      options: [
        {
          name: 'Disappointment & Feeling Unseen',
          description: 'A quiet ache when vulnerability and effort are met with indifference.',
          isPrimary: true,
          feedback: 'Accurate! Beneath any potential irritation lies the vulnerable pain of having poured love and effort into something that was not recognized.'
        },
        {
          name: 'Pure Anger',
          description: 'Desire to break something or yell loudly.',
          isPrimary: false,
          feedback: 'While anger might flare up later as a defensive shield, the root tender emotion here is deep disappointment and feeling invisible.'
        },
        {
          name: 'Indifference',
          description: 'Not caring about the family at all.',
          isPrimary: false,
          feedback: 'He cared deeply—that is precisely why the silence stung.'
        }
      ],
      deeperTakeaway: 'Anger often acts as a bodyguard for more tender feelings: disappointment, feeling unappreciated, or sadness.'
    },
    {
      id: 'feel-2',
      character: 'Maya',
      situation: 'Maya’s closest friend called excitedly to announce landing her dream scholarship. Maya congratulated her warmly, but hung up and felt an uncomfortable sinking knot in her stomach.',
      clues: ['Feeling guilty for not being 100% euphoric', 'Stomach knot', 'Comparing her own stalled projects'],
      options: [
        {
          name: 'Complex Vulnerability & Latent Grief for Herself',
          description: 'Loving a friend while feeling a painful mirror on one’s own unresolved longings.',
          isPrimary: true,
          feedback: 'Spot on! Experiencing envy or grief about our own unfulfilled dreams does NOT mean we don’t love our friend. Humans can hold both joy for another and grief for themselves.'
        },
        {
          name: 'Malice & Enmity',
          description: 'Wishing harm or failure upon the friend.',
          isPrimary: false,
          feedback: 'Not at all. Maya genuinely wishes her friend well; the knot is about Maya’s own quiet self-doubt.'
        },
        {
          name: 'Boredom',
          description: 'Lack of interest in academic achievements.',
          isPrimary: false,
          feedback: 'Far from boring; the emotional impact was potent.'
        }
      ],
      deeperTakeaway: 'You can love someone unconditionally and still experience a twinge of personal grief when their milestone highlights your own wait.'
    },
    {
      id: 'feel-3',
      character: 'Tarek',
      situation: 'Tarek agreed to take on three extra tasks for a teammate because he couldn’t bring himself to say no. Now he is awake at 2 AM, rushing to meet deadlines with a clenched jaw.',
      clues: ['Jaw clenching', 'Resentment toward the colleague', 'Frustration with himself'],
      options: [
        {
          name: 'Boundary Overwhelm & Self-Resentment',
          description: 'Frustration born from self-betrayal and fear of setting limits.',
          isPrimary: true,
          feedback: 'Exactly. Tarek isn’t just stressed by the workload; he feels betrayed by his own inability to honor his personal limits.'
        },
        {
          name: 'Pride & Satisfaction',
          description: 'Feeling heroic for saving the day.',
          isPrimary: false,
          feedback: 'His body’s clenched jaw and inner bitterness prove this is not genuine satisfaction.'
        },
        {
          name: 'Simple Tiredness',
          description: 'Just needing 8 hours of sleep.',
          isPrimary: false,
          feedback: 'Sleep deprivation is present, but the emotional charge is resentment at having compromised his boundaries.'
        }
      ],
      deeperTakeaway: 'Resentment is the emotional alarm system that tells us where we abandoned our own boundaries to appease others.'
    }
  ],
  ar: [
    {
      id: 'feel-1',
      character: 'كريم',
      situation: 'أمضى كريم عطلة نهاية الأسبوع بأكملها يطهو ويجهز مائدة عشاء لعائلته بمحبة. وعندما جلسوا، فتح الجميع هواتفهم وتناولوا الطعام دون أي كلمة شكر أو انتباه لجهده.',
      clues: ['أكتاف منخفضة', 'فقدان الشهية فجأة', 'تنهيدة خافتة', 'ابتلاع الكلمات والتزام الصمت'],
      options: [
        {
          name: 'خيبة أمل وشعور بعدم التقدير والتجاهل',
          description: 'ألم هادئ وموجع حين يُقابل الجهد الصادق باللامبالاة والبرود.',
          isPrimary: true,
          feedback: 'رائع ودقيق جداً! تحت أي رغبة في الغضب أو الانفعال، يكمن شعور أكثر رهافة وهو ألم التمني غير المتحقق والشعور بأن محبته لم تُرَ.'
        },
        {
          name: 'غضب محض ورغبة في الصراخ',
          description: 'الرغبة في كسر الصحون أو توبيخ الجميع بصوت عالٍ.',
          isPrimary: false,
          feedback: 'قد يظهر الغضب لاحقاً كـ «درع حماية» دفاعي، لكن الشعور الأصيل في تلك اللحظة هو خيبة الأمل والغصة.'
        },
        {
          name: 'عدم الاكتراث',
          description: 'أنه لا يهتم برأي عائلته إطلاقاً.',
          isPrimary: false,
          feedback: 'على العكس تماماً، اهتمامه العميق ومحبته هما السبب الحقيقي وراء ألم هذا الصمت.'
        }
      ],
      deeperTakeaway: 'غالباً ما يأتي الغضب كحارس شخصي يحمي مشاعر أرقّ وأكثر هشاشة: كخيبة الأمل، والحزن، والشعور بعدم التقدير.'
    },
    {
      id: 'feel-2',
      character: 'مي',
      situation: 'اتصلت صديقة مي المقربة بحماس لتخبرها بحصولها على منحة دراسية دولية حلمت بها طويلاً. باركت مي لها بحرارة، لكن بعد إنهاء المكالمة شعرت بانقباضة غير مريحة في بطنها مع لوم ذاتي.',
      clues: ['شعور بالذنب لعدم الفرح المطلق', 'انقباض في المعدة', 'مقارنة مسارها المتعثر بمسار صديقتها'],
      options: [
        {
          name: 'مزيج مركب من الحزن على تعثر أحلامها الشخصية والغيرة العفوية',
          description: 'محبة الصديقة مع وخزة مرآة مؤلمة تذكرها بتعطل أهدافها الذاتية.',
          isPrimary: true,
          feedback: 'أحسنت القراءة! الشعور بوجع المقارنة لا يعني بالضرورة كراهية الصديقة. يمكن للإنسان أن يحمل فرحاً صادقاً للآخرين مع حزن مشروع على تأخر أمنياته الخاصة.'
        },
        {
          name: 'حقد وكراهية خالصة',
          description: 'تمني زوال النعمة عن صديقتها.',
          isPrimary: false,
          feedback: 'أبداً؛ مي تحب صديقتها بصدق، لكن الوخزة كانت صوتاً يعبر عن قلقها الداخلي على مستقبلها الخاص.'
        },
        {
          name: 'ملل وعدم اهتمام',
          description: 'أن الموضوع لا يمثل لها أي قيمة.',
          isPrimary: false,
          feedback: 'الأمر بعيد تماماً عن الملل؛ فالأثر النفسي كان عميقاً وحقيقياً.'
        }
      ],
      deeperTakeaway: 'يمكنك أن تحب شخصاً من كل قلبك، وتظل قادراً على الشعور بوخزة حزن شخصية حين يذكرك نجاحه برحلتك الشاقة.'
    },
    {
      id: 'feel-3',
      character: 'طارق',
      situation: 'وافق طارق على تحمل ثلاثة مهام إضافية لزميله في العمل لأنه عجز عن قول «لا» خجلاً. الآن، هو مستيقظ في الثانية بعد منتصف الليل، يضغط على أسنانه محاولاً إنهاء العمل بإنهاك شديد.',
      clues: ['شد مستمر في الفك', 'حنق داخلي تجاه الزميل', 'عتاب وقسوة على النفس'],
      options: [
        {
          name: 'إنهاك الحدود النفسية والاستياء من خذلان الذات',
          description: 'إحباط ينبع من التنازل عن الراحة الشخصية خوفاً من الرفض أو المواجهة.',
          isPrimary: true,
          feedback: 'بالضبط! طارق ليس مرهقاً فقط من حجم العمل، بل متألم في الأعماق لأنه خذل حدوده ولم يحمِ راحته.'
        },
        {
          name: 'فخر واعتزاز بالبطولة',
          description: 'الشعور بالسعادة لإنقاذ الموقف ومساعدة الآخرين.',
          isPrimary: false,
          feedback: 'الشد في فكه والحرقة في صدره يؤكدان أن هذا ليس عطاءً صحياً ولا فخراً حقيقياً.'
        },
        {
          name: 'مجرد نعاس طبيعي',
          description: 'أنه يحتاج فقط لساعات نوم إضافية.',
          isPrimary: false,
          feedback: 'الحاجة للنوم موجودة، لكن الشحنة النفسية الضاغطة هي الاستياء من عدم وضع حد فاصل.'
        }
      ],
      deeperTakeaway: 'الاستياء والغبن هما جرس إنذار نفسي يخبرنا بالمواضع التي تنازلنا فيها عن حدودنا إرضاءً لغيرنا.'
    }
  ]
};

export const PERSPECTIVE_CHALLENGES: Record<'en' | 'ar', PerspectiveChallengeItem[]> = {
  en: [
    {
      id: 'persp-1',
      situation: 'Your friend was online, read your message (blue ticks), but didn’t reply for 4 hours.',
      automaticThought: '“They don’t value me. If they cared, replying takes only 10 seconds.”',
      distortionType: 'Mind Reading & Black-and-White Thinking',
      distortionExplanation: 'Assuming silence can only mean a lack of caring, forgetting mental exhaustion or interruption.',
      guidingQuestion: 'Can you think of another explanation that doesn’t attack your worth or their character?',
      alternativePerspectives: [
        {
          text: '“They opened it while walking into a task or meeting, got distracted, and intended to reply properly later when they had full attention.”',
          helpfulScore: 5,
          feedback: 'High realism! Most unreplied messages happen because people want to give a thoughtful answer and get sidetracked.'
        },
        {
          text: '“They are currently burnt out, overwhelmed with notifications, and their social battery is completely depleted today.”',
          helpfulScore: 5,
          feedback: 'Empathetic & compassionate: It shifts the focus from you being rejected to them needing gentle space.'
        },
        {
          text: '“Maybe they are talking to someone more important than me.”',
          helpfulScore: 1,
          feedback: 'This is another flavor of the same self-sabotaging thought; it deepens the wound rather than offering a grounded perspective.'
        }
      ]
    },
    {
      id: 'persp-2',
      situation: 'You stumbled over a sentence in the first two minutes of your team presentation.',
      automaticThought: '“The entire presentation was a disaster. Nobody will ever take me seriously.”',
      distortionType: 'Catastrophizing & Mental Filtering',
      distortionExplanation: 'Focusing exclusively on a 5-second slip while deleting the 20 minutes of solid content that followed.',
      guidingQuestion: 'If a respected colleague tripped on one word, would you consider their entire career ruined?',
      alternativePerspectives: [
        {
          text: '“Stumbling on a word is human biology; what people cared about was the insight in the slides that followed.”',
          helpfulScore: 5,
          feedback: 'Balanced and grounded: Normalizes human imperfection and weighs the whole picture.'
        },
        {
          text: '“Most listeners were busy thinking about their own day and didn’t even register a momentary pause.”',
          helpfulScore: 4,
          feedback: 'The Spotlight Effect: We assume people watch us with magnifying glasses when they rarely do.'
        },
        {
          text: '“I should never volunteer to present again so I don’t embarrass myself.”',
          helpfulScore: 1,
          feedback: 'Avoidance mode: Keeps you small and lets anxiety dictate your professional growth.'
        }
      ]
    }
  ],
  ar: [
    {
      id: 'persp-1',
      situation: 'شاهد صديقك رسالتك وظهرت علامة القراءة الزرقاء، لكنه لم يرد طوال 4 ساعات متواصلة.',
      automaticThought: '«هو لا يقيمني ولا يهتم بي. لو كنتُ مهماً في حياته لأخذ الرد 10 ثوانٍ فقط.»',
      distortionType: 'قراءة الأفكار والتفكير الأبيض والأسود',
      distortionExplanation: 'حصر الاحتمالات في تفسير واحد قاسٍ، وتجاهل احتمالات الانشغال أو استنزاف الطاقة النفسية.',
      guidingQuestion: 'هل يمكنك العثور على تفسير بديل لا يقلل من قيمتك ولا يسيء لنيات صديقك؟',
      alternativePerspectives: [
        {
          text: '«ربما فتح الرسالة وهو في عجلة من أمره أو دخل اجتماعاً، وأراد تأجيل الرد حتى يتفرغ ليكتب جواباً وافياً بهدوء.»',
          helpfulScore: 5,
          feedback: 'واقعي جداً وموضوعي! أغلب الرسائل المؤجلة تحدث لأن الطرف الآخر يريد وقتاً ليرد كما ينبغي ثم تشغله دوامة الحياة.'
        },
        {
          text: '«ربما يمر بيوم شاق وطاقته الاجتماعية مستنزفة تماماً، ويحتاج وقتاً ليستعيد أنفاسه قبل التواصل مع أي شخص.»',
          helpfulScore: 5,
          feedback: 'تفسير رحيم ومتفهم: ينقل التركيز من وهم «الرفض الشخصي» إلى «تقدير الظرف البشري» للآخر.'
        },
        {
          text: '«بالتأكيد يتحدث مع أشخاص أهم مني ويفضلهم عليّ.»',
          helpfulScore: 1,
          feedback: 'هذا مجرد وجه آخر للفكرة السلبية الأولى؛ يغذي الألم بدلاً من أن يفتح أفقاً هادئاً متزناً.'
        }
      ]
    },
    {
      id: 'persp-2',
      situation: 'تعثرتَ في نطق جملة خلال الدقيقتين الأوليين من عرضك التقديمي أمام زملائك.',
      automaticThought: '«لقد تدمر العرض بأكمله. الآن سيعتبرني الجميع عاجزاً وغير كفء.»',
      distortionType: 'التهويل (Catastrophizing) والترشيح العقلي السلبي',
      distortionExplanation: 'تضخيم تعثر استغرق ثانيتين ومحو عشرين دقيقة من الطرح الجيد والبيانات القيمة.',
      guidingQuestion: 'لو تعثر زميل تحترمه في كلمة عفوية، هل ستحكم على مسيرته المهنية بالفشل الذريع؟',
      alternativePerspectives: [
        {
          text: '«التعثر في نطق كلمة هو أمر طبيعي وبشري تماماً؛ ما يهم الحاضرين هو جوهر الأفكار والحلول التي قدمتها بعد ذلك.»',
          helpfulScore: 5,
          feedback: 'تفكير متزن ينزع القداسة عن الكمال، ويعيد النظر إلى الصورة الكاملة للجهد المبذول.'
        },
        {
          text: '«أغلب الحاضرين كانوا منشغلين بأفكارهم الخاصة ولم يتوقفوا عند التعثر اللحظي كما فعلت أنا.»',
          helpfulScore: 4,
          feedback: 'تأثير بقعة الضوء (Spotlight Effect): نتخيل أن الناس يراقبوننا بعدسة مكبرة بينما هم مشغولون بعوالمهم.'
        },
        {
          text: '«سأمتنع عن التقديم في المستقبل حتى لا أضع نفسي في مواقف محرجة مجدداً.»',
          helpfulScore: 1,
          feedback: 'استجابة هروبية دفاعية: تزيد من سطوة القلق وتحرمك من التطور الطبيعي.'
        }
      ]
    }
  ]
};

export const BEFORE_YOU_REACT_ITEMS: Record<'en' | 'ar', BeforeYouReactItem[]> = {
  en: [
    {
      id: 'react-1',
      situation: 'You receive a blunt, sarcastic comment in the family or team group chat regarding an idea you proposed.',
      emotionSurge: 'Hot, defensive rage mixed with sudden shame',
      physicalSensations: ['Flushed face', 'Trembling fingers typing fast', 'Heart thumping in the ears'],
      mindfulKey: 'The pause between stimulus and response is where your power lives.',
      options: [
        {
          id: 'opt-impulsive',
          title: 'The Immediate Fiery Retaliation',
          actionType: 'impulsive',
          description: 'Type a stinging personal retort and hit Send immediately.',
          shortTermConsequence: 'A brief, thrilling jolt of chemical adrenaline and wounded pride defense.',
          longTermConsequence: 'Fractures group safety, invites bystanders into the drama, keeps your nervous system spiked in fight-or-flight for hours, and creates lingering regret.',
          emotionalCost: 'High exhaustion & persistent agitation.',
          reflection: 'Reacting in the heat of an adrenaline surge lets the primitive survival brain dictate your voice.'
        },
        {
          id: 'opt-avoidant',
          title: 'The Silent Retreat & Sulking',
          actionType: 'avoidant',
          description: 'Exit the group immediately without a word and stew in resentment.',
          shortTermConsequence: 'Avoids having to speak up.',
          longTermConsequence: 'Leaves you feeling powerless and leaves the other person with no boundary or accountability.',
          emotionalCost: 'Chronic bitterness and helplessness.',
          reflection: 'Passive withdrawal often harms the quiet person far more than the provocateur.'
        },
        {
          id: 'opt-conscious',
          title: 'The 5-Second Mindful Pause & Grounded Response',
          actionType: 'conscious',
          description: 'Put the phone on the table. Take 3 deep diaphragmatic exhales. Later, reply with clean, unemotional clarity or handle it one-on-one.',
          shortTermConsequence: 'Requires tolerating the burning physical urge to fire back instantly.',
          longTermConsequence: 'Maintains personal dignity, commands quiet respect, de-escalates public drama, and preserves inner nervous peace.',
          emotionalCost: 'Low long-term friction; builds inner self-trust.',
          reflection: 'When you choose not to absorb the invitation to a brawl, you remain in complete command of your energy.'
        }
      ]
    },
    {
      id: 'react-2',
      situation: 'A car cuts sharply across your lane in heavy morning traffic, nearly clipping your bumper, and honks aggressively at you.',
      emotionSurge: 'Acute panic turning into blazing road rage',
      physicalSensations: ['Gripping the steering wheel white-knuckled', 'Adrenaline spike', 'Shallow rapid breathing'],
      mindfulKey: 'Never let a stranger’s reckless storm hijack the wheel of your own peace.',
      options: [
        {
          id: 'opt-impulsive-2',
          title: 'Aggressive Pursuit & Tailgating',
          actionType: 'impulsive',
          description: 'Floor the gas, honk back continuously, and glare aggressively at their window.',
          shortTermConsequence: 'Releases the violent shock of almost crashing.',
          longTermConsequence: 'Exponentially increases physical accident danger, spikes cortisol for the rest of your workday, and risks road altercation.',
          emotionalCost: 'Prolonged stress toxicity throughout the morning.',
          reflection: 'Trading physical safety and mental peace to "teach a stranger a lesson" is always a losing bargain.'
        },
        {
          id: 'opt-conscious-2',
          title: 'The Deep Exhale & Space Creation',
          actionType: 'conscious',
          description: 'Gently release your tight grip on the wheel, breathe out slowly through your lips, drop your speed, and create 3 car lengths of safety.',
          shortTermConsequence: 'Feeling the heart gradually slow down over 90 seconds.',
          longTermConsequence: 'Arrive alive, relaxed, and unbothered. Your day remains yours.',
          emotionalCost: 'Virtually zero lasting emotional cost.',
          reflection: 'Their driving is about their chaos; your steering is about your safety and serenity.'
        }
      ]
    }
  ],
  ar: [
    {
      id: 'react-1',
      situation: 'تلقيتَ تعليقاً ساخراً وجارحاً في مجموعة المحادثة العائلية أو الخاصة بالعمل رداً على فكرة طرحتها.',
      emotionSurge: 'فورة غضب دفاعية حارقة مع إحساس مباغت بالخجل والإهانة',
      physicalSensations: ['حرارة تتدفق إلى الوجه', 'ارتجاف خفيف في الأصابع أثناء الكتابة بسرعة', 'دقات قلب مسموعة في الأذنين'],
      mindfulKey: 'بين المثير الخارجي واستجابتك توجد مساحة حرة؛ في تلك المساحة تكمن قوتك وحريتك واختيارك.',
      options: [
        {
          id: 'opt-impulsive',
          title: 'الرد الهجومي الفوري والمباغت',
          actionType: 'impulsive',
          description: 'كتابة رد لاذع يمس شخصية الطرف الآخر والضغط فوراً على «إرسال».',
          shortTermConsequence: 'شعور سريع بالانتصار اللحظي وتفريغ احتقان الكبرياء الجريح.',
          longTermConsequence: 'يجر الآخرين لصراع مفتوح، يرفع مستوى هرمونات التوتر لساعات طويلة، ويورث ندماً ثقيلاً وصعوبة في ترميم الأجواء.',
          emotionalCost: 'استنزاف عصبي حاد وشعور بالاضطراب المتواصل.',
          reflection: 'الاستجابة تحت وطأة فوران الأدرينالين تجعل العقل الغريزي البدائي هو الذي يتحكم في لسانك وقرارك.'
        },
        {
          id: 'opt-avoidant',
          title: 'الانسحاب الصامت والمغادرة الغاضبة',
          actionType: 'avoidant',
          description: 'مغادرة المجموعة فوراً دون كلمة واحدة والانعزال مع مشاعر القهر.',
          shortTermConsequence: 'تجنب المواجهة المباشرة في اللحظة الراهنة.',
          longTermConsequence: 'يبقيك في موقع الضحية العاجزة ولا يضع حدوداً صحية وواضحة للطرف المعتدي.',
          emotionalCost: 'مرارة كامنة وشعور بالعجز وقلة الحيلة.',
          reflection: 'الهروب السلبي غالباً ما يؤذي الطرف الصامت أضعاف ما يؤثر في الشخص المستفز.'
        },
        {
          id: 'opt-conscious',
          title: 'وقفة الأنفاس الخمسة والرد الهادئ الرصين',
          actionType: 'conscious',
          description: 'وضع الهاتف جانباً على الطاولة. أخذ 3 أنفاس عميقة وبطيئة من البطن. الرد لاحقاً بوضوح واقتضاب غير انفعالي، أو معالجة الأمر في محادثة فردية.',
          shortTermConsequence: 'يتطلب شجاعة لكبح رغبة الانتقام السريع المشتعلة في الصدر.',
          longTermConsequence: 'يحفظ وقارك وهيبتك، يجبر الآخرين على احترام رصانتك، ويحمي سلام جهازك العصبي وطمأنينتك.',
          emotionalCost: 'احتكاك نفسي صفري على المدى الطويل؛ ويعزز الثقة العميقة بالذات.',
          reflection: 'حين ترفض قبول دعوة الآخرين للشجار، فإنك تحتفظ بكامل طاقتك وسلامك في يدك.'
        }
      ]
    },
    {
      id: 'react-2',
      situation: 'انعطفت سيارة فجأة وبتهور شديد أمامك في زحام الصباح لتكاد تصطدم بمقدمة سيارتك، مع إطلاق بوق سيارته بعنف واستفزاز.',
      emotionSurge: 'فزع مباغت من خطر الاصطدام يتحول فوراً إلى غضب عارم',
      physicalSensations: ['قبضة بيضاء مشدودة بعنف على عجلة القيادة', 'اندفاع أدرينالين حاد', 'تنفس سريع وسطحي'],
      mindfulKey: 'لا تسمح لعاصفة شخص متهور غريب بأن تختطف مقود هدوئك وسلامة يومك.',
      options: [
        {
          id: 'opt-impulsive-2',
          title: 'المطاردة العنيفة والمعاملة بالمثل',
          actionType: 'impulsive',
          description: 'الضغط على دواسة السرعة، إطلاق البوق باستمرار، والتضييق عليه بنظرات غاضبة.',
          shortTermConsequence: 'تفريغ صدمة الخوف من الحادث في شكل عدوانية مضادة.',
          longTermConsequence: 'مضاعفة خطر وقوع حادث مروري حقيقي، ورفع الكورتيزول طوال باقي يوم عملك، واحتمال تطور الموقف لعراك خطير.',
          emotionalCost: 'تسمم ذهني وتوتر مرافق لساعات طويلة دون أي فائدة.',
          reflection: 'المقامرة بسلامتك الجسدية وراحة بالك من أجل «تلقين شخص متهور درساً» هي دائماً صفقة خاسرة.'
        },
        {
          id: 'opt-conscious-2',
          title: 'الزفير العميق وصناعة مسافة الأمان',
          actionType: 'conscious',
          description: 'إرخاء القبضة المشدودة عن المقود، إخراج الزفير ببطء من الفم، خفض السرعة، وإفساح مسافة أمان كافية بينكما.',
          shortTermConsequence: 'ملاحظة تباطؤ نبضات القلب وعودتها للسكينة خلال 90 ثانية.',
          longTermConsequence: 'تصل لوجهتك سالماً، هادئاً، ومحتفظاً بطاقتك. ويظل يومك ملكاً لك وحدك.',
          emotionalCost: 'سلامة نفسية وجسدية كاملة.',
          reflection: 'قيادته المتهورة تخص فوضاه الداخلية الخاصة؛ أما تحكمك في مقودك فيخص سلامتك وسكينة روحك.'
        }
      ]
    }
  ]
};
