import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Grid2X2, 
  ListFilter, 
  Plus, 
  Pin, 
  ArrowRight, 
  Trash2, 
  Check, 
  ImagePlus, 
  Share2, 
  X, 
  FileText,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  UploadCloud
} from 'lucide-react';
import { Note } from '../types';
import { NOTE_COLORS } from '../data/noteColors';
import { SAMPLE_GALLERY_IMAGES } from '../data/initialNotes';

interface AndroidSimulatorProps {
  notes: Note[];
  onSaveNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

export const AndroidSimulator: React.FC<AndroidSimulatorProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  onTogglePin,
  isDark,
  setIsDark,
}) => {
  const [currentView, setCurrentView] = useState<'list' | 'edit'>('list');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [isFullScreenPhone, setIsFullScreenPhone] = useState(false);

  // Editor State
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editColorId, setEditColorId] = useState('default');
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editIsPinned, setEditIsPinned] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current time in Arabic/Standard
  const [currentTime, setCurrentTime] = useState('12:45');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const openNewNote = () => {
    setEditingNoteId(null);
    setEditTitle('');
    setEditContent('');
    setEditColorId('default');
    setEditImages([]);
    setEditIsPinned(false);
    setCurrentView('edit');
  };

  const openEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditColorId(note.colorId);
    setEditImages([...note.imageUris]);
    setEditIsPinned(note.isPinned);
    setCurrentView('edit');
  };

  const handleSave = () => {
    if (!editTitle.trim() && !editContent.trim() && editImages.length === 0) {
      setCurrentView('list');
      return;
    }

    const noteToSave: Note = {
      id: editingNoteId || `note-${Date.now()}`,
      title: editTitle.trim(),
      content: editContent.trim(),
      colorId: editColorId,
      imageUris: editImages,
      isPinned: editIsPinned,
      createdAt: editingNoteId 
        ? (notes.find(n => n.id === editingNoteId)?.createdAt || Date.now()) 
        : Date.now(),
      updatedAt: Date.now(),
    };

    onSaveNote(noteToSave);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      setCurrentView('list');
    }, 400);
  };

  const handleDeleteCurrent = () => {
    if (editingNoteId) {
      onDeleteNote(editingNoteId);
    }
    setCurrentView('list');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    setShowImagePickerModal(false);
  };

  const addSampleImage = (url: string) => {
    if (!editImages.includes(url)) {
      setEditImages(prev => [...prev, url]);
    }
    setShowImagePickerModal(false);
  };

  const removeImage = (indexToRemove: number) => {
    setEditImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const filteredNotes = notes.filter(n => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
  }).sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });

  const activeColorObj = NOTE_COLORS.find(c => c.id === editColorId) || NOTE_COLORS[0];

  const formatArabicDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full transition-all duration-300 ${isFullScreenPhone ? 'p-0' : 'p-2 sm:p-4'}`}>
      
      {/* Top Device Bar & Controls */}
      <div className="w-full max-w-[420px] mb-3 flex items-center justify-between text-xs px-2 text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-neutral-200">محاكي تطبيق زينب مسلم (Compose)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="toggle-dark-mode-btn"
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            title={isDark ? 'التبديل للوضع النهاري' : 'التبديل للوضع الليلي'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>
          <button
            id="toggle-fullscreen-btn"
            onClick={() => setIsFullScreenPhone(!isFullScreenPhone)}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            title={isFullScreenPhone ? 'تصغير الإطار' : 'تكبير ملء الشاشة'}
          >
            {isFullScreenPhone ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Android Device Mockup Frame */}
      <div 
        className={`relative w-full max-w-[410px] transition-all duration-300 overflow-hidden shadow-2xl ${
          isFullScreenPhone 
            ? 'h-[92vh] max-w-[480px] rounded-2xl border-2 border-neutral-700' 
            : 'h-[780px] rounded-[44px] border-[10px] border-neutral-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-neutral-700'
        } ${isDark ? 'bg-neutral-900 text-neutral-100' : 'bg-neutral-50 text-neutral-900'}`}
      >
        {/* Hardware Notch / Camera Hole Punch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-neutral-950 ring-2 ring-neutral-800 z-50 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-800"></div>
        </div>

        {/* Android Status Bar */}
        <div className={`pt-2.5 px-6 pb-1 flex items-center justify-between text-[11px] font-semibold tracking-tight select-none z-40 ${
          isDark ? 'text-neutral-300 bg-neutral-900/90' : 'text-neutral-700 bg-neutral-50/90'
        } backdrop-blur-sm`}>
          <span>{currentTime}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] opacity-80">5G</span>
            <svg className="w-3.5 h-3.5 fill-current opacity-80" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/>
            </svg>
            <div className="w-5 h-2.5 border border-current rounded-xs p-[1px] flex items-center">
              <div className="h-full w-4/5 bg-current rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* MAIN SCREEN AREA */}
        <div className="h-[calc(100%-48px)] flex flex-col relative overflow-hidden">
          
          {/* VIEW: NOTES LIST */}
          {currentView === 'list' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* App Top Bar */}
              <div className="px-5 pt-3 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-base">
                    📝
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight">مذكرة زينب مسلم</h1>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                      {notes.length} ملاحظة محفوظة
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    id="toggle-layout-mode-btn"
                    onClick={() => setIsGridView(!isGridView)}
                    className={`p-2 rounded-full transition-colors ${
                      isDark ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-200 text-neutral-700'
                    }`}
                    title={isGridView ? 'عرض القائمة' : 'عرض الشبكة'}
                  >
                    {isGridView ? <ListFilter className="w-5 h-5" /> : <Grid2X2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Material 3 Arabic Search Bar */}
              <div className="px-4 py-2">
                <div className={`relative flex items-center rounded-full px-4 py-2.5 transition-all shadow-xs border ${
                  isDark 
                    ? 'bg-neutral-800/80 border-neutral-700/80 focus-within:border-amber-500' 
                    : 'bg-white border-neutral-200 focus-within:border-amber-500'
                }`}>
                  <Search className="w-4 h-4 text-neutral-400 shrink-0 ml-2" />
                  <input
                    id="arabic-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث في الملاحظات أو الصور..."
                    className="w-full bg-transparent text-sm focus:outline-hidden placeholder:text-neutral-400 font-medium"
                    dir="rtl"
                  />
                  {searchQuery && (
                    <button
                      id="clear-search-btn"
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-neutral-400 hover:text-neutral-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Notes List / Grid Scroll Container */}
              <div className="flex-1 overflow-y-auto px-4 py-2 pb-24 scrollbar-thin">
                {filteredNotes.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 mt-12 text-neutral-400">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-neutral-200 mb-1">
                      {searchQuery ? 'لم يتم العثور على نتائج' : 'لا توجد ملاحظات بعد'}
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-[220px] leading-relaxed">
                      {searchQuery ? 'جرب البحث بكلمة أخرى أو مسح شريط البحث' : 'اضغط على زر (+) في الأسفل لكتابة أول فكرة وحفظ صورك'}
                    </p>
                  </div>
                ) : (
                  <div className={isGridView ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
                    {filteredNotes.map((note) => {
                      const colorConfig = NOTE_COLORS.find(c => c.id === note.colorId) || NOTE_COLORS[0];
                      return (
                        <div
                          key={note.id}
                          id={`note-card-${note.id}`}
                          onClick={() => openEditNote(note)}
                          className={`group relative rounded-2xl p-3.5 transition-all duration-200 cursor-pointer border hover:scale-[1.02] shadow-xs ${
                            isDark ? colorConfig.darkBg : colorConfig.lightBg
                          } ${isDark ? colorConfig.darkBorder : colorConfig.lightBorder}`}
                        >
                          {/* Pin Icon indicator */}
                          {note.isPinned && (
                            <div className="absolute top-3 left-3 text-amber-500">
                              <Pin className="w-3.5 h-3.5 fill-amber-500" />
                            </div>
                          )}

                          {/* Image preview thumbnail */}
                          {note.imageUris && note.imageUris.length > 0 && (
                            <div className="relative mb-2.5 rounded-xl overflow-hidden aspect-video bg-neutral-800">
                              <img
                                src={note.imageUris[0]}
                                alt={note.title || 'Note image'}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {note.imageUris.length > 1 && (
                                <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                                  +{note.imageUris.length - 1}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Title */}
                          {note.title && (
                            <h2 className="text-sm font-bold leading-snug mb-1 line-clamp-2" dir="rtl">
                              {note.title}
                            </h2>
                          )}

                          {/* Content Snippet */}
                          {note.content && (
                            <p className="text-xs opacity-80 leading-relaxed line-clamp-4 whitespace-pre-line" dir="rtl">
                              {note.content}
                            </p>
                          )}

                          {/* Footer: Date & Quick Actions */}
                          <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-between text-[10px] opacity-70">
                            <span>{formatArabicDate(note.updatedAt)}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTogglePin(note.id);
                                }}
                                className="p-1 hover:text-amber-500 rounded-sm"
                                title="تثبيت"
                              >
                                <Pin className={`w-3 h-3 ${note.isPinned ? 'fill-current' : ''}`} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteNote(note.id);
                                }}
                                className="p-1 hover:text-rose-500 rounded-sm"
                                title="حذف"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Floating Action Button (FAB) */}
              <button
                id="fab-add-note-btn"
                onClick={openNewNote}
                className="absolute bottom-6 left-6 z-30 flex items-center gap-2 bg-gradient-to-tr from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-neutral-950 font-bold px-4 py-3.5 rounded-2xl shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span className="text-xs font-bold">ملاحظة جديدة</span>
              </button>
            </div>
          )}

          {/* VIEW: NOTE EDITOR */}
          {currentView === 'edit' && (
            <div className={`flex-1 flex flex-col h-full overflow-hidden transition-colors ${
              isDark ? activeColorObj.darkBg : activeColorObj.lightBg
            }`}>
              {/* Editor Top Bar */}
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-current/10 shrink-0">
                <button
                  id="editor-back-btn"
                  onClick={handleSave}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  title="رجوع وحفظ"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1">
                  {/* Toggle Pin */}
                  <button
                    id="editor-pin-btn"
                    onClick={() => setEditIsPinned(!editIsPinned)}
                    className={`p-2 rounded-full transition-colors ${
                      editIsPinned ? 'text-amber-500' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-80'
                    }`}
                    title={editIsPinned ? 'إلغاء التثبيت' : 'تثبيت الملاحظة'}
                  >
                    <Pin className={`w-4 h-4 ${editIsPinned ? 'fill-amber-500' : ''}`} />
                  </button>

                  {/* Add Image */}
                  <button
                    id="editor-add-image-btn"
                    onClick={() => setShowImagePickerModal(true)}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 opacity-80 transition-colors"
                    title="إرفاق صورة"
                  >
                    <ImagePlus className="w-4 h-4" />
                  </button>

                  {/* Delete (if existing note) */}
                  {editingNoteId && (
                    <button
                      id="editor-delete-btn"
                      onClick={handleDeleteCurrent}
                      className="p-2 rounded-full hover:bg-rose-500/10 text-rose-500 transition-colors"
                      title="حذف الملاحظة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Save Button */}
                  <button
                    id="editor-save-btn"
                    onClick={handleSave}
                    className="flex items-center gap-1 bg-amber-500 text-neutral-950 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs hover:bg-amber-400 active:scale-95 transition-all mr-1"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>حفظ</span>
                  </button>
                </div>
              </div>

              {/* Editor Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-5 py-4 pb-20 scrollbar-thin">
                
                {/* Palette Color Picker */}
                <div className="mb-4">
                  <p className="text-[11px] font-semibold opacity-70 mb-2">لون الملاحظة:</p>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {NOTE_COLORS.map(color => (
                      <button
                        key={color.id}
                        id={`color-picker-${color.id}`}
                        onClick={() => setEditColorId(color.id)}
                        className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center transition-all ${
                          isDark ? color.darkBg : color.lightBg
                        } ${isDark ? color.darkBorder : color.lightBorder} border-2 ${
                          editColorId === color.id ? 'ring-2 ring-amber-500 scale-110 shadow-xs' : 'opacity-80 hover:opacity-100'
                        }`}
                        title={color.name}
                      >
                        {editColorId === color.id && (
                          <Check className="w-3.5 h-3.5 text-amber-500 stroke-[3]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attached Images Horizontal Row */}
                {editImages.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-semibold opacity-70">
                        الصور المرفقة ({editImages.length}):
                      </p>
                      <button
                        onClick={() => setShowImagePickerModal(true)}
                        className="text-[11px] text-amber-500 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Plus className="w-3 h-3" />
                        <span>إضافة صورة</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                      {editImages.map((imgUrl, index) => (
                        <div 
                          key={index}
                          className="relative w-28 h-20 rounded-xl overflow-hidden shrink-0 border border-black/10 dark:border-white/10 shadow-xs group"
                        >
                          <img
                            src={imgUrl}
                            alt="Attached"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            id={`remove-image-btn-${index}`}
                            onClick={() => removeImage(index)}
                            className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow-xs"
                            title="حذف الصورة"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Title Input */}
                <input
                  id="note-title-input"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="عنوان الملاحظة..."
                  className="w-full bg-transparent text-xl font-extrabold focus:outline-hidden placeholder:opacity-40 py-1"
                  dir="rtl"
                />

                <div className="w-full h-px bg-current opacity-10 my-3"></div>

                {/* Content Input */}
                <textarea
                  id="note-content-textarea"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="اكتب ملاحظتك هنا بحرية..."
                  rows={14}
                  className="w-full bg-transparent text-sm leading-relaxed resize-none focus:outline-hidden placeholder:opacity-40"
                  dir="rtl"
                />

                {/* Stats Footer in Editor */}
                <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-[10px] opacity-60">
                  <span>
                    {editContent.length} حرف | {editContent.trim() ? editContent.trim().split(/\s+/).length : 0} كلمة
                  </span>
                  <span>حفظ تلقائي مع Room Database</span>
                </div>
              </div>
            </div>
          )}

          {/* Android Navigation Gesture Bar */}
          <div className={`h-6 flex items-center justify-center select-none shrink-0 ${
            isDark ? 'bg-neutral-900' : 'bg-neutral-100'
          }`}>
            <div className="w-32 h-1 bg-neutral-400/60 rounded-full"></div>
          </div>
        </div>

        {/* IMAGE PICKER MODAL (Simulating Android System Photo Picker) */}
        {showImagePickerModal && (
          <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-end">
            <div className={`rounded-t-3xl p-5 border-t border-neutral-700 max-h-[85%] flex flex-col animate-in slide-in-from-bottom duration-200 ${
              isDark ? 'bg-neutral-850 text-neutral-100' : 'bg-white text-neutral-900'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-700/50">
                <div className="flex items-center gap-2">
                  <ImagePlus className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-sm">معرض صور الأندرويد (Coil / Photo Picker)</h3>
                </div>
                <button
                  onClick={() => setShowImagePickerModal(false)}
                  className="p-1 rounded-full hover:bg-neutral-700/50 text-neutral-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Upload from user device */}
              <div className="py-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 font-bold text-xs transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>رفع صورة من جهازك مباشرة (File Picker)</span>
                </button>
              </div>

              <p className="text-[11px] text-neutral-400 mb-2">أو اختر من صور المعرض الجاهزة:</p>

              <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-56 pb-2 scrollbar-thin">
                {SAMPLE_GALLERY_IMAGES.map((sample, idx) => (
                  <div
                    key={idx}
                    onClick={() => addSampleImage(sample.url)}
                    className="group relative rounded-xl overflow-hidden aspect-square cursor-pointer border border-neutral-700 hover:border-amber-500 transition-all"
                  >
                    <img
                      src={sample.url}
                      alt={sample.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Save Toast Notification */}
        {saveToast && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-neutral-900/95 text-white text-xs font-bold px-4 py-2 rounded-full border border-neutral-700 shadow-xl flex items-center gap-2 z-50 animate-in fade-in zoom-in-95">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>تم حفظ الملاحظة بنجاح!</span>
          </div>
        )}

      </div>
    </div>
  );
};
