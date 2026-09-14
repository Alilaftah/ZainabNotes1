import React from 'react';
import { CheckCircle2, Terminal, FolderPlus, Play, AlertCircle, Copy } from 'lucide-react';

export const SetupGuide: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-neutral-900 rounded-2xl border border-neutral-800 p-6 md:p-8 text-neutral-100 shadow-xl space-y-6">
      <div className="border-b border-neutral-800 pb-4">
        <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
          <span>🚀 دليل تشغيل المشروع في Android Studio</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          خطوات سريعة لنقل الأكواد وتشغيل تطبيق "مذكرة زينب مسلم" على هاتفك الأندرويد أو المحاكي الرسمي.
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-5 text-sm">
        
        {/* Step 1 */}
        <div className="bg-neutral-850 p-4 rounded-xl border border-neutral-800 flex gap-4">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
            1
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="font-bold text-neutral-200">إنشاء مشروع جديد في Android Studio</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              افتح Android Studio واضغط على <strong>New Project</strong> ثم اختر قالب <strong>Empty Activity (Compose)</strong>.
              حدد اسم المشروع <code className="text-amber-400 font-mono">ProNotesArabicApp</code> و Package name: <code className="text-amber-400 font-mono">com.pronotes.arabicapp</code> واضبط لغة المشروع على <strong>Kotlin</strong> والحد الأدنى <strong>Minimum SDK: API 24</strong>.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-neutral-850 p-4 rounded-xl border border-neutral-800 flex gap-4">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
            2
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="font-bold text-neutral-200">إضافة مكتبات Room و Coil في build.gradle.kts</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              افتح ملف <code className="text-amber-400 font-mono">app/build.gradle.kts</code> وأضف الاعتماديات التالية كما هو مبيّن في تبويب "أكواد المشروع":
            </p>
            <div className="bg-neutral-950 p-3 rounded-lg font-mono text-[11px] text-neutral-300 overflow-x-auto" dir="ltr">
              <pre>{`// Room Database & KSP
val roomVersion = "2.6.1"
implementation("androidx.room:room-runtime:$roomVersion")
implementation("androidx.room:room-ktx:$roomVersion")
ksp("androidx.room:room-compiler:$roomVersion")

// Coil Compose for image loading
implementation("io.coil-kt:coil-compose:2.7.0")

// Navigation & Lifecycle
implementation("androidx.navigation:navigation-compose:2.8.5")
implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
implementation("com.google.code.gson:gson:2.11.0")`}</pre>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-neutral-850 p-4 rounded-xl border border-neutral-800 flex gap-4">
          <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0">
            3
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="font-bold text-neutral-200">نسخ حزم وملفات الكود (Data, UI, ViewModel)</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              انسخ ملفات الكود من تبويب <strong>أكواد المشروع</strong> إلى الحزم المقابلة لها:
            </p>
            <ul className="text-xs text-neutral-400 space-y-1 list-disc list-inside mt-2">
              <li><code className="text-neutral-300 font-mono">data/model/NoteEntity.kt</code></li>
              <li><code className="text-neutral-300 font-mono">data/local/NoteDao.kt</code> و <code className="text-neutral-300 font-mono">NotesDatabase.kt</code> و <code className="text-neutral-300 font-mono">Converters.kt</code></li>
              <li><code className="text-neutral-300 font-mono">data/repository/NoteRepository.kt</code></li>
              <li><code className="text-neutral-300 font-mono">ui/viewmodel/NotesViewModel.kt</code></li>
              <li><code className="text-neutral-300 font-mono">ui/screens/NotesListScreen.kt</code> و <code className="text-neutral-300 font-mono">NoteEditScreen.kt</code></li>
              <li><code className="text-neutral-300 font-mono">MainActivity.kt</code> و <code className="text-neutral-300 font-mono">AndroidManifest.xml</code></li>
            </ul>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-neutral-850 p-4 rounded-xl border border-neutral-800 flex gap-4">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center shrink-0">
            4
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="font-bold text-neutral-200">مزامنة المشروع وتشغيله (Sync Project & Run)</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              اضغط على <strong>Sync Project with Gradle Files</strong> في الشريط العلوي لـ Android Studio، ثم اضغط على زر <strong>Run (Play)</strong> لتثبيت التطبيق على جهازك أو المحاكي.
            </p>
          </div>
        </div>

      </div>

      {/* Best Practices Note */}
      <div className="bg-amber-950/20 border border-amber-800/40 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <strong className="text-amber-400 block mb-1">دعم اللغة العربية والاتجاه (RTL):</strong>
          تم ضبط ملف <code className="font-mono">Theme.kt</code> تلقائياً عبر المزود <code className="font-mono">LocalLayoutDirection provides LayoutDirection.Rtl</code> ومفتاح <code className="font-mono">android:supportsRtl="true"</code> في ملف المانيفست، مما يضمن اتجاهاً عربياً دقيقاً ومحاذاة ممتازة حتى لو كانت لغة الهاتف الإنجليزية!
        </div>
      </div>

    </div>
  );
};
