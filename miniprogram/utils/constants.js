// 常量定义
module.exports = {
  // 每局题目数量
  QUESTIONS_PER_GAME: 5,

  // 重听次数
  MAX_REPLAY_COUNT: 1,

  // 反馈显示时长（毫秒）
  FEEDBACK_DURATION: 1500,

  // 星级评定阈值
  STAR_THRESHOLDS: [
    { min: 100, stars: 5, title: '古典音乐大师 🎭' },
    { min: 80,  stars: 4, title: '资深乐迷 🎻' },
    { min: 60,  stars: 3, title: '古典音乐爱好者 🎵' },
    { min: 40,  stars: 2, title: '音乐探索者 🎧' },
    { min: 0,   stars: 1, title: '古典音乐新手 🌱' }
  ],

  // 评价建议
  EVALUATIONS: {
    5: '太厉害了！你对古典音乐了如指掌，堪称大师级鉴赏力。',
    4: '非常棒！你有扎实的古典音乐功底，继续精进！',
    3: '不错！你对古典音乐有一定了解，多听多想会更好。',
    2: '加油！古典音乐的世界很精彩，多听几遍这些名曲吧。',
    1: '刚入门很正常～这些曲子都值得反复聆听，下次再来挑战！'
  }
};
