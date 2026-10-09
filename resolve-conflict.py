#!/usr/bin/env python3
"""解 gh-pages rebase 冲突：保留 Updated upstream（CST 正确版），删除冲突标记。"""
import re, sys

FILES = [
    "/home/rex/hermes-workspace/projects/rex-hugo-qwen-image-21/deploy/posts/2026-10-03-rust-vs-go-latency-myth/index.html",
    "/home/rex/hermes-workspace/projects/rex-hugo-qwen-image-21/deploy/en/posts/2026-10-03-rust-vs-go-latency-myth/index.html",
]
PAT = re.compile(r'<<<<<<< Updated upstream\n(.*?)=======\n.*?>>>>>>> [^\n]*\n', re.S)

for f in FILES:
    t = open(f, encoding="utf-8").read()
    n = len(PAT.findall(t))
    t2 = PAT.sub(r"\1", t)
    open(f, "w", encoding="utf-8").write(t2)
    print(f.split("/deploy/")[1], f"resolved {n} conflicts | residual markers: {t2.count('<<<<<<<')} | dup +0800: {t2.count('+0800 +0800')}")
