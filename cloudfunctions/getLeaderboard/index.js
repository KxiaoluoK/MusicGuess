const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const difficulty = event.difficulty || 0;

  try {
    const { data: records } = await db.collection('gameRecords')
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();

    // 内存聚合 + 按难度筛选
    const userMap = {};
    records.forEach(r => {
      if (difficulty > 0 && r.difficulty !== difficulty) return;
      const oid = r._openid;
      if (!userMap[oid]) {
        userMap[oid] = {
          _openid: oid,
          totalGames: 0,
          totalScore: 0,
          bestPercentage: 0
        };
      }
      userMap[oid].totalGames++;
      userMap[oid].totalScore += r.score?.percentage || 0;
      if (r.score?.percentage > userMap[oid].bestPercentage) {
        userMap[oid].bestPercentage = r.score.percentage;
      }
    });

    const board = Object.values(userMap)
      .map(u => ({
        _openid: u._openid,
        totalGames: u.totalGames,
        avgScore: Math.round(u.totalScore / u.totalGames),
        bestScore: u.bestPercentage
      }))
      .sort((a, b) => b.avgScore - a.avgScore || b.bestScore - a.bestScore)
      .slice(0, 50);

    return { code: 0, board };
  } catch (err) {
    return { code: -1, message: err.message };
  }
};
