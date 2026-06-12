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
    id: "paris-street",
    name: "香榭丽舍大街",
    city: "巴黎",
    country: "法国",
    continent: "欧洲",
    description: "巴黎最著名的林荫大道，沿街林立着奢华精品店、咖啡馆和剧院。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
    latitude: 48.8708,
    longitude: 2.3063,
    initialHeading: 0,
    initialPitch: 0,
    tags: ["街道", "浪漫", "购物"]
  },
  {
    id: "new-york-manhattan",
    name: "曼哈顿第五大道",
    city: "纽约",
    country: "美国",
    continent: "北美洲",
    description: "世界顶级商业区，摩天大楼与繁华街景交织的都市奇观。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
    latitude: 40.7549,
    longitude: -73.9840,
    initialHeading: 90,
    initialPitch: 5,
    tags: ["都市", "繁华", "购物"]
  },
  {
    id: "tokyo-street",
    name: "新宿街头",
    city: "东京",
    country: "日本",
    continent: "亚洲",
    description: "霓虹闪烁的繁华街区，动漫文化与现代都市的完美融合。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
    latitude: 35.6895,
    longitude: 139.6917,
    initialHeading: 45,
    initialPitch: 3,
    tags: ["都市", "霓虹", "夜生活"]
  },
  {
    id: "sydney-harbor",
    name: "悉尼港",
    city: "悉尼",
    country: "澳大利亚",
    continent: "大洋洲",
    description: "世界最美海港之一，歌剧院与海港大桥相映成趣。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop",
    latitude: -33.8568,
    longitude: 151.2153,
    initialHeading: 180,
    initialPitch: 3,
    tags: ["海港", "地标", "风景"]
  },
  {
    id: "rome-ruins",
    name: "古罗马广场",
    city: "罗马",
    country: "意大利",
    continent: "欧洲",
    description: "古罗马帝国的政治中心，两千年历史的建筑遗迹群。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop",
    latitude: 41.8902,
    longitude: 12.4922,
    initialHeading: 270,
    initialPitch: 8,
    tags: ["古迹", "历史", "文明"]
  },
  {
    id: "grand-canyon-view",
    name: "大峡谷南缘",
    city: "亚利桑那州",
    country: "美国",
    continent: "北美洲",
    description: "科罗拉多高原上的地质奇观，亿万年风化雕琢的壮丽画卷。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1575408264798-b50b252663e6?w=400&h=300&fit=crop",
    latitude: 36.1069,
    longitude: -112.1129,
    initialHeading: 135,
    initialPitch: -8,
    tags: ["自然", "地质", "壮观"]
  },
  {
    id: "machu-picchu-peak",
    name: "马丘比丘山城",
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
    id: "great-wall-section",
    name: "慕田峪长城",
    city: "北京",
    country: "中国",
    continent: "亚洲",
    description: "万里长城的精华段落，蜿蜒于青山之巅的建筑奇迹。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop",
    latitude: 40.4319,
    longitude: 116.5704,
    initialHeading: 90,
    initialPitch: 5,
    tags: ["历史", "地标", "奇迹"]
  },
  {
    id: "iceland-aurora",
    name: "冰岛极光之夜",
    city: "雷克雅未克",
    country: "冰岛",
    continent: "欧洲",
    description: "北极圈的梦幻光影，皑皑白雪映衬下的绿色极光舞动。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&h=300&fit=crop",
    latitude: 64.1466,
    longitude: -21.9426,
    initialHeading: 0,
    initialPitch: 25,
    tags: ["自然", "极光", "奇幻"]
  },
  {
    id: "bali-sanur-beach",
    name: "沙努尔海滩",
    city: "巴厘岛",
    country: "印度尼西亚",
    continent: "亚洲",
    description: "巴厘岛最著名的日出海滩，椰林树影，碧海蓝天。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop",
    latitude: -8.7048,
    longitude: 115.2645,
    initialHeading: 180,
    initialPitch: -3,
    tags: ["海滩", "度假", "热带"]
  },
  {
    id: "venice-grand-canal",
    name: "大运河",
    city: "威尼斯",
    country: "意大利",
    continent: "欧洲",
    description: "威尼斯的水上主干道，两岸矗立着文艺复兴时期的华丽宫殿。",
    panoramaUrl: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop",
    latitude: 45.4408,
    longitude: 12.3155,
    initialHeading: 0,
    initialPitch: 3,
    tags: ["水城", "浪漫", "历史"]
  },
  {
    id: "taj-mahal-garden",
    name: "泰姬陵花园",
    city: "阿格拉",
    country: "印度",
    continent: "亚洲",
    description: "莫卧儿园林的典范，透过花瓣喷泉凝望白色大理石的永恒之美。",
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
  const filtered = excludeId
    ? streetViewLocations.filter(loc => loc.id !== excludeId)
    : streetViewLocations;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

export function getLocationsByContinent(continent: string): StreetViewLocation[] {
  return streetViewLocations.filter(loc => loc.continent === continent);
}
