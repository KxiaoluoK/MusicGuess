Page({
  data: {},

  goGame() {
    wx.navigateTo({ url: '/pages/game/game' });
  },

  goHistory() {
    wx.navigateTo({ url: '/pages/history/history' });
  }
});
