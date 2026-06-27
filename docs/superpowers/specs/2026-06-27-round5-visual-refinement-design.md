# Round 5 视觉精致化设计

> **目标**：在不变更布局结构的前提下，统一设计语言，提升"产品感"
> **原则**：一处一个亮点，其余安静克制

## 1. 设计系统

### 1.1 CSS 变量体系 (app.wxss)

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
}
```

### 1.2 卡片体系

所有卡片统一为：`background: --color-surface; border-radius: --radius-md; border: 1rpx solid rgba(139,90,43,0.15);`

卡片状态：
- 默认：上述样式
- 高亮（如"我的排名"）：金色描边 + 金色背景
- 按压：`--color-surface-hover` + `transform: scale(0.98)`

### 1.3 按钮体系

| 层级 | 样式 | 场景 |
|------|------|------|
| 主按钮 | 金色渐变背景 + 白字 + 阴影 | 开始答题、提交 |
| 次按钮 | 半透明棕底 + 金色字 | 排行榜、历史 |
| 幽灵按钮 | 仅描边 + 暗色字 | 返回首页、我有建议 |
| 禁用按钮 | opacity 0.4 + 灰色描边 | 困难、提交(未填完) |

---

## 2. 页面改动

### 2.1 首页 (index)

**Logo 区增强：**
- 🎻 图标下方加 3 条细线（简约五线谱），半透明金色
- 副标题字号略微调大

**难度选择区：**
- 简单按钮绿色饱和度微提，中等按钮橙色饱和度微提
- 按钮间距从 16rpx → 20rpx
- 困难按钮描边更柔和

**菜单按钮：**
- 左侧增加 4rpx 金色装饰线（默认透明，hover 时显现）
- 按钮间距统一

### 2.2 游戏页 (game)

**选项卡片：**
- 默认态描边更清晰
- 正确/错误反馈时增加左侧粗边条（绿/红 6rpx）
- 按压态增加 scale 变化

**进度条：**
- 当前题目 dot 增加 pulse 呼吸动画
- 已答正确 dot 改为绿色填充，错误改为红色填充
- 点间距微增

**反馈横幅：**
- 圆角加大到 `--radius-md`
- 增加小图标（🎉/😞）

**结果页：**
- 星星 popIn 动画错开（每颗延迟 0.1s）
- 正确率数字字号从 72rpx → 80rpx，更醒目
- "答题回顾"每项卡片增加左侧颜色条（正确绿/错误红）
- 按钮间距统一

### 2.3 排行榜 (leaderboard)

**前三名：**
- 🥇 行：金色微光泽背景 + 金色描边
- 🥈 行：银色光泽背景 + 银色描边  
- 🥉 行：铜色光泽背景 + 铜色描边
- 奖牌 emoji 增大到 44rpx

**表头：**
- 字号加大，颜色更亮
- 底线加粗

**"我的排名"行：**
- 左侧加 4rpx 金色竖线
- 背景用金色调

**难度 Tab：**
- 选中态底部加 4rpx 金色下划线（替代纯色块）

### 2.4 历史记录 (history)

**记录卡片：**
- 星级 + 难度标签放一行，左侧对齐
- 日期格式化：当天显示"今天"，昨天"昨天"，其余 "6月27日"
- 正确率数字加大

**空状态：**
- 图标增大到 100rpx
- 增加引导文案 + 跳转按钮

---

## 3. 不做的

- ❌ 不改布局结构
- ❌ 不加页面过渡动画
- ❌ 不加声音/音效
- ❌ 不新增页面
- ❌ 不动功能逻辑

---

## 4. 实施顺序

1. app.wxss — CSS 变量定义
2. index.wxss — 首页微调
3. game.wxss — 游戏页精致化
4. leaderboard.wxss — 排行榜前三名 + Tab
5. history.wxml + history.wxss + history.js — 历史记录卡片 + 日期格式化
