# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 行为规则                                                                                                                                        
                                                                                                                                                   
1. **全部用中文回复**
2. **固定称呼"老大"开头**
3. **写代码前先说方案，等批准再动手** 
4. **需求模糊先提问** 
5. **写完列出边缘情况** — 提交代码时附带边界条件分析
6. **超 3 个文件先拆任务** — 涉及 4 个以上文件时，先拆成独立步骤用 TaskCreate 跟踪 
7. **出 bug 先写复现测试** — 在修复前先写能复现问题的测试
8. **被纠正后制定不再犯的计划** — 每次被指出错误，主动制定预防方案并记录
9. **修改前先建 Git 分支** — 任何代码修改前，先 `git checkout -b feature/xxx` 创建分支，完成后合并回 main

## Project Overview

MusicGuess (古典音乐猜曲) is a WeChat Mini Program where users listen to classical music clips and answer multiple-choice questions about the composer. Built with the native WeChat Mini Program framework (WXML/WXSS/JS), using WeChat Cloud Development for backend (starting Round 2).

## Development Iteration Plan

The project follows a strict 6-round iterative approach — each round must be verified before proceeding. See `/home/zachary/.claude/plans/claude-plugin-install-frontend-design-cl-iridescent-toast.md` for the full plan.

| Round | Status | What |
|-------|--------|------|
| 0 | ✅ done | Content pipeline: download music → clip with ffmpeg → human screening |
| 1 | ✅ done | Single-page hardcoded version: play → choose → score, no backend |
| 2 | ✅ done | Cloud dev: cloud DB + cloud functions + cloud storage + 4 question types + preload |
| 2.5 | ✅ done | Expand to 15 pieces (180 questions), auto-download scripts, difficulty system |
| 3 | ✅ done | Login + game history |
| 4 | ✅ done | Leaderboard + difficulty levels + suggestions |
| 5 | ✅ done | CSS design system + visual polish + privacy policy + launch prep |
| 6 | ⏳ planned | Expand to 50+ pieces, continuous polish |

**Key decisions**: no time limit, 1 replay allowed, 5 questions per game. 4 question types: composer / pieceName / era / instrument.

## Architecture (Round 2)

```
miniprogram/
├── app.js / app.json / app.wxss    # App entry, cloud init, page: pages/game/game
├── pages/game/game.js              # Core game logic — async cloud-based, 4-state machine
├── components/audio-player/        # Audio component wrapping wx.createInnerAudioContext()
├── utils/score.js                  # calculateScore(), pickQuestions() (Fisher-Yates shuffle)
└── utils/constants.js              # QUESTIONS_PER_GAME=5, MAX_REPLAY_COUNT=1, QUESTION_TYPES

cloudfunctions/getQuestions/        # Cloud function: type-balanced random question fetch
scripts/questions-v2.jsonl          # 60-question dataset (4 types × 10 clips)
```

**Game state machine** (`gameState`): `start` → `playing` → `feedback` → `result`

- `startGame()`: shuffles pool, picks QUESTIONS_PER_GAME, triggers audio via `playTrigger` increment
- `selectOption()`: compares `selectedIndex` vs `correctIndex`, records answer, vibrates, waits FEEDBACK_DURATION ms
- `nextQuestion()`: advances or calls `showResult()`
- `showResult()`: calls `calculateScore()` → star rating + evaluation text

**Audio player**: Observes `playTrigger` (number) — each increment triggers `play()`. Tracks `replayCount` capped at `MAX_REPLAY_COUNT`. Uses `wx.createInnerAudioContext()`, reinitializes on `src` change.

**Question data** (`data/questions.js`): each entry has `clipFile` (relative path from `/audio/`), `composer`, `pieceName`, `era`, `instrument`, `options[]`, `correctIndex`. Pool size must be ≥ QUESTIONS_PER_GAME.

## Content Pipeline

Music source: Musopen (musopen.org) — public domain MP3 downloads via browser (this environment cannot reach archive.org/musopen.org directly).

Clip preparation workflow:
```bash
# 1. Download full MP3s from Musopen → put in music-source/
# 2. Generate candidate clips (6 per track, 20s each, skip first 30s)
./scripts/prepare-clips.sh music-source/ clips/
# 3. Screen candidates with ffplay, copy best 2 per piece to miniprogram/audio/
# 4. Update data/questions.js to match actual clip filenames and metadata
```

The script requires `ffmpeg`. Each clip is ~315KB (20s at 128kbps mono). Clips use libmp3lame re-encoding for consistent format.

## Git 工作流

WSL 已配置代理可直连 GitHub，所有 Git 操作在 WSL 中一次完成。

```bash
# 1. 编辑代码 + 提交
cd /home/zachary/AI/project/MusicGuess
git add -A
git commit -m "描述"

# 2. 推送
git push origin <分支>

# 3. 同步 Windows DevTools 副本（微信开发者工具打开这个路径）
cd "/mnt/d/4. Project/Music Guess/MusicGuess"
git fetch origin && git clean -fd && git reset --hard && git checkout <分支> && git pull origin <分支>
```

## Development Commands

```bash
# 试听裁剪片段
ffplay -nodisp -autoexit clips/<filename>.mp3

# 重新运行裁剪脚本
./scripts/prepare-clips.sh music-source/ clips/
```

## Open Project Structure

`project.config.json` sets `"miniprogramRoot": "miniprogram/"` — WeChat DevTools reads this. The `projectname` field is `MusicGuess`. AppID should be set to a real one before cloud development (Round 2).

## Adding More Questions

1. Download MP3 from Musopen → `music-source/`
2. Run `./scripts/prepare-clips.sh music-source/ clips/`
3. Screen with `ffplay`, copy chosen clips to `miniprogram/audio/`
4. Add entries to `miniprogram/data/questions.js` matching the clip paths and piece metadata
5. Reload in WeChat DevTools

Each piece yields 2 clips → can create 2-3 question entries per clip by varying the option order and distractor composers.
