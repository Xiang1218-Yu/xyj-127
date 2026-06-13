import { create } from 'zustand';

export interface Watermark {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  opacity: number;
  rotation: number;
}

export interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

export type FilterType = 
  | 'none' 
  | 'vivid' 
  | 'warm' 
  | 'cool' 
  | 'vintage' 
  | 'mono' 
  | 'dramatic' 
  | 'sunset' 
  | 'ocean' 
  | 'forest';

export type WeatherType = 
  | 'none'
  | 'rain'
  | 'snow'
  | 'fog'
  | 'sand';

export type ViewPresetType =
  | 'front'
  | 'back'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'wide'
  | 'telephoto'
  | 'default';

export interface ViewPreset {
  id: ViewPresetType;
  name: string;
  heading: number;
  pitch: number;
  fov: number;
}

export interface Filter {
  id: FilterType;
  name: string;
  cssFilter: string;
}

export interface WeatherConfig {
  id: WeatherType;
  name: string;
  icon: string;
  description: string;
}

export const WEATHERS: WeatherConfig[] = [
  { id: 'none', name: '晴天', icon: '☀️', description: '晴朗无云' },
  { id: 'rain', name: '雨天', icon: '🌧️', description: '淅沥雨滴' },
  { id: 'snow', name: '雪天', icon: '❄️', description: '飘雪纷飞' },
  { id: 'fog', name: '雾天', icon: '🌫️', description: '薄雾朦胧' },
  { id: 'sand', name: '沙尘', icon: '🌪️', description: '沙尘漫天' },
];

export const FILTERS: Filter[] = [
  { id: 'none', name: '原图', cssFilter: 'none' },
  { id: 'vivid', name: '鲜艳', cssFilter: 'saturate(1.4) contrast(1.1)' },
  { id: 'warm', name: '暖色', cssFilter: 'sepia(0.3) saturate(1.2) hue-rotate(-10deg)' },
  { id: 'cool', name: '冷色', cssFilter: 'saturate(1.1) hue-rotate(20deg) brightness(1.05)' },
  { id: 'vintage', name: '复古', cssFilter: 'sepia(0.5) saturate(0.8) contrast(1.1) brightness(0.95)' },
  { id: 'mono', name: '黑白', cssFilter: 'grayscale(1) contrast(1.2)' },
  { id: 'dramatic', name: '戏剧', cssFilter: 'contrast(1.4) saturate(1.2) brightness(0.9)' },
  { id: 'sunset', name: '日落', cssFilter: 'sepia(0.4) saturate(1.3) hue-rotate(-20deg) brightness(1.1)' },
  { id: 'ocean', name: '海洋', cssFilter: 'saturate(1.2) hue-rotate(180deg) brightness(1.05)' },
  { id: 'forest', name: '森林', cssFilter: 'saturate(1.1) hue-rotate(90deg) contrast(1.05)' },
];

export const STICKER_EMOJIS = [
  '📍', '❤️', '🌟', '✨', '📸', '🎨', '🌈', '☀️',
  '🌙', '⛰️', '🌊', '🌸', '🍃', '❄️', '🔥', '💫',
  '🎯', '🏆', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧',
  '✈️', '🚀', '🚗', '⛵', '🏝️', '🗽', '🏰', '🌋',
];

export const FONT_FAMILIES = [
  { id: 'sans', name: '无衬线', value: 'system-ui, -apple-system, sans-serif' },
  { id: 'serif', name: '衬线', value: 'Georgia, serif' },
  { id: 'mono', name: '等宽', value: 'ui-monospace, monospace' },
  { id: 'cursive', name: '手写', value: 'cursive' },
];

export const COLOR_PRESETS = [
  '#ffffff', '#000000', '#ff6b6b', '#4ecdc4', '#45b7d1',
  '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe',
  '#00b894', '#e17055', '#6c5ce7', '#00cec9', '#fab1a0',
];

export const VIEW_PRESETS: ViewPreset[] = [
  { id: 'default', name: '默认', heading: 0, pitch: 0, fov: 75 },
  { id: 'front', name: '正面', heading: 0, pitch: 0, fov: 75 },
  { id: 'back', name: '背面', heading: 180, pitch: 0, fov: 75 },
  { id: 'left', name: '左侧', heading: -90, pitch: 0, fov: 75 },
  { id: 'right', name: '右侧', heading: 90, pitch: 0, fov: 75 },
  { id: 'top', name: '俯视', heading: 0, pitch: 70, fov: 75 },
  { id: 'bottom', name: '仰视', heading: 0, pitch: -70, fov: 75 },
  { id: 'wide', name: '广角', heading: 0, pitch: 0, fov: 110 },
  { id: 'telephoto', name: '长焦', heading: 0, pitch: 0, fov: 35 },
];

interface EditorState {
  isEditorOpen: boolean;
  activeTab: 'watermark' | 'sticker' | 'filter' | 'weather' | 'camera' | 'export';
  
  filter: FilterType;
  weather: WeatherType;
  weatherIntensity: number;
  watermarks: Watermark[];
  stickers: Sticker[];
  
  autoRotate: boolean;
  autoRotateSpeed: number;
  fov: number;
  currentViewPreset: ViewPresetType | null;
  forcedHeading: number | null;
  forcedPitch: number | null;
  
  selectedItemId: string | null;
  selectedItemType: 'watermark' | 'sticker' | null;
  
  setEditorOpen: (open: boolean) => void;
  setActiveTab: (tab: 'watermark' | 'sticker' | 'filter' | 'weather' | 'camera' | 'export') => void;
  
  setFilter: (filter: FilterType) => void;
  setWeather: (weather: WeatherType) => void;
  setWeatherIntensity: (intensity: number) => void;
  
  setAutoRotate: (enabled: boolean) => void;
  setAutoRotateSpeed: (speed: number) => void;
  setFov: (fov: number) => void;
  setCurrentViewPreset: (preset: ViewPresetType | null) => void;
  setForcedCameraAngles: (heading: number, pitch: number) => void;
  clearForcedCameraAngles: () => void;
  
  addWatermark: (text: string) => void;
  updateWatermark: (id: string, updates: Partial<Watermark>) => void;
  deleteWatermark: (id: string) => void;
  
  addSticker: (emoji: string) => void;
  updateSticker: (id: string, updates: Partial<Sticker>) => void;
  deleteSticker: (id: string) => void;
  
  selectItem: (id: string | null, type: 'watermark' | 'sticker' | null) => void;
  
  clearAll: () => void;
  getFilterCss: () => string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export const useEditorStore = create<EditorState>((set, get) => ({
  isEditorOpen: false,
  activeTab: 'filter',
  
  filter: 'none',
  weather: 'none',
  weatherIntensity: 0.5,
  watermarks: [],
  stickers: [],
  
  autoRotate: false,
  autoRotateSpeed: 1,
  fov: 75,
  currentViewPreset: null,
  forcedHeading: null,
  forcedPitch: null,
  
  selectedItemId: null,
  selectedItemType: null,
  
  setEditorOpen: (open) => set({ isEditorOpen: open }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setFilter: (filter) => set({ filter }),
  setWeather: (weather) => set({ weather }),
  setWeatherIntensity: (weatherIntensity) => set({ weatherIntensity: Math.max(0, Math.min(1, weatherIntensity)) }),
  
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setAutoRotateSpeed: (autoRotateSpeed) => set({ autoRotateSpeed: Math.max(0.1, Math.min(5, autoRotateSpeed)) }),
  setFov: (fov) => set({ fov: Math.max(20, Math.min(120, fov)), currentViewPreset: null }),
  setCurrentViewPreset: (preset) => {
    if (preset) {
      const presetConfig = VIEW_PRESETS.find(p => p.id === preset);
      if (presetConfig) {
        set({ 
          currentViewPreset: preset, 
          fov: presetConfig.fov,
          forcedHeading: presetConfig.heading,
          forcedPitch: presetConfig.pitch
        });
      }
    } else {
      set({ currentViewPreset: null });
    }
  },
  setForcedCameraAngles: (heading, pitch) => set({ 
    forcedHeading: heading, 
    forcedPitch: pitch,
    currentViewPreset: null
  }),
  clearForcedCameraAngles: () => set({ forcedHeading: null, forcedPitch: null }),
  
  addWatermark: (text) => set((state) => ({
    watermarks: [...state.watermarks, {
      id: generateId(),
      text,
      x: 50,
      y: 50,
      fontSize: 24,
      fontFamily: FONT_FAMILIES[0].value,
      color: '#ffffff',
      opacity: 0.8,
      rotation: 0,
    }],
  })),
  
  updateWatermark: (id, updates) => set((state) => ({
    watermarks: state.watermarks.map(w => 
      w.id === id ? { ...w, ...updates } : w
    ),
  })),
  
  deleteWatermark: (id) => set((state) => ({
    watermarks: state.watermarks.filter(w => w.id !== id),
    selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    selectedItemType: state.selectedItemId === id ? null : state.selectedItemType,
  })),
  
  addSticker: (emoji) => set((state) => ({
    stickers: [...state.stickers, {
      id: generateId(),
      emoji,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
      opacity: 1,
    }],
  })),
  
  updateSticker: (id, updates) => set((state) => ({
    stickers: state.stickers.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ),
  })),
  
  deleteSticker: (id) => set((state) => ({
    stickers: state.stickers.filter(s => s.id !== id),
    selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    selectedItemType: state.selectedItemId === id ? null : state.selectedItemType,
  })),
  
  selectItem: (id, type) => set({ 
    selectedItemId: id, 
    selectedItemType: type 
  }),
  
  clearAll: () => set({
    watermarks: [],
    stickers: [],
    filter: 'none',
    weather: 'none',
    weatherIntensity: 0.5,
    autoRotate: false,
    autoRotateSpeed: 1,
    fov: 75,
    currentViewPreset: null,
    forcedHeading: null,
    forcedPitch: null,
    selectedItemId: null,
    selectedItemType: null,
  }),
  
  getFilterCss: () => {
    const filterConfig = FILTERS.find(f => f.id === get().filter);
    return filterConfig?.cssFilter || 'none';
  },
}));
