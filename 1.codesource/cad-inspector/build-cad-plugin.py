#!/usr/bin/env python3
"""打包 CAD 图样标准化审查插件为可安装 ZIP，并做安装前静态校验。"""
import hashlib
import json
import os
import re
import sys
import zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "cad-standard-reviewer")
OUT_DIR = ROOT

INCLUDE = [
    "manifest.json",
    "package.json",
    "index.js",
    "icon.svg",
    "server.js",
    "server/analyze.js",
    "server/dxf.js",
    "server/extract.js",
    "server/geom.js",
    "server/llm.js",
    "server/library-import.js",
    "server/library-store.js",
    "server/rule-catalog.js",
    "server/rule-import.js",
    "server/rule-store.js",
    "server/source-store.js",
    "server/rules.js",
    "server/store.js",
    "server/zip.js",
    "rules/v1.json",
    "libraries/materials-gb.json",
    "libraries/tolerances-gb.json",
    "assets/dwg/README.md",
    "assets/dwg/dwg-worker.js",
    "assets/dwg/libredwg-web.js",
    "assets/dwg/libredwg-web.wasm",
    "assets/dwg/LICENSE",
    "assets/dwg/GPL-3.0.txt",
    "assets/dwg/NOTICE",
    "assets/dwg/CORRESPONDING_SOURCE_NOTICE.txt",
    "assets/dwg/CORRESPONDING_SOURCE.zip",
    "README.md",
]

NAME_PATTERN = re.compile(r"^[a-zA-Z0-9_-]{1,64}$")


def fail(message):
    print(f"[build] 失败：{message}", file=sys.stderr)
    sys.exit(1)


def read_json(path):
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


manifest = read_json(os.path.join(SRC, "manifest.json"))
for field in ("name", "displayName", "version", "type", "entry", "icon"):
    if not str(manifest.get(field, "")).strip():
        fail(f"manifest 缺少字段 {field}")
if not NAME_PATTERN.match(manifest["name"]):
    fail("manifest.name 不符合 [a-zA-Z0-9_-]{1,64}")
if len(manifest["displayName"]) > 32:
    fail("manifest.displayName 超过 32 字符")
if manifest.get("backendApiVersion") != 3:
    fail("backendApiVersion 必须为 3")
if not os.path.isfile(os.path.join(SRC, manifest["entry"])):
    fail(f"入口文件不存在：{manifest['entry']}")
if not os.path.isfile(os.path.join(SRC, manifest["icon"])):
    fail(f"图标文件不存在：{manifest['icon']}")

# 校验后端相对 import 均可解析
import_pattern = re.compile(r"from\s+['\"](\./[^'\"]+)['\"]")
for include in INCLUDE:
    if not include.endswith(".js") or include.startswith("assets/"):
        continue
    path = os.path.join(SRC, include)
    if not os.path.isfile(path):
        fail(f"缺少文件：{include}")
    with open(path, "r", encoding="utf-8") as handle:
        text = handle.read()
    for match in import_pattern.finditer(text):
        target = os.path.normpath(os.path.join(os.path.dirname(path), match.group(1)))
        if not os.path.isfile(target):
            fail(f"{include} 引用了不存在的模块 {match.group(1)}")
        relative_target = os.path.relpath(target, SRC).replace(os.sep, "/")
        if relative_target not in INCLUDE:
            fail(f"{include} 引用的模块未列入打包清单：{relative_target}")

for include in INCLUDE:
    path = os.path.join(SRC, include)
    if not os.path.isfile(path):
        fail(f"缺少待打包文件：{include}")

version = manifest["version"]
output = os.path.join(OUT_DIR, f"elvespuck-plugin-{manifest['name']}-{version}-final.zip")
if os.path.exists(output):
    fail(f"输出文件已存在，请先选择其他名称：{output}")

with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for include in INCLUDE:
        source = os.path.join(SRC, include)
        archive.write(source, include.replace(os.sep, "/"))

with zipfile.ZipFile(output, "r") as archive:
    names = archive.namelist()
    if "manifest.json" not in names:
        fail("ZIP 根目录缺少 manifest.json")
    for include in INCLUDE:
        if include.replace(os.sep, "/") not in names:
            fail(f"ZIP 缺少 {include}")
    bad = [name for name in names if name.startswith("/") or ".." in name.split("/")]
    if bad:
        fail(f"ZIP 包含不安全路径：{bad}")
    restored = json.loads(archive.read("manifest.json").decode("utf-8"))
    if restored != manifest:
        fail("ZIP 内 manifest 与源文件不一致")

size = os.path.getsize(output)
digest = hashlib.sha256(open(output, "rb").read()).hexdigest()
print(f"[build] 插件包：{output}")
print(f"[build] 版本：{version}　大小：{size / 1024:.1f} KB　文件数：{len(INCLUDE)}")
print(f"[build] SHA256：{digest}")
