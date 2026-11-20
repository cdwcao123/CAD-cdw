import io
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'vendor' / 'python'))
from pypdf import PdfReader

try:
    data = sys.stdin.buffer.read(20 * 1024 * 1024 + 1)
    if len(data) > 20 * 1024 * 1024:
        raise ValueError('file too large')
    reader = PdfReader(io.BytesIO(data), strict=True)
    if reader.is_encrypted:
        raise ValueError('encrypted PDF')
    if len(reader.pages) > 300:
        raise ValueError('too many pages')
    pages = []
    total = 0
    for number, page in enumerate(reader.pages, 1):
        content = page.extract_text() or ''
        total += len(content)
        if total > 1000000:
            raise ValueError('extracted text exceeds limit')
        pages.append({'page': number, 'text': content})
    print(json.dumps({'pages': pages}, ensure_ascii=False))
except Exception as error:
    print(json.dumps({'error': type(error).__name__}))
    sys.exit(1)
