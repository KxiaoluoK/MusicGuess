App({
  async onLaunch() {
    wx.cloud.init({
      env: 'cloud1-d6g7k4w8h97f63f30',
      traceUser: true
    });

    // 静默登录，获取 openid
    try {
      const res = await wx.cloud.callFunction({ name: 'login' });
      this.globalData.openid = res.result.openid;
    } catch (e) {
      console.warn('登录失败，历史记录功能不可用:', e);
    }

    console.log('🎵 MusicGuess 启动');
  },

  globalData: {
    openid: null
  }
});
