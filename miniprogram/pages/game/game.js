// 答题页 — 第2轮云开发版
const { calculateScore } = require('../../utils/score');
const { QUESTIONS_PER_GAME, FEEDBACK_DURATION } = require('../../utils/constants');

Page({
  data: {
    // 游戏状态: 'start' | 'playing' | 'feedback' | 'result'
    gameState: 'start',

    // 当前题目
    currentIndex: 0,
    totalQuestions: QUESTIONS_PER_GAME,
    questions: [],
    currentQuestion: null,

    // 音频播放触发器（每次自增触发重新播放）
    playTrigger: 0,

    // 用户选择
    selectedIndex: -1,
    isCorrect: false,

    // 答题记录
    answers: [],

    // 结果
    score: { stars: 1, title: '', evaluation: '', percentage: 0 },
    correctCount: 0,

    // UI 辅助
    feedbackClass: '',
    loading: false,

    // 结果详情
    resultAnswers: []
  },

  onLoad() {
    // 页面加载，显示开始界面
  },

  // ========== 开始游戏 ==========
  async startGame() {
    if (this.data.loading) return;

    this.setData({ loading: true });

    try {
      const res = await wx.cloud.callFunction({
        name: 'getQuestions',
        data: { count: QUESTIONS_PER_GAME }
      });

      if (res.result.code !== 0) {
        wx.showToast({ title: res.result.message || '加载题目失败', icon: 'none' });
        this.setData({ loading: false });
        return;
      }

      const questions = res.result.questions;
      const firstQuestion = questions[0];

      this.setData({
        gameState: 'playing',
        questions,
        currentIndex: 0,
        currentQuestion: firstQuestion,
        selectedIndex: -1,
        answers: [],
        correctCount: 0,
        loading: false,
        playTrigger: this.data.playTrigger + 1  // 触发自动播放
      });
    } catch (err) {
      console.error('云函数调用失败:', err);
      wx.showToast({ title: '网络异常，请重试', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  // ========== 选择答案 ==========
  selectOption(e) {
    if (this.data.gameState !== 'playing') return;

    const selectedIndex = e.currentTarget.dataset.index;
    const currentQuestion = this.data.currentQuestion;
    const isCorrect = selectedIndex === currentQuestion.correctIndex;

    // 禁用继续选择
    this.setData({
      gameState: 'feedback',
      selectedIndex,
      isCorrect,
      feedbackClass: isCorrect ? 'correct' : 'wrong'
    });

    // 记录答题
    const answer = {
      questionId: currentQuestion._id,
      composer: currentQuestion.composer,
      pieceName: currentQuestion.pieceName,
      selectedIndex,
      correctIndex: currentQuestion.correctIndex,
      isCorrect
    };
    const answers = [...this.data.answers, answer];
    const correctCount = this.data.correctCount + (isCorrect ? 1 : 0);

    this.setData({ answers, correctCount });

    // 震动反馈
    if (isCorrect) {
      wx.vibrateShort({ type: 'light' });
    } else {
      wx.vibrateShort({ type: 'heavy' });
    }

    // 延时后自动进入下一题或结果
    setTimeout(() => {
      this.nextQuestion();
    }, FEEDBACK_DURATION);
  },

  // ========== 下一题 ==========
  nextQuestion() {
    const nextIndex = this.data.currentIndex + 1;

    if (nextIndex >= this.data.totalQuestions) {
      // 所有题目答完，显示结果
      this.showResult();
    } else {
      // 下一题
      const nextQuestion = this.data.questions[nextIndex];
      this.setData({
        gameState: 'playing',
        currentIndex: nextIndex,
        currentQuestion: nextQuestion,
        selectedIndex: -1,
        isCorrect: false,
        feedbackClass: '',
        playTrigger: this.data.playTrigger + 1  // 触发自动播放
      });
    }
  },

  // ========== 显示结果 ==========
  showResult() {
    const score = calculateScore(this.data.correctCount, this.data.totalQuestions);

    // 构建结果详情
    const resultAnswers = this.data.answers.map((answer, idx) => ({
      ...answer,
      index: idx + 1
    }));

    this.setData({
      gameState: 'result',
      score,
      resultAnswers
    });

    // 结果页震动
    wx.vibrateLong();
  },

  // ========== 再来一局 ==========
  restartGame() {
    this.startGame();
  },

  // ========== 分享 ==========
  onShareAppMessage() {
    const { score } = this.data;
    return {
      title: `我在古典音乐猜曲中获得了 ${score.percentage} 分！${score.title}`,
      path: '/pages/game/game'
    };
  },

  // ========== 音频事件 ==========
  onAudioError(e) {
    console.error('音频播放失败:', e.detail);
    wx.showToast({ title: '音频加载失败', icon: 'none' });
  },

  onReplay() {
    // 用户重听
    console.log('用户重听');
  }
});
