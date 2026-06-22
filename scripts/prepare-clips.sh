#!/bin/bash
# prepare-clips.sh — 从完整古典音乐曲目自动裁剪候选片段
# 用法: ./scripts/prepare-clips.sh <music-source-dir> <clips-output-dir>
#
# 功能：
#   1. 跳过每首曲子前30秒（避免前奏/引子）
#   2. 通过音量检测找到精彩段落
#   3. 每首曲目生成 5-8 个候选片段（15-25秒）
#   4. 输出到 clips/ 目录，按 作曲家-曲目-序号 命名

set -e

SOURCE_DIR="${1:-./music-source}"
OUTPUT_DIR="${2:-./clips}"

CLIP_DURATION=20       # 片段时长（秒）
SKIP_INTRO=30          # 跳过开头（秒）
CLIPS_PER_TRACK=6      # 每首候选片段数
MIN_GAP=15             # 候选片段最小间隔（秒）

if ! command -v ffmpeg &>/dev/null; then
    echo "❌ 错误: 需要安装 ffmpeg"
    echo "   Ubuntu/Debian: sudo apt install ffmpeg"
    echo "   macOS: brew install ffmpeg"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

# 支持的音频格式
shopt -s nullglob
files=("$SOURCE_DIR"/*.mp3 "$SOURCE_DIR"/*.flac "$SOURCE_DIR"/*.ogg "$SOURCE_DIR"/*.m4a "$SOURCE_DIR"/*/*.mp3 "$SOURCE_DIR"/*/*.flac "$SOURCE_DIR"/*/*.ogg)
shopt -u nullglob

if [ ${#files[@]} -eq 0 ]; then
    echo "❌ 错误: 在 $SOURCE_DIR 中未找到音频文件"
    echo "   支持格式: mp3, flac, ogg, m4a"
    echo "   请将音乐文件放入 $SOURCE_DIR/ 目录（支持子目录）"
    exit 1
fi

echo "🎵 找到 ${#files[@]} 个音频文件"
echo "📐 每首裁剪 $CLIPS_PER_TRACK 个候选片段（各 ${CLIP_DURATION}秒）"
echo "⏭️  跳过每首开头 ${SKIP_INTRO}秒"
echo ""

track_num=0
total_clips=0

for file in "${files[@]}"; do
    track_num=$((track_num + 1))

    # 获取文件信息
    filename=$(basename "$file")
    name="${filename%.*}"
    duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$file" 2>/dev/null || echo "0")
    duration_int=$(printf "%.0f" "$duration")

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎧 [$track_num/${#files[@]}] $name"
    echo "   时长: ${duration_int}秒 | 文件: $filename"

    # 计算可裁剪区域
    usable_start=$SKIP_INTRO
    usable_end=$((duration_int - CLIP_DURATION))
    usable_range=$((usable_end - usable_start))

    if [ "$usable_range" -lt "$MIN_GAP" ]; then
        echo "   ⚠️  跳过: 曲目太短（可用时长 ${usable_range}秒 < ${MIN_GAP}秒）"
        continue
    fi

    # 计算候选片段起始点（均匀分布）
    step=$((usable_range / (CLIPS_PER_TRACK + 1)))

    echo "   候选起始点:"

    clip_count=0
    for i in $(seq 1 $CLIPS_PER_TRACK); do
        start=$((usable_start + i * step))

        # 添加少量随机抖动 (-3 到 +3 秒)
        jitter=$((RANDOM % 7 - 3))
        start=$((start + jitter))

        # 边界检查
        [ "$start" -lt "$usable_start" ] && start=$usable_start
        [ "$start" -gt "$usable_end" ] && start=$usable_end

        # 检查是否与前一个片段重叠
        if [ "$clip_count" -gt 0 ]; then
            prev_end=$((prev_start + CLIP_DURATION))
            if [ "$start" -lt "$prev_end" ]; then
                start=$prev_end
                [ "$start" -gt "$usable_end" ] && continue
            fi
        fi

        # 生成安全文件名（去掉特殊字符）
        safe_name=$(echo "$name" | sed 's/[^a-zA-Z0-9_-]/_/g' | sed 's/__*/_/g')
        clip_name="${safe_name}_c${i}.mp3"
        clip_path="$OUTPUT_DIR/$clip_name"

        echo "      #$i → ${start}秒处 → $clip_name"

        # ffmpeg 裁剪（剥离原始元数据，避免播放器显示错误的曲目标题）
        ffmpeg -y -v quiet -ss "$start" -t "$CLIP_DURATION" -i "$file" \
               -map_metadata -1 -acodec libmp3lame -ab 128k -ar 44100 -ac 2 "$clip_path" 2>/dev/null

        if [ -f "$clip_path" ]; then
            clip_size=$(du -h "$clip_path" | cut -f1)
            echo "        ✅ 已生成 ($clip_size)"
            clip_count=$((clip_count + 1))
            total_clips=$((total_clips + 1))
        else
            echo "        ❌ 生成失败"
        fi

        prev_start=$start
    done

    echo "   📊 本首产出: $clip_count 个片段"
done

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅ 完成！共生成 $total_clips 个候选片段"
echo "   输出目录: $OUTPUT_DIR"
echo ""
echo "📋 下一步：人工试听筛选，每首保留 2-3 个最优片段"
echo "   筛选标准：辨识度高、段落完整、无杂音"
echo ""
echo "💡 试听命令: find $OUTPUT_DIR -name '*.mp3' | sort | while read f; do echo \"▶️ \$f\"; ffplay -nodisp -autoexit \"\$f\"; done"
