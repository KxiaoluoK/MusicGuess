# 🎻 古典音乐猜曲 (MusicGuess)

一款微信小程序——听古典音乐片段，猜作曲家是谁。

## 玩法

1. 点击播放按钮，听一段 20 秒的古典音乐片段
2. 从 4 个选项中选出作曲家
3. 5 题答完后给出星级评分和评价
4. 支持重听 1 次，不限答题时间

## 曲库（V1.0）

5 位作曲家 × 2 个精选片段 = 10 段音频

| 作曲家 | 曲目 | 时期 |
|---|---|---|
| 巴赫 | 大提琴组曲 BWV 1007 | 巴洛克 |
| 莫扎特 | 钢琴奏鸣曲 K.545 | 古典 |
| 贝多芬 | 月光奏鸣曲 Op.27 No.2 | 古典 |
| 肖邦 | 夜曲 Op.9 No.1 | 浪漫 |
| 德沃夏克 | 幽默曲 Op.101 No.7 | 浪漫 |

## 技术栈

- 微信小程序原生框架（WXML / WXSS / JS）
- 微信云开发（第 2 轮起）
- 音频裁剪：ffmpeg（本地脚本）
- 曲源：Musopen（CC0 公共领域）

## 项目结构

```
miniprogram/
├── pages/game/            # 答题页面（单页面，4 状态机）
├── components/audio-player/  # 音频播放组件
├── data/questions.js      # 硬编码题库（15 题）
├── utils/                 # 评分、常量
└── audio/                 # 音乐片段（10 个 mp3）

scripts/
└── prepare-clips.sh        # ffmpeg 自动裁剪脚本
```

## 开发指南

```bash
# 裁剪新的音乐片段
./scripts/prepare-clips.sh music-source/ clips/

# 试听筛选
ffplay -nodisp -autoexit clips/xxx_c1.mp3

# 微信开发者工具
# 打开项目根目录 → 选「小程序」→ 用测试号
```

## 版本

- **V1.0** — 硬编码单机版，5 位作曲家，单页面答题闭环

## 许可

代码 MIT，音乐片段 CC0 公共领域。
