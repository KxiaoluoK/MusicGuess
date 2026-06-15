// 云函数：随机抽题
// 从 questions 集合中随机抽取 N 道题，为每道题生成云存储临时播放链接
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const count = event.count || 5;

  try {
    // 1. 查询所有题目
    const { data: questions } = await db.collection('questions').get();

    if (!questions || questions.length === 0) {
      return { code: -1, message: '题库为空' };
    }

    // 2. Fisher-Yates 洗牌，取前 count 题
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    // 3. 为每个 clipFileId 获取临时下载链接
    const fileIds = selected.map(q => q.clipFileId);
    const tempResult = await cloud.getTempFileURL({ fileList: fileIds });

    // 4. 合并结果
    const result = selected.map((q, idx) => ({
      ...q,
      clipUrl: tempResult.fileList[idx].tempFileURL
    }));

    return { code: 0, questions: result };
  } catch (err) {
    console.error('getQuestions 云函数错误:', err);
    return { code: -1, message: err.message };
  }
};
