// 答题页 — 第2轮云开发版（多题型 + 预加载）
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

    // 难度
    difficulty: 0,
    difficultyLabel: '',

    // UI 辅助
    feedbackClass: '',
    loading: false,

    // 结果详情
    resultAnswers: [],

    // 建议反馈
    showSuggestForm: false,
    suggestCategoryIndex: -1,
    suggestContent: '',
    suggestCategories: ['🐛 题目有误', '🎵 音质问题', '💡 功能建议', '🎼 曲库建议', '📝 题型建议', '💬 其他反馈']
  },

  onLoad(options) {
    // 读取难度参数
    const difficulty = parseInt(options.difficulty) || 0;
    const diffLabels = { 0: '不限难度', 1: '🌱 简单', 2: '🔥 中等', 3: '🔒 困难' };
    this.setData({ difficulty, difficultyLabel: diffLabels[difficulty] || '' });
  },

  // ========== 开始游戏 ==========
  async startGame() {
    if (this.data.loading) return;

    this.setData({ loading: true });

    try {
      const callData = { count: QUESTIONS_PER_GAME };
      if (this.data.difficulty > 0) {
        callData.difficulty = this.data.difficulty;
      }
      const res = await wx.cloud.callFunction({
        name: 'getQuestions',
        data: callData
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
        totalQuestions: questions.length,
        currentIndex: 0,
        currentQuestion: firstQuestion,
        selectedIndex: -1,
        answers: [],
        correctCount: 0,
        loading: false,
        playTrigger: this.data.playTrigger + 1
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

    // 记录答题（含题型信息）
    const answer = {
      questionId: currentQuestion._id,
      type: currentQuestion.type,
      composer: currentQuestion.composer,
      pieceName: currentQuestion.pieceName,
      era: currentQuestion.era,
      instrument: currentQuestion.instrument,
      questionText: currentQuestion.questionText,
      options: currentQuestion.options,
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

      // 静默预加载下一题的音频
      this._preloadNextAudio(nextIndex);
    }
  },

  // ========== 音频预加载 ==========
  _preloadNextAudio(currentIdx) {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= this.data.questions.length) return;

    const nextQ = this.data.questions[nextIdx];
    const url = nextQ.clipUrl;
    if (!url) return;

    // 已经是本地路径则跳过
    if (url.startsWith('wxfile://') || url.startsWith('http://tmp/')) return;

    wx.downloadFile({
      url: url,
      success: (res) => {
        if (res.statusCode === 200 && res.tempFilePath) {
          // 用本地路径替换云存储 URL，下次播放直接走本地
          const questions = this.data.questions;
          questions[nextIdx].clipUrl = res.tempFilePath;
          // 静默更新 data，不影响当前播放
          this.setData({ questions });
        }
      },
      fail: () => {
        // 预加载失败不影响游戏，继续用云存储 URL
      }
    });
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

    // 提交成绩到云端（静默，不阻塞）
    wx.cloud.callFunction({
      name: 'submitScore',
      data: { score, answers: resultAnswers, difficulty: this.data.difficulty }
    }).catch(() => {});

    // 结果页震动
    wx.vibrateLong();
  },

  // ========== 再来一局 ==========
  restartGame() {
    this.startGame();
  },

  // ========== 返回首页 ==========
  goHome() {
    wx.navigateBack();
  },

  // ========== 建议反馈 ==========
  toggleSuggestForm() {
    this.setData({ showSuggestForm: !this.data.showSuggestForm });
  },

  onCategoryChange(e) {
    this.setData({ suggestCategoryIndex: parseInt(e.detail.value) });
  },

  onSuggestInput(e) {
    this.setData({ suggestContent: e.detail.value });
  },

  async submitSuggestion() {
    const { suggestCategoryIndex, suggestCategories, suggestContent, difficulty, score, correctCount, totalQuestions, answers } = this.data;
    if (suggestCategoryIndex === -1 || suggestContent.trim() === '') return;

    try {
      const db = wx.cloud.database();
      await db.collection('suggestions').add({
        data: {
          category: suggestCategories[suggestCategoryIndex],
          content: suggestContent.trim(),
          questionIds: answers.map(a => a.questionId),
          difficulty,
          score: { correctCount, totalQuestions, percentage: score.percentage },
          createdAt: db.serverDate()
        }
      });

      wx.showToast({ title: '感谢你的建议！🙏', icon: 'none' });
      this.setData({
        showSuggestForm: false,
        suggestCategoryIndex: -1,
        suggestContent: ''
      });
    } catch (err) {
      console.error('提交建议失败:', err);
      wx.showToast({ title: '提交失败，请重试', icon: 'none' });
    }
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
