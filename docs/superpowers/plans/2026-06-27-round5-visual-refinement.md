# Round 5 视觉精致化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不变更布局结构的前提下，统一设计语言，提升视觉"产品感"

**Architecture:** 纯 CSS + 微量 JS。先在 app.wxss 建立 CSS 变量体系，然后逐页应用。每个任务独立可验证。

**Tech Stack:** 微信小程序原生 WXSS/JS

## Global Constraints

- 不改布局结构（flex 方向、元素位置不动）
- 不动功能逻辑（JS 只加日期格式化）
- 不改 WXML 结构（除历史记录空状态加引导按钮）
- 色板严格使用现有：幕布黑 #1a0f0a、琴木棕 #2c1810、黄铜金 #c9a64e、象牙白 #f5e6d3

---

### Task 1: CSS 变量体系 (app.wxss)

**Files:**
- Modify: `miniprogram/app.wxss`

**Interfaces:**
- Produces: CSS 变量供所有页面使用

- [ ] **Step 1: 在 app.wxss 的 page 选择器中添加 CSS 变量**

将现有 `page` 样式块替换为：

```css
page {
  /* 色板 */
  --color-bg: #1a0f0a;
  --color-surface: rgba(139, 90, 43, 0.1);
  --color-surface-hover: rgba(139, 90, 43, 0.18);
  --color-gold: #c9a64e;
  --color-gold-dim: rgba(201, 166, 78, 0.2);
  --color-text: #f5e6d3;
  --color-text-secondary: #d4b896;
  --color-text-muted: #8b7355;
  --color-success: #6b8e23;
  --color-danger: #cd5c5c;
  --color-silver: rgba(180, 180, 190, 0.2);
  --color-bronze: rgba(200, 150, 100, 0.2);

  /* 圆角 */
  --radius-sm: 12rpx;
  --radius-md: 20rpx;
  --radius-lg: 24rpx;

  /* 间距 */
  --space-xs: 8rpx;
  --space-sm: 16rpx;
  --space-md: 24rpx;
  --space-lg: 32rpx;
  --space-xl: 48rpx;

  /* 字号 */
  --text-xs: 22rpx;
  --text-sm: 24rpx;
  --text-base: 26rpx;
  --text-md: 28rpx;
  --text-lg: 34rpx;
  --text-xl: 40rpx;
  --text-2xl: 48rpx;
  --text-3xl: 80rpx;

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
  min-height: 100vh;
}

button::after {
  border: none;
}

button {
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
```

- [ ] **Step 2: 提交**

```bash
git add miniprogram/app.wxss
git commit -m "样式：app.wxss 建立 CSS 变量体系（色板/圆角/间距/字号）"
```

---

### Task 2: 首页精致化 (index)

**Files:**
- Modify: `miniprogram/pages/index/index.wxss`

**Interfaces:**
- Consumes: CSS 变量体系 (Task 1)

- [ ] **Step 1: 更新 index.wxss**

将 `miniprogram/pages/index/index.wxss` 全量替换为：

```css
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--color-bg) 0%, #2c1810 40%, var(--color-bg) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx var(--space-lg);
  box-sizing: border-box;
}

/* ===== Logo 区 ===== */
.logo-area {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.logo-icon {
  font-size: 100rpx;
  margin-bottom: var(--space-sm);
  animation: float 3s ease-in-out infinite;
}

/* 五线谱装饰线 */
.logo-icon::after {
  content: '';
  display: block;
  width: 120rpx;
  height: 2rpx;
  margin: 12rpx auto 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--color-gold-dim) 20%,
    var(--color-gold-dim) 80%,
    transparent 100%
  );
  box-shadow:
    0 8rpx 0 var(--color-gold-dim),
    0 16rpx 0 var(--color-gold-dim);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12rpx); }
}

.logo-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-xs);
  letter-spacing: 4rpx;
}

.logo-subtitle {
  font-size: var(--text-md);
  color: var(--color-text-secondary);
}

/* ===== 难度选择 ===== */
.section-title {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  margin-bottom: 20rpx;
}

.difficulty-area {
  display: flex;
  gap: 20rpx;
  width: 100%;
  max-width: 560rpx;
  margin-bottom: 40rpx;
}

.diff-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  height: 140rpx;
  border-radius: var(--radius-lg);
  border: none;
  position: relative;
  transition: transform 0.15s;
}

.diff-btn:active {
  transform: scale(0.96);
}

.diff-btn.easy {
  background: linear-gradient(135deg, #7a9e2f 0%, #5a7a1f 100%);
  box-shadow: 0 6rpx 24rpx rgba(107, 142, 35, 0.35);
}

.diff-btn.medium {
  background: linear-gradient(135deg, #d4943f 0%, #9a7518 100%);
  box-shadow: 0 6rpx 24rpx rgba(205, 133, 63, 0.35);
}

.diff-btn.hard {
  background: rgba(180, 140, 100, 0.15);
  border: 1rpx solid rgba(180, 140, 100, 0.3);
}

.diff-btn.hard .diff-icon {
  font-size: var(--text-md);
}

.diff-btn.hard .diff-label {
  font-size: var(--text-sm);
}

.diff-btn.hard .diff-hint {
  font-size: 20rpx;
}

.diff-icon {
  font-size: 36rpx;
}

.diff-label {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
}

.diff-btn.hard .diff-label {
  color: #c0a880;
}

.diff-hint {
  font-size: var(--text-xs);
  color: #d4c0a0;
}

/* ===== 菜单区 ===== */
.menu-area {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: 100%;
  max-width: 480rpx;
}

.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  height: 88rpx;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1rpx solid rgba(139, 90, 43, 0.15);
  color: var(--color-text-secondary);
  font-size: var(--text-md);
  transition: background 0.15s;
}

.menu-btn:active {
  background: var(--color-surface-hover);
}

.menu-icon {
  font-size: var(--space-lg);
}

.menu-text {
  font-size: var(--text-md);
}
```

- [ ] **Step 2: 提交**

```bash
git add miniprogram/pages/index/index.wxss
git commit -m "样式：首页精致化 — 五线谱装饰、按钮饱和度、间距统一"
```

---

### Task 3: 游戏页精致化 (game)

**Files:**
- Modify: `miniprogram/pages/game/game.wxss`

**Interfaces:**
- Consumes: CSS 变量体系 (Task 1)

- [ ] **Step 1: 更新 game.wxss**

将 `miniprogram/pages/game/game.wxss` 全量替换为：

```css
/* ==================== 整体布局 ==================== */
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--color-bg) 0%, #2c1810 40%, var(--color-bg) 100%);
}

.screen {
  min-height: 100vh;
  padding: 40rpx var(--space-lg);
  box-sizing: border-box;
}

/* ==================== 开始界面 ==================== */
.start-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-xl);
}

.logo-area {
  text-align: center;
}

.logo-icon {
  font-size: 120rpx;
  margin-bottom: var(--space-md);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12rpx); }
}

.logo-title {
  font-size: 52rpx;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 12rpx;
  letter-spacing: 4rpx;
}

.logo-subtitle {
  font-size: var(--text-md);
  color: var(--color-text-muted);
}

.difficulty-tag {
  margin-top: var(--space-sm);
  display: inline-block;
  padding: var(--space-xs) var(--space-lg);
  background: var(--color-gold-dim);
  border: 1rpx solid rgba(201, 166, 78, 0.3);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  color: var(--color-gold);
}

.rules-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) 40rpx;
  width: 100%;
  max-width: 560rpx;
  border: 1rpx solid rgba(139, 90, 43, 0.2);
}

.rules-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 20rpx;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.rule-item {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  line-height: 1.6;
}

.rule-item .highlight {
  color: var(--color-gold);
  font-weight: 600;
}

.start-btn {
  width: 400rpx;
  height: 96rpx;
  background: linear-gradient(135deg, #b8860b 0%, #8b6914 100%);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 12rpx 40rpx rgba(184, 134, 11, 0.3);
  transition: transform 0.15s;
}

.start-btn:active {
  transform: scale(0.96);
}

.start-btn-text {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 4rpx;
}

/* ==================== 答题界面 ==================== */
.game-screen {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* 顶部进度 */
.game-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.progress-text {
  font-size: var(--text-base);
  color: var(--color-text-muted);
}

.current-num {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--color-gold);
}

.progress-dots {
  display: flex;
  gap: 14rpx;
}

.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 8rpx;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.dot.current {
  background: var(--color-gold);
  box-shadow: 0 0 12rpx rgba(201, 166, 78, 0.5);
  width: 32rpx;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 12rpx rgba(201, 166, 78, 0.5); }
  50% { opacity: 0.7; box-shadow: 0 0 20rpx rgba(201, 166, 78, 0.8); }
}

.dot.done {
  background: rgba(255, 255, 255, 0.25);
}

.dot.dot-correct {
  background: var(--color-success);
}

.dot.dot-wrong {
  background: var(--color-danger);
}

/* 音频区域 */
.audio-section {
  padding: 20rpx 0;
}

/* 题目 */
.question-text {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  text-align: center;
  padding: var(--space-sm) 0;
}

/* 选项 */
.options-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.option-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx var(--space-lg);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1rpx solid rgba(139, 90, 43, 0.2);
  transition: all 0.15s;
}

.option-card:active {
  background: rgba(139, 90, 43, 0.2);
  transform: scale(0.98);
}

.option-letter {
  width: 56rpx;
  height: 56rpx;
  border-radius: 28rpx;
  background: var(--color-gold-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-gold);
  flex-shrink: 0;
}

.option-text {
  flex: 1;
  font-size: 30rpx;
  color: #e8d5c0;
}

.option-icon {
  width: 48rpx;
  text-align: center;
  font-size: var(--space-lg);
  flex-shrink: 0;
}

/* 选项状态 — 正确 */
.option-correct {
  background: rgba(107, 142, 35, 0.2);
  border-color: rgba(107, 142, 35, 0.5);
  border-left: 6rpx solid var(--color-success);
}

.option-correct .option-letter {
  background: rgba(107, 142, 35, 0.3);
  color: #8fbc8f;
}

.option-correct .option-icon {
  color: #8fbc8f;
}

/* 选项状态 — 错误 */
.option-wrong {
  background: rgba(205, 92, 92, 0.2);
  border-color: rgba(205, 92, 92, 0.5);
  border-left: 6rpx solid var(--color-danger);
}

.option-wrong .option-letter {
  background: rgba(205, 92, 92, 0.3);
  color: #e8a0a0;
}

.option-wrong .option-icon {
  color: #e8a0a0;
}

.option-dimmed {
  opacity: 0.35;
}

/* 反馈横幅 */
.feedback-banner {
  text-align: center;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  font-size: 30rpx;
  font-weight: 600;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.feedback-banner.correct {
  background: rgba(107, 142, 35, 0.15);
  color: #8fbc8f;
}

.feedback-banner.wrong {
  background: rgba(205, 92, 92, 0.15);
  color: #e8a0a0;
}

/* ==================== 结果界面 ==================== */
.result-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  padding-bottom: 60rpx;
}

.result-header {
  text-align: center;
  padding-top: 40rpx;
}

.stars-row {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.star {
  font-size: 56rpx;
}

.star-filled {
  animation: popIn 0.3s ease-out both;
}

/* 星星错开弹出 */
.star-filled:nth-child(1) { animation-delay: 0s; }
.star-filled:nth-child(2) { animation-delay: 0.1s; }
.star-filled:nth-child(3) { animation-delay: 0.2s; }
.star-filled:nth-child(4) { animation-delay: 0.3s; }
.star-filled:nth-child(5) { animation-delay: 0.4s; }

.star-empty {
  opacity: 0.25;
}

@keyframes popIn {
  0% { transform: scale(0); }
  80% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.result-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 12rpx;
}

.result-score {
  font-size: var(--text-3xl);
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-gold), #daa520);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.result-percentage {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  margin-top: var(--space-xs);
}

.evaluation-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 28rpx 36rpx;
  width: 100%;
  max-width: 560rpx;
  text-align: center;
  font-size: var(--text-md);
  color: var(--color-text-secondary);
  line-height: 1.8;
  border: 1rpx solid rgba(139, 90, 43, 0.15);
}

/* 逐题回顾 */
.review-section {
  width: 100%;
  max-width: 560rpx;
}

.review-title {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-sm);
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.review-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx var(--space-md);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  border-left: 6rpx solid transparent;
}

.review-correct {
  border-left-color: var(--color-success);
}

.review-wrong {
  border-left-color: var(--color-danger);
}

.review-number {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.review-detail {
  flex: 1;
}

.review-composer {
  font-size: var(--text-base);
  color: #e8d5c0;
}

.review-answer {
  font-size: var(--text-sm);
  margin-top: 4rpx;
}

/* 按钮组 */
.result-actions {
  display: flex;
  gap: var(--space-md);
  padding-top: var(--space-sm);
}

.restart-btn,
.share-btn {
  flex: 1;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-size: var(--text-md);
  font-weight: 600;
  border: none;
  transition: transform 0.15s;
}

.restart-btn:active,
.share-btn:active {
  transform: scale(0.96);
}

.restart-btn {
  background: linear-gradient(135deg, #b8860b 0%, #8b6914 100%);
  color: var(--color-text);
  box-shadow: 0 8rpx 32rpx rgba(184, 134, 11, 0.3);
  padding: 0 var(--space-xl);
}

.share-btn {
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border: 1rpx solid rgba(139, 90, 43, 0.2);
  padding: 0 var(--space-xl);
}

.bottom-actions {
  width: 100%;
  max-width: 560rpx;
}

.home-btn,
.suggest-btn {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  border: none;
  transition: background 0.15s, transform 0.15s;
}

.home-btn:active,
.suggest-btn:active {
  transform: scale(0.97);
}

.home-btn {
  background: var(--color-surface);
  color: var(--color-text-muted);
  border: 1rpx solid rgba(139, 90, 43, 0.12);
}

.suggest-btn {
  background: var(--color-gold-dim);
  color: var(--color-gold);
  border: 1rpx solid rgba(201, 166, 78, 0.2);
}

.suggest-btn.suggest-active {
  background: rgba(201, 166, 78, 0.25);
  border-color: rgba(201, 166, 78, 0.45);
}

/* 建议表单 */
.suggest-form {
  width: 100%;
  max-width: 560rpx;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  border: 1rpx solid rgba(139, 90, 43, 0.15);
  animation: slideUp 0.3s ease-out;
}

.suggest-form-title {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
}

.suggest-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx var(--space-md);
  background: rgba(139, 90, 43, 0.08);
  border-radius: 14rpx;
  border: 1rpx solid rgba(139, 90, 43, 0.15);
  margin-bottom: 20rpx;
}

.picker-placeholder {
  color: #6b5b4a;
  font-size: var(--text-base);
}

.picker-value {
  color: #e8d5c0;
  font-size: var(--text-base);
}

.picker-arrow {
  font-size: 20rpx;
  color: var(--color-text-muted);
}

.suggest-textarea {
  width: 100%;
  height: 180rpx;
  background: rgba(139, 90, 43, 0.08);
  border-radius: 14rpx;
  border: 1rpx solid rgba(139, 90, 43, 0.15);
  padding: 20rpx var(--space-md);
  color: #e8d5c0;
  font-size: var(--text-base);
  box-sizing: border-box;
  margin-bottom: 20rpx;
}

.suggest-placeholder {
  color: #6b5b4a;
}

.suggest-submit-btn {
  width: 100%;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-gold) 0%, #8b6914 100%);
  color: var(--color-text);
  font-size: var(--text-md);
  font-weight: 600;
  border: none;
}

.suggest-submit-btn[disabled] {
  background: rgba(139, 90, 43, 0.08);
  color: #5a4a3a;
}
```

- [ ] **Step 2: 提交**

```bash
git add miniprogram/pages/game/game.wxss
git commit -m "样式：游戏页精致化 — 进度点呼吸动画、选项左边条、星星错开弹出"
```

---

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

## Implementation Notes

- 每个 Task 完成后在微信开发者工具中刷新验证该页面
- CSS 变量在 app.wxss 中定义后，所有页面的硬编码颜色值逐步替换为变量引用
- 排行榜 Task 4 涉及 WXML 小改（加 rank-N class）
- 历史记录 Task 5 涉及 JS 改动（日期格式化 + goGame 导航）
- 全部完成后，最终验证一遍四个页面
