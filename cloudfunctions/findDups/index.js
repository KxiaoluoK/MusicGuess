// 扫描题库重复题（题型+曲子+片段相同，仅选项顺序不同）
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const action = event.action || 'scan'; // scan | delete

  try {
    const res = await db.collection('questions').limit(500).get();
    const questions = res.data;

    // 去重键：题型 + 作曲家 + 曲名 + 片段文件ID
    const groups = {};
    questions.forEach(q => {
      const key = `${q.type}||${q.composer}||${q.pieceName}||${q.clipFileId}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(q);
    });

    // 找出重复组（同一 key 下有多道题）
    const dups = [];
    for (const [key, qs] of Object.entries(groups)) {
      if (qs.length > 1) {
        // 检查选项是否仅顺序不同
        const sortedOptions = qs.map(q => ({
          _id: q._id,
          options: [...q.options].sort().join('|||'),
          rawOptions: q.options,
          correctIndex: q.correctIndex
        }));

        const uniqueOptionSets = new Set(sortedOptions.map(s => s.options));
        if (uniqueOptionSets.size < sortedOptions.length) {
          // 有真正重复的（选项集合相同）
          dups.push({
            key,
            count: qs.length,
            questions: qs.map(q => ({
              _id: q._id,
              type: q.type,
              questionText: q.questionText,
              composer: q.composer,
              pieceName: q.pieceName,
              options: q.options,
              correctIndex: q.correctIndex,
              difficulty: q.difficulty
            }))
          });
        }
      }
    }

    if (action === 'delete' && event.deleteId) {
      await db.collection('questions').doc(event.deleteId).remove();
      return { code: 0, deleted: event.deleteId, duplicateCount: dups.length, duplicates: dups };
    }

    return {
      code: 0,
      totalQuestions: questions.length,
      duplicateCount: dups.length,
      duplicates: dups
    };
  } catch (err) {
    return { code: -1, message: err.message };
  }
};
