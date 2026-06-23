#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
add-difficulty.py — 难度计算引擎

读取一个题库 JSONL，根据作曲家/曲目知名度表和题型权重，
为每道题计算 difficulty 字段（1=简单 / 2=中等 / 3=困难），输出新 JSONL。

难度公式：
    rawScore = composerFame×0.4 + pieceFame×0.3 + typeWeight×0.3
    映射：  1.0~2.0 → 1(简单)   2.0~3.0 → 2(中等)   3.0~4.4 → 3(困难)

用法：
    python3 add-difficulty.py <输入.jsonl> <输出.jsonl>
"""
import json
import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# 题型权重（猜得越具体越难）
TYPE_WEIGHTS = {
    "composer": 1,
    "instrument": 1,
    "era": 2,
    "pieceName": 3,
    # 未来扩展题型默认中等权重
    "birthYear": 2,
    "nationality": 2,
    "genre": 2,
}

# 公式权重
W_COMPOSER = 0.4
W_PIECE = 0.3
W_TYPE = 0.3

# 缺失知名度时的默认值（按中等偏冷门处理）
DEFAULT_FAME = 3


def load_fame(filename):
    """加载知名度表，返回 {名称: 分数} 字典"""
    path = os.path.join(SCRIPT_DIR, "fame", filename)
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("fame", {})


def raw_to_difficulty(raw):
    """rawScore → 难度等级"""
    if raw < 2.0:
        return 1
    elif raw < 3.0:
        return 2
    else:
        return 3


def compute_difficulty(question, composer_fame, piece_fame, warnings):
    """计算单题难度，记录缺失项到 warnings"""
    composer = question.get("composer", "")
    piece = question.get("pieceName", "")
    qtype = question.get("type", "composer")

    cf = composer_fame.get(composer)
    if cf is None:
        warnings.append(f"作曲家知名度缺失: {composer}")
        cf = DEFAULT_FAME

    pf = piece_fame.get(piece)
    if pf is None:
        warnings.append(f"曲目知名度缺失: {piece}")
        pf = DEFAULT_FAME

    tw = TYPE_WEIGHTS.get(qtype)
    if tw is None:
        warnings.append(f"题型权重缺失: {qtype}")
        tw = 2

    raw = cf * W_COMPOSER + pf * W_PIECE + tw * W_TYPE
    return raw_to_difficulty(raw), raw


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    in_path, out_path = sys.argv[1], sys.argv[2]

    composer_fame = load_fame("composerFame.json")
    piece_fame = load_fame("pieceFame.json")

    warnings = []
    dist = {1: 0, 2: 0, 3: 0}
    out_lines = []

    with open(in_path, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                q = json.loads(line)
            except json.JSONDecodeError as e:
                print(f"⚠️ 第 {line_num} 行 JSON 解析失败: {e}")
                continue

            difficulty, raw = compute_difficulty(q, composer_fame, piece_fame, warnings)
            q["difficulty"] = difficulty
            dist[difficulty] += 1
            # ensure_ascii=False 保留中文
            out_lines.append(json.dumps(q, ensure_ascii=False))

    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(out_lines) + "\n")

    # 报告
    print(f"✅ 处理完成: {len(out_lines)} 道题 → {out_path}")
    print(f"   难度分布: 简单 {dist[1]} / 中等 {dist[2]} / 困难 {dist[3]}")
    if warnings:
        unique_warnings = sorted(set(warnings))
        print(f"⚠️  {len(unique_warnings)} 个知名度缺失（已用默认值 {DEFAULT_FAME}）:")
        for w in unique_warnings:
            print(f"   - {w}")


if __name__ == "__main__":
    main()
