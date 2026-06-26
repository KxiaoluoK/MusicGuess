const app = getApp();

Page({
  data: {
    board: [],
    myOpenid: '',
    difficulty: 0,   // 0=全部, 1=简单, 2=中等
    loading: true
  },

  onShow() {
    this.setData({ myOpenid: app.globalData.openid || '' });
    this.loadBoard();
  },

  async loadBoard() {
    this.setData({ loading: true });
    try {
      const data = {};
      if (this.data.difficulty > 0) data.difficulty = this.data.difficulty;
      const res = await wx.cloud.callFunction({
        name: 'getLeaderboard',
        data
      });
      if (res.result.code === 0) {
        this.setData({ board: res.result.board });
      }
    } catch (err) {
      console.error('加载排行榜失败:', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  switchDiff(e) {
    const d = parseInt(e.currentTarget.dataset.d);
    this.setData({ difficulty: d });
    this.loadBoard();
  },

  goHome() {
    wx.navigateBack();
  }
});
