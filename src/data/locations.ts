export interface MonthlyClimate {
  month: string;
  tempHigh: number;
  tempLow: number;
  rainfall: number;
}

export interface ClimateInfo {
  type: string;
  avgTemp: string;
  bestSeason: string;
  monthlyData: MonthlyClimate[];
}

export interface CultureHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface TravelTip {
  icon: string;
  title: string;
  content: string;
}

export interface TravelAdvice {
  transport: string;
  accommodation: string;
  budget: string;
  safety: string;
}

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
  climate: ClimateInfo;
  culture: CultureHighlight[];
  tips: TravelTip[];
  travelAdvice: TravelAdvice;
}

export const streetViewLocations: StreetViewLocation[] = [
  {
    id: "paris-street",
    name: "香榭丽舍大街",
    city: "巴黎",
    country: "法国",
    continent: "欧洲",
    description: "巴黎最著名的林荫大道，沿街林立着奢华精品店、咖啡馆和剧院。",
    panoramaUrl: "/textures/pano1.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
    latitude: 48.8708,
    longitude: 2.3063,
    initialHeading: 0,
    initialPitch: 0,
    tags: ["街道", "浪漫", "购物"],
    climate: {
      type: "温带海洋性气候",
      avgTemp: "12°C",
      bestSeason: "4月-6月 / 9月-10月",
      monthlyData: [
        { month: "1月", tempHigh: 6, tempLow: 1, rainfall: 51 },
        { month: "2月", tempHigh: 7, tempLow: 1, rainfall: 41 },
        { month: "3月", tempHigh: 12, tempLow: 4, rainfall: 48 },
        { month: "4月", tempHigh: 16, tempLow: 7, rainfall: 52 },
        { month: "5月", tempHigh: 20, tempLow: 10, rainfall: 63 },
        { month: "6月", tempHigh: 23, tempLow: 13, rainfall: 50 },
        { month: "7月", tempHigh: 25, tempLow: 16, rainfall: 62 },
        { month: "8月", tempHigh: 25, tempLow: 15, rainfall: 53 },
        { month: "9月", tempHigh: 21, tempLow: 12, rainfall: 55 },
        { month: "10月", tempHigh: 16, tempLow: 8, rainfall: 60 },
        { month: "11月", tempHigh: 10, tempLow: 4, rainfall: 52 },
        { month: "12月", tempHigh: 7, tempLow: 2, rainfall: 58 },
      ],
    },
    culture: [
      { icon: "🎨", title: "艺术之都", description: "卢浮宫、奥赛博物馆等世界级艺术殿堂汇聚于此" },
      { icon: "☕", title: "咖啡文化", description: "街边咖啡馆是巴黎人社交生活的核心场所" },
      { icon: "🥐", title: "美食传统", description: "法式面包、甜点与米其林餐厅构成独特美食版图" },
      { icon: "💃", title: "浪漫气质", description: "塞纳河畔漫步与黄昏的铁塔是浪漫的代名词" },
    ],
    tips: [
      { icon: "🗣️", title: "语言提示", content: "法语为主，旅游区英语可用，学几句法语更受欢迎" },
      { icon: "💶", title: "消费水平", content: "人均日消费约80-150欧元，博物馆周日免费" },
      { icon: "🚇", title: "出行建议", content: "地铁10次票更划算，避开早晚高峰" },
      { icon: "⚠️", title: "安全提醒", content: "注意扒手，尤其在地铁和旅游热点区域" },
    ],
    travelAdvice: {
      transport: "巴黎地铁覆盖全城，单程票2.15欧，建议购买Navigo周卡",
      accommodation: "玛黑区和圣日耳曼区安全便捷，蒙马特有性价比之选",
      budget: "中等消费水平，日均80-150欧元（含住宿）",
      safety: "旅游区治安良好，注意防范扒手，夜间避开郊区",
    },
  },
  {
    id: "new-york-manhattan",
    name: "曼哈顿第五大道",
    city: "纽约",
    country: "美国",
    continent: "北美洲",
    description: "世界顶级商业区，摩天大楼与繁华街景交织的都市奇观。",
    panoramaUrl: "/textures/pano_alps.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
    latitude: 40.7549,
    longitude: -73.9840,
    initialHeading: 90,
    initialPitch: 5,
    tags: ["都市", "繁华", "购物"],
    climate: {
      type: "温带大陆性湿润气候",
      avgTemp: "13°C",
      bestSeason: "4月-6月 / 9月-11月",
      monthlyData: [
        { month: "1月", tempHigh: 3, tempLow: -3, rainfall: 86 },
        { month: "2月", tempHigh: 4, tempLow: -2, rainfall: 78 },
        { month: "3月", tempHigh: 10, tempLow: 2, rainfall: 111 },
        { month: "4月", tempHigh: 16, tempLow: 7, rainfall: 114 },
        { month: "5月", tempHigh: 22, tempLow: 13, rainfall: 106 },
        { month: "6月", tempHigh: 27, tempLow: 18, rainfall: 112 },
        { month: "7月", tempHigh: 30, tempLow: 21, rainfall: 117 },
        { month: "8月", tempHigh: 29, tempLow: 20, rainfall: 113 },
        { month: "9月", tempHigh: 25, tempLow: 16, rainfall: 109 },
        { month: "10月", tempHigh: 18, tempLow: 10, rainfall: 112 },
        { month: "11月", tempHigh: 12, tempLow: 5, rainfall: 102 },
        { month: "12月", tempHigh: 6, tempLow: 0, rainfall: 102 },
      ],
    },
    culture: [
      { icon: "🗽", title: "自由精神", description: "多元文化大熔炉，包容与自由是城市的灵魂" },
      { icon: "🎭", title: "百老汇文化", description: "世界戏剧与音乐剧的中心，每晚数十场演出" },
      { icon: "🍕", title: "快餐传奇", description: "纽约披萨与百吉饼是城市的味觉标志" },
      { icon: "🏙️", title: "摩天文化", description: "从帝国大厦到世贸中心，天际线定义了城市美学" },
    ],
    tips: [
      { icon: "🗣️", title: "语言提示", content: "英语为主，多元社区中西班牙语、中文也常用" },
      { icon: "💵", title: "消费水平", content: "消费较高，人均日消费约100-200美元" },
      { icon: "🚕", title: "出行建议", content: "地铁24小时运营，Uber/Lyft方便但高峰期贵" },
      { icon: "💡", title: "省钱攻略", content: "CityPASS可省景点门票40%，博物馆有免费时段" },
    ],
    travelAdvice: {
      transport: "地铁24小时运营，MetroCard充值使用，出租车需给15-20%小费",
      accommodation: "曼哈顿中城交通便利但贵，布鲁克林性价比更高",
      budget: "高消费城市，日均100-200美元（含住宿）",
      safety: "整体安全，深夜避免中央公园和部分地铁线路",
    },
  },
  {
    id: "tokyo-street",
    name: "新宿街头",
    city: "东京",
    country: "日本",
    continent: "亚洲",
    description: "霓虹闪烁的繁华街区，动漫文化与现代都市的完美融合。",
    panoramaUrl: "/textures/pano_ocean.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
    latitude: 35.6895,
    longitude: 139.6917,
    initialHeading: 45,
    initialPitch: 3,
    tags: ["都市", "霓虹", "夜生活"],
    climate: {
      type: "温带季风气候",
      avgTemp: "16°C",
      bestSeason: "3月-5月 / 10月-11月",
      monthlyData: [
        { month: "1月", tempHigh: 10, tempLow: 1, rainfall: 52 },
        { month: "2月", tempHigh: 10, tempLow: 2, rainfall: 56 },
        { month: "3月", tempHigh: 14, tempLow: 5, rainfall: 117 },
        { month: "4月", tempHigh: 19, tempLow: 10, rainfall: 124 },
        { month: "5月", tempHigh: 24, tempLow: 15, rainfall: 137 },
        { month: "6月", tempHigh: 26, tempLow: 19, rainfall: 167 },
        { month: "7月", tempHigh: 30, tempLow: 23, rainfall: 153 },
        { month: "8月", tempHigh: 31, tempLow: 24, rainfall: 168 },
        { month: "9月", tempHigh: 27, tempLow: 20, rainfall: 209 },
        { month: "10月", tempHigh: 22, tempLow: 14, rainfall: 197 },
        { month: "11月", tempHigh: 16, tempLow: 9, rainfall: 92 },
        { month: "12月", tempHigh: 12, tempLow: 3, rainfall: 51 },
      ],
    },
    culture: [
      { icon: "🎌", title: "传统与现代", description: "神社与摩天楼并存，千年传统与尖端科技交织" },
      { icon: "🎌", title: "动漫圣地", description: "秋叶原与池袋是全球动漫迷的朝圣之地" },
      { icon: "🍜", title: "美食天堂", description: "从米其林星级到街头拉面，味蕾的极致体验" },
      { icon: "🚄", title: "匠人精神", description: "精致入微的服务文化体现了日本人的匠心" },
    ],
    tips: [
      { icon: "🗣️", title: "语言提示", content: "日语为主，旅游区英语标识较完善" },
      { icon: "💴", title: "消费水平", content: "中等偏高，日均消费约10000-20000日元" },
      { icon: "🚃", title: "出行建议", content: "SUICA/PASMO卡通用，新宿站注意出口编号" },
      { icon: "礼仪", title: "文化礼仪", content: "电车中请勿打电话，进食请在指定区域" },
    ],
    travelAdvice: {
      transport: "铁路网络发达，SUICA卡可乘地铁/公交/购物，出租车起步价约420日元",
      accommodation: "新宿/池袋交通便利，胶囊旅馆体验独特且经济",
      budget: "中等偏高消费，日均10000-20000日元（含住宿）",
      safety: "全球最安全城市之一，深夜独行也无太大风险",
    },
  },
  {
    id: "sydney-harbor",
    name: "悉尼港",
    city: "悉尼",
    country: "澳大利亚",
    continent: "大洋洲",
    description: "世界最美海港之一，歌剧院与海港大桥相映成趣。",
    panoramaUrl: "/textures/pano_ocean.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop",
    latitude: -33.8568,
    longitude: 151.2153,
    initialHeading: 180,
    initialPitch: 3,
    tags: ["海港", "地标", "风景"],
    climate: {
      type: "温带海洋性气候",
      avgTemp: "18°C",
      bestSeason: "10月-4月（南半球夏季）",
      monthlyData: [
        { month: "1月", tempHigh: 27, tempLow: 20, rainfall: 102 },
        { month: "2月", tempHigh: 27, tempLow: 20, rainfall: 117 },
        { month: "3月", tempHigh: 25, tempLow: 18, rainfall: 131 },
        { month: "4月", tempHigh: 23, tempLow: 15, rainfall: 127 },
        { month: "5月", tempHigh: 20, tempLow: 12, rainfall: 123 },
        { month: "6月", tempHigh: 17, tempLow: 9, rainfall: 132 },
        { month: "7月", tempHigh: 17, tempLow: 8, rainfall: 98 },
        { month: "8月", tempHigh: 18, tempLow: 9, rainfall: 81 },
        { month: "9月", tempHigh: 21, tempLow: 11, rainfall: 69 },
        { month: "10月", tempHigh: 23, tempLow: 14, rainfall: 77 },
        { month: "11月", tempHigh: 24, tempLow: 16, rainfall: 83 },
        { month: "12月", tempHigh: 26, tempLow: 18, rainfall: 78 },
      ],
    },
    culture: [
      { icon: "🏄", title: "冲浪文化", description: "邦迪海滩是全球冲浪爱好者的圣地" },
      { icon: "🎭", title: "艺术地标", description: "歌剧院不仅是一座建筑，更是文化符号" },
      { icon: "🦘", title: "自然生态", description: "独特的有袋类动物和珊瑚礁生态系统" },
      { icon: "🍷", title: "酒庄文化", description: "猎人谷产区出品世界级葡萄酒" },
    ],
    tips: [
      { icon: "🗣️", title: "语言提示", content: "英语为官方语言，口音独特但易于理解" },
      { icon: "💵", title: "消费水平", content: "中等偏高，日均约120-200澳元" },
      { icon: "🚢", title: "出行建议", content: "渡轮是最美交通方式，Opal卡通用" },
      { icon: "☀️", title: "防晒提醒", content: "紫外线强烈，SPF50+防晒霜必备" },
    ],
    travelAdvice: {
      transport: "Opal卡乘公交/火车/渡轮，渡轮穿越海港风景极佳",
      accommodation: "环形码头附近最便利，达令港区域性价比好",
      budget: "中等偏高消费，日均120-200澳元（含住宿）",
      safety: "治安良好，海滩注意暗流，野外注意野生动物",
    },
  },
  {
    id: "rome-ruins",
    name: "古罗马广场",
    city: "罗马",
    country: "意大利",
    continent: "欧洲",
    description: "古罗马帝国的政治中心，两千年历史的建筑遗迹群。",
    panoramaUrl: "/textures/pano1.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop",
    latitude: 41.8902,
    longitude: 12.4922,
    initialHeading: 270,
    initialPitch: 8,
    tags: ["古迹", "历史", "文明"],
    climate: {
      type: "地中海气候",
      avgTemp: "16°C",
      bestSeason: "4月-6月 / 9月-10月",
      monthlyData: [
        { month: "1月", tempHigh: 12, tempLow: 3, rainfall: 67 },
        { month: "2月", tempHigh: 13, tempLow: 3, rainfall: 73 },
        { month: "3月", tempHigh: 16, tempLow: 5, rainfall: 58 },
        { month: "4月", tempHigh: 19, tempLow: 8, rainfall: 80 },
        { month: "5月", tempHigh: 24, tempLow: 12, rainfall: 53 },
        { month: "6月", tempHigh: 28, tempLow: 16, rainfall: 34 },
        { month: "7月", tempHigh: 32, tempLow: 19, rainfall: 19 },
        { month: "8月", tempHigh: 32, tempLow: 19, rainfall: 37 },
        { month: "9月", tempHigh: 27, tempLow: 15, rainfall: 68 },
        { month: "10月", tempHigh: 22, tempLow: 12, rainfall: 98 },
        { month: "11月", tempHigh: 16, tempLow: 7, rainfall: 130 },
        { month: "12月", tempHigh: 13, tempLow: 4, rainfall: 111 },
      ],
    },
    culture: [
      { icon: "🏛️", title: "永恒之城", description: "两千年文明层叠，每个街角都有历史故事" },
      { icon: "🍝", title: "意式美食", description: "手工意面、薄底披萨与Gelato构成味觉天堂" },
      { icon: "⛪", title: "宗教艺术", description: "梵蒂冈与数百年教堂展示了无与伦比的宗教艺术" },
      { icon: "🤌", title: "生活哲学", description: "Dolce Vita——甜蜜生活是罗马人的信仰" },
    ],
    tips: [
      { icon: "🗣️", title: "语言提示", content: "意大利语为主，旅游区英语可用" },
      { icon: "💶", title: "消费水平", content: "中等消费，日均约70-130欧元" },
      { icon: "🏛️", title: "参观建议", content: "Roma Pass可免费进入前两个景点并享交通优惠" },
      { icon: "💧", title: "实用提醒", content: "公共饮水喷泉(nasoni)水质可直饮" },
    ],
    travelAdvice: {
      transport: "地铁仅三条线，公交更实用，步行是探索老城最佳方式",
      accommodation: "特拉斯提弗列区氛围好，中央火车站附近交通便利",
      budget: "中等消费水平，日均70-130欧元（含住宿）",
      safety: "旅游景点注意扒手，出租车请认准白色正规车辆",
    },
  },
  {
    id: "grand-canyon-view",
    name: "大峡谷南缘",
    city: "亚利桑那州",
    country: "美国",
    continent: "北美洲",
    description: "科罗拉多高原上的地质奇观，亿万年风化雕琢的壮丽画卷。",
    panoramaUrl: "/textures/pano_alps.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1575408264798-b50b252663e6?w=400&h=300&fit=crop",
    latitude: 36.1069,
    longitude: -112.1129,
    initialHeading: 135,
    initialPitch: -8,
    tags: ["自然", "地质", "壮观"],
    climate: {
      type: "干旱半干旱气候",
      avgTemp: "15°C",
      bestSeason: "3月-5月 / 9月-11月",
      monthlyData: [
        { month: "1月", tempHigh: 5, tempLow: -8, rainfall: 32 },
        { month: "2月", tempHigh: 8, tempLow: -5, rainfall: 29 },
        { month: "3月", tempHigh: 13, tempLow: -2, rainfall: 31 },
        { month: "4月", tempHigh: 18, tempLow: 2, rainfall: 22 },
        { month: "5月", tempHigh: 24, tempLow: 6, rainfall: 15 },
        { month: "6月", tempHigh: 31, tempLow: 11, rainfall: 9 },
        { month: "7月", tempHigh: 33, tempLow: 16, rainfall: 38 },
        { month: "8月", tempHigh: 31, tempLow: 15, rainfall: 40 },
        { month: "9月", tempHigh: 27, tempLow: 10, rainfall: 32 },
        { month: "10月", tempHigh: 20, tempLow: 3, rainfall: 28 },
        { month: "11月", tempHigh: 12, tempLow: -3, rainfall: 28 },
        { month: "12月", tempHigh: 6, tempLow: -7, rainfall: 34 },
      ],
    },
    culture: [
      { icon: "🏜️", title: "地质史诗", description: "20亿年的地层记录了地球的壮阔演变" },
      { icon: "🪶", title: "原住民文化", description: "印第安部族在此生活千年，保留丰富传说" },
      { icon: "🥾", title: "徒步天堂", description: "Bright Angel Trail等步道是全球徒步者的梦想" },
      { icon: "📸", title: "光影奇观", description: "日出日落时分峡谷的色彩变化令人叹为观止" },
    ],
    tips: [
      { icon: "🗣️", title: "语言提示", content: "英语为主，公园有中文导览手册" },
      { icon: "💵", title: "消费水平", content: "公园门票$35/车7天有效，园内住宿需提前预订" },
      { icon: "🚗", title: "出行建议", content: "自驾最佳，园内免费穿梭巴士连接各观景点" },
      { icon: "💧", title: "安全提醒", content: "徒步必带充足饮水，峡谷内温度可比崖顶高15°C" },
    ],
    travelAdvice: {
      transport: "自驾最佳，拉斯维加斯出发约4.5小时，园内免费穿梭巴士",
      accommodation: "园内El Tovar等酒店需提前数月预订，图萨扬有连锁酒店",
      budget: "门票$35/车7天，园内消费较高，建议自带食物",
      safety: "徒步注意体能分配，勿翻越护栏，夏季防暑冬季防滑",
    },
  },
  {
    id: "machu-picchu-peak",
    name: "马丘比丘山城",
    city: "库斯科",
    country: "秘鲁",
    continent: "南美洲",
    description: "印加帝国的失落之城，安第斯山脉云雾中的神秘遗迹。",
    panoramaUrl: "/textures/pano_snow.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop",
    latitude: -13.1631,
    longitude: -72.5450,
    initialHeading: 225,
    initialPitch: 5,
    tags: ["古迹", "山脉", "神秘"],
    climate: {
      type: "高原亚热带气候",
      avgTemp: "14°C",
      bestSeason: "5月-9月（旱季）",
      monthlyData: [
        { month: "1月", tempHigh: 19, tempLow: 8, rainfall: 185 },
        { month: "2月", tempHigh: 19, tempLow: 8, rainfall: 170 },
        { month: "3月", tempHigh: 19, tempLow: 7, rainfall: 140 },
        { month: "4月", tempHigh: 19, tempLow: 5, rainfall: 70 },
        { month: "5月", tempHigh: 19, tempLow: 3, rainfall: 30 },
        { month: "6月", tempHigh: 18, tempLow: 1, rainfall: 12 },
        { month: "7月", tempHigh: 18, tempLow: -1, rainfall: 8 },
        { month: "8月", tempHigh: 19, tempLow: 0, rainfall: 15 },
        { month: "9月", tempHigh: 19, tempLow: 3, rainfall: 40 },
        { month: "10月", tempHigh: 20, tempLow: 5, rainfall: 85 },
        { month: "11月", tempHigh: 20, tempLow: 6, rainfall: 130 },
        { month: "12月", tempHigh: 19, tempLow: 7, rainfall: 170 },
      ],
    },
    culture: [
      { icon: "🏔️", title: "印加遗产", description: "精密石砌技术至今令人惊叹，无需砂浆严丝合缝" },
      { icon: "🦙", title: "安第斯风情", description: "原住民Quechua族保持独特的纺织和农耕传统" },
      { icon: "🌀", title: "天文智慧", description: "印加人将天文观测融入建筑设计与历法系统" },
      { icon: "🌺", title: "神秘氛围", description: "云雾中的遗迹赋予马丘比丘超越时空的神秘感" },
    ],
    tips: [
      { icon: "🗣️", title: "语言提示", content: "西班牙语和Quechua语为主，导游可用英语" },
      { icon: "💵", title: "消费水平", content: "门票约152索尔，需提前网上预约" },
      { icon: "🚂", title: "出行建议", content: "从库斯科乘火车至热水镇，再乘巴士上山" },
      { icon: "🏔️", title: "高原反应", content: "库斯科海拔3400米，建议先适应1-2天再上山" },
    ],
    travelAdvice: {
      transport: "从库斯科乘Peru Rail火车至热水镇，再乘巴士上山；印加古道需提前6个月预约",
      accommodation: "热水镇各类住宿丰富，贝尔蒙德圣克拉里顿是顶级选择",
      budget: "门票+火车+巴士约200-300美元，总体日均80-150美元",
      safety: "注意高原反应，携带古柯茶缓解，雨季步道湿滑需小心",
    },
  },
  {
    id: "great-wall-section",
    name: "慕田峪长城",
    city: "北京",
    country: "中国",
    continent: "亚洲",
    description: "万里长城的精华段落，蜿蜒于青山之巅的建筑奇迹。",
    panoramaUrl: "/textures/pano_alps.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop",
    latitude: 40.4319,
    longitude: 116.5704,
    initialHeading: 90,
    initialPitch: 5,
    tags: ["历史", "地标", "奇迹"],
    climate: {
      type: "温带季风气候",
      avgTemp: "13°C",
      bestSeason: "4月-5月 / 9月-10月",
      monthlyData: [
        { month: "1月", tempHigh: 1, tempLow: -9, rainfall: 3 },
        { month: "2月", tempHigh: 4, tempLow: -6, rainfall: 6 },
        { month: "3月", tempHigh: 12, tempLow: 0, rainfall: 9 },
        { month: "4月", tempHigh: 20, tempLow: 7, rainfall: 26 },
        { month: "5月", tempHigh: 27, tempLow: 13, rainfall: 35 },
        { month: "6月", tempHigh: 31, tempLow: 18, rainfall: 78 },
        { month: "7月", tempHigh: 31, tempLow: 22, rainfall: 185 },
        { month: "8月", tempHigh: 30, tempLow: 21, rainfall: 160 },
        { month: "9月", tempHigh: 26, tempLow: 14, rainfall: 46 },
        { month: "10月", tempHigh: 19, tempLow: 7, rainfall: 22 },
        { month: "11月", tempHigh: 9, tempLow: -1, rainfall: 8 },
        { month: "12月", tempHigh: 3, tempLow: -7, rainfall: 3 },
      ],
    },
    culture: [
      { icon: "🏯", title: "建筑奇迹", description: "绵延万里的军事防御工程是人类建筑史的壮举" },
      { icon: "🐉", title: "龙之精神", description: "长城形似巨龙蜿蜒，是中华民族精神的象征" },
      { icon: "📜", title: "千年历史", description: "从春秋到明朝，两千年修筑史承载无数故事" },
      { icon: "🍜", title: "京味美食", description: "烤鸭、炸酱面与豆汁是老北京的味觉记忆" },
    ],
    tips: [
      { icon: "🗣️", title: "语言提示", content: "普通话为主，景区有多语言标识和讲解器" },
      { icon: "💵", title: "消费水平", content: "门票40元，缆车单程100元，总体消费适中" },
      { icon: "🚌", title: "出行建议", content: "东直门乘916路至怀柔再转车，或直通巴士" },
      { icon: "🥾", title: "徒步提醒", content: "穿舒适运动鞋，陡峭段需小心，带足饮水" },
    ],
    travelAdvice: {
      transport: "市区至慕田峪约1.5小时车程，建议乘坐慕巴士等直通车",
      accommodation: "建议住北京市区，周边民宿体验独特",
      budget: "门票+缆车约140元，日均消费200-500元（含住宿）",
      safety: "台阶陡峭注意安全，雷雨天气避免登城，冬季注意防滑",
    },
  },
  {
    id: "iceland-aurora",
    name: "冰岛极光之夜",
    city: "雷克雅未克",
    country: "冰岛",
    continent: "欧洲",
    description: "北极圈的梦幻光影，皑皑白雪映衬下的绿色极光舞动。",
    panoramaUrl: "/textures/pano_snow.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&h=300&fit=crop",
    latitude: 64.1466,
    longitude: -21.9426,
    initialHeading: 0,
    initialPitch: 25,
    tags: ["自然", "极光", "奇幻"],
    climate: {
      type: "温带海洋性气候（亚寒带）",
      avgTemp: "5°C",
      bestSeason: "6月-8月（观光）/ 9月-3月（极光）",
      monthlyData: [
        { month: "1月", tempHigh: 2, tempLow: -3, rainfall: 76 },
        { month: "2月", tempHigh: 2, tempLow: -3, rainfall: 72 },
        { month: "3月", tempHigh: 3, tempLow: -2, rainfall: 82 },
        { month: "4月", tempHigh: 6, tempLow: 1, rainfall: 58 },
        { month: "5月", tempHigh: 10, tempLow: 4, rainfall: 44 },
        { month: "6月", tempHigh: 13, tempLow: 7, rainfall: 50 },
        { month: "7月", tempHigh: 14, tempLow: 9, rainfall: 52 },
        { month: "8月", tempHigh: 13, tempLow: 8, rainfall: 62 },
        { month: "9月", tempHigh: 10, tempLow: 5, rainfall: 67 },
        { month: "10月", tempHigh: 6, tempLow: 2, rainfall: 86 },
        { month: "11月", tempHigh: 3, tempLow: -1, rainfall: 73 },
        { month: "12月", tempHigh: 2, tempLow: -3, rainfall: 79 },
      ],
    },
    culture: [
      { icon: "🌌", title: "极光文化", description: "极光是冰岛冬季的灵魂，维京人视为神灵的显现" },
      { icon: "♨️", title: "温泉生活", description: "地热温泉是冰岛人社交和放松的日常" },
      { icon: "🧊", title: "冰川世界", description: "冰川覆盖国土11%，冰与火共存的自然奇观" },
      { icon: "📖", title: "维京传奇", description: "萨迦文学记录了维京时代的英雄与冒险" },
    ],
    tips: [
      { icon: "🗣️", title: "语言提示", content: "冰岛语为主，英语普及率极高" },
      { icon: "💵", title: "消费水平", content: "消费极高，日均约150-300美元" },
      { icon: "🚗", title: "出行建议", content: "自驾环岛公路1号最经典，冬季需四驱车" },
      { icon: "🧥", title: "装备提醒", content: "防风防水外层+羊毛内层，洋葱式穿搭法" },
    ],
    travelAdvice: {
      transport: "自驾1号环岛公路最自由，冬季路况复杂建议跟团",
      accommodation: "雷克雅未克选择最多，乡村地区需提前预订特色农场住宿",
      budget: "高消费国家，日均150-300美元（含住宿和租车）",
      safety: "天气多变随时关注预警，远离冰川边缘和海浪危险区",
    },
  },
  {
    id: "bali-sanur-beach",
    name: "沙努尔海滩",
    city: "巴厘岛",
    country: "印度尼西亚",
    continent: "亚洲",
    description: "巴厘岛最著名的日出海滩，椰林树影，碧海蓝天。",
    panoramaUrl: "/textures/pano_ocean.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop",
    latitude: -8.7048,
    longitude: 115.2645,
    initialHeading: 180,
    initialPitch: -3,
    tags: ["海滩", "度假", "热带"],
    climate: {
      type: "热带季风气候",
      avgTemp: "27°C",
      bestSeason: "4月-10月（旱季）",
      monthlyData: [
        { month: "1月", tempHigh: 31, tempLow: 24, rainfall: 270 },
        { month: "2月", tempHigh: 31, tempLow: 24, rainfall: 240 },
        { month: "3月", tempHigh: 31, tempLow: 24, rainfall: 210 },
        { month: "4月", tempHigh: 31, tempLow: 24, rainfall: 90 },
        { month: "5月", tempHigh: 30, tempLow: 23, rainfall: 70 },
        { month: "6月", tempHigh: 29, tempLow: 22, rainfall: 50 },
        { month: "7月", tempHigh: 28, tempLow: 22, rainfall: 40 },
        { month: "8月", tempHigh: 29, tempLow: 22, rainfall: 30 },
        { month: "9月", tempHigh: 29, tempLow: 22, rainfall: 40 },
        { month: "10月", tempHigh: 30, tempLow: 23, rainfall: 90 },
        { month: "11月", tempHigh: 31, tempLow: 24, rainfall: 150 },
        { month: "12月", tempHigh: 31, tempLow: 24, rainfall: 250 },
      ],
    },
    culture: [
      { icon: "🕌", title: "印度教文化", description: "巴厘岛是印尼唯一以印度教为主的地区，寺庙遍布" },
      { icon: "🌺", title: "花艺传统", description: "每日供奉鲜花是巴厘人生活的重要组成部分" },
      { icon: "💃", title: "传统舞蹈", description: "Legong与Kecak舞展现了巴厘文化的精髓" },
      { icon: "🌾", title: "梯田文化", description: "苏巴克灌溉系统是联合国认定的世界遗产" },
    ],
    tips: [
      { icon: "🗣️", title: "语言提示", content: "印尼语为主，旅游区英语通用" },
      { icon: "💵", title: "消费水平", content: "消费较低，日均约30-80美元" },
      { icon: "🛵", title: "出行建议", content: "租摩托车最灵活（约5万印尼盾/天），也可包车" },
      { icon: "🙏", title: "文化禁忌", content: "进入寺庙需穿纱笼，不可踩踏祭品" },
    ],
    travelAdvice: {
      transport: "租摩托车最灵活，包车约35-50万美元/天，Grab叫车方便",
      accommodation: "沙努尔安静适合家庭，乌布体验田园，水明漾时尚派对",
      budget: "低消费天堂，日均30-80美元即可享受度假体验",
      safety: "注意海流，参与水上活动选正规公司，尊重当地宗教习俗",
    },
  },
  {
    id: "venice-grand-canal",
    name: "大运河",
    city: "威尼斯",
    country: "意大利",
    continent: "欧洲",
    description: "威尼斯的水上主干道，两岸矗立着文艺复兴时期的华丽宫殿。",
    panoramaUrl: "/textures/pano1.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop",
    latitude: 45.4408,
    longitude: 12.3155,
    initialHeading: 0,
    initialPitch: 3,
    tags: ["水城", "浪漫", "历史"],
    climate: {
      type: "地中海气候",
      avgTemp: "14°C",
      bestSeason: "4月-6月 / 9月-10月",
      monthlyData: [
        { month: "1月", tempHigh: 6, tempLow: -1, rainfall: 47 },
        { month: "2月", tempHigh: 8, tempLow: 0, rainfall: 48 },
        { month: "3月", tempHigh: 13, tempLow: 4, rainfall: 57 },
        { month: "4月", tempHigh: 17, tempLow: 8, rainfall: 64 },
        { month: "5月", tempHigh: 22, tempLow: 13, rainfall: 69 },
        { month: "6月", tempHigh: 26, tempLow: 17, rainfall: 76 },
        { month: "7月", tempHigh: 29, tempLow: 19, rainfall: 63 },
        { month: "8月", tempHigh: 28, tempLow: 18, rainfall: 83 },
        { month: "9月", tempHigh: 24, tempLow: 15, rainfall: 67 },
        { month: "10月", tempHigh: 18, tempLow: 10, rainfall: 69 },
        { month: "11月", tempHigh: 11, tempLow: 5, rainfall: 87 },
        { month: "12月", tempHigh: 7, tempLow: 0, rainfall: 54 },
      ],
    },
    culture: [
      { icon: "🛶", title: "贡多拉文化", description: "黑色贡多拉是威尼斯的标志，承载千年水上传统" },
      { icon: "🎭", title: "面具嘉年华", description: "威尼斯嘉年华是世界最古老最盛大的面具节" },
      { icon: "🎨", title: "文艺复兴", description: "贝利尼与提香等大师让威尼斯成为艺术中心" },
      { icon: "🦞", title: "海鲜盛宴", description: "潟湖鲜鱼与墨鱼面是威尼斯的味觉名片" },
    ],
    tips: [
      { icon: "🗣️", title: "语言提示", content: "意大利语为主，旅游区英语可用" },
      { icon: "💶", title: "消费水平", content: "消费偏高，日均约100-180欧元" },
      { icon: "🚢", title: "出行建议", content: "水上巴士vaporetto最实用，日票25欧元" },
      { icon: "🌊", title: "高水位提醒", content: "11月-2月可能出现Acqua Alta，备好雨靴" },
    ],
    travelAdvice: {
      transport: "水上巴士是主要交通，日票25欧元；贡多拉体验约80欧元/30分钟",
      accommodation: "圣马可广场附近最便利但最贵，梅斯特雷性价比高",
      budget: "偏高消费，日均100-180欧元（含住宿）",
      safety: "水上交通注意安全，桥面湿滑小心行走，注意扒手",
    },
  },
  {
    id: "taj-mahal-garden",
    name: "泰姬陵花园",
    city: "阿格拉",
    country: "印度",
    continent: "亚洲",
    description: "莫卧儿园林的典范，透过花瓣喷泉凝望白色大理石的永恒之美。",
    panoramaUrl: "/textures/pano_snow.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop",
    latitude: 27.1751,
    longitude: 78.0421,
    initialHeading: 0,
    initialPitch: 5,
    tags: ["建筑", "浪漫", "历史"],
    climate: {
      type: "半干旱气候",
      avgTemp: "25°C",
      bestSeason: "10月-3月",
      monthlyData: [
        { month: "1月", tempHigh: 22, tempLow: 7, rainfall: 12 },
        { month: "2月", tempHigh: 26, tempLow: 10, rainfall: 15 },
        { month: "3月", tempHigh: 33, tempLow: 16, rainfall: 10 },
        { month: "4月", tempHigh: 39, tempLow: 22, rainfall: 5 },
        { month: "5月", tempHigh: 42, tempLow: 26, rainfall: 15 },
        { month: "6月", tempHigh: 41, tempLow: 28, rainfall: 65 },
        { month: "7月", tempHigh: 36, tempLow: 27, rainfall: 240 },
        { month: "8月", tempHigh: 34, tempLow: 26, rainfall: 260 },
        { month: "9月", tempHigh: 35, tempLow: 24, rainfall: 140 },
        { month: "10月", tempHigh: 34, tempLow: 18, rainfall: 25 },
        { month: "11月", tempHigh: 29, tempLow: 12, rainfall: 5 },
        { month: "12月", tempHigh: 24, tempLow: 8, rainfall: 8 },
      ],
    },
    culture: [
      { icon: "🕌", title: "莫卧儿遗产", description: "穆斯林与印度文化的完美融合创造了建筑奇迹" },
      { icon: "🎨", title: "石雕工艺", description: "白色大理石上的宝石镶嵌工艺(Pietra Dura)举世闻名" },
      { icon: "🧘", title: "灵性传统", description: "印度教与伊斯兰教的灵性传统在此交汇" },
      { icon: "🥘", title: "北印美食", description: "奶油咖喱与烤饼构成了北印度的味觉底色" },
    ],
    tips: [
      { icon: "🗣️", title: "语言提示", content: "印地语和乌尔都语为主，旅游区英语可用" },
      { icon: "💵", title: "消费水平", content: "消费较低，日均约20-50美元" },
      { icon: "🚂", title: "出行建议", content: "从德里乘火车至阿格拉约2小时" },
      { icon: "🕐", title: "参观提醒", content: "日出时分最美，周五闭馆，提前网购门票" },
    ],
    travelAdvice: {
      transport: "德里乘Shatabdi快车2小时到阿格拉，城内乘突突车即可",
      accommodation: "泰姬陵东侧酒店可看日出景观，价格适中",
      budget: "低消费，日均20-50美元，门票外国人约1100卢比",
      safety: "注意饮用水安全（买瓶装水），景区内外注意推销陷阱",
    },
  },
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
