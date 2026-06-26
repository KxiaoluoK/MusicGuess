Page({
  data: {
    questions: [],
    stats: {},
    loading: true
  },

  onShow() {
    this.loadQuestions();
  },

  async loadQuestions() {
    this.setData({ loading: true });
    try {
      const res = await wx.cloud.callFunction({
        name: 'getQuestions',
        data: { count: 1000 }
      });
      if (res.result.code === 0) {
        const qs = res.result.questions;
        const stats = { total: qs.length };
        qs.forEach(q => {
          const key = `diff${q.difficulty}`;
          stats[key] = (stats[key] || 0) + 1;
        });
        this.setData({ questions: qs, stats });
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.setData({ loading: false });
    }
  },

  async deleteQuestion(e) {
    const id = e.currentTarget.dataset.id;
    const confirmed = await this._confirm('确定删除这道题？');
    if (!confirmed) return;

    try {
      const db = wx.cloud.database();
      await db.collection('questions').doc(id).remove();
      wx.showToast({ title: '已删除', icon: 'success' });
      this.loadQuestions();
    } catch (err) {
      wx.showToast({ title: '删除失败', icon: 'none' });
    }
  },

  _confirm(msg) {
    return new Promise(resolve => {
      wx.showModal({
        title: '确认',
        content: msg,
        success: r => resolve(r.confirm)
      });
    });
  },

  goHome() {
    wx.navigateBack();
  }
});
