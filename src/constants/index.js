// 应用常量配置

// 菜单项配置
export const MENU_ITEMS = [
  {
    key: 'home',
    icon: 'HomeOutlined',
    label: '首页',
  },
  {
    key: 'english',
    icon: 'TranslationOutlined',
    label: '英语',
  },
  {
    key: 'math',
    icon: 'CalculatorOutlined',
    label: '数学',
  },
  {
    key: 'chinese',
    icon: 'ReadOutlined',
    label: '语文',
  },
];

// 英语分类信息
export const CATEGORY_INFO = {
  short_a: { name: '短元音 a', example: 'cat, hat, map', color: '#1890ff' },
  short_e: { name: '短元音 e', example: 'bed, pen, red', color: '#52c41a' },
  short_i: { name: '短元音 i', example: 'pig, big, sit', color: '#fa8c16' },
  short_o: { name: '短元音 o', example: 'dog, hot, top', color: '#eb2f96' },
  short_u: { name: '短元音 u', example: 'bus, cup, sun', color: '#722ed1' },
  long_a_e: { name: '长元音 a-e', example: 'cake, make, name', color: '#13c2c2' },
  long_i_e: { name: '长元音 i-e', example: 'bike, like, time', color: '#2f54eb' },
  long_o_e: { name: '长元音 o-e', example: 'home, bone, hope', color: '#fa541c' },
  long_u_e: { name: '长元音 u-e', example: 'cute, tube, rule', color: '#a0d911' },
  vowel_ai_ay: { name: '元音 ai/ay', example: 'rain, day, play', color: '#597ef7' },
  vowel_ee_ea: { name: '元音 ee/ea', example: 'see, tree, eat', color: '#73d13d' },
  vowel_oa_ow: { name: '元音 oa/ow', example: 'boat, snow, grow', color: '#ff7875' },
  vowel_igh: { name: '元音 igh', example: 'night, light, high', color: '#ffc53d' },
  r_controlled_ar: { name: 'R控制 ar', example: 'car, star, park', color: '#ff85c0' },
  r_controlled_er_ir_ur: { name: 'R控制 er/ir/ur', example: 'her, bird, turn', color: '#5cdbd3' },
  r_controlled_or: { name: 'R控制 or', example: 'for, corn, horse', color: '#b37feb' },
  diphthong_oi_oy: { name: '双元音 oi/oy', example: 'oil, coin, boy', color: '#ffa940' },
  diphthong_ou_ow: { name: '双元音 ou/ow', example: 'out, house, cow', color: '#36cfc9' },
  diphthong_au_aw: { name: '双元音 au/aw', example: 'saw, draw, cause', color: '#9254de' },
  vowel_oo_long: { name: '长音 oo', example: 'zoo, moon, food', color: '#69b1ff' },
  vowel_oo_short: { name: '短音 oo', example: 'book, look, good', color: '#95de64' },
};

// 数学难度配置
export const DIFFICULTY_CONFIG = {
  easy: { label: '简单 (20以内)', color: '#52c41a', max: 20 },
  medium: { label: '中等 (50以内)', color: '#faad14', max: 50 },
  hard: { label: '困难 (100以内)', color: '#ff4d4f', max: 100 },
};

// 题目数量选项
export const QUESTION_COUNTS = [10, 20, 30];

// 语音配置
export const SPEECH_CONFIG = {
  ENGLISH: {
    preferredVoices: ['Samantha', 'Alex', 'Google US English', 'Microsoft David', 'Microsoft Zira'],
    defaultRate: 0.75,
  },
  CHINESE: {
    preferredVoices: ['Tingting', 'Ting-Ting', 'Huihui', 'Yaoyao', 'Google 普通话', 'Google 中文'],
    defaultRate: 0.7,
  },
};

// 评分阈值
export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
};
