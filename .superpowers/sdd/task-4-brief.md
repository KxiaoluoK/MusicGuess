### Task 4: 排行榜精致化 (leaderboard)

**Files:**
- Modify: `miniprogram/pages/leaderboard/leaderboard.wxss`

**Interfaces:**
- Consumes: CSS 变量体系 (Task 1)

- [ ] **Step 1: 更新 leaderboard.wxss**

将 `miniprogram/pages/leaderboard/leaderboard.wxss` 全量替换为：

```css
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--color-bg) 0%, #2c1810 40%, var(--color-bg) 100%);
  padding: var(--space-lg);
  box-sizing: border-box;
}

/* ===== 难度 Tab ===== */
.diff-tabs {
  display: flex;
  gap: 12rpx;
  margin-bottom: 28rpx;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 16rpx 0 12rpx;
  font-size: var(--text-base);
  color: var(--color-text-muted);
  background: transparent;
  border-radius: 0;
  border-bottom: 4rpx solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.tab.active {
  color: var(--color-text);
  border-bottom-color: var(--color-gold);
}

.tab.disabled {
  opacity: 0.35;
}

/* ===== 列表 ===== */
.board-header {
  display: flex;
  padding: 16rpx var(--space-md);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  border-bottom: 1rpx solid rgba(139, 90, 43, 0.25);
  margin-bottom: 12rpx;
}

.board-item {
  display: flex;
  align-items: center;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  margin-bottom: 12rpx;
  background: var(--color-surface);
  border: 1rpx solid rgba(139, 90, 43, 0.12);
  transition: background 0.15s;
}

/* 前三名光泽 */
.board-item.rank-1 {
  background: linear-gradient(135deg, rgba(201, 166, 78, 0.18), rgba(201, 166, 78, 0.06));
  border-color: rgba(201, 166, 78, 0.35);
}

.board-item.rank-2 {
  background: linear-gradient(135deg, rgba(180, 180, 190, 0.14), rgba(180, 180, 190, 0.04));
  border-color: rgba(180, 180, 190, 0.25);
}

.board-item.rank-3 {
  background: linear-gradient(135deg, rgba(200, 150, 100, 0.14), rgba(200, 150, 100, 0.04));
  border-color: rgba(200, 150, 100, 0.25);
}

/* 我的排名 */
.board-item.is-me {
  background: var(--color-gold-dim);
  border: 1rpx solid rgba(201, 166, 78, 0.35);
  border-left: 6rpx solid var(--color-gold);
}

.rank-col {
  width: 80rpx;
  text-align: center;
  font-size: 30rpx;
  color: var(--color-gold);
}

.rank-medal {
  font-size: 44rpx;
}

.score-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.avg-score {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--color-text);
}

.best-score {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.games-col {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  text-align: right;
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
  font-size: 80rpx;
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
}

.loading {
  text-align: center;
  padding-top: 200rpx;
  color: var(--color-text-muted);
  font-size: var(--text-md);
}
```

- [ ] **Step 2: 更新 leaderboard.wxml 添加排名 class**

修改 `miniprogram/pages/leaderboard/leaderboard.wxml` 第 17 行，给 `board-item` 加上排名类名：

```html
<view
  class="board-item rank-{{index + 1}} {{item._openid === myOpenid ? 'is-me' : ''}}"
  wx:for="{{board}}"
  wx:key="_openid"
>
```

替换原来的：
```html
<view
  class="board-item {{item._openid === myOpenid ? 'is-me' : ''}}"
  wx:for="{{board}}"
  wx:key="_openid"
>
```

- [ ] **Step 3: 提交**

```bash
git add miniprogram/pages/leaderboard/
git commit -m "样式：排行榜精致化 — 前三名光泽、Tab下划线、我排左边条"
```

---
