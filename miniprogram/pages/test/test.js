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

      const tempRes = await wx.cloud.getTempFileURL({ fileList: [q.clipFileId] });
      const tempUrl = tempRes.fileList[0].tempFileURL;

      if (!tempUrl) {
        this.setData({ error: 'getTempFileURL 返回空', loading: false });
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
