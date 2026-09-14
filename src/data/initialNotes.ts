import { Note } from '../types';

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-welcome-zainab',
    title: 'أهلاً بكِ في مذكرة زينب مسلم 🌸✨',
    content: `تطبيقكِ الشخصي والمثالي لتدوين الملاحظات والأفكار اليومية وحفظ الصور باحترافية وسرعة:
• دعم كامل للغة العربية والاتجاه من اليمين لليسار (RTL).
• إمكانية إرفاق عدة صور لكل ملاحظة مع استعراض سلس ومحدد ألوان مريح للعين.
• حفظ محلي آمن وسريع عبر Room Database في أندرويد.`,
    colorId: 'rose',
    createdAt: Date.now() - 1000 * 60 * 15,
    updatedAt: Date.now() - 1000 * 60 * 15,
    imageUris: [
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80'
    ],
    isPinned: true,
    tags: ['زينب مسلم', 'ملاحظاتي'],
  },
  {
    id: 'note-1',
    title: 'خطة بناء تطبيق أندرويد بـ Jetpack Compose 🚀',
    content: `المراحل الأساسية للتطوير:
1. إعداد بنية المشروع و KSP لـ Room Database.
2. بناء طبقة البيانات (Entity, TypeConverters, DAO, Database).
3. برمجة مستودع البيانات (NoteRepository) لإدارة العمليات.
4. إعداد ViewModel باستخدام StateFlow وإدارة أحداث الواجهة (UiEvents).
5. تصميم الشاشات بواسطة Jetpack Compose ودعم كامل للاتجاه RTL العربي.
6. دعم الوضع الليلي (Dark Theme) والألوان الديناميكية من Material 3.`,
    colorId: 'amber',
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    updatedAt: Date.now() - 1000 * 60 * 30,
    imageUris: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    ],
    isPinned: true,
    tags: ['أندرويد', 'تطوير', 'Compose'],
  },
  {
    id: 'note-2',
    title: 'قائمة مهام العمل وتجهيزات الأسبوع 📋',
    content: `• مراجعة تقرير الأداء الشهري مع الفريق.
• فحص كود Room Database للتحقق من دعم نصوص UTF-8 العربية.
• اختبار رفع وإرفاق الصور المتعددة بواسطة Coil.
• شراء حزمة بن القهوة المختصة وكوب حراري جديد.`,
    colorId: 'emerald',
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 20,
    imageUris: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80'
    ],
    isPinned: true,
    tags: ['مهام', 'عمل'],
  },
  {
    id: 'note-3',
    title: 'اقتباس أدبي ملهم ✨',
    content: `"إنَّما الفضيلةُ في العملِ الجادِ والسَّعْيِ الصادق، وليس فيما يُقال أو يُتمنّى. كل إنجاز عظيم بدأ بفكرة دُوّنت في لحظة هدوء."`,
    colorId: 'violet',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    updatedAt: Date.now() - 1000 * 60 * 60 * 48,
    imageUris: [],
    isPinned: false,
    tags: ['اقتباسات'],
  },
  {
    id: 'note-4',
    title: 'أفكار لمشروع ذكاء اصطناعي تفاعلي 💡',
    content: `دمج واجهة تلخيص الملاحظات الطويلة مع Gemini 2.5 Flash، واستخراج الكلمات المفتاحية باللغة العربية تلقائياً عند حفظ الملاحظة.
تحديد الألوان المقترحة بناءً على المشاعر المكتوبة في النص!`,
    colorId: 'sky',
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    updatedAt: Date.now() - 1000 * 60 * 60 * 70,
    imageUris: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
    ],
    isPinned: false,
    tags: ['أفكار', 'ذكاء اصطناعي'],
  },
];

export const SAMPLE_GALLERY_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    title: 'برمجة وتطوير',
  },
  {
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    title: 'حاسوب محمول ومكتب',
  },
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
    title: 'أكواد برمجية',
  },
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    title: 'طبيعة جبلية',
  },
  {
    url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80',
    title: 'قهوة ودفتر ملاحظات',
  },
  {
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    title: 'كتابة وأوراق دراسة',
  },
];
