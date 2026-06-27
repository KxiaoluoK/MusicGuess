# Task 2 Report: 首页精致化 (index.wxss)

## 状态: DONE

## 实现内容

按照任务简报，将 `miniprogram/pages/index/index.wxss` 全量替换为使用 CSS 变量体系的版本。

### 主要变更

1. **背景色**：从硬编码 `#1a0f0a` 替换为 `var(--color-bg)`，保留中间渐变段 `#2c1810`
2. **Logo 区**：新增五线谱装饰线 `::after` 伪元素，用 `box-shadow` 实现三条平行线
3. **间距统一**：所有间距（padding/margin/gap）替换为 `var(--space-*)` 变量
4. **字号统一切换**：
   - `.logo-title`: 48rpx → `var(--text-2xl)`
   - `.logo-subtitle`, `.menu-btn`: 26-28rpx → `var(--text-md)`
   - `.section-title`, `.diff-label`: 26rpx → `var(--text-base)`
   - `.diff-hint`: 22rpx → `var(--text-xs)`
   - `.diff-btn.hard .diff-label`: 24rpx → `var(--text-sm)`
5. **颜色变量化**：`#f5e6d3` → `var(--color-text)`，`#b8a088`/`#d4b896` → `var(--color-text-secondary)`，`#8b7355` → `var(--color-text-muted)`，按钮背景 → `var(--color-surface)`/`var(--color-surface-hover)`
6. **圆角**：硬编码值 → `var(--radius-lg)`(diff-btn)、`var(--radius-md)`(menu-btn)
7. **按钮交互**：新增 `transition: transform 0.15s` 和 `:active` 缩放 0.96
8. **按钮色彩饱和度提升**：
   - easy: `#6b8e23`→`#7a9e2f`, `#556b2f`→`#5a7a1f`，阴影不透明度 0.3→0.35
   - medium: `#cd853f`→`#d4943f`, `#8b6914`→`#9a7518`，阴影不透明度 0.3→0.35
   - hard: 边框 2rpx→1rpx，不透明度 0.4→0.3，背景不透明度 0.2→0.15

## 文件变更

- 修改：`miniprogram/pages/index/index.wxss` (65 insertions, 34 deletions)

## 自审结果

### 正确性
- 文件内容与任务简报完全一致 ✅
- 所有 CSS 变量名拼写正确，与 app.wxss 定义一致 ✅
- 选择器顺序与旧版兼容，无丢失类名 ✅

### 边界情况
- `::after` 伪元素依赖 .logo-icon 已有文本（font-size 存在），显示正常 ✅
- hard 按钮保持特殊半透明样式，不影响 disabled 状态判断 ✅
- flex 布局的 `.difficulty-area` 使用 `gap: 20rpx`，在宽度 560rpx 内三按钮均分 ✅
- `transition: transform` 不影响布局，仅提供触感反馈 ✅
- 无硬编码颜色溢漏，所有颜色都通过 CSS 变量或设计体系值控制 ✅

### 潜在问题
- 无。替换为 CSS 变量后，首页主题将跟随 app.wxss 的变量定义自动切换，维护性提升。

## 提交

```
e1741fe 样式：首页精致化 — 五线谱装饰、按钮饱和度、间距统一
```
