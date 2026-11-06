#!/usr/bin/env python3
"""Optional raw-URL replay of the exact pinned source manifest; standard library."""
import hashlib
import json
from pathlib import Path
from urllib.request import urlopen

batch = Path(__file__).resolve().parent
manifest = json.loads((batch / "sources.json").read_text())
for row in manifest["sources"]:
    target = Path(row["cache"])
    url = f"https://raw.githubusercontent.com/{manifest['repository']}/{manifest['revision']}/{row['path']}"
    with urlopen(url, timeout=60) as response:
        data = response.read()
    actual = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
    if actual != row["githubBlobSha"]:
        raise ValueError(f"Git blob hash mismatch: {row['path']}")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
print(json.dumps({"fetched": len(manifest["sources"]), "revision": manifest["revision"]}))
