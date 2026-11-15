#!/usr/bin/env python3
"""Inspect JSON configurations and decoded Prefab JSON without rewriting inputs.

Examples:
  config.py level.json --out phase.json select /branches/dragon/phases/0
  config.py levels/ --out actions.json select '/waves/*/fragments/*/actions/*' --where /count 2 --field /key
  config.py prefab.json --out fields.json find --key _alwaysCheckCurrentPoint
  config.py prefab.json --out references.json find --value 188846094545021249
  config.py level.json --out counts.json stats '/waves/*/fragments/*/actions/*' --by /key --sum /count

Paths use JSON Pointer escaping (~0 for ~, ~1 for /). Selectors additionally
accept * for one child and ** for descendants. --where and --equals take JSON
literals; --value takes an exact string. Counts refer to selected JSON nodes.
"""
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
import argparse
from collections import Counter
from datetime import datetime, timezone
import fnmatch
import hashlib
import json
from pathlib import Path
import sys


MISSING = object()


def tokens(pointer):
    if pointer == "":
        return ()
    if not pointer.startswith("/"):
        raise argparse.ArgumentTypeError("JSON Pointer must be empty or start with /")
    return tuple(part.replace("~1", "/").replace("~0", "~") for part in pointer[1:].split("/"))


def child_pointer(pointer, key):
    return pointer + "/" + str(key).replace("~", "~0").replace("/", "~1")


def children(value):
    if isinstance(value, dict):
        yield from value.items()
    elif isinstance(value, list):
        yield from ((str(index), item) for index, item in enumerate(value))


def child(value, key):
    if isinstance(value, dict):
        return value.get(key, MISSING)
    if isinstance(value, list) and key.isascii() and key.isdecimal():
        index = int(key)
        if str(index) == key and index < len(value):
            return value[index]
    return MISSING


def walk(value, pointer=""):
    yield pointer, value
    for key, item in children(value):
        yield from walk(item, child_pointer(pointer, key))


def select(value, parts, pointer=""):
    if not parts:
        yield pointer, value
    elif parts[0] == "**":
        yield from select(value, parts[1:], pointer)
        for key, item in children(value):
            yield from select(item, parts, child_pointer(pointer, key))
    elif parts[0] == "*":
        for key, item in children(value):
            yield from select(item, parts[1:], child_pointer(pointer, key))
    else:
        item = child(value, parts[0])
        if item is not MISSING:
            yield from select(item, parts[1:], child_pointer(pointer, parts[0]))


def get(value, pointer):
    for part in tokens(pointer):
        value = child(value, part)
        if value is MISSING:
            return MISSING
    return value


def equal(first, second):
    if isinstance(first, bool) or isinstance(second, bool):
        return type(first) is type(second) and first == second
    if isinstance(first, (int, float)) and isinstance(second, (int, float)):
        return first == second
    if type(first) is not type(second):
        return False
    if isinstance(first, dict):
        return first.keys() == second.keys() and all(equal(value, second[key]) for key, value in first.items())
    if isinstance(first, list):
        return len(first) == len(second) and all(equal(a, b) for a, b in zip(first, second))
    return first == second


def matches(value, filters):
    return all((actual := get(value, pointer)) is not MISSING and equal(actual, expected)
               for pointer, expected in filters)


def kind(value):
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "boolean"
    if isinstance(value, dict):
        return "object"
    if isinstance(value, list):
        return "array"
    return "string" if isinstance(value, str) else "number"


def brief(value):
    if isinstance(value, dict):
        return {"type": "object", "size": len(value), "keys": list(value)[:6]}
    if isinstance(value, list):
        return {"type": "array", "size": len(value)}
    if isinstance(value, str) and len(value) > 120:
        return value[:117] + "..."
    return value


def find(value, args):
    for pointer, item in walk(value):
        if args.key is not None:
            if not pointer:
                continue
            key = pointer.rsplit("/", 1)[1].replace("~1", "/").replace("~0", "~")
            parent = get(value, pointer.rsplit("/", 1)[0])
            if not isinstance(parent, dict):
                continue
            pattern = args.key.casefold() if args.ignore_case else args.key
            key = key.casefold() if args.ignore_case else key
            if not fnmatch.fnmatchcase(key, pattern):
                continue
        if args.value is not None:
            if not isinstance(item, str):
                continue
            actual = item.casefold() if args.ignore_case else item
            expected = args.value.casefold() if args.ignore_case else args.value
            if actual != expected:
                continue
        if args.contains is not None:
            if not isinstance(item, str):
                continue
            actual = item.casefold() if args.ignore_case else item
            expected = args.contains.casefold() if args.ignore_case else args.contains
            if expected not in actual:
                continue
        if args.equals is not MISSING and not equal(item, args.equals):
            continue
        yield pointer, item


def summarize(rows, by, sums):
    sums = list(dict.fromkeys(sums))
    pointers = list(dict.fromkeys(([by] if by is not None else []) + sums))
    groups = {}
    totals = Counter({pointer: 0 for pointer in sums})
    missing = Counter()
    types = Counter()
    for row in rows:
        value = row["value"]
        types[kind(value)] += 1
        values = {pointer: get(value, pointer) for pointer in pointers}
        missing.update(pointer for pointer, item in values.items() if item is MISSING)
        group = None
        if by is not None:
            grouped = values[by]
            if grouped is not MISSING:
                key = json.dumps(grouped, ensure_ascii=False, sort_keys=True)
                group = groups.setdefault(key, {"value": grouped, "count": 0, "sums": Counter()})
                group["count"] += 1
        for pointer in sums:
            number = values[pointer]
            if number is MISSING:
                continue
            elif isinstance(number, (int, float)) and not isinstance(number, bool):
                totals[pointer] += number
                if group is not None:
                    group["sums"][pointer] += number
            else:
                raise ValueError(f"{row['source']}#{row['pointer']}: {pointer} is not numeric")
    return {"matched": len(rows), "types": dict(types), "sums": dict(totals),
            "missing": dict(missing), "groups": list(groups.values())}


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("input", type=Path, help="JSON file or directory")
    parser.add_argument("--glob", action="append", help="directory-relative file glob; repeatable, default **/*.json")
    parser.add_argument("--out", type=Path, required=True, help="full provenance/result JSON file")
    parser.add_argument("--preview", type=int, default=3, help="maximum compact stdout examples; default 3, 0 disables")
    parser.add_argument("--source-url", help="record the source URL without claiming to verify it")
    parser.add_argument("--revision", help="record the supplied source revision")
    commands = parser.add_subparsers(dest="command", required=True)
    selecting = commands.add_parser("select", help="extract paths, optionally filter and project fields")
    statistics = commands.add_parser("stats", help="count selected nodes, group values, and sum numeric fields")
    for command in (selecting, statistics):
        command.add_argument("pointer", type=tokens, help="JSON Pointer with optional * and **")
        command.add_argument("--where", nargs=2, action="append", default=[], metavar=("POINTER", "JSON"))
    selecting.add_argument("--field", action="append", default=[], help="project this literal JSON Pointer; repeatable")
    statistics.add_argument("--by", help="group by this literal JSON Pointer")
    statistics.add_argument("--sum", dest="sums", action="append", default=[], help="sum this numeric field; repeatable")
    finding = commands.add_parser("find", help="locate fields or string/JSON values recursively")
    finding.add_argument("--key", help="field-name glob, such as *Timeline*")
    values = finding.add_mutually_exclusive_group()
    values.add_argument("--value", help="exact string value; useful for IDs and references")
    values.add_argument("--contains", help="substring of string values")
    values.add_argument("--equals", type=json.loads, default=MISSING, help="exact JSON value, including null, false, or numbers")
    finding.add_argument("--ignore-case", action="store_true", help="case-insensitive --key, --value, and --contains")
    args = parser.parse_args()
    if args.preview < 0:
        parser.error("--preview must be nonnegative")
    if args.command == "find" and args.key is None and args.value is None and args.contains is None and args.equals is MISSING:
        parser.error("find requires --key, --value, --contains, or --equals")
    try:
        args.where = [(pointer, json.loads(value)) for pointer, value in getattr(args, "where", [])]
        for pointer in [p for p, _ in args.where] + getattr(args, "field", []) + getattr(args, "sums", []):
            tokens(pointer)
        if getattr(args, "by", None) is not None:
            tokens(args.by)
    except (ValueError, argparse.ArgumentTypeError) as error:
        parser.error(str(error))
    source = args.input.resolve()
    if source.is_file():
        paths = [source]
    elif source.is_dir():
        paths = sorted({path.resolve() for pattern in args.glob or ["**/*.json"]
                        for path in source.glob(pattern) if path.is_file()})
    else:
        parser.error(f"input does not exist: {source}")
    if not paths:
        parser.error("no JSON inputs matched")
    if args.out.resolve() in paths:
        parser.error("--out must not overwrite a scanned input")
    rows, inputs, errors = [], [], []
    for path in paths:
        entry = {"path": str(path)}
        inputs.append(entry)
        try:
            raw = path.read_bytes()
            entry.update(bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest())
            document = json.loads(raw)
            if args.command == "find":
                selected = find(document, args)
            else:
                selected = ((pointer, value) for pointer, value in select(document, args.pointer)
                            if matches(value, args.where))
            seen = set()
            count = 0
            for pointer, value in selected:
                if pointer in seen:
                    continue
                seen.add(pointer)
                rows.append({"source": str(path), "pointer": pointer, "value": value})
                count += 1
            entry.update(status="ok", matched=count)
        except (OSError, ValueError, UnicodeError) as error:
            entry["status"] = "error"
            errors.append({"source": str(path), "error": type(error).__name__, "message": str(error)})
    if args.command == "stats":
        try:
            result = summarize(rows, args.by, args.sums)
        except ValueError as error:
            parser.error(str(error))
        preview = [{"value": brief(group["value"]), "count": group["count"], "sums": group["sums"]}
                   for group in result["groups"][:args.preview]]
    else:
        if args.command == "select" and args.field:
            for row in rows:
                value = row.pop("value")
                fields = {pointer: get(value, pointer) for pointer in args.field}
                row["fields"] = {pointer: item for pointer, item in fields.items() if item is not MISSING}
                row["missingFields"] = [pointer for pointer, item in fields.items() if item is MISSING]
        result = {"matched": len(rows), "matches": rows}
        preview = [{**{key: value for key, value in row.items() if key not in ("value", "fields")},
                    **({"value": brief(row["value"])} if "value" in row else
                       {"fields": {key: brief(value) for key, value in row["fields"].items()}})}
                   for row in rows[:args.preview]]
    result.update(complete=not errors, scanned=len(paths), succeeded=len(paths) - len(errors), errors=errors)
    output = {
        "provenance": {
            "collectedAt": datetime.now(timezone.utc).isoformat(),
            "scope": "Selected local JSON documents only. Value matches locate potential references; they do not resolve or validate bindings.",
            "tool": {"path": str(Path(__file__).resolve()), "sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},
            "python": sys.version,
            "argv": sys.argv[1:],
            "sourceUrl": args.source_url,
            "revision": args.revision,
            "inputs": inputs,
        },
        "result": result,
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = {"output": str(args.out), "complete": result["complete"], "scanned": len(paths),
               "matched": result["matched"], "errors": len(errors), "preview": preview}
    if args.command == "stats":
        summary.update(types=result["types"], sums=result["sums"], missing=result["missing"], groups=len(result["groups"]))
    print(json.dumps(summary, ensure_ascii=False))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
