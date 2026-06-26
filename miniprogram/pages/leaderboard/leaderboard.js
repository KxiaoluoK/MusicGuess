const app = getApp();

Page({
  data: {
    board: [],
    myOpenid: '',
    loading: true
  },

  onShow() {
    this.setData({ myOpenid: app.globalData.openid || '' });
    this.loadBoard();
  },

  async loadBoard() {
    this.setData({ loading: true });
    try {
      const res = await wx.cloud.callFunction({ name: 'getLeaderboard' });
      if (res.result.code === 0) {
        this.setData({ board: res.result.board });
      }
    } catch (err) {
      console.error('加载排行榜失败:', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  goHome() {
    wx.navigateBack();
  }
});
