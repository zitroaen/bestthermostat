#!/usr/bin/env python3
"""Set the version in every place that carries it and rebuild the card.

Usage: python scripts/bump_version.py 1.2.3 [--no-build]
"""

from __future__ import annotations

import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
COMPONENT = ROOT / "custom_components" / "bestthermostat"

# (file, regex with one group around the version)
TEXT_FILES: list[tuple[Path, str]] = [
    (COMPONENT / "const.py", r'^VERSION: Final = "([^"]+)"$'),
    (ROOT / "frontend" / "src" / "version.ts", r'^export const CARD_VERSION = "([^"]+)";$'),
    (ROOT / "pyproject.toml", r'^version = "([^"]+)"$'),
]
JSON_FILES: list[Path] = [COMPONENT / "manifest.json", ROOT / "frontend" / "package.json"]
LOCK_FILE = ROOT / "frontend" / "package-lock.json"


def versions() -> dict[str, str]:
    """Return the version found in every place (used by the tests)."""
    found: dict[str, str] = {}
    for path, pattern in TEXT_FILES:
        match = re.search(pattern, path.read_text(), re.MULTILINE)
        found[str(path.relative_to(ROOT))] = match.group(1) if match else "<missing>"
    for path in JSON_FILES:
        found[str(path.relative_to(ROOT))] = json.loads(path.read_text())["version"]
    lock = json.loads(LOCK_FILE.read_text())
    found["frontend/package-lock.json"] = lock["version"]
    found["frontend/package-lock.json (root package)"] = lock["packages"][""]["version"]
    return found


def bump(version: str) -> None:
    """Write ``version`` everywhere."""
    for path, pattern in TEXT_FILES:
        text = path.read_text()
        new, count = re.subn(
            pattern,
            lambda m: m.group(0).replace(m.group(1), version),
            text,
            count=1,
            flags=re.MULTILINE,
        )
        if count != 1:
            sys.exit(f"Version not found in {path}")
        path.write_text(new)
    for path in JSON_FILES:
        data = json.loads(path.read_text())
        data["version"] = version
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    lock = json.loads(LOCK_FILE.read_text())
    lock["version"] = version
    lock["packages"][""]["version"] = version
    LOCK_FILE.write_text(json.dumps(lock, indent=2, ensure_ascii=False) + "\n")


def main() -> None:
    """Entry point."""
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 1 or not re.fullmatch(r"\d+\.\d+\.\d+", args[0]):
        sys.exit(__doc__)
    bump(args[0])
    if "--no-build" not in sys.argv:
        subprocess.run(["npm", "run", "build"], cwd=ROOT / "frontend", check=True)
    print(f"Version set to {args[0]}")


if __name__ == "__main__":
    main()
