const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async () => {
  try {
    // 聚合查询：按 _openid 分组，统计总分和总局数
    const { data: records } = await db.collection('gameRecords')
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();

    // 内存聚合（云数据库聚合管道限制较多，这里数据量小时直接用 JS 聚合）
    const userMap = {};
    records.forEach(r => {
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

    // 按总分排序
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
