const { STAR_THRESHOLDS, EVALUATIONS } = require('./constants');

/**
 * 根据正确率计算星级和评价
 * @param {number} correctCount - 答对数量
 * @param {number} totalCount - 总题数
 * @returns {{ stars: number, title: string, evaluation: string, percentage: number }}
 */
function calculateScore(correctCount, totalCount) {
  const percentage = Math.round((correctCount / totalCount) * 100);

  let stars = 1;
  let title = '';
  for (const threshold of STAR_THRESHOLDS) {
    if (percentage >= threshold.min) {
      stars = threshold.stars;
      title = threshold.title;
      break;
    }
  }

  const evaluation = EVALUATIONS[stars] || '';

  return {
    stars,
    title,
    evaluation,
    percentage
  };
}

/**
 * 从题库中随机抽题（Fisher-Yates 洗牌后取前N道）
 */
function pickQuestions(pool, count) {
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

module.exports = { calculateScore, pickQuestions };
