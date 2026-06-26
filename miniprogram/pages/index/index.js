Page({
  data: {
    statusBarHeight: 0
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync();
    this.setData({ statusBarHeight });
  },

  goGame() {
    wx.navigateTo({ url: '/pages/game/game' });
  },

  goHistory() {
    wx.navigateTo({ url: '/pages/history/history' });
  }
});
