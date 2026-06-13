# 第0轮：内容管线验证 — 操作指南

## 前置条件

1. **安装 ffmpeg**（WSL 终端中执行）：
   ```bash
   sudo apt update && sudo apt install -y ffmpeg
   ```

2. **验证 ffmpeg 安装**：
   ```bash
   ffmpeg -version
   ```

## 步骤一：下载 5 首古典音乐曲目

在 Windows 浏览器中打开以下网址，下载完整的 MP3 文件：

| 曲目 | 作曲家 | 推荐下载源 |
|---|---|---|
| Air on the G String | 巴赫 (Bach) | https://musopen.org → 搜索 "Air on the G String" |
| Eine Kleine Nachtmusik K.525 | 莫扎特 (Mozart) | https://musopen.org → 搜索 "Eine Kleine Nachtmusik" |
| Moonlight Sonata 1st mov. | 贝多芬 (Beethoven) | https://musopen.org → 搜索 "Moonlight Sonata" |
| Nocturne Op.9 No.2 | 肖邦 (Chopin) | https://musopen.org → 搜索 "Nocturne Op.9 No.2" |
| Clair de Lune | 德彪西 (Debussy) | https://musopen.org → 搜索 "Clair de Lune" |

**Musopen 免费账户每天可下载 5 首，刚好够用。**

或者从 Internet Archive 批量下载：
- https://archive.org/details/musopen-dvd-in-lossless-flac-format

将下载的文件放入本项目的 `music-source/` 目录：
```
MusicGuess/music-source/
├── bach_air_on_g_string.mp3
├── mozart_eine_kleine.mp3
├── beethoven_moonlight_1.mp3
├── chopin_nocturne_op9_no2.mp3
└── debussy_clair_de_lune.mp3
```

## 步骤二：运行裁剪脚本

```bash
cd /home/zachary/AI/project/MusicGuess
chmod +x scripts/prepare-clips.sh
./scripts/prepare-clips.sh music-source/ clips/
```

脚本会：
- 跳过每首前 30 秒
- 每首生成 6 个候选片段（各 20 秒）
- 输出到 `clips/` 目录

## 步骤三：人工筛选

试听 `clips/` 目录中的候选片段，每首保留 2 个最优的。

**筛选标准**：
- ✅ 辨识度高（一听就知道是哪首曲子）
- ✅ 段落完整（不要断在乐句中间）
- ✅ 音量正常，无杂音
- ❌ 避免前奏过长、过渡段、重复段

将选中的 10 个片段（5首 × 2片段）拷贝到小程序音频目录：
```bash
# 按命名规则复制（重要：必须和 data/questions.js 中的路径一致）
cp clips/bach_air_c1.mp3 miniprogram/audio/
cp clips/bach_air_c2.mp3 miniprogram/audio/
cp clips/mozart_eine_kleine_c1.mp3 miniprogram/audio/
cp clips/mozart_eine_kleine_c2.mp3 miniprogram/audio/
cp clips/beethoven_moonlight_c1.mp3 miniprogram/audio/
cp clips/beethoven_moonlight_c2.mp3 miniprogram/audio/
cp clips/chopin_nocturne_c1.mp3 miniprogram/audio/
cp clips/chopin_nocturne_c2.mp3 miniprogram/audio/
cp clips/debussy_clair_c1.mp3 miniprogram/audio/
cp clips/debussy_clair_c2.mp3 miniprogram/audio/
```

## 步骤四：验证

在手机上播放这 10 个片段，确认：
- [ ] 每个片段都能正常播放
- [ ] 能认出是哪首曲子
- [ ] 音量适中

**如果 10 个片段全部通过 → 第0轮验证成功，进入第1轮！**
