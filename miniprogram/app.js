App({
  async onLaunch() {
    wx.cloud.init({
      env: 'cloud1-d6g7k4w8h97f63f30',
      traceUser: true
    });

    // 隐私政策检查
    const agreed = wx.getStorageSync('privacyAgreed');
    if (!agreed) {
      this.globalData.needPrivacyAgree = true;
      return; // 等用户同意后再登录
    }

    await this._doLogin();
    console.log('🎵 MusicGuess 启动');
  },

  async _doLogin() {
    try {
      const res = await wx.cloud.callFunction({ name: 'login' });
      this.globalData.openid = res.result.openid;
    } catch (e) {
      console.warn('登录失败:', e);
    }
  },

  // 用户同意隐私政策后调用
  async agreePrivacy() {
    wx.setStorageSync('privacyAgreed', true);
    this.globalData.needPrivacyAgree = false;
    await this._doLogin();
  },

  globalData: {
    openid: null,
    needPrivacyAgree: false
  }
});
