// 扫描/清理题库重复题（题型+曲子+片段相同，仅选项顺序不同）
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

function getKey(q) {
  return `${q.type}||${q.composer}||${q.pieceName}||${q.clipFileId}`;
}

exports.main = async (event) => {
  const action = event.action || 'scan'; // scan | autoClean

  try {
    const res = await db.collection('questions').limit(500).get();
    const questions = res.data;

    const groups = {};
    questions.forEach(q => {
      const key = getKey(q);
      if (!groups[key]) groups[key] = [];
      groups[key].push(q);
    });

    // 找出重复组
    const dupGroups = [];
    for (const [key, qs] of Object.entries(groups)) {
      if (qs.length > 1) {
        const sortedOptions = qs.map(q => [...q.options].sort().join('|||'));
        const uniqueSets = new Set(sortedOptions);
        // 选项集合数 < 题目数 = 有重复
        if (uniqueSets.size < qs.length) {
          dupGroups.push({
            key,
            questionIds: qs.map(q => q._id)
          });
        }
      }
    }

    if (action === 'autoClean') {
      const deleted = [];
      for (const group of dupGroups) {
        // 每组保留第一题，删其余
        const toDelete = group.questionIds.slice(1);
        for (const id of toDelete) {
          await db.collection('questions').doc(id).remove();
          deleted.push(id);
        }
      }

      // 再扫一次确认
      const res2 = await db.collection('questions').limit(500).get();
      return {
        code: 0,
        action: 'autoClean',
        before: questions.length,
        after: res2.data.length,
        deleted,
        deletedCount: deleted.length
      };
    }

    // scan 模式
    return {
      code: 0,
      action: 'scan',
      totalQuestions: questions.length,
      duplicateCount: dupGroups.length,
      duplicates: dupGroups
    };
  } catch (err) {
    return { code: -1, message: err.message };
  }
};
