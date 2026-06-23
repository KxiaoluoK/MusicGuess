#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
download-musopen.py — 从 Internet Archive 批量下载公共领域古典音乐

archive.org 镜像了 Musopen 等大量公共领域古典录音。本脚本通过其公开 API
搜索 + 下载 MP3，绕过 Musopen 免费账户每天 5 首的限制。

⚠️ 在【Windows】上运行（WSL 连不上外网）。需要 Python3 + requests。
   首次使用：  pip install requests

⚠️ 如果你用代理访问 archive.org，用 --proxy 指定，例如：
   --proxy http://127.0.0.1:7890

────────────────────────────────────────────────────────
用法：

1) 搜索曲目（拿到 identifier）：
   python download-musopen.py search "Vivaldi Four Seasons Spring" --proxy http://127.0.0.1:7890

2) 查看某个条目里的音频文件：
   python download-musopen.py files <identifier> --proxy ...

3) 下载某个条目的 MP3（可用 --filter 只下文件名含关键词的）：
   python download-musopen.py get <identifier> --filter spring --out music-source --proxy ...
────────────────────────────────────────────────────────
"""
import sys
import os
import json
import argparse

try:
    import requests
except ImportError:
    print("❌ 缺少 requests 库，请先运行：pip install requests")
    sys.exit(1)

SEARCH_API = "https://archive.org/advancedsearch.php"
METADATA_API = "https://archive.org/metadata"
DOWNLOAD_BASE = "https://archive.org/download"

AUDIO_EXTS = (".mp3", ".ogg", ".flac", ".m4a")


def make_session(proxy):
    s = requests.Session()
    if proxy:
        s.proxies = {"http": proxy, "https": proxy}
    s.headers.update({"User-Agent": "MusicGuess-downloader/1.0"})
    return s


def cmd_search(session, query, rows):
    """搜索 archive.org，优先公共领域音频"""
    params = {
        "q": f'({query}) AND mediatype:audio',
        "fl[]": ["identifier", "title", "creator", "downloads"],
        "rows": rows,
        "sort[]": "downloads desc",  # 下载量高的更可能是清晰的知名版本
        "output": "json",
    }
    try:
        r = session.get(SEARCH_API, params=params, timeout=30)
        r.raise_for_status()
        docs = r.json().get("response", {}).get("docs", [])
    except Exception as e:
        print(f"❌ 搜索失败: {e}")
        return

    if not docs:
        print("没有找到结果，换个关键词试试。")
        return

    print(f"找到 {len(docs)} 个条目（按下载量排序）：\n")
    for i, d in enumerate(docs, 1):
        title = d.get("title", "(无标题)")
        creator = d.get("creator", "")
        if isinstance(creator, list):
            creator = ", ".join(creator)
        dl = d.get("downloads", 0)
        print(f"[{i}] {title}")
        print(f"     作者: {creator}")
        print(f"     identifier: {d.get('identifier')}   下载量: {dl}")
        print()


def cmd_files(session, identifier):
    """列出条目里的音频文件"""
    try:
        r = session.get(f"{METADATA_API}/{identifier}", timeout=30)
        r.raise_for_status()
        files = r.json().get("files", [])
    except Exception as e:
        print(f"❌ 获取文件列表失败: {e}")
        return

    audio = [f for f in files if f.get("name", "").lower().endswith(AUDIO_EXTS)]
    if not audio:
        print("该条目没有音频文件。")
        return

    print(f"条目 {identifier} 的音频文件（共 {len(audio)} 个）：\n")
    for f in audio:
        size = f.get("size", "?")
        try:
            size = f"{int(size) / 1024 / 1024:.1f} MB"
        except (ValueError, TypeError):
            size = "?"
        print(f"  {f['name']}   ({size})")


def cmd_get(session, identifier, name_filter, out_dir):
    """下载条目里的音频文件"""
    try:
        r = session.get(f"{METADATA_API}/{identifier}", timeout=30)
        r.raise_for_status()
        files = r.json().get("files", [])
    except Exception as e:
        print(f"❌ 获取文件列表失败: {e}")
        return

    audio = [f for f in files if f.get("name", "").lower().endswith(AUDIO_EXTS)]
    if name_filter:
        audio = [f for f in audio if name_filter.lower() in f["name"].lower()]

    if not audio:
        print("没有匹配的音频文件（试试去掉 --filter 或换关键词）。")
        return

    os.makedirs(out_dir, exist_ok=True)
    print(f"准备下载 {len(audio)} 个文件到 {out_dir}/\n")

    for f in audio:
        name = f["name"]
        url = f"{DOWNLOAD_BASE}/{identifier}/{name}"
        # 文件名可能含路径分隔符，取末段
        safe_name = os.path.basename(name)
        dest = os.path.join(out_dir, safe_name)
        print(f"⬇️  {name} ...", end="", flush=True)
        try:
            with session.get(url, stream=True, timeout=120) as resp:
                resp.raise_for_status()
                with open(dest, "wb") as fp:
                    for chunk in resp.iter_content(chunk_size=8192):
                        fp.write(chunk)
            print(f" ✅ → {dest}")
        except Exception as e:
            print(f" ❌ 失败: {e}")


def main():
    parser = argparse.ArgumentParser(description="从 Internet Archive 下载公共领域古典音乐")
    parser.add_argument("--proxy", help="代理地址，如 http://127.0.0.1:7890")
    sub = parser.add_subparsers(dest="command", required=True)

    p_search = sub.add_parser("search", help="搜索曲目")
    p_search.add_argument("query", help="搜索关键词，如 'Vivaldi Spring'")
    p_search.add_argument("--rows", type=int, default=15, help="返回结果数（默认15）")

    p_files = sub.add_parser("files", help="列出条目内的音频文件")
    p_files.add_argument("identifier", help="archive.org 条目 identifier")

    p_get = sub.add_parser("get", help="下载条目内的音频")
    p_get.add_argument("identifier", help="archive.org 条目 identifier")
    p_get.add_argument("--filter", dest="name_filter", default="", help="只下文件名含此关键词的")
    p_get.add_argument("--out", default="music-source", help="输出目录（默认 music-source）")

    args = parser.parse_args()
    session = make_session(args.proxy)

    if args.command == "search":
        cmd_search(session, args.query, args.rows)
    elif args.command == "files":
        cmd_files(session, args.identifier)
    elif args.command == "get":
        cmd_get(session, args.identifier, args.name_filter, args.out)


if __name__ == "__main__":
    main()
