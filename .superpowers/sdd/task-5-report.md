# Task 5 Report: 历史记录精致化

## 修改文件

| 文件 | 变更 |
|------|------|
| `miniprogram/pages/history/history.wxss` | 全量替换为 CSS 变量版本，使用 `var(--color-*)`/`var(--space-*)`/`var(--text-*)`/`var(--radius-*)` 体系，新增 empty-btn 样式 |
| `miniprogram/pages/history/history.js` | 新增 `formatDate()` 函数（今天/昨天/X月X日）；数据处理链路添加 `formattedDate` 字段；新增 `goGame()` 导航方法 |
| `miniprogram/pages/history/history.wxml` | 日期显示从 `{{item.createdAt}}` 改为 `{{item.formattedDate}}`；空状态增加"开始答题"按钮 |

## 提交

```
3f031c0 样式：历史记录精致化 — 日期格式化、卡片统一、空状态引导按钮
```

## 边界情况

- `formatDate` 对 null/空字符串返回空字符串，防止渲染异常
- 空状态仅在非加载态且 records 为空时显示，避免闪现
- `record-diff` 使用 `wx:if="{{item.difficulty > 0}}"` 只在有难度字段时显示，兼容旧记录
- 日期比较基于日期部分（年/月/日）而非时间戳，避免小时差异导致判断错误
