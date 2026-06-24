#!/usr/bin/env python3
# 批量生成 9 首新曲目的 108 道题目（12题/首 × 9首）
import json

# ---- 新曲目元数据 ----
pieces = [
    {"composer":"帕赫贝尔","pieceName":"卡农","era":"巴洛克","instrument":"钢琴独奏"},
    {"composer":"亨德尔","pieceName":"水上音乐 Alla Hornpipe","era":"巴洛克","instrument":"管弦乐"},
    {"composer":"阿尔比诺尼","pieceName":"g小调柔板","era":"巴洛克","instrument":"弦乐与管风琴"},
    {"composer":"巴赫","pieceName":"G弦上的咏叹调","era":"巴洛克","instrument":"弦乐"},
    {"composer":"莫扎特","pieceName":"土耳其进行曲","era":"古典","instrument":"管弦乐"},
    {"composer":"莫扎特","pieceName":"弦乐小夜曲 K.525 第一乐章","era":"古典","instrument":"弦乐"},
    {"composer":"海顿","pieceName":"惊愕交响曲 第二乐章","era":"古典","instrument":"管弦乐"},
    {"composer":"贝多芬","pieceName":"致爱丽丝","era":"古典","instrument":"钢琴独奏"},
    {"composer":"贝多芬","pieceName":"第五交响曲「命运」第一乐章","era":"古典","instrument":"管弦乐"},
]

# ---- 各作曲家选题的干扰项库 ----
baroque_composers = ["巴赫","亨德尔","维瓦尔第","泰勒曼","科雷利","帕赫贝尔","阿尔比诺尼","斯卡拉蒂"]
classical_composers = ["莫扎特","贝多芬","海顿","舒伯特"]
all_composers = baroque_composers + classical_composers + ["肖邦","德沃夏克","舒曼","勃拉姆斯","李斯特","门德尔松","德彪西"]

def pick_distractors(correct, pool, count=3):
    """从池中取 count 个不同于 correct 的干扰项"""
    candidates = [c for c in pool if c != correct]
    seen = set()
    result = []
    for c in candidates:
        if c not in seen:
            seen.add(c)
            result.append(c)
        if len(result) == count:
            break
    return result

# ---- 为每首曲目生成 6 种题型模板 ----
all_questions = []

for p in pieces:
    composer = p["composer"]
    piece = p["pieceName"]
    era = p["era"]
    instr = p["instrument"]

    # 干扰项
    if era == "巴洛克":
        comp_pool = baroque_composers
    else:
        comp_pool = classical_composers

    # pieceName 干扰项 - 按作曲家定制
    piece_distractors = {
        "卡农": ["G弦上的咏叹调","水上音乐","g小调柔板"],
        "水上音乐 Alla Hornpipe": ["卡农","G弦上的咏叹调","g小调柔板"],
        "g小调柔板": ["卡农","G弦上的咏叹调","水上音乐"],
        "G弦上的咏叹调": ["卡农","勃兰登堡协奏曲 No.3","G大调第一大提琴组曲"],
        "土耳其进行曲": ["弦乐小夜曲 K.525","C大调钢琴奏鸣曲 K.545","费加罗的婚礼序曲"],
        "弦乐小夜曲 K.525 第一乐章": ["土耳其进行曲","C大调钢琴奏鸣曲 K.545","费加罗的婚礼序曲"],
        "惊愕交响曲 第二乐章": ["第五交响曲「命运」","弦乐小夜曲 K.525","告别交响曲"],
        "致爱丽丝": ["月光奏鸣曲","土耳其进行曲","爱之梦"],
        "第五交响曲「命运」第一乐章": ["惊愕交响曲","第九交响曲「合唱」","第六交响曲「田园」"],
    }

    inst_distractors = {
        "钢琴独奏": ["弦乐","管弦乐","小提琴独奏"],
        "管弦乐": ["钢琴独奏","弦乐","小提琴与乐队"],
        "弦乐": ["钢琴独奏","管弦乐","长笛"],
        "弦乐与管风琴": ["弦乐","钢琴独奏","管弦乐"],
        "小提琴与乐队": ["钢琴独奏","弦乐","管弦乐"],
    }

    comp_d = pick_distractors(composer, comp_pool)
    piece_d = piece_distractors.get(piece, ["月光奏鸣曲","卡农","G弦上的咏叹调"])
    inst_d = inst_distractors.get(instr, ["钢琴独奏","弦乐","管弦乐"])

    # 每片段 6 道题，CID 用曲目+clip 唯一标识
    safe_name = piece.replace(" ", "_").replace("「","").replace("」","")
    for clip_suffix in ["c1", "c2"]:
        qs = [
            # 3 道作曲家题（选项排列不同）
            {"type":"composer","questionText":"这段音乐的作曲家是谁？",
             "options":[composer]+comp_d[:3],"correctIndex":0},
            {"type":"composer","questionText":"这段音乐的作曲家是谁？",
             "options":[comp_d[0],composer,comp_d[1],comp_d[2]],"correctIndex":1},
            {"type":"composer","questionText":"这段音乐的作曲家是谁？",
             "options":[comp_d[1],comp_d[2],composer,comp_d[0]],"correctIndex":2},
            # 曲名题
            {"type":"pieceName","questionText":"这首曲子的名称是什么？",
             "options":[piece]+piece_d,"correctIndex":0},
            # 时期题
            {"type":"era","questionText":"这段音乐属于哪个时期？",
             "options":([era] + [e for e in ["巴洛克","古典","浪漫","现代"] if e != era]),"correctIndex":0},
            # 乐器题
            {"type":"instrument","questionText":"这段音乐的主要乐器是什么？",
             "options":[instr]+inst_d,"correctIndex":0},
        ]
        for q in qs:
            q["composer"] = composer
            q["pieceName"] = piece
            q["era"] = era
            q["instrument"] = instr
            q["clipFileId"] = f"CID_{safe_name}_{clip_suffix}"  # 占位符，用曲名唯一标识
            all_questions.append(q)

# 输出 JSONL
with open("scripts/questions-batch.jsonl", "w", encoding="utf-8") as f:
    for q in all_questions:
        f.write(json.dumps(q, ensure_ascii=False) + "\n")

print(f"✅ 生成 {len(all_questions)} 道题 → scripts/questions-batch.jsonl")
print(f"   分布: {len(all_questions)//2} 题/首 × {len(pieces)} 首")
