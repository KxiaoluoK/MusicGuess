Page({
  data: {},

  goGame(e) {
    const difficulty = e.currentTarget.dataset.difficulty || 0;
    wx.navigateTo({ url: `/pages/game/game?difficulty=${difficulty}` });
  },

  goLeaderboard() {
    wx.navigateTo({ url: '/pages/leaderboard/leaderboard' });
  },

  goHistory() {
    wx.navigateTo({ url: '/pages/history/history' });
  },

  goAdmin() {
    wx.navigateTo({ url: '/pages/admin/admin' });
  }
});
