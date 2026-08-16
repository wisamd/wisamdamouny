#!/usr/bin/env python3
"""Generate a minimal, valid CV.pdf for the portfolio contact section."""
import zlib


def esc(s):
    return s.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def build_cv() -> bytes:
    lines = [
        "Wisam Damouny",
        "",
        "Software engineer building self-hosted, Hebrew-first, premium software.",
        "Product design - AI agents - Self-hosted - React/Node.",
        "",
        "github.com/wisamd  -  ikando.tech  -  zrikat.com",
    ]
    content = "BT\n/F1 16 Tf\n72 780 Td\n"
    for ln in lines:
        content += f"({esc(ln)}) Tj\n0 -26 Td\n"
    content += "ET"
    stream = zlib.compress(content.encode("ascii", "replace"))

    objects = [None]  # 1-indexed

    def add(body) -> int:
        objects.append(body)
        return len(objects) - 1

    add(b"<< /Type /Catalog /Pages 2 0 R >>")  # 1
    add(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")  # 2
    add(b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] "
        b"/Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>")  # 3
    add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica "
        b"/Encoding /WinAnsiEncoding >>")  # 4
    add(b"<< /Length %d /Filter /FlateDecode >>\nstream\n"
        % len(stream) + stream + b"\nendstream")  # 5

    out = b"%PDF-1.4\n"
    offsets = [0] * len(objects)
    for i in range(1, len(objects)):
        offsets[i] = len(out)
        out += b"%d 0 obj\n" % i + objects[i] + b"\nendobj\n"

    xref = len(out)
    out += b"xref\n0 %d\n" % len(objects)
    out += b"0000000000 65535 f \n"
    for i in range(1, len(objects)):
        out += b"%010d 00000 n \n" % offsets[i]
    out += b"trailer\n<< /Size %d /Root 1 0 R >>\n" % len(objects)
    out += b"startxref\n%d\n%%%%EOF" % xref
    return out


if __name__ == "__main__":
    with open("CV.pdf", "wb") as f:
        f.write(build_cv())
    print("wrote CV.pdf", len(build_cv()), "bytes")