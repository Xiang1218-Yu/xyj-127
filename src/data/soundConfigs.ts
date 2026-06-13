export interface SoundLayer {
  type: 'noise' | 'sine' | 'triangle' | 'sawtooth' | 'square';
  frequency: number;
  volume: number;
  filter?: {
    type: 'lowpass' | 'highpass' | 'bandpass';
    frequency: number;
    Q?: number;
  };
  modulation?: {
    type: 'lfo' | 'envelope';
    frequency?: number;
    depth?: number;
    attack?: number;
    release?: number;
  };
}

export interface AmbientSoundConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  layers: SoundLayer[];
  masterVolume: number;
}

export const ambientSoundConfigs: Record<string, AmbientSoundConfig> = {
  ocean: {
    id: 'ocean',
    name: '海浪',
    icon: '🌊',
    description: '轻柔的海浪拍岸声',
    masterVolume: 0.4,
    layers: [
      {
        type: 'noise',
        frequency: 0,
        volume: 0.35,
        filter: { type: 'lowpass', frequency: 800, Q: 0.5 },
        modulation: { type: 'lfo', frequency: 0.15, depth: 0.4 }
      },
      {
        type: 'sine',
        frequency: 60,
        volume: 0.15,
        modulation: { type: 'lfo', frequency: 0.1, depth: 0.3 }
      }
    ]
  },
  forest: {
    id: 'forest',
    name: '森林',
    icon: '🌲',
    description: '林间鸟鸣与微风',
    masterVolume: 0.35,
    layers: [
      {
        type: 'noise',
        frequency: 0,
        volume: 0.2,
        filter: { type: 'lowpass', frequency: 2000, Q: 0.3 }
      },
      {
        type: 'sine',
        frequency: 2000,
        volume: 0.08,
        modulation: { type: 'lfo', frequency: 3, depth: 0.8 }
      },
      {
        type: 'sine',
        frequency: 3500,
        volume: 0.05,
        modulation: { type: 'lfo', frequency: 5, depth: 0.6 }
      }
    ]
  },
  city: {
    id: 'city',
    name: '都市',
    icon: '🏙️',
    description: '城市交通与人声',
    masterVolume: 0.3,
    layers: [
      {
        type: 'noise',
        frequency: 0,
        volume: 0.25,
        filter: { type: 'lowpass', frequency: 400, Q: 0.7 }
      },
      {
        type: 'sine',
        frequency: 120,
        volume: 0.1,
        modulation: { type: 'lfo', frequency: 0.5, depth: 0.2 }
      },
      {
        type: 'sawtooth',
        frequency: 80,
        volume: 0.05,
        filter: { type: 'lowpass', frequency: 300, Q: 0.5 }
      }
    ]
  },
  rain: {
    id: 'rain',
    name: '雨声',
    icon: '🌧️',
    description: '淅沥沥的雨滴声',
    masterVolume: 0.4,
    layers: [
      {
        type: 'noise',
        frequency: 0,
        volume: 0.4,
        filter: { type: 'lowpass', frequency: 6000, Q: 0.3 }
      },
      {
        type: 'noise',
        frequency: 0,
        volume: 0.15,
        filter: { type: 'highpass', frequency: 4000, Q: 0.5 },
        modulation: { type: 'lfo', frequency: 2, depth: 0.5 }
      }
    ]
  },
  wind: {
    id: 'wind',
    name: '山风',
    icon: '💨',
    description: '山间呼啸的风声',
    masterVolume: 0.35,
    layers: [
      {
        type: 'noise',
        frequency: 0,
        volume: 0.3,
        filter: { type: 'bandpass', frequency: 500, Q: 2 },
        modulation: { type: 'lfo', frequency: 0.3, depth: 0.6 }
      },
      {
        type: 'noise',
        frequency: 0,
        volume: 0.15,
        filter: { type: 'bandpass', frequency: 1500, Q: 3 },
        modulation: { type: 'lfo', frequency: 0.4, depth: 0.5 }
      }
    ]
  },
  night: {
    id: 'night',
    name: '夜晚',
    icon: '🌙',
    description: '宁静的夜晚虫鸣',
    masterVolume: 0.25,
    layers: [
      {
        type: 'sine',
        frequency: 4000,
        volume: 0.08,
        modulation: { type: 'lfo', frequency: 0.5, depth: 1 }
      },
      {
        type: 'sine',
        frequency: 6000,
        volume: 0.05,
        modulation: { type: 'lfo', frequency: 0.7, depth: 1 }
      },
      {
        type: 'sine',
        frequency: 80,
        volume: 0.05
      }
    ]
  },
  crowd: {
    id: 'crowd',
    name: '人群',
    icon: '👥',
    description: '热闹的人群喧闹声',
    masterVolume: 0.3,
    layers: [
      {
        type: 'noise',
        frequency: 0,
        volume: 0.2,
        filter: { type: 'bandpass', frequency: 800, Q: 1 }
      },
      {
        type: 'noise',
        frequency: 0,
        volume: 0.15,
        filter: { type: 'bandpass', frequency: 1500, Q: 1.5 }
      }
    ]
  },
  snow: {
    id: 'snow',
    name: '雪境',
    icon: '❄️',
    description: '静谧的雪夜氛围',
    masterVolume: 0.2,
    layers: [
      {
        type: 'noise',
        frequency: 0,
        volume: 0.15,
        filter: { type: 'lowpass', frequency: 200, Q: 0.3 }
      },
      {
        type: 'sine',
        frequency: 120,
        volume: 0.08
      },
      {
        type: 'sine',
        frequency: 180,
        volume: 0.05
      }
    ]
  },
  aurora: {
    id: 'aurora',
    name: '极光',
    icon: '✨',
    description: '梦幻极光的神秘低频',
    masterVolume: 0.3,
    layers: [
      {
        type: 'sine',
        frequency: 50,
        volume: 0.15,
        modulation: { type: 'lfo', frequency: 0.2, depth: 0.5 }
      },
      {
        type: 'sine',
        frequency: 100,
        volume: 0.1,
        modulation: { type: 'lfo', frequency: 0.3, depth: 0.4 }
      },
      {
        type: 'sine',
        frequency: 200,
        volume: 0.08,
        modulation: { type: 'lfo', frequency: 0.5, depth: 0.6 }
      },
      {
        type: 'triangle',
        frequency: 300,
        volume: 0.05,
        modulation: { type: 'lfo', frequency: 0.7, depth: 0.3 }
      }
    ]
  },
  history: {
    id: 'history',
    name: '古迹',
    icon: '🏛️',
    description: '古老遗迹的悠远回响',
    masterVolume: 0.28,
    layers: [
      {
        type: 'sine',
        frequency: 80,
        volume: 0.12,
        modulation: { type: 'lfo', frequency: 0.1, depth: 0.3 }
      },
      {
        type: 'sine',
        frequency: 160,
        volume: 0.08
      },
      {
        type: 'noise',
        frequency: 0,
        volume: 0.1,
        filter: { type: 'lowpass', frequency: 300, Q: 0.5 }
      }
    ]
  },
  tropical: {
    id: 'tropical',
    name: '热带',
    icon: '🌴',
    description: '热带雨林的生机勃勃',
    masterVolume: 0.35,
    layers: [
      {
        type: 'noise',
        frequency: 0,
        volume: 0.2,
        filter: { type: 'lowpass', frequency: 1500, Q: 0.3 }
      },
      {
        type: 'sine',
        frequency: 800,
        volume: 0.08,
        modulation: { type: 'lfo', frequency: 4, depth: 0.7 }
      },
      {
        type: 'sine',
        frequency: 1500,
        volume: 0.06,
        modulation: { type: 'lfo', frequency: 6, depth: 0.5 }
      },
      {
        type: 'sine',
        frequency: 3000,
        volume: 0.04,
        modulation: { type: 'lfo', frequency: 8, depth: 0.8 }
      }
    ]
  }
};

export const tagToSoundMap: Record<string, string[]> = {
  '海滩': ['ocean'],
  '海港': ['ocean'],
  '海洋': ['ocean'],
  '山脉': ['wind'],
  '峡谷': ['wind'],
  '高原': ['wind'],
  '山风': ['wind'],
  '都市': ['city', 'crowd'],
  '繁华': ['city', 'crowd'],
  '街道': ['city'],
  '购物': ['crowd'],
  '夜生活': ['city', 'night'],
  '霓虹': ['night'],
  '森林': ['forest'],
  '丛林': ['forest'],
  '自然': ['forest'],
  '雨林': ['tropical'],
  '热带': ['tropical'],
  '度假': ['tropical', 'ocean'],
  '雨': ['rain'],
  '雨天': ['rain'],
  '雪': ['snow'],
  '雪山': ['snow', 'wind'],
  '冰雪': ['snow'],
  '极光': ['aurora'],
  '奇幻': ['aurora'],
  '神秘': ['aurora', 'history'],
  '古迹': ['history'],
  '历史': ['history'],
  '文明': ['history'],
  '遗迹': ['history'],
  '建筑': ['history'],
  '地标': ['history', 'crowd'],
  '奇迹': ['history'],
  '水城': ['ocean', 'history'],
  '浪漫': ['night', 'history'],
  '风景': ['forest', 'wind'],
  '壮观': ['wind', 'history'],
  '地质': ['wind', 'history']
};

export function getMatchingSounds(tags: string[]): string[] {
  const matchedSounds = new Set<string>();
  
  for (const tag of tags) {
    const sounds = tagToSoundMap[tag];
    if (sounds) {
      sounds.forEach(sound => matchedSounds.add(sound));
    }
  }
  
  if (matchedSounds.size === 0) {
    return ['forest'];
  }
  
  return Array.from(matchedSounds);
}

export function getDominantSound(tags: string[]): string {
  const sounds = getMatchingSounds(tags);
  return sounds[0] || 'forest';
}
