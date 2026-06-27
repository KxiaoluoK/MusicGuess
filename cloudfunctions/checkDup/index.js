// 临时：对比两道题的字段
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async () => {
  const ids = [
    '59d6db416a3bfe160c3bb1016a2e8034',
    '59d6db416a3bfe160c3bb10267339e25'
  ];
  const results = [];
  for (const id of ids) {
    const res = await db.collection('questions').doc(id).get();
    const q = res.data;
    results.push({
      _id: q._id,
      type: q.type,
      composer: q.composer,
      pieceName: q.pieceName,
      questionText: q.questionText,
      options: q.options,
      correctIndex: q.correctIndex,
      difficulty: q.difficulty,
      clipFileId: q.clipFileId,
      era: q.era,
      instrument: q.instrument
    });
  }

  const isDuplicate = JSON.stringify(results[0].options) === JSON.stringify(results[1].options)
    && results[0].type === results[1].type
    && results[0].correctIndex === results[1].correctIndex
    && results[0].composer === results[1].composer;

  return { code: 0, questions: results, isDuplicate };
};
