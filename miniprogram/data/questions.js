// 第1轮硬编码题库 — 只做"识别作曲家"题型
// 音频文件需放在 miniprogram/audio/ 目录下

const questions = [
  // ===== 巴赫：大提琴组曲 No.1 BWV 1007 =====
  {
    id: 1,
    clipFile: '/audio/bach_cello_c1.mp3',
    composer: '巴赫',
    pieceName: 'G大调第一大提琴组曲 BWV 1007',
    era: '巴洛克',
    instrument: '大提琴独奏',
    questionText: '这段音乐的作曲家是谁？',
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
    questionText: '这段音乐的作曲家是谁？',
    options: ['维瓦尔第', '巴赫', '亨德尔', '帕赫贝尔'],
    correctIndex: 1
  },
  {
    id: 3,
    clipFile: '/audio/bach_cello_c1.mp3',
    composer: '巴赫',
    pieceName: 'G大调第一大提琴组曲 BWV 1007',
    era: '巴洛克',
    instrument: '大提琴独奏',
    questionText: '这段音乐的作曲家是谁？',
    options: ['亨德尔', '巴赫', '泰勒曼', '维瓦尔第'],
    correctIndex: 1
  },

  // ===== 莫扎特：钢琴奏鸣曲 K.545 =====
  {
    id: 4,
    clipFile: '/audio/mozart_sonata_c1.mp3',
    composer: '莫扎特',
    pieceName: 'C大调钢琴奏鸣曲 K.545 第一乐章',
    era: '古典',
    instrument: '钢琴独奏',
    questionText: '这段音乐的作曲家是谁？',
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
    questionText: '这段音乐的作曲家是谁？',
    options: ['海顿', '贝多芬', '莫扎特', '舒伯特'],
    correctIndex: 2
  },
  {
    id: 6,
    clipFile: '/audio/mozart_sonata_c1.mp3',
    composer: '莫扎特',
    pieceName: 'C大调钢琴奏鸣曲 K.545 第一乐章',
    era: '古典',
    instrument: '钢琴独奏',
    questionText: '这段音乐的作曲家是谁？',
    options: ['莫扎特', '海顿', '舒伯特', '贝多芬'],
    correctIndex: 0
  }
];

module.exports = questions;
