const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async () => {
  const { OPENID } = cloud.getWXContext();

  try {
    const { data: records } = await db.collection('gameRecords')
      .where({ _openid: OPENID })
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    return { code: 0, records };
  } catch (err) {
    return { code: -1, message: err.message };
  }
};
