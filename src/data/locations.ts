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
}

export const streetViewLocations: StreetViewLocation[] = [
  {
    id: "eiffel-tower",
    name: "埃菲尔铁塔",
    city: "巴黎",
    country: "法国",
    continent: "欧洲",
    description: "巴黎最著名的地标建筑，俯瞰塞纳河畔的浪漫之都。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop",
    latitude: 48.8584,
    longitude: 2.2945,
    initialHeading: 0,
    initialPitch: 0,
    tags: ["地标", "浪漫", "历史"]
  },
  {
    id: "times-square",
    name: "时代广场",
    city: "纽约",
    country: "美国",
    continent: "北美洲",
    description: "世界的十字路口，霓虹闪烁的繁华都市中心。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop",
    latitude: 40.7580,
    longitude: -73.9855,
    initialHeading: 90,
    initialPitch: 5,
    tags: ["都市", "夜景", "繁华"]
  },
  {
    id: "tokyo-shibuya",
    name: "涩谷十字路口",
    city: "东京",
    country: "日本",
    continent: "亚洲",
    description: "世界最繁忙的十字路口，感受东京的现代都市脉搏。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
    latitude: 35.6595,
    longitude: 139.7004,
    initialHeading: 45,
    initialPitch: 0,
    tags: ["都市", "现代", "科技"]
  },
  {
    id: "sydney-opera",
    name: "悉尼歌剧院",
    city: "悉尼",
    country: "澳大利亚",
    continent: "大洋洲",
    description: "世界文化遗产，港湾边的建筑艺术杰作。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1523059623039-a9ed027e7b93?w=400&h=300&fit=crop",
    latitude: -33.8568,
    longitude: 151.2153,
    initialHeading: 180,
    initialPitch: 0,
    tags: ["地标", "海景", "艺术"]
  },
  {
    id: "colosseum",
    name: "罗马斗兽场",
    city: "罗马",
    country: "意大利",
    continent: "欧洲",
    description: "古罗马帝国的辉煌见证，两千年历史的建筑奇迹。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop",
    latitude: 41.8902,
    longitude: 12.4922,
    initialHeading: 270,
    initialPitch: 10,
    tags: ["历史", "古迹", "文明"]
  },
  {
    id: "grand-canyon",
    name: "大峡谷",
    city: "亚利桑那州",
    country: "美国",
    continent: "北美洲",
    description: "科罗拉多河雕刻数百万年的地球奇观，壮丽的自然画卷。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1575408264798-b50b252663e6?w=400&h=300&fit=crop",
    latitude: 36.1069,
    longitude: -112.1129,
    initialHeading: 135,
    initialPitch: -5,
    tags: ["自然", "壮丽", "地质"]
  },
  {
    id: "machu-picchu",
    name: "马丘比丘",
    city: "库斯科",
    country: "秘鲁",
    continent: "南美洲",
    description: "印加帝国的失落之城，安第斯山脉云雾中的神秘遗迹。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop",
    latitude: -13.1631,
    longitude: -72.5450,
    initialHeading: 225,
    initialPitch: 5,
    tags: ["古迹", "山脉", "神秘"]
  },
  {
    id: "great-wall",
    name: "万里长城",
    city: "北京",
    country: "中国",
    continent: "亚洲",
    description: "世界七大奇迹之一，蜿蜒群山之巅的人类建筑丰碑。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop",
    latitude: 40.4319,
    longitude: 116.5704,
    initialHeading: 90,
    initialPitch: 5,
    tags: ["历史", "地标", "奇迹"]
  },
  {
    id: "northern-lights",
    name: "北极光",
    city: "雷克雅未克",
    country: "冰岛",
    continent: "欧洲",
    description: "大自然最壮观的光影秀，北极圈上空的神秘极光。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&h=300&fit=crop",
    latitude: 64.1466,
    longitude: -21.9426,
    initialHeading: 0,
    initialPitch: 30,
    tags: ["自然", "极光", "奇幻"]
  },
  {
    id: "bali-beach",
    name: "巴厘岛海滩",
    city: "巴厘岛",
    country: "印度尼西亚",
    continent: "亚洲",
    description: "热带天堂的碧海银沙，感受东南亚的悠闲风情。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop",
    latitude: -8.4095,
    longitude: 115.1889,
    initialHeading: 180,
    initialPitch: -5,
    tags: ["海滩", "度假", "热带"]
  },
  {
    id: "venice-canals",
    name: "威尼斯运河",
    city: "威尼斯",
    country: "意大利",
    continent: "欧洲",
    description: "水上之城的浪漫贡多拉，穿梭于千年历史的水道之间。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop",
    latitude: 45.4408,
    longitude: 12.3155,
    initialHeading: 0,
    initialPitch: 0,
    tags: ["水城", "浪漫", "历史"]
  },
  {
    id: "taj-mahal",
    name: "泰姬陵",
    city: "阿格拉",
    country: "印度",
    continent: "亚洲",
    description: "永恒爱情的象征，莫卧儿建筑艺术的巅峰之作。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop",
    latitude: 27.1751,
    longitude: 78.0421,
    initialHeading: 0,
    initialPitch: 5,
    tags: ["建筑", "浪漫", "历史"]
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
