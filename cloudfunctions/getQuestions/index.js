// 云函数：随机抽题（多题型均匀分配）
// 从 questions 集合中按题型比例抽取 N 道题，每种题型至少 1 题
// 为每道题生成云存储临时播放链接
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// Fisher-Yates 洗牌
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

exports.main = async (event) => {
  const count = event.count || 5;
  const minPerType = event.minPerType || 1; // 每种题型最少出现次数

  try {
    const { data: questions } = await db.collection('questions').limit(500).get();

    if (!questions || questions.length === 0) {
      return { code: -1, message: '题库为空' };
    }

    // 1. 按题型分组
    const groups = {};
    questions.forEach(q => {
      const type = q.type || 'composer';
      if (!groups[type]) groups[type] = [];
      groups[type].push(q);
    });

    const types = Object.keys(groups);
    const selected = [];
    const usedIds = new Set();

    // 2. 每种题型至少选 minPerType 题
    for (const type of types) {
      const pool = groups[type].filter(q => !usedIds.has(q._id));
      const needed = Math.min(minPerType, pool.length);
      const picked = shuffle(pool).slice(0, needed);
      picked.forEach(q => {
        selected.push(q);
        usedIds.add(q._id);
      });
    }

    // 3. 剩余名额随机补全
    const remaining = count - selected.length;
    if (remaining > 0) {
      const restPool = questions.filter(q => !usedIds.has(q._id));
      const extra = shuffle(restPool).slice(0, remaining);
      extra.forEach(q => {
        selected.push(q);
        usedIds.add(q._id);
      });
    }

    // 4. 最终洗牌（避免题型顺序固定）
    const finalSelection = shuffle(selected);

    // 5. 为每个 clipFileId 获取临时下载链接
    const fileIds = finalSelection.map(q => q.clipFileId);
    const tempResult = await cloud.getTempFileURL({ fileList: fileIds });

    // 6. 合并结果，过滤获取链接失败的题目
    const result = finalSelection
      .map((q, idx) => {
        const tempUrl = tempResult.fileList[idx].tempFileURL;
        if (!tempUrl) {
          console.warn('getTempFileURL 失败:', q.clipFileId, tempResult.fileList[idx].errMsg);
          return null;
        }
        return { ...q, clipUrl: tempUrl };
      })
      .filter(Boolean);

    if (result.length === 0) {
      return { code: -1, message: '音频链接获取失败' };
    }

    return { code: 0, questions: result };
  } catch (err) {
    console.error('getQuestions 云函数错误:', err);
    return { code: -1, message: err.message };
  }
};
