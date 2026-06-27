# Task 1: CSS 变量体系 — 完成报告

## 实现内容

将 `miniprogram/app.wxss` 中的 `page` 选择器从硬编码样式升级为 CSS 变量驱动：

- **色板**：12 个颜色变量（bg, surface, gold, text 等），保持深色主题
- **圆角**：3 个层级（sm: 12rpx, md: 20rpx, lg: 24rpx）
- **间距**：5 个层级（xs: 8rpx ~ xl: 48rpx）
- **字号**：8 个层级（xs: 22rpx ~ 3xl: 80rpx）
- 原有 `button` / `button::after` 样式保持不变

所有现有硬编码颜色值均由对应 `var(--color-*)` 引用替换。

## 变更文件

- `miniprogram/app.wxss` — page 选择器重写，新增 28 个 CSS 自定义属性

## 自审结果

- 变量命名与设计稿一致
- 值与现有主题完全匹配：`--color-bg: #1a0f0a`、`--color-text: #f5e6d3`
- `font-family` / `min-height` 等常规属性保持不变
- `button` 重置样式未受影响
- 微信小程序兼容性：CSS 自定义属性在 iOS 9+/Android 5+ 的 WebView 中均受支持，无风险

## 注意事项

无。这是纯样式重构，不涉及逻辑变更。
