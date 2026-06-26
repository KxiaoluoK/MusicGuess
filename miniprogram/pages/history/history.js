Page({
  data: {
    records: [],
    loading: true,
    statusBarHeight: 0
  },

  onLoad() {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync().statusBarHeight
    });
  },

  onShow() {
    this.loadHistory();
  },

  async loadHistory() {
    this.setData({ loading: true });
    try {
      const res = await wx.cloud.callFunction({ name: 'getUserHistory' });
      if (res.result.code === 0) {
        this.setData({ records: res.result.records });
      }
    } catch (err) {
      console.error('加载历史失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  goHome() {
    wx.navigateBack();
  }
});
