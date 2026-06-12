export interface StreetViewLocation {
  id: string;
  name: string;
  city: string;
  country: string;
  continent: string;
  description: string;
  panoramaUrl: string;
  thumbnailUrl: string;
  latitude: number;
  longitude: number;
  initialHeading: number;
  initialPitch: number;
  tags: string[];
  theme: PanoramaTheme;
}

export interface PanoramaTheme {
  skyTop: string;
  skyBottom: string;
  groundTop: string;
  groundBottom: string;
  buildingColor1: string;
  buildingColor2: string;
  accentColor: string;
  streetLightColor: string;
  hasWater: boolean;
  hasMountains: boolean;
  hasTrees: boolean;
  buildingStyle: 'european' | 'modern' | 'asian' | 'desert' | 'tropical' | 'historic';
  timeOfDay: 'day' | 'sunset' | 'night' | 'dawn';
}

export const streetViewLocations: StreetViewLocation[] = [
  {
    id: "eiffel-tower",
    name: "埃菲尔铁塔",
    city: "巴黎",
    country: "法国",
    continent: "欧洲",
    description: "巴黎最著名的地标建筑，俯瞰塞纳河畔的浪漫之都。街头咖啡馆、奥斯曼风格建筑尽收眼底。",
    panoramaUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop",
    latitude: 48.8584,
    longitude: 2.2945,
    initialHeading: 0,
    initialPitch: 5,
    tags: ["地标", "浪漫", "历史"],
    theme: {
      skyTop: "#87CEEB",
      skyBottom: "#E0F4FF",
      groundTop: "#C9A86C",
      groundBottom: "#8B7355",
      buildingColor1: "#D4C5A9",
      buildingColor2: "#B8A888",
      accentColor: "#8B4513",
      streetLightColor: "#2C2C2C",
      hasWater: true,
      hasMountains: false,
      hasTrees: true,
      buildingStyle: 'european',
      timeOfDay: 'day'
    }
  },
  {
    id: "times-square",
    name: "时代广场",
    city: "纽约",
    country: "美国",
    continent: "北美洲",
    description: "世界的十字路口，霓虹闪烁的繁华都市中心。摩天大楼、巨型广告牌、百老汇剧院云集于此。",
    panoramaUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop",
    latitude: 40.7580,
    longitude: -73.9855,
    initialHeading: 90,
    initialPitch: 5,
    tags: ["都市", "夜景", "繁华"],
    theme: {
      skyTop: "#0a0a1a",
      skyBottom: "#1a1a3a",
      groundTop: "#2a2a2a",
      groundBottom: "#1a1a1a",
      buildingColor1: "#3a3a4a",
      buildingColor2: "#2a2a3a",
      accentColor: "#FF0066",
      streetLightColor: "#FFD700",
      hasWater: false,
      hasMountains: false,
      hasTrees: false,
      buildingStyle: 'modern',
      timeOfDay: 'night'
    }
  },
  {
    id: "tokyo-shibuya",
    name: "涩谷十字路口",
    city: "东京",
    country: "日本",
    continent: "亚洲",
    description: "世界最繁忙的十字路口，感受东京的现代都市脉搏。霓虹灯牌、动漫广告、高楼林立。",
    panoramaUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
    latitude: 35.6595,
    longitude: 139.7004,
    initialHeading: 45,
    initialPitch: 3,
    tags: ["都市", "现代", "科技"],
    theme: {
      skyTop: "#1a0a2e",
      skyBottom: "#3d1a5c",
      groundTop: "#1f1f1f",
      groundBottom: "#0f0f0f",
      buildingColor1: "#2d2d4a",
      buildingColor2: "#1a1a3a",
      accentColor: "#00FFFF",
      streetLightColor: "#FF69B4",
      hasWater: false,
      hasMountains: false,
      hasTrees: true,
      buildingStyle: 'asian',
      timeOfDay: 'night'
    }
  },
  {
    id: "sydney-opera",
    name: "悉尼歌剧院",
    city: "悉尼",
    country: "澳大利亚",
    continent: "大洋洲",
    description: "世界文化遗产，港湾边的建筑艺术杰作。悉尼海港大桥、蓝绿海水、白色帆船帆造型。",
    panoramaUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1523059623039-a9ed027e7b93?w=400&h=300&fit=crop",
    latitude: -33.8568,
    longitude: 151.2153,
    initialHeading: 180,
    initialPitch: 3,
    tags: ["地标", "海景", "艺术"],
    theme: {
      skyTop: "#4A90D9",
      skyBottom: "#87CEEB",
      groundTop: "#C2B280",
      groundBottom: "#8B7355",
      buildingColor1: "#F5F5F5",
      buildingColor2: "#E8E8E8",
      accentColor: "#E74C3C",
      streetLightColor: "#2C2C2C",
      hasWater: true,
      hasMountains: true,
      hasTrees: true,
      buildingStyle: 'modern',
      timeOfDay: 'day'
    }
  },
  {
    id: "colosseum",
    name: "罗马斗兽场",
    city: "罗马",
    country: "意大利",
    continent: "欧洲",
    description: "古罗马帝国的辉煌见证，两千年历史的建筑奇迹。鹅卵石街道、文艺复兴建筑、喷泉点缀。",
    panoramaUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop",
    latitude: 41.8902,
    longitude: 12.4922,
    initialHeading: 270,
    initialPitch: 8,
    tags: ["历史", "古迹", "文明"],
    theme: {
      skyTop: "#FF8C42",
      skyBottom: "#FFD699",
      groundTop: "#D2B48C",
      groundBottom: "#A0826D",
      buildingColor1: "#D4A574",
      buildingColor2: "#B8956A",
      accentColor: "#8B0000",
      streetLightColor: "#4A3728",
      hasWater: false,
      hasMountains: false,
      hasTrees: true,
      buildingStyle: 'historic',
      timeOfDay: 'sunset'
    }
  },
  {
    id: "grand-canyon",
    name: "大峡谷",
    city: "亚利桑那州",
    country: "美国",
    continent: "北美洲",
    description: "科罗拉多河雕刻数百万年的地球奇观，壮丽的自然画卷。红色岩层、无垠旷野、日落金辉。",
    panoramaUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1575408264798-b50b252663e6?w=400&h=300&fit=crop",
    latitude: 36.1069,
    longitude: -112.1129,
    initialHeading: 135,
    initialPitch: -8,
    tags: ["自然", "壮丽", "地质"],
    theme: {
      skyTop: "#FF7F50",
      skyBottom: "#FFDAB9",
      groundTop: "#CD853F",
      groundBottom: "#8B4513",
      buildingColor1: "#A0522D",
      buildingColor2: "#8B4513",
      accentColor: "#DAA520",
      streetLightColor: "#5C4033",
      hasWater: false,
      hasMountains: true,
      hasTrees: false,
      buildingStyle: 'desert',
      timeOfDay: 'sunset'
    }
  },
  {
    id: "machu-picchu",
    name: "马丘比丘",
    city: "库斯科",
    country: "秘鲁",
    continent: "南美洲",
    description: "印加帝国的失落之城，安第斯山脉云雾中的神秘遗迹。山峦叠嶂、云雾缭绕、石砌古建。",
    panoramaUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop",
    latitude: -13.1631,
    longitude: -72.5450,
    initialHeading: 225,
    initialPitch: 5,
    tags: ["古迹", "山脉", "神秘"],
    theme: {
      skyTop: "#708090",
      skyBottom: "#B0C4DE",
      groundTop: "#556B2F",
      groundBottom: "#2F4F2F",
      buildingColor1: "#A9A9A9",
      buildingColor2: "#808080",
      accentColor: "#228B22",
      streetLightColor: "#4A4A4A",
      hasWater: false,
      hasMountains: true,
      hasTrees: true,
      buildingStyle: 'historic',
      timeOfDay: 'dawn'
    }
  },
  {
    id: "great-wall",
    name: "万里长城",
    city: "北京",
    country: "中国",
    continent: "亚洲",
    description: "世界七大奇迹之一，蜿蜒群山之巅的人类建筑丰碑。秋色山峦、青砖城墙、烽火台相望。",
    panoramaUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop",
    latitude: 40.4319,
    longitude: 116.5704,
    initialHeading: 90,
    initialPitch: 5,
    tags: ["历史", "地标", "奇迹"],
    theme: {
      skyTop: "#6B8E23",
      skyBottom: "#9ACD32",
      groundTop: "#8B7355",
      groundBottom: "#5C4033",
      buildingColor1: "#808080",
      buildingColor2: "#696969",
      accentColor: "#B22222",
      streetLightColor: "#4A3728",
      hasWater: false,
      hasMountains: true,
      hasTrees: true,
      buildingStyle: 'asian',
      timeOfDay: 'day'
    }
  },
  {
    id: "northern-lights",
    name: "北极光",
    city: "雷克雅未克",
    country: "冰岛",
    continent: "欧洲",
    description: "大自然最壮观的光影秀，北极圈上空的神秘极光。皑皑白雪、火山岩地貌、绿色极光舞动。",
    panoramaUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&h=300&fit=crop",
    latitude: 64.1466,
    longitude: -21.9426,
    initialHeading: 0,
    initialPitch: 25,
    tags: ["自然", "极光", "奇幻"],
    theme: {
      skyTop: "#0B0B2B",
      skyBottom: "#1A1A4A",
      groundTop: "#E8E8E8",
      groundBottom: "#C0C0C0",
      buildingColor1: "#2F2F4F",
      buildingColor2: "#1F1F3F",
      accentColor: "#00FF7F",
      streetLightColor: "#FFD700",
      hasWater: true,
      hasMountains: true,
      hasTrees: false,
      buildingStyle: 'european',
      timeOfDay: 'night'
    }
  },
  {
    id: "bali-beach",
    name: "巴厘岛海滩",
    city: "巴厘岛",
    country: "印度尼西亚",
    continent: "亚洲",
    description: "热带天堂的碧海银沙，感受东南亚的悠闲风情。椰林树影、碧蓝海水、传统茅屋。",
    panoramaUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop",
    latitude: -8.4095,
    longitude: 115.1889,
    initialHeading: 180,
    initialPitch: -3,
    tags: ["海滩", "度假", "热带"],
    theme: {
      skyTop: "#00BFFF",
      skyBottom: "#87CEEB",
      groundTop: "#F4D03F",
      groundBottom: "#DEB887",
      buildingColor1: "#DAA520",
      buildingColor2: "#8B4513",
      accentColor: "#32CD32",
      streetLightColor: "#8B4513",
      hasWater: true,
      hasMountains: false,
      hasTrees: true,
      buildingStyle: 'tropical',
      timeOfDay: 'day'
    }
  },
  {
    id: "venice-canals",
    name: "威尼斯运河",
    city: "威尼斯",
    country: "意大利",
    continent: "欧洲",
    description: "水上之城的浪漫贡多拉，穿梭于千年历史的水道之间。彩色建筑、叹息桥、落日余晖。",
    panoramaUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop",
    latitude: 45.4408,
    longitude: 12.3155,
    initialHeading: 0,
    initialPitch: 3,
    tags: ["水城", "浪漫", "历史"],
    theme: {
      skyTop: "#FFB347",
      skyBottom: "#FFDAB9",
      groundTop: "#87CEEB",
      groundBottom: "#5F9EA0",
      buildingColor1: "#F5DEB3",
      buildingColor2: "#DEB887",
      accentColor: "#CD5C5C",
      streetLightColor: "#4A3728",
      hasWater: true,
      hasMountains: false,
      hasTrees: false,
      buildingStyle: 'european',
      timeOfDay: 'sunset'
    }
  },
  {
    id: "taj-mahal",
    name: "泰姬陵",
    city: "阿格拉",
    country: "印度",
    continent: "亚洲",
    description: "永恒爱情的象征，莫卧儿建筑艺术的巅峰之作。白色大理石、倒影水池、莫卧儿花园。",
    panoramaUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop",
    latitude: 27.1751,
    longitude: 78.0421,
    initialHeading: 0,
    initialPitch: 5,
    tags: ["建筑", "浪漫", "历史"],
    theme: {
      skyTop: "#E6B800",
      skyBottom: "#FFE4B5",
      groundTop: "#90EE90",
      groundBottom: "#228B22",
      buildingColor1: "#FFFAF0",
      buildingColor2: "#F5F5DC",
      accentColor: "#FFD700",
      streetLightColor: "#8B4513",
      hasWater: true,
      hasMountains: false,
      hasTrees: true,
      buildingStyle: 'asian',
      timeOfDay: 'dawn'
    }
  }
];

export function getRandomLocation(excludeId?: string): StreetViewLocation {
  let filtered = streetViewLocations;
  if (excludeId) {
    filtered = streetViewLocations.filter(loc => loc.id !== excludeId);
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

export function getLocationsByContinent(continent: string): StreetViewLocation[] {
  return streetViewLocations.filter(loc => loc.continent === continent);
}
