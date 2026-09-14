export interface Note {
  id: string;
  title: string;
  content: string;
  colorId: string;
  createdAt: number;
  updatedAt: number;
  imageUris: string[];
  isPinned: boolean;
  tags?: string[];
}

export interface NoteColor {
  id: string;
  name: string;
  lightBg: string;
  lightBorder: string;
  lightText: string;
  darkBg: string;
  darkBorder: string;
  darkText: string;
  composeColorLight: string;
  composeColorDark: string;
}

export interface AndroidFile {
  id: string;
  path: string;
  fileName: string;
  language: 'kotlin' | 'groovy' | 'xml' | 'json';
  category: 'build' | 'data' | 'viewmodel' | 'ui' | 'theme' | 'manifest' | 'res';
  description: string;
  code: string;
}
