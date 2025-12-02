// 拼音数据库
const pinyinData = {
  // 声母 (23个)
  shengmu: [
    { pinyin: 'b', example: '爸爸 bàba', words: ['爸', '包', '杯', '笔'] },
    { pinyin: 'p', example: '苹果 píngguǒ', words: ['苹', '跑', '皮', '瓶'] },
    { pinyin: 'm', example: '妈妈 māma', words: ['妈', '猫', '米', '门'] },
    { pinyin: 'f', example: '飞机 fēijī', words: ['飞', '风', '饭', '房'] },
    { pinyin: 'd', example: '弟弟 dìdi', words: ['弟', '大', '灯', '刀'] },
    { pinyin: 't', example: '兔子 tùzi', words: ['兔', '天', '太', '头'] },
    { pinyin: 'n', example: '奶奶 nǎinai', words: ['奶', '牛', '鸟', '你'] },
    { pinyin: 'l', example: '老师 lǎoshī', words: ['老', '蓝', '龙', '六'] },
    { pinyin: 'g', example: '哥哥 gēge', words: ['哥', '狗', '高', '瓜'] },
    { pinyin: 'k', example: '可乐 kělè', words: ['可', '口', '哭', '裤'] },
    { pinyin: 'h', example: '红色 hóngsè', words: ['红', '花', '虎', '火'] },
    { pinyin: 'j', example: '姐姐 jiějie', words: ['姐', '鸡', '家', '九'] },
    { pinyin: 'q', example: '汽车 qìchē', words: ['汽', '七', '球', '钱'] },
    { pinyin: 'x', example: '西瓜 xīguā', words: ['西', '小', '星', '学'] },
    { pinyin: 'zh', example: '中国 Zhōngguó', words: ['中', '猪', '纸', '桌'] },
    { pinyin: 'ch', example: '吃饭 chīfàn', words: ['吃', '车', '虫', '船'] },
    { pinyin: 'sh', example: '书本 shūběn', words: ['书', '水', '十', '手'] },
    { pinyin: 'r', example: '热水 rèshuǐ', words: ['热', '人', '日', '肉'] },
    { pinyin: 'z', example: '坐下 zuòxià', words: ['坐', '走', '字', '做'] },
    { pinyin: 'c', example: '草地 cǎodì', words: ['草', '菜', '擦', '从'] },
    { pinyin: 's', example: '三只 sānzhī', words: ['三', '四', '树', '送'] },
    { pinyin: 'y', example: '月亮 yuèliang', words: ['月', '云', '鱼', '一'] },
    { pinyin: 'w', example: '我们 wǒmen', words: ['我', '五', '外', '玩'] },
  ],
  // 单韵母 (6个)
  danyunmu: [
    { pinyin: 'a', example: '阿姨 āyí', words: ['阿', '啊', '爱'] },
    { pinyin: 'o', example: '哦 ó', words: ['哦', '噢'] },
    { pinyin: 'e', example: '鹅 é', words: ['鹅', '饿', '恶'] },
    { pinyin: 'i', example: '衣服 yīfu', words: ['衣', '一', '医'] },
    { pinyin: 'u', example: '乌龟 wūguī', words: ['乌', '五', '屋'] },
    { pinyin: 'ü', example: '鱼 yú', words: ['鱼', '雨', '语'] },
  ],
  // 复韵母 (9个)
  fuyunmu: [
    { pinyin: 'ai', example: '爱 ài', words: ['爱', '矮', '白'] },
    { pinyin: 'ei', example: '杯 bēi', words: ['杯', '北', '黑'] },
    { pinyin: 'ui', example: '水 shuǐ', words: ['水', '回', '会'] },
    { pinyin: 'ao', example: '好 hǎo', words: ['好', '高', '猫'] },
    { pinyin: 'ou', example: '走 zǒu', words: ['走', '狗', '口'] },
    { pinyin: 'iu', example: '六 liù', words: ['六', '牛', '球'] },
    { pinyin: 'ie', example: '叶 yè', words: ['叶', '写', '姐'] },
    { pinyin: 'üe', example: '月 yuè', words: ['月', '学', '雪'] },
    { pinyin: 'er', example: '耳朵 ěrduo', words: ['耳', '二', '儿'] },
  ],
  // 前鼻韵母 (5个)
  qianbi: [
    { pinyin: 'an', example: '安 ān', words: ['安', '三', '山'] },
    { pinyin: 'en', example: '门 mén', words: ['门', '本', '人'] },
    { pinyin: 'in', example: '今 jīn', words: ['今', '林', '心'] },
    { pinyin: 'un', example: '云 yún', words: ['云', '军', '春'] },
    { pinyin: 'ün', example: '云 yún', words: ['云', '军', '群'] },
  ],
  // 后鼻韵母 (4个)
  houbi: [
    { pinyin: 'ang', example: '糖 táng', words: ['糖', '光', '长'] },
    { pinyin: 'eng', example: '灯 dēng', words: ['灯', '风', '冷'] },
    { pinyin: 'ing', example: '星 xīng', words: ['星', '听', '名'] },
    { pinyin: 'ong', example: '红 hóng', words: ['红', '中', '龙'] },
  ],
  // 整体认读音节 (16个)
  zhengtirend: [
    { pinyin: 'zhi', example: '知道 zhīdao', words: ['知', '纸', '织'] },
    { pinyin: 'chi', example: '吃饭 chīfàn', words: ['吃', '池', '迟'] },
    { pinyin: 'shi', example: '十 shí', words: ['十', '是', '时'] },
    { pinyin: 'ri', example: '日 rì', words: ['日', '入'] },
    { pinyin: 'zi', example: '字 zì', words: ['字', '子', '自'] },
    { pinyin: 'ci', example: '词 cí', words: ['词', '次', '此'] },
    { pinyin: 'si', example: '四 sì', words: ['四', '思', '死'] },
    { pinyin: 'yi', example: '一 yī', words: ['一', '衣', '医'] },
    { pinyin: 'wu', example: '五 wǔ', words: ['五', '午', '舞'] },
    { pinyin: 'yu', example: '鱼 yú', words: ['鱼', '雨', '语'] },
    { pinyin: 'ye', example: '叶 yè', words: ['叶', '也', '夜'] },
    { pinyin: 'yue', example: '月 yuè', words: ['月', '乐', '越'] },
    { pinyin: 'yuan', example: '圆 yuán', words: ['圆', '元', '远'] },
    { pinyin: 'yin', example: '音 yīn', words: ['音', '因', '银'] },
    { pinyin: 'yun', example: '云 yún', words: ['云', '运', '晕'] },
    { pinyin: 'ying', example: '英 yīng', words: ['英', '影', '应'] },
  ],
};

// 获取所有分类
export const getAllCategories = () => Object.keys(pinyinData);

// 获取指定分类的拼音
export const getPinyinByCategory = (category) => pinyinData[category] || [];

// 获取所有拼音
export const getAllPinyin = () => pinyinData;

// 分类中文名称
export const categoryNames = {
  shengmu: '声母',
  danyunmu: '单韵母',
  fuyunmu: '复韵母',
  qianbi: '前鼻韵母',
  houbi: '后鼻韵母',
  zhengtirend: '整体认读音节',
};

export default pinyinData;
