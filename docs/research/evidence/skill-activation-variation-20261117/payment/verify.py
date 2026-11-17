#!/usr/bin/env python3
"""Independently rerun the bounded payment configuration and derived counts."""
import argparse
import hashlib
import json
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).parent


def fp(path):
    raw = path.read_bytes()
    return dict(path=str(path), bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    expected_content = json.loads((HERE / 'content.json').read_text())
    expected_result = json.loads((HERE / 'result.json').read_text())
    with tempfile.TemporaryDirectory(prefix='skill-payment-') as folder:
        fresh = Path(folder) / 'content.json'
        subprocess.run([sys.executable, str(HERE / 'extract.py'), '--out', str(fresh)], check=True, stdout=subprocess.DEVNULL)
        actual = json.loads(fresh.read_text())
        content_equal = actual['result'] == expected_content['result']
        source_equal = actual['provenance']['sources'] == expected_content['provenance']['sources']
    with tempfile.TemporaryDirectory(prefix='skill-payment-result-') as folder:
        fresh = Path(folder) / 'result.json'
        subprocess.run([sys.executable, str(HERE / 'summarize.py'), '--out', str(fresh)], check=True, stdout=subprocess.DEVNULL)
        result_equal = json.loads(fresh.read_text())['result'] == expected_result['result']
    checks = dict(freshConfiguration=content_equal, sourceFingerprints=source_equal, derivedResult=result_equal,
                  feverDeduplicated=(expected_content['result']['counts']['feverSkillIds'] == len(set(expected_content['result']['feverSkillIds'])) == 11))
    result = dict(complete=all(checks.values()), checks=checks, counts=expected_content['result']['counts'],
                  componentCount=len(expected_content['result']['components']), templateCount=len(expected_content['result']['templates']))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(dict(provenance=dict(script=fp(Path(__file__)), scope='Fresh config re-extraction and count/result comparison; not native or runtime execution.'), result=result), ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(result))
    if not result['complete']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
