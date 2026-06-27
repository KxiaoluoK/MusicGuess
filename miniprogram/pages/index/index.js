const app = getApp();

Page({
  data: {
    showPrivacyModal: false
  },

  onLoad() {
    if (app.globalData.needPrivacyAgree) {
      this.setData({ showPrivacyModal: true });
    }
  },

  async agreePrivacy() {
    await app.agreePrivacy();
    this.setData({ showPrivacyModal: false });
  },

  onDisagree() {
    this.setData({ showPrivacyModal: false });
    wx.showToast({ title: '历史记录和排行榜功能暂不可用', icon: 'none' });
  },

  goPrivacy() {
    wx.navigateTo({ url: '/pages/privacy/privacy' });
  },

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

});
