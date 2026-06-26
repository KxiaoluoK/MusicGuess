// 云函数：随机抽题（多题型均匀分配 + 音频尽量不重复）
// 预选多题备用，确保过滤无效链接后仍够 5 题
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

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

  try {
    let { data: questions } = await db.collection('questions').limit(500).get();

    // 难度筛选
    if (event.difficulty) {
      questions = questions.filter(q => q.difficulty === event.difficulty);
    }

    if (!questions || questions.length === 0) {
      return { code: -1, message: event.difficulty ? '该难度题库为空' : '题库为空' };
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

    // 2. 每种题型至少选 1 题
    for (const type of types) {
      const pool = groups[type].filter(q => !usedIds.has(q._id));
      const picked = shuffle(pool).slice(0, 1);
      picked.forEach(q => {
        selected.push(q);
        usedIds.add(q._id);
        usedClipIds.add(q.clipFileId);
      });
    }

    // 3. 补充备选题（选 count×2 题缓冲过滤损耗）
    const bufferSize = count * 2;
    const remaining = bufferSize - selected.length;
    if (remaining > 0) {
      const restPool = questions.filter(q => !usedIds.has(q._id));
      // 优先不同 clip
      const fresh = restPool.filter(q => !usedClipIds.has(q.clipFileId));
      const reuse = restPool.filter(q => usedClipIds.has(q.clipFileId));
      const extra = [
        ...shuffle(fresh).slice(0, remaining),
        ...shuffle(reuse).slice(0, Math.max(0, remaining - fresh.length))
      ];
      extra.forEach(q => {
        selected.push(q);
        usedIds.add(q._id);
        usedClipIds.add(q.clipFileId);
      });
    }

    const candidates = shuffle(selected);

    // 4. 获取临时下载链接
    const fileIds = candidates.map(q => q.clipFileId);
    const tempResult = await cloud.getTempFileURL({ fileList: fileIds });

    // 5. 取前 count 个有效的
    const result = [];
    for (let i = 0; i < candidates.length; i++) {
      const tempUrl = tempResult.fileList[i].tempFileURL;
      if (tempUrl) {
        result.push({ ...candidates[i], clipUrl: tempUrl });
      } else {
        console.warn('getTempFileURL 失败:', candidates[i].clipFileId);
      }
      if (result.length >= count) break;
    }

    if (result.length === 0) {
      return { code: -1, message: '音频链接获取失败' };
    }

    return { code: 0, questions: result };
  } catch (err) {
    console.error('getQuestions 云函数错误:', err);
    return { code: -1, message: err.message };
  }
};
