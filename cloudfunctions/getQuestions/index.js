// 云函数：随机抽题（多题型均匀分配 + 音频不重复）
// 从 questions 集合中按题型比例抽取 N 道题，每种题型至少 1 题
// 确保同一音频片段不会出现两次
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
  const minPerType = event.minPerType || 1;

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
    const usedClipIds = new Set();

    // 2. 每种题型至少选 minPerType 题
    for (const type of types) {
      const pool = groups[type].filter(q => !usedIds.has(q._id));
      const needed = Math.min(minPerType, pool.length);
      const picked = shuffle(pool).slice(0, needed);
      picked.forEach(q => {
        selected.push(q);
        usedIds.add(q._id);
        usedClipIds.add(q.clipFileId);
      });
    }

    // 3. 剩余名额补全，优先选择不同音频片段
    const remaining = count - selected.length;
    if (remaining > 0) {
      const restPool = questions.filter(q => !usedIds.has(q._id));
      // 优先选不同 clip 的题
      const freshClip = restPool.filter(q => !usedClipIds.has(q.clipFileId));
      const reuseClip = restPool.filter(q => usedClipIds.has(q.clipFileId));

      const extra = shuffle(freshClip).slice(0, remaining);
      // 如果不同 clip 不够，才用重复 clip 的
      if (extra.length < remaining) {
        const moreNeeded = remaining - extra.length;
        extra.push(...shuffle(reuseClip).slice(0, moreNeeded));
      }

      extra.forEach(q => {
        selected.push(q);
        usedIds.add(q._id);
        usedClipIds.add(q.clipFileId);
      });
    }

    // 4. 最终洗牌
    const finalSelection = shuffle(selected);

    // 5. 获取临时下载链接
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
