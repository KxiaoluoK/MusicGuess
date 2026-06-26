// 临时云函数：一键清空 questions 集合
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async () => {
  try {
    // 分批删除（每次最多删 100 条）
    let deleted = 0;
    while (true) {
      const { data } = await db.collection('questions').limit(100).get();
      if (data.length === 0) break;
      const ids = data.map(d => d._id);
      await Promise.all(ids.map(id => db.collection('questions').doc(id).remove()));
      deleted += data.length;
    }
    return { ok: true, deleted };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};
