App({
  onLaunch() {
    // 初始化云开发
    wx.cloud.init({
      env: 'cloud1-d9g5xdgbm046ba438',
      traceUser: true
    });
    console.log('🎵 MusicGuess 启动 (云开发已初始化)');
  },

  globalData: {
    userInfo: null,
    openid: null
  }
});
