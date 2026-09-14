import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  FolderTree, 
  Layers, 
  Database, 
  Cpu, 
  Palette, 
  ShieldCheck, 
  Code2, 
  Terminal,
  ExternalLink,
  Search,
  BookOpen
} from 'lucide-react';
import { AndroidFile } from '../types';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';

export const AndroidCodeHub: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>('notes-list-screen');
  const [copied, setCopied] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedFile = ANDROID_PROJECT_FILES.find(f => f.id === selectedFileId) || ANDROID_PROJECT_FILES[0];

  const filteredFiles = ANDROID_PROJECT_FILES.filter(file => {
    const matchesCategory = categoryFilter === 'all' || file.category === categoryFilter;
    const matchesSearch = file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          file.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          file.path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCurrentFile = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedFile.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.fileName.split(' ')[0];
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadAllBundle = () => {
    // Generate combined project source bundle
    const bundleText = ANDROID_PROJECT_FILES.map(f => (
      `// ========================================================\n` +
      `// FILE: ${f.path} (${f.fileName})\n` +
      `// DESCRIPTION: ${f.description}\n` +
      `// ========================================================\n\n` +
      `${f.code}\n\n`
    )).join('\n\n');

    const element = document.createElement('a');
    const file = new Blob([bundleText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'ProNotes_Android_Source_Code_Bundle.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'build': return <Terminal className="w-3.5 h-3.5 text-orange-400" />;
      case 'data': return <Database className="w-3.5 h-3.5 text-emerald-400" />;
      case 'viewmodel': return <Cpu className="w-3.5 h-3.5 text-blue-400" />;
      case 'ui': return <Layers className="w-3.5 h-3.5 text-amber-400" />;
      case 'theme': return <Palette className="w-3.5 h-3.5 text-purple-400" />;
      default: return <FileCode2 className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
      
      {/* Code Hub Header */}
      <div className="px-5 py-4 bg-neutral-850 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Code2 className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-neutral-100">
              مركز الكود البرمجي لأندرويد ستوديو (Kotlin & Jetpack Compose)
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            جميع الملفات مكتوبة وجاهزة للنسخ أو التضمين المباشر في مشروع Android Studio
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="download-all-code-bundle-btn"
            onClick={handleDownloadAllBundle}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-semibold transition-colors"
            title="تنزيل جميع الملفات في حزمة نصية واحدة"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>تصدير كل الملفات (Bundle)</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Sidebar + Code Editor */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left / Navigation Sidebar (Files list) */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-l border-neutral-800 flex flex-col bg-neutral-950/60 shrink-0">
          
          {/* Search files */}
          <div className="p-3 border-b border-neutral-800">
            <div className="relative flex items-center bg-neutral-900 rounded-xl px-3 py-1.5 border border-neutral-800 focus-within:border-amber-500">
              <Search className="w-3.5 h-3.5 text-neutral-400 ml-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن ملف..."
                className="w-full bg-transparent text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-hidden"
                dir="rtl"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto border-b border-neutral-800 text-[11px] scrollbar-none">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'data', label: 'Room' },
              { id: 'ui', label: 'Compose' },
              { id: 'viewmodel', label: 'ViewModel' },
              { id: 'theme', label: 'Theme' },
              { id: 'build', label: 'Gradle' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2 py-1 rounded-lg shrink-0 font-medium transition-colors ${
                  categoryFilter === cat.id 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-48 md:max-h-none scrollbar-thin">
            {filteredFiles.map(file => {
              const isSelected = file.id === selectedFileId;
              return (
                <button
                  key={file.id}
                  id={`file-item-${file.id}`}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`w-full text-right px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 border ${
                    isSelected
                      ? 'bg-neutral-850 border-amber-500/40 text-amber-300 font-bold shadow-xs'
                      : 'border-transparent text-neutral-300 hover:bg-neutral-900 hover:border-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {getCategoryIcon(file.category)}
                    <span className="truncate" dir="ltr">{file.fileName}</span>
                  </div>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-neutral-800 text-neutral-400 font-mono">
                    {file.language}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Info Box in Sidebar */}
          <div className="p-3 bg-neutral-900/80 border-t border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
            <div className="flex items-center gap-1.5 text-neutral-200 font-bold mb-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>تقنيات الأندرويد المستخدمة:</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
              <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 px-1.5 py-0.5 rounded-md">Room 2.6.1</span>
              <span className="bg-blue-950/60 text-blue-400 border border-blue-800/50 px-1.5 py-0.5 rounded-md">StateFlow</span>
              <span className="bg-purple-950/60 text-purple-400 border border-purple-800/50 px-1.5 py-0.5 rounded-md">Material 3</span>
              <span className="bg-amber-950/60 text-amber-400 border border-amber-800/50 px-1.5 py-0.5 rounded-md">Coil Compose</span>
              <span className="bg-rose-950/60 text-rose-400 border border-rose-800/50 px-1.5 py-0.5 rounded-md">RTL Arabization</span>
            </div>
          </div>

        </div>

        {/* Code View Area */}
        <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden">
          
          {/* File Meta Header Bar */}
          <div className="px-5 py-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between gap-3 shrink-0">
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-amber-400 font-semibold" dir="ltr">
                  {selectedFile.path}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {selectedFile.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                id="copy-code-btn"
                onClick={handleCopyCode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  copied 
                    ? 'bg-emerald-500 text-neutral-950' 
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                }`}
                title="نسخ كود الملف إلى الحافظة"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
              </button>

              <button
                id="download-file-btn"
                onClick={handleDownloadCurrentFile}
                className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
                title="تنزيل هذا الملف منفصلاً"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Syntax Code Container with Line Numbers */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed scrollbar-thin select-text bg-neutral-950">
            <pre className="text-neutral-200 whitespace-pre" dir="ltr">
              {selectedFile.code.split('\n').map((line, idx) => (
                <div key={idx} className="table-row hover:bg-neutral-900/60 px-2 rounded-xs">
                  <span className="table-cell text-neutral-600 select-none pr-4 text-right w-10 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="table-cell whitespace-pre">
                    {/* Basic visual colorizing for keywords */}
                    {line.startsWith('//') || line.startsWith('/*') || line.startsWith('*') ? (
                      <span className="text-neutral-500 italic">{line}</span>
                    ) : line.includes('import ') ? (
                      <span className="text-rose-400">{line}</span>
                    ) : line.includes('@Entity') || line.includes('@Dao') || line.includes('@Composable') || line.includes('@Database') ? (
                      <span className="text-amber-400 font-semibold">{line}</span>
                    ) : line.includes('fun ') || line.includes('class ') || line.includes('interface ') ? (
                      <span className="text-cyan-300">{line}</span>
                    ) : line.includes('val ') || line.includes('var ') ? (
                      <span className="text-emerald-300">{line}</span>
                    ) : (
                      line
                    )}
                  </span>
                </div>
              ))}
            </pre>
          </div>

          {/* Quick Setup Instructions Footer */}
          <div className="px-5 py-2.5 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>جاهز للاستخدام في Android Studio Ladybug / Iguana / Giraffe أو أحدث</span>
            </div>
            <span className="font-mono text-neutral-500">Target SDK: 35 | Kotlin 2.0+</span>
          </div>

        </div>

      </div>
    </div>
  );
};
