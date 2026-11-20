import io
import json
import posixpath
import sys
import zipfile
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
REL = "{http://schemas.openxmlformats.org/package/2006/relationships}"


def paragraph_text(element):
    parts = []
    for node in element.iter():
        if node.tag == W + "t" and node.text:
            parts.append(node.text)
        elif node.tag == W + "tab":
            parts.append("\t")
        elif node.tag in (W + "br", W + "cr"):
            parts.append("\n")
    return "".join(parts).strip()


def cell_text(cell, state):
    parts = []
    for child in list(cell):
        if child.tag == W + "p":
            text = paragraph_text(child)
            if text:
                parts.append(text)
        elif child.tag == W + "tbl":
            text = table_text(child, state)
            if text:
                parts.append(text)
        else:
            for paragraph in child.iter(W + "p"):
                text = paragraph_text(paragraph)
                if text:
                    parts.append(text)
    return "\n".join(parts)


def table_text(table, state):
    state["table"] += 1
    table_no = state["table"]
    lines = []
    rows = list(table.findall(W + "tr"))
    for row_no, row in enumerate(rows, 1):
        cells = list(row.findall(W + "tc"))
        values = []
        for cell_no, cell in enumerate(cells, 1):
            text = cell_text(cell, state)
            if text:
                values.append(text)
                if len(state["fragments"]) < 10000:
                    state["fragments"].append({
                        "location": {
                            "type": "docx-table",
                            "section": state["section"],
                            "table": table_no,
                            "row": row_no,
                            "cell": cell_no,
                        },
                        "text": text,
                    })
        if values:
            lines.append("\t".join(values))
    return "\n".join(lines)


def collect_container(container, section, state):
    previous = state["section"]
    state["section"] = section
    paragraph_no = 0
    try:
        for child in list(container):
            if child.tag == W + "p":
                paragraph_no += 1
                text = paragraph_text(child)
                if text and len(state["fragments"]) < 10000:
                    state["fragments"].append({
                        "location": {
                            "type": "docx-paragraph",
                            "section": section,
                            "paragraph": paragraph_no,
                        },
                        "text": text,
                    })
            elif child.tag == W + "tbl":
                table_text(child, state)
            elif child.tag in (W + "sdt", W + "customXml"):
                collect_container(child, section, state)
    finally:
        state["section"] = previous


def resolve_target(target):
    if target.startswith("/"):
        return target.lstrip("/")
    return posixpath.normpath(posixpath.join("word", target))


def relationships(files):
    result = {}
    rel_name = "word/_rels/document.xml.rels"
    if rel_name not in files:
        return result
    root = ET.fromstring(files[rel_name])
    for relation in root.findall(REL + "Relationship"):
        relation_id = relation.get("Id")
        target = relation.get("Target")
        if relation_id and target:
            result[relation_id] = resolve_target(target)
    return result


def collect_referenced_stories(root, rels, files, state):
    seen = set()
    for node in root.iter():
        if node.tag not in (W + "headerReference", W + "footerReference"):
            continue
        relation_id = node.get(R + "id")
        target = rels.get(relation_id)
        if not target or target in seen or target not in files:
            continue
        seen.add(target)
        story_root = ET.fromstring(files[target])
        kind = "页眉" if node.tag.endswith("headerReference") else "页脚"
        collect_container(story_root, kind, state)


def collect_part(name, section, files, state):
    if name not in files:
        return
    root = ET.fromstring(files[name])
    collect_container(root, section, state)


try:
    data = sys.stdin.buffer.read(20 * 1024 * 1024 + 1)
    if len(data) > 20 * 1024 * 1024:
        raise ValueError("file too large")
    with zipfile.ZipFile(io.BytesIO(data), "r") as archive:
        files = {name: archive.read(name) for name in archive.namelist() if not name.endswith("/")}
    if "word/document.xml" not in files:
        raise ValueError("missing document.xml")
    document = ET.fromstring(files["word/document.xml"])
    body = document.find(W + "body")
    if body is None:
        raise ValueError("missing body")
    rels = relationships(files)
    state = {"fragments": [], "table": 0, "section": "正文"}
    collect_container(body, "正文", state)
    collect_referenced_stories(document, rels, files, state)
    for name, section in (
        ("word/footnotes.xml", "脚注"),
        ("word/endnotes.xml", "尾注"),
        ("word/comments.xml", "批注"),
    ):
        collect_part(name, section, files, state)
    fragments = state["fragments"]
    if len(fragments) > 10000 or sum(len(item["text"]) for item in fragments) > 1000000:
        raise ValueError("extraction exceeds limit")
    print(json.dumps({"fragments": fragments}, ensure_ascii=False))
except Exception as error:
    print(json.dumps({"error": type(error).__name__}))
    sys.exit(1)
