const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { score, answers } = event;
  const { OPENID } = cloud.getWXContext();

  try {
    await db.collection('gameRecords').add({
      data: {
        _openid: OPENID,
        score,
        answers,
        createdAt: db.serverDate()
      }
    });
    return { code: 0 };
  } catch (err) {
    return { code: -1, message: err.message };
  }
};
