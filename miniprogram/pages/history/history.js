function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (target.getTime() === today.getTime()) return '今天';
  if (target.getTime() === yesterday.getTime()) return '昨天';
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

Page({
  data: {
    records: [],
    loading: true
  },

  onShow() {
    this.loadHistory();
  },

  async loadHistory() {
    this.setData({ loading: true });
    try {
      const res = await wx.cloud.callFunction({ name: 'getUserHistory' });
      if (res.result.code === 0) {
        const records = res.result.records.map(r => ({
          ...r,
          formattedDate: formatDate(r.createdAt)
        }));
        this.setData({ records });
      }
    } catch (err) {
      console.error('加载历史失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  goHome() {
    wx.navigateBack();
  },

  goGame() {
    wx.navigateTo({ url: '/pages/game/game' });
  }
});
