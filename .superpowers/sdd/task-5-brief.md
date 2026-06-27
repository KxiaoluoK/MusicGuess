### Task 5: 历史记录精致化 (history)

**Files:**
- Modify: `miniprogram/pages/history/history.wxss`
- Modify: `miniprogram/pages/history/history.js`

**Interfaces:**
- Consumes: CSS 变量体系 (Task 1)

- [ ] **Step 1: 更新 history.wxss**

将 `miniprogram/pages/history/history.wxss` 全量替换为：

```css
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--color-bg) 0%, #2c1810 40%, var(--color-bg) 100%);
  padding: var(--space-lg);
  box-sizing: border-box;
}

/* ===== 空状态 ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.empty-icon {
  font-size: 100rpx;
  margin-bottom: var(--space-md);
}

.empty-text {
  font-size: var(--space-lg);
  color: var(--color-text-muted);
  margin-bottom: 12rpx;
}

.empty-hint {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
}

.empty-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
  padding: 0 var(--space-xl);
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #b8860b 0%, #8b6914 100%);
  color: var(--color-text);
  font-size: var(--text-md);
  font-weight: 600;
  border: none;
}

/* ===== 加载 ===== */
.loading {
  text-align: center;
  padding-top: 200rpx;
  color: var(--color-text-muted);
  font-size: var(--text-md);
}

/* ===== 列表 ===== */
.record-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.record-item {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 28rpx var(--space-lg);
  border: 1rpx solid rgba(139, 90, 43, 0.15);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.record-stars {
  font-size: var(--text-md);
}

.record-diff {
  font-size: var(--text-xs);
  color: var(--color-gold);
  padding: 2rpx var(--space-sm);
  background: var(--color-gold-dim);
  border-radius: var(--radius-sm);
  margin: 0 var(--space-sm);
}

.record-date {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.record-score {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
  margin-bottom: var(--space-xs);
}

.score-num {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-gold);
}

.score-pct {
  font-size: var(--text-base);
  color: var(--color-text-muted);
}

.record-eval {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
}
```

- [ ] **Step 2: 在 history.js 添加日期格式化函数**

在 `miniprogram/pages/history/history.js` 的 `Page({` 之前添加：

```javascript
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
```

- [ ] **Step 3: 在 history.js 中格式化日期**

修改 `onShow` 方法，加载记录后格式化日期。找到 `onShow` 方法中原有的 `this.setData({ records: ... })` 调用，确保 records 中的 `createdAt` 经过 `formatDate` 处理。当前 history.js 未在本次对话中完整读取，需读取后确认具体行号。但逻辑如下：

```javascript
// 在 setData 之前，对 records 处理：
records = records.map(r => ({
  ...r,
  formattedDate: formatDate(r.createdAt)
}));
```

- [ ] **Step 4: 更新 history.wxml 使用格式化日期**

修改 `miniprogram/pages/history/history.wxml` 第 19 行：

```html
<view class="record-date">{{item.formattedDate}}</view>
```

替换原来的：
```html
<view class="record-date">{{item.createdAt}}</view>
```

同时在空状态区域（第 2-6 行）增加引导按钮：

```html
<view class="empty-state" wx:if="{{!loading && records.length === 0}}">
  <view class="empty-icon">📝</view>
  <view class="empty-text">还没有游戏记录</view>
  <view class="empty-hint">去答一局题吧！</view>
  <button class="empty-btn" bindtap="goGame">开始答题</button>
</view>
```

并在 history.js 中添加 `goGame` 方法：

```javascript
goGame() {
  wx.navigateTo({ url: '/pages/game/game' });
}
```

- [ ] **Step 5: 提交**

```bash
git add miniprogram/pages/history/
git commit -m "样式：历史记录精致化 — 日期格式化、卡片统一、空状态引导按钮"
```

---
