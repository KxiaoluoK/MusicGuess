// 硬编码题库 — 第1轮"识别作曲家"题型
// 5位作曲家 × 2片段 × 2-3组选项 = 25题，每局随机抽5题

const questions = [
  // ===== 巴赫：G大调第一大提琴组曲 BWV 1007（巴洛克） =====
  {
    id: 1,
    clipFile: '/audio/bach_cello_c1.mp3',
    composer: '巴赫',
    pieceName: 'G大调第一大提琴组曲 BWV 1007',
    era: '巴洛克',
    instrument: '大提琴独奏',
    options: ['巴赫', '亨德尔', '维瓦尔第', '泰勒曼'],
    correctIndex: 0
  },
  {
    id: 2,
    clipFile: '/audio/bach_cello_c2.mp3',
    composer: '巴赫',
    pieceName: 'G大调第一大提琴组曲 BWV 1007',
    era: '巴洛克',
    instrument: '大提琴独奏',
    options: ['维瓦尔第', '巴赫', '帕赫贝尔', '亨德尔'],
    correctIndex: 1
  },
  {
    id: 3,
    clipFile: '/audio/bach_cello_c1.mp3',
    composer: '巴赫',
    pieceName: 'G大调第一大提琴组曲 BWV 1007',
    era: '巴洛克',
    instrument: '大提琴独奏',
    options: ['泰勒曼', '亨德尔', '巴赫', '维瓦尔第'],
    correctIndex: 2
  },

  // ===== 莫扎特：C大调钢琴奏鸣曲 K.545 第一乐章（古典） =====
  {
    id: 4,
    clipFile: '/audio/mozart_sonata_c1.mp3',
    composer: '莫扎特',
    pieceName: 'C大调钢琴奏鸣曲 K.545 第一乐章',
    era: '古典',
    instrument: '钢琴独奏',
    options: ['海顿', '莫扎特', '贝多芬', '舒伯特'],
    correctIndex: 1
  },
  {
    id: 5,
    clipFile: '/audio/mozart_sonata_c2.mp3',
    composer: '莫扎特',
    pieceName: 'C大调钢琴奏鸣曲 K.545 第一乐章',
    era: '古典',
    instrument: '钢琴独奏',
    options: ['贝多芬', '海顿', '莫扎特', '舒伯特'],
    correctIndex: 2
  },
  {
    id: 6,
    clipFile: '/audio/mozart_sonata_c1.mp3',
    composer: '莫扎特',
    pieceName: 'C大调钢琴奏鸣曲 K.545 第一乐章',
    era: '古典',
    instrument: '钢琴独奏',
    options: ['莫扎特', '舒伯特', '海顿', '贝多芬'],
    correctIndex: 0
  },

  // ===== 贝多芬：月光奏鸣曲 Op.27 No.2 第一乐章（古典） =====
  {
    id: 7,
    clipFile: '/audio/beethoven_moonlight_c1.mp3',
    composer: '贝多芬',
    pieceName: '月光奏鸣曲 Op.27 No.2 第一乐章',
    era: '古典',
    instrument: '钢琴独奏',
    options: ['莫扎特', '舒曼', '勃拉姆斯', '贝多芬'],
    correctIndex: 3
  },
  {
    id: 8,
    clipFile: '/audio/beethoven_moonlight_c2.mp3',
    composer: '贝多芬',
    pieceName: '月光奏鸣曲 Op.27 No.2 第一乐章',
    era: '古典',
    instrument: '钢琴独奏',
    options: ['贝多芬', '海顿', '莫扎特', '舒伯特'],
    correctIndex: 0
  },
  {
    id: 9,
    clipFile: '/audio/beethoven_moonlight_c1.mp3',
    composer: '贝多芬',
    pieceName: '月光奏鸣曲 Op.27 No.2 第一乐章',
    era: '古典',
    instrument: '钢琴独奏',
    options: ['李斯特', '贝多芬', '肖邦', '莫扎特'],
    correctIndex: 1
  },

  // ===== 肖邦：降b小调夜曲 Op.9 No.1（浪漫） =====
  {
    id: 10,
    clipFile: '/audio/chopin_nocturne_c1.mp3',
    composer: '肖邦',
    pieceName: '降b小调夜曲 Op.9 No.1',
    era: '浪漫',
    instrument: '钢琴独奏',
    options: ['李斯特', '肖邦', '舒曼', '门德尔松'],
    correctIndex: 1
  },
  {
    id: 11,
    clipFile: '/audio/chopin_nocturne_c2.mp3',
    composer: '肖邦',
    pieceName: '降b小调夜曲 Op.9 No.1',
    era: '浪漫',
    instrument: '钢琴独奏',
    options: ['门德尔松', '李斯特', '肖邦', '格里格'],
    correctIndex: 2
  },
  {
    id: 12,
    clipFile: '/audio/chopin_nocturne_c1.mp3',
    composer: '肖邦',
    pieceName: '降b小调夜曲 Op.9 No.1',
    era: '浪漫',
    instrument: '钢琴独奏',
    options: ['肖邦', '李斯特', '勃拉姆斯', '德彪西'],
    correctIndex: 0
  },

  // ===== 德沃夏克：降G大调幽默曲 Op.101 No.7（浪漫） =====
  {
    id: 13,
    clipFile: '/audio/dvorak_humoresque_c1.mp3',
    composer: '德沃夏克',
    pieceName: '降G大调幽默曲 Op.101 No.7',
    era: '浪漫',
    instrument: '小提琴与钢琴',
    options: ['斯美塔那', '德沃夏克', '雅纳切克', '柴可夫斯基'],
    correctIndex: 1
  },
  {
    id: 14,
    clipFile: '/audio/dvorak_humoresque_c2.mp3',
    composer: '德沃夏克',
    pieceName: '降G大调幽默曲 Op.101 No.7',
    era: '浪漫',
    instrument: '小提琴与钢琴',
    options: ['德沃夏克', '勃拉姆斯', '柴可夫斯基', '斯美塔那'],
    correctIndex: 0
  },
  {
    id: 15,
    clipFile: '/audio/dvorak_humoresque_c1.mp3',
    composer: '德沃夏克',
    pieceName: '降G大调幽默曲 Op.101 No.7',
    era: '浪漫',
    instrument: '小提琴与钢琴',
    options: ['勃拉姆斯', '柴可夫斯基', '德沃夏克', '格里格'],
    correctIndex: 2
  }
];

module.exports = questions;
