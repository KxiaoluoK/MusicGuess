// 临时测试页：加载指定题目并播放音频
Page({
  data: {
    question: null,
    clipUrl: '',
    playTrigger: 0,
    loading: true,
    error: ''
  },

  async onLoad() {
    try {
      const QUESTION_ID = '59d6db416a3bfe160c3bb0b720643fe9';
      const db = wx.cloud.database();
      const res = await db.collection('questions').doc(QUESTION_ID).get();
      const q = res.data;

      // 通过云函数获取临时链接（服务端 API，与游戏一致）
      const cfRes = await wx.cloud.callFunction({
        name: 'getTestUrl',
        data: { fileId: q.clipFileId }
      });

      if (cfRes.result.code !== 0) {
        this.setData({ error: '云函数获取URL失败: ' + JSON.stringify(cfRes.result), loading: false });
        return;
      }

      const tempUrl = cfRes.result.tempUrl;
      if (!tempUrl) {
        this.setData({ error: 'tempUrl 为空', loading: false });
        return;
      }

      this.setData({
        question: q,
        clipUrl: tempUrl,
        loading: false,
        playTrigger: 1
      });
    } catch (err) {
      console.error('测试加载失败:', err);
      this.setData({ error: err.message || JSON.stringify(err), loading: false });
    }
  },

  onAudioError(e) {
    console.error('音频播放失败:', e.detail);
    wx.showToast({ title: '音频播放失败！', icon: 'none' });
  },

  goBack() {
    wx.navigateBack();
  }
});
