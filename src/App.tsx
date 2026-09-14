import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Code2, 
  BookOpen, 
  Columns2, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Github, 
  Layers, 
  Database,
  Moon,
  Sun
} from 'lucide-react';
import { Note } from './types';
import { INITIAL_NOTES } from './data/initialNotes';
import { AndroidSimulator } from './components/AndroidSimulator';
import { AndroidCodeHub } from './components/AndroidCodeHub';
import { SetupGuide } from './components/SetupGuide';

const LOCAL_STORAGE_KEY = 'zainab_muslem_notes_app_v1';

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved notes', e);
      }
    }
    return INITIAL_NOTES;
  });

  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'split' | 'guide'>('simulator');
  const [isDark, setIsDark] = useState(true);
  const [resetConfirmToast, setResetConfirmToast] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const handleSaveNote = (noteToSave: Note) => {
    setNotes(prev => {
      const exists = prev.some(n => n.id === noteToSave.id);
      if (exists) {
        return prev.map(n => n.id === noteToSave.id ? noteToSave : n);
      }
      return [noteToSave, ...prev];
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, isPinned: !n.isPinned, updatedAt: Date.now() };
      }
      return n;
    }));
  };

  const handleResetSampleNotes = () => {
    setNotes(INITIAL_NOTES);
    setResetConfirmToast(true);
    setTimeout(() => setResetConfirmToast(false), 2500);
  };

  const totalImages = notes.reduce((acc, n) => acc + (n.imageUris?.length || 0), 0);
  const pinnedCount = notes.filter(n => n.isPinned).length;

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${
      isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-100 text-neutral-900'
    }`} dir="rtl">

      {/* Global Application Header */}
      <header className={`sticky top-0 z-50 px-4 sm:px-6 py-3 border-b backdrop-blur-md transition-colors ${
        isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white/90 border-neutral-200'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 font-black text-xl shadow-md shadow-amber-500/20">
              📝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-neutral-100 dark:text-neutral-100">
                  مذكرة زينب مسلم (Zainab Muslem Notes)
                </h1>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Android Compose RTL
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                تطبيق زينب مسلم • Kotlin • Jetpack Compose • Material 3 • Room
              </p>
            </div>
          </div>

          {/* View Mode Navigation Tabs */}
          <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-800/80 border border-neutral-700/60 text-xs font-semibold">
            <button
              id="tab-simulator-btn"
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'simulator'
                  ? 'bg-amber-500 text-neutral-950 shadow-xs'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>المحاكي التفاعلي</span>
            </button>

            <button
              id="tab-code-btn"
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'code'
                  ? 'bg-amber-500 text-neutral-950 shadow-xs'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>أكواد المشروع</span>
            </button>

            <button
              id="tab-split-btn"
              onClick={() => setActiveTab('split')}
              className={`hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'split'
                  ? 'bg-amber-500 text-neutral-950 shadow-xs'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
              }`}
              title="عرض المحاكي والكود جنباً إلى جنب"
            >
              <Columns2 className="w-4 h-4" />
              <span>عرض مزدوج</span>
            </button>

            <button
              id="tab-guide-btn"
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'guide'
                  ? 'bg-amber-500 text-neutral-950 shadow-xs'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>دليل التشغيل</span>
            </button>
          </nav>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              id="reset-sample-notes-btn"
              onClick={handleResetSampleNotes}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800 rounded-xl transition-colors border border-neutral-700/50"
              title="استعادة الملاحظات التجريبية الافتراضية"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">استعادة النماذج</span>
            </button>

            <button
              id="global-theme-toggle-btn"
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors border border-neutral-700/50"
              title={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">

        {/* Tab 1: Simulator View */}
        {activeTab === 'simulator' && (
          <div className="flex flex-col items-center justify-center py-2">
            {/* Quick Metrics Pill */}
            <div className="flex items-center gap-4 text-xs text-neutral-400 mb-4 bg-neutral-900/60 border border-neutral-800 px-4 py-1.5 rounded-full">
              <span>الملاحظات: <strong className="text-amber-400">{notes.length}</strong></span>
              <span>•</span>
              <span>المثبتة: <strong className="text-amber-400">{pinnedCount}</strong></span>
              <span>•</span>
              <span>الصور المرفقة: <strong className="text-amber-400">{totalImages}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Room Local Storage Active</span>
            </div>

            <AndroidSimulator
              notes={notes}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              onTogglePin={handleTogglePin}
              isDark={isDark}
              setIsDark={setIsDark}
            />
          </div>
        )}

        {/* Tab 2: Full Code Hub View */}
        {activeTab === 'code' && (
          <div className="h-[760px] w-full flex flex-col">
            <AndroidCodeHub />
          </div>
        )}

        {/* Tab 3: Split View (Simulator on Left/Right + Code on other side) */}
        {activeTab === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 flex justify-center">
              <AndroidSimulator
                notes={notes}
                onSaveNote={handleSaveNote}
                onDeleteNote={handleDeleteNote}
                onTogglePin={handleTogglePin}
                isDark={isDark}
                setIsDark={setIsDark}
              />
            </div>
            <div className="lg:col-span-7 h-[760px]">
              <AndroidCodeHub />
            </div>
          </div>
        )}

        {/* Tab 4: Setup Guide View */}
        {activeTab === 'guide' && (
          <div className="py-4">
            <SetupGuide />
          </div>
        )}

      </main>

      {/* Reset Toast */}
      {resetConfirmToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 z-50 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>تمت استعادة الملاحظات والنماذج الافتراضية بنجاح!</span>
        </div>
      )}

      {/* Footer */}
      <footer className={`py-4 px-6 border-t text-center text-xs transition-colors ${
        isDark ? 'bg-neutral-950 border-neutral-900 text-neutral-500' : 'bg-neutral-100 border-neutral-200 text-neutral-600'
      }`}>
        <p>
          تطبيق مذكرة احترافية للأندرويد — مبني وفق بنية Clean Architecture مع Room Database و StateFlow و Jetpack Compose ودعم كامل للغة العربية (RTL).
        </p>
      </footer>

    </div>
  );
}
