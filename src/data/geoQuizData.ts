export type GeoQuizCategory = 'country' | 'city' | 'landmark';

export interface GeoQuizQuestion {
  id: string;
  category: GeoQuizCategory;
  answer: string;
  aliases: string[];
  hints: string[];
  emoji: string;
  continent: string;
  funFact: string;
}

export const geoQuizQuestions: GeoQuizQuestion[] = [
  {
    id: 'gq-1',
    category: 'country',
    answer: '法国',
    aliases: ['法兰西', 'France'],
    hints: [
      '这个国家以浪漫文化和精致美食闻名于世',
      '它的首都被称为"光之城"，拥有世界最著名的铁塔',
      '这个国家的国旗是蓝白红三色旗，国花是鸢尾花',
    ],
    emoji: '🇫🇷',
    continent: '欧洲',
    funFact: '法国每年接待约9000万游客，是全球最受欢迎的旅游目的地。',
  },
  {
    id: 'gq-2',
    category: 'country',
    answer: '日本',
    aliases: ['Japan', '日本国'],
    hints: [
      '这是一个岛国，由数千个岛屿组成，以樱花和温泉闻名',
      '它的首都是世界上人口最密集的都市圈之一，拥有繁忙的轨道交通',
      '这个国家的传统美食包括寿司和拉面，国花是菊花',
    ],
    emoji: '🇯🇵',
    continent: '亚洲',
    funFact: '日本有超过6800个岛屿，其中约430个有人居住。',
  },
  {
    id: 'gq-3',
    category: 'country',
    answer: '巴西',
    aliases: ['Brazil', '巴西联邦共和国'],
    hints: [
      '这个国家拥有世界上最大的热带雨林和最宽广的河流',
      '它以桑巴舞和狂欢节闻名全球，足球是国民运动',
      '这个国家的官方语言是葡萄牙语，国土面积居世界第五',
    ],
    emoji: '🇧🇷',
    continent: '南美洲',
    funFact: '亚马逊雨林产生的氧气约占全球氧气总量的20%。',
  },
  {
    id: 'gq-4',
    category: 'country',
    answer: '埃及',
    aliases: ['Egypt', '阿拉伯埃及共和国'],
    hints: [
      '这个国家拥有世界上最长的河流和最古老的文明之一',
      '它的标志性建筑是古代世界七大奇迹中唯一留存的',
      '这个国家位于非洲东北部，首都是开罗',
    ],
    emoji: '🇪🇬',
    continent: '非洲',
    funFact: '吉萨大金字塔由约230万块石头建成，每块重约2.5吨。',
  },
  {
    id: 'gq-5',
    category: 'country',
    answer: '澳大利亚',
    aliases: ['Australia', '澳洲'],
    hints: [
      '这个国家同时也是一个大陆，拥有独特的有袋类动物',
      '它的大堡礁是世界最大的珊瑚礁系统，绵延超过2300公里',
      '这个国家的首都是堪培拉，而非最大的城市悉尼',
    ],
    emoji: '🇦🇺',
    continent: '大洋洲',
    funFact: '澳大利亚有超过150种有袋类动物，是地球上独一无二的生命宝库。',
  },
  {
    id: 'gq-6',
    category: 'country',
    answer: '冰岛',
    aliases: ['Iceland', '冰岛共和国'],
    hints: [
      '这个岛国位于北大西洋，以极光和冰川闻名',
      '它拥有世界上最古老的议会，地热资源极为丰富',
      '这个国家的首都叫雷克雅未克，意为"冒烟的海湾"',
    ],
    emoji: '🇮🇸',
    continent: '欧洲',
    funFact: '冰岛没有蚊子，是少数完全没有蚊子的大块陆地之一。',
  },
  {
    id: 'gq-7',
    category: 'country',
    answer: '印度',
    aliases: ['India', '印度共和国'],
    hints: [
      '这个南亚国家拥有世界上最古老的城市文明之一',
      '泰姬陵是它最著名的建筑，被视为爱情的象征',
      '这个国家是世界上人口最多的国家，官方语言包括印地语和英语',
    ],
    emoji: '🇮🇳',
    continent: '亚洲',
    funFact: '印度每年的大壶节是全球最大规模的宗教集会，参与者可达上亿人。',
  },
  {
    id: 'gq-8',
    category: 'country',
    answer: '意大利',
    aliases: ['Italy', '意大利共和国'],
    hints: [
      '这个国家的版图形状像一只靴子，伸入地中海',
      '它是文艺复兴的发源地，拥有最多的联合国世界遗产',
      '这个国家的美食包括披萨和意面，首都是罗马',
    ],
    emoji: '🇮🇹',
    continent: '欧洲',
    funFact: '意大利拥有58处联合国世界遗产，数量居全球第一。',
  },
  {
    id: 'gq-9',
    category: 'city',
    answer: '巴黎',
    aliases: ['Paris', '花都', '光之城'],
    hints: [
      '这座城市被称为"光之城"，是全球时尚与艺术的中心',
      '塞纳河穿城而过，河畔有一座举世闻名的铁塔',
      '它是法国的首都，拥有卢浮宫和圣母院',
    ],
    emoji: '🗼',
    continent: '欧洲',
    funFact: '巴黎卢浮宫每年接待约1000万游客，是世界上参观人数最多的博物馆。',
  },
  {
    id: 'gq-10',
    category: 'city',
    answer: '东京',
    aliases: ['Tokyo', '江户'],
    hints: [
      '这座城市是全球人口最密集的都市区之一，以霓虹灯和科技闻名',
      '它有一个著名的十字路口，每次绿灯时有上千人同时穿过',
      '它是日本的首都，以前叫"江户"',
    ],
    emoji: '🏙️',
    continent: '亚洲',
    funFact: '东京涩谷十字路口每次绿灯时约有3000人同时穿越，是世界上最繁忙的路口。',
  },
  {
    id: 'gq-11',
    category: 'city',
    answer: '威尼斯',
    aliases: ['Venice', '水城'],
    hints: [
      '这座城市建在水面之上，以运河和桥梁闻名',
      '这里的交通工具是船只，有一种传统划船叫做贡多拉',
      '它位于意大利东北部，被称为"水上之都"',
    ],
    emoji: '🛶',
    continent: '欧洲',
    funFact: '威尼斯由118个小岛组成，通过约400座桥梁相连。',
  },
  {
    id: 'gq-12',
    category: 'city',
    answer: '悉尼',
    aliases: ['Sydney', '雪梨'],
    hints: [
      '这座城市拥有世界上最著名的歌剧院之一，屋顶形如白色风帆',
      '它有一个巨大的海港大桥，当地人昵称为"衣架"',
      '它是澳大利亚最大的城市，位于新南威尔士州',
    ],
    emoji: '🎭',
    continent: '大洋洲',
    funFact: '悉尼歌剧院的屋顶由超过100万块瑞典制造的瓷砖覆盖。',
  },
  {
    id: 'gq-13',
    category: 'city',
    answer: '伊斯坦布尔',
    aliases: ['Istanbul', '君士坦丁堡', '拜占庭'],
    hints: [
      '这座城市横跨两个大洲，是世界上唯一地跨欧亚的大城市',
      '它曾是三个帝国的首都，拥有圣索菲亚大教堂',
      '它曾被称为君士坦丁堡和拜占庭，位于土耳其',
    ],
    emoji: '🕌',
    continent: '亚洲/欧洲',
    funFact: '伊斯坦布尔是历史上唯一曾作为罗马、拜占庭和奥斯曼三大帝国首都的城市。',
  },
  {
    id: 'gq-14',
    category: 'city',
    answer: '北京',
    aliases: ['Beijing', '北平', 'Peking'],
    hints: [
      '这座城市拥有世界上最大的宫殿建筑群，有近万间房屋',
      '它的中心有一个巨大的广场，可容纳上百万人',
      '它是中国的首都，拥有长城、故宫等世界闻名的古迹',
    ],
    emoji: '🏛️',
    continent: '亚洲',
    funFact: '故宫有9999.5间房间，是世界上现存规模最大的宫殿建筑群。',
  },
  {
    id: 'gq-15',
    category: 'city',
    answer: '开罗',
    aliases: ['Cairo', '开罗省'],
    hints: [
      '这座城市紧邻世界上最古老的巨型石造建筑群',
      '它是非洲人口最多的城市，尼罗河穿城而过',
      '它是埃及的首都，是阿拉伯世界最大的城市',
    ],
    emoji: '🏜️',
    continent: '非洲',
    funFact: '开罗是非洲和阿拉伯世界人口最多的城市，大都市区人口超过2000万。',
  },
  {
    id: 'gq-16',
    category: 'landmark',
    answer: '埃菲尔铁塔',
    aliases: ['Eiffel Tower', '巴黎铁塔', '铁塔'],
    hints: [
      '这座铁制结构在建成时是世界上最高的人造建筑',
      '它最初是为一场世界博览会而建的临时建筑，计划20年后拆除',
      '它位于巴黎战神广场，是法国最具标志性的地标',
    ],
    emoji: '🗼',
    continent: '欧洲',
    funFact: '埃菲尔铁塔每7年需要重新刷漆一次，每次使用约60吨油漆。',
  },
  {
    id: 'gq-17',
    category: 'landmark',
    answer: '长城',
    aliases: ['Great Wall', '万里长城', '中国长城'],
    hints: [
      '这是人类历史上最伟大的建筑工程之一，从太空也能看到其踪迹',
      '它绵延数千公里，修建历史跨越了两千多年',
      '它横跨中国北方，是为了防御北方游牧民族而修建的',
    ],
    emoji: '🏯',
    continent: '亚洲',
    funFact: '长城总长度超过21000公里，修建历史从公元前7世纪延续到明朝。',
  },
  {
    id: 'gq-18',
    category: 'landmark',
    answer: '泰姬陵',
    aliases: ['Taj Mahal', '泰姬玛哈陵'],
    hints: [
      '这座白色大理石建筑被誉为世界上最美的建筑之一',
      '它是一位皇帝为纪念亡妻而建造的陵墓，被视为永恒爱情的象征',
      '它位于印度阿格拉，是莫卧儿建筑的巅峰之作',
    ],
    emoji: '🕌',
    continent: '亚洲',
    funFact: '泰姬陵的白色大理石在一天中会随光线变化呈现不同颜色，清晨粉红、午间白色、月光下金色。',
  },
  {
    id: 'gq-19',
    category: 'landmark',
    answer: '自由女神像',
    aliases: ['Statue of Liberty', '自由女神'],
    hints: [
      '这座巨型雕像是另一个国家赠送的友谊之礼',
      '她手持火炬和法典，矗立在一座小岛上迎接海上来的旅客',
      '它位于纽约港，是美国的标志性象征，由法国赠予',
    ],
    emoji: '🗽',
    continent: '北美洲',
    funFact: '自由女神像从脚底到火炬尖端高约93米，铜皮厚度仅2.4毫米，约两枚硬币厚。',
  },
  {
    id: 'gq-20',
    category: 'landmark',
    answer: '马丘比丘',
    aliases: ['Machu Picchu', '天空之城', '失落之城'],
    hints: [
      '这座古城隐匿在海拔两千多米的云雾山林之中，直到20世纪才被重新发现',
      '它是一个失落帝国的山城遗址，石砌建筑精密得连刀片都插不进去',
      '它位于秘鲁安第斯山脉，是印加帝国最神秘的遗产',
    ],
    emoji: '⛰️',
    continent: '南美洲',
    funFact: '马丘比丘的石墙不用任何灰浆，石块间缝隙不到1毫米，历经500年地震仍屹立不倒。',
  },
  {
    id: 'gq-21',
    category: 'landmark',
    answer: '悉尼歌剧院',
    aliases: ['Sydney Opera House', '歌剧院'],
    hints: [
      '这座建筑的屋顶由一系列巨大的白色壳片组成，形如展开的风帆',
      '它坐落在一个海港边，是南半球最著名的建筑之一',
      '它位于澳大利亚悉尼港畔，是20世纪最具标志性的建筑之一',
    ],
    emoji: '🎭',
    continent: '大洋洲',
    funFact: '悉尼歌剧院原计划4年建成，实际耗时16年，预算从700万澳元飙升至1.02亿。',
  },
  {
    id: 'gq-22',
    category: 'landmark',
    answer: '大峡谷',
    aliases: ['Grand Canyon', '科罗拉多大峡谷'],
    hints: [
      '这个巨大的地貌奇观是由一条河流历经数百万年侵蚀而成的',
      '它的岩层记录了地球近20亿年的地质历史',
      '它位于美国亚利桑那州，深达1600多米',
    ],
    emoji: '🏜️',
    continent: '北美洲',
    funFact: '大峡谷最宽处约29公里，最深达1829米，是地球上最壮观的侵蚀地貌之一。',
  },
  {
    id: 'gq-23',
    category: 'country',
    answer: '秘鲁',
    aliases: ['Peru', '秘鲁共和国'],
    hints: [
      '这个南美国家拥有神秘的古代文明遗址和安第斯山脉',
      '纳斯卡线条和一座"天空之城"是它最著名的考古遗产',
      '它的首都是利马，曾经的印加帝国就在这片土地上',
    ],
    emoji: '🇵🇪',
    continent: '南美洲',
    funFact: '秘鲁的纳斯卡线条有超过800条直线、300个几何图形和70个动植物图案，从地面几乎无法辨认。',
  },
  {
    id: 'gq-24',
    category: 'city',
    answer: '罗马',
    aliases: ['Rome', '罗马市', '永恒之城'],
    hints: [
      '这座城市被称为"永恒之城"，拥有近三千年的建城历史',
      '城内有一个巨大的角斗场遗址，曾举办过残酷的角斗比赛',
      '它是意大利的首都，城中国梵蒂冈是天主教会的中心',
    ],
    emoji: '🏛️',
    continent: '欧洲',
    funFact: '罗马斗兽场可容纳约5万至8万名观众，是古代最大的圆形剧场。',
  },
];

export function getRandomQuizQuestions(count: number, excludeIds: string[] = []): GeoQuizQuestion[] {
  const filtered = geoQuizQuestions.filter(q => !excludeIds.includes(q.id));
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function checkAnswer(input: string, question: GeoQuizQuestion): boolean {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return false;
  const allAnswers = [question.answer, ...question.aliases].map(a => a.toLowerCase());
  return allAnswers.some(a => a === normalized || normalized.includes(a) || a.includes(normalized));
}

export const CATEGORY_LABELS: Record<GeoQuizCategory, string> = {
  country: '国家',
  city: '城市',
  landmark: '地标',
};

export const CATEGORY_ICONS: Record<GeoQuizCategory, string> = {
  country: '🌍',
  city: '🏙️',
  landmark: '🏛️',
};
