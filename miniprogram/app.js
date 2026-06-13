App({
  onLaunch() {
    // 第1轮：无登录，无云开发
    console.log('🎵 MusicGuess 启动');
  },

  globalData: {
    // 后续轮次才会用到
    userInfo: null,
    openid: null
  }
});
