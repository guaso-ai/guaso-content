#!/usr/bin/env python3
"""Release helper for @guaso-ai/content — bump package.json + tag; never npm publish.

PARITY: guaso-app/scripts/bump_version.py — same conventional-commit bump rules
(BREAKING/`!` → major, feat → minor, fix|perf|refactor → patch, else no release).
No shared module: DRY threshold 3+; this is the sole package.json caller.

Happy path:
  python scripts/release.py                 # dry-run (default)
  python scripts/release.py --apply         # bump + commit + tag local
  python scripts/release.py --apply --push  # also push main + tag → GHA OIDC publish

⛔ npm publish in this script / local happy path. Publish = GHA on tag push only.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

# PARITY: guaso-app/scripts/bump_version.py (lines ~19–55, ~108–123)
_BREAKING_RE = re.compile(r"BREAKING[ -]CHANGE", re.IGNORECASE)
_COMMIT_RE = re.compile(r"^(\w+)(\([^)]+\))?(!)?:")

REPO_ROOT = Path(__file__).resolve().parent.parent
PACKAGE_JSON = "package.json"
PACKAGE_LOCK = "package-lock.json"
NPM_PACKAGE = "@guaso-ai/content"


def _run(
    cmd: list[str],
    *,
    cwd: Path | None = None,
    check: bool = True,
) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        cmd,
        cwd=cwd or REPO_ROOT,
        text=True,
        capture_output=True,
        check=check,
    )


def determine_bump(commits: list[str]) -> str | None:
    """PARITY bump_version._determine_bump."""
    bump: str | None = None
    for msg in commits:
        if _BREAKING_RE.search(msg):
            return "major"
        m = _COMMIT_RE.match(msg)
        if not m:
            continue
        type_, _, bang = m.group(1).lower(), m.group(2), m.group(3)
        if bang:
            return "major"
        if type_ == "feat":
            bump = "minor"
        elif type_ in ("fix", "perf", "refactor") and bump != "minor":
            bump = "patch"
    return bump


def apply_bump(version: str, bump: str) -> str:
    """PARITY bump_version._apply_bump."""
    parts = version.split(".")
    major, minor = int(parts[0]), int(parts[1])
    patch_raw = parts[2]
    dash = patch_raw.find("-")
    patch_n = int(patch_raw[:dash]) if dash >= 0 else int(patch_raw)

    if bump == "major":
        major, minor, patch_n = major + 1, 0, 0
    elif bump == "minor":
        minor, patch_n = minor + 1, 0
    else:
        patch_n += 1

    return f"{major}.{minor}.{patch_n}"


def read_package_version(repo: Path) -> str:
    data = json.loads((repo / PACKAGE_JSON).read_text(encoding="utf-8"))
    version = data.get("version")
    if not isinstance(version, str) or not version.strip():
        raise SystemExit(f"✗ {PACKAGE_JSON} missing version")
    return version.strip()


def write_package_version(repo: Path, version: str) -> None:
    """Update package.json#version and package-lock.json top-level + packages[\"\"].version."""
    pkg_path = repo / PACKAGE_JSON
    pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
    pkg["version"] = version
    pkg_path.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")

    lock_path = repo / PACKAGE_LOCK
    if not lock_path.exists():
        return
    lock = json.loads(lock_path.read_text(encoding="utf-8"))
    lock["version"] = version
    packages = lock.get("packages")
    if isinstance(packages, dict) and "" in packages:
        root = packages[""]
        if isinstance(root, dict):
            root["version"] = version
    lock_path.write_text(json.dumps(lock, indent=2) + "\n", encoding="utf-8")


def last_v_tag(repo: Path) -> str | None:
    """Latest tag matching v* (version-sort)."""
    proc = _run(
        ["git", "tag", "-l", "v*", "--sort=-v:refname"],
        cwd=repo,
        check=False,
    )
    if proc.returncode != 0:
        return None
    lines = [ln.strip() for ln in proc.stdout.splitlines() if ln.strip()]
    return lines[0] if lines else None


def commits_since(repo: Path, tag: str | None) -> list[str]:
    log_range = f"{tag}..HEAD" if tag else "HEAD"
    proc = _run(
        ["git", "log", log_range, "--format=%B---SEP---"],
        cwd=repo,
        check=False,
    )
    if proc.returncode != 0:
        raise SystemExit(f"✗ git log failed: {proc.stderr.strip()}")
    return [c.strip() for c in proc.stdout.split("---SEP---") if c.strip()]


def assert_tag_version_match(tag_name: str, version: str) -> None:
    """Fail if tag_name != f'v{version}'."""
    expected = f"v{version}"
    if tag_name != expected:
        raise SystemExit(f"✗ tag '{tag_name}' != expected '{expected}'")


def npm_version_already_published(version: str) -> bool:
    """True if version is already on npm. Network errors raise unless caller skips."""
    url = f"https://registry.npmjs.org/{NPM_PACKAGE}/{version}"
    req = urllib.request.Request(url, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:  # noqa: S310 — fixed npm registry
            return 200 <= getattr(resp, "status", 200) < 300
    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            return False
        raise
    except urllib.error.URLError:
        raise


def _git_dirty(repo: Path) -> bool:
    proc = _run(["git", "status", "--porcelain"], cwd=repo, check=False)
    if proc.returncode != 0:
        raise SystemExit(f"✗ git status failed: {proc.stderr.strip()}")
    return bool(proc.stdout.strip())


def _fetch_and_assert_not_behind(repo: Path) -> None:
    fetch = _run(["git", "fetch", "origin", "main"], cwd=repo, check=False)
    if fetch.returncode != 0:
        raise SystemExit(f"✗ git fetch origin main failed: {fetch.stderr.strip()}")
    ancestor = _run(
        ["git", "merge-base", "--is-ancestor", "origin/main", "HEAD"],
        cwd=repo,
        check=False,
    )
    if ancestor.returncode != 0:
        raise SystemExit(
            "✗ HEAD atrasado respecto de origin/main; corré: "
            "git fetch && git rebase origin/main"
        )


def _tag_exists(repo: Path, tag: str) -> bool:
    proc = _run(
        ["git", "rev-parse", "--verify", "--quiet", f"refs/tags/{tag}"],
        cwd=repo,
        check=False,
    )
    return proc.returncode == 0


def plan_release(repo: Path) -> dict[str, Any]:
    """Return release plan or raise SystemExit if no-release."""
    current = read_package_version(repo)
    tag = last_v_tag(repo)
    commits = commits_since(repo, tag)
    if not commits:
        raise SystemExit("No commits since last tag — nothing to release.")
    bump = determine_bump(commits)
    if not bump:
        raise SystemExit(
            "No release-worthy commits (feat/fix/perf/refactor/BREAKING) — skipping."
        )
    new_version = apply_bump(current, bump)
    new_tag = f"v{new_version}"
    assert_tag_version_match(new_tag, new_version)
    return {
        "current": current,
        "bump": bump,
        "new_version": new_version,
        "tag": new_tag,
        "commits_considered": len(commits),
        "last_tag": tag,
    }


def apply_release(repo: Path, *, push: bool, skip_npm_check: bool = False) -> int:
    """Bump files → git commit → git tag → optional push. No npm publish."""
    if _git_dirty(repo):
        raise SystemExit("✗ working tree dirty — commit or stash before --apply")
    _fetch_and_assert_not_behind(repo)

    plan = plan_release(repo)
    new_version = plan["new_version"]
    new_tag = plan["tag"]

    if _tag_exists(repo, new_tag):
        raise SystemExit(f"✗ tag {new_tag} already exists")

    if not skip_npm_check:
        try:
            if npm_version_already_published(new_version):
                raise SystemExit(
                    f"✗ {NPM_PACKAGE}@{new_version} already on npm — abort"
                )
        except SystemExit:
            raise
        except Exception as exc:  # noqa: BLE001 — best-effort network
            print(
                f"⚠ npm view check failed ({exc}); continuing "
                "(use --skip-npm-check to silence)",
                file=sys.stderr,
            )

    write_package_version(repo, new_version)
    paths = [PACKAGE_JSON]
    if (repo / PACKAGE_LOCK).exists():
        paths.append(PACKAGE_LOCK)
    _run(["git", "add", *paths], cwd=repo)
    msg = f"chore(release): v{new_version}"
    _run(["git", "commit", "-m", msg], cwd=repo)
    _run(["git", "tag", "-a", new_tag, "-m", msg], cwd=repo)
    print(f"✓ bumped {plan['bump']}: {plan['current']} → {new_version}")
    print(f"✓ tagged {new_tag}")

    if push:
        # Push current branch (expect main) + tag. Never npm publish.
        branch_proc = _run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            cwd=repo,
            check=False,
        )
        branch = (branch_proc.stdout or "").strip() or "main"
        push_branch = _run(
            ["git", "push", "origin", f"HEAD:refs/heads/{branch}"],
            cwd=repo,
            check=False,
        )
        if push_branch.returncode != 0:
            raise SystemExit(f"✗ git push branch failed: {push_branch.stderr.strip()}")
        push_tag = _run(["git", "push", "origin", new_tag], cwd=repo, check=False)
        if push_tag.returncode != 0:
            raise SystemExit(f"✗ git push tag failed: {push_tag.stderr.strip()}")
        print(f"✓ pushed {branch} + {new_tag} (GHA will OIDC-publish)")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Bump @guaso-ai/content version + tag (no npm publish)."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        default=False,
        help="Print plan only (default when --apply is absent).",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Bump package.json/lock, commit, and create annotated tag locally.",
    )
    parser.add_argument(
        "--push",
        action="store_true",
        help="With --apply: push branch + tag to origin (triggers GHA publish).",
    )
    parser.add_argument(
        "--skip-npm-check",
        action="store_true",
        help="Skip best-effort npm registry duplicate-version check.",
    )
    parser.add_argument(
        "--repo",
        type=Path,
        default=REPO_ROOT,
        help="Repo root (default: parent of scripts/).",
    )
    args = parser.parse_args(argv)

    if args.push and not args.apply:
        print("✗ --push requires --apply", file=sys.stderr)
        return 2

    repo = args.repo.expanduser().resolve()
    if not (repo / PACKAGE_JSON).exists():
        print(f"✗ no {PACKAGE_JSON} in {repo}", file=sys.stderr)
        return 1

    # Default = dry-run when --apply not set.
    if not args.apply:
        try:
            _fetch_and_assert_not_behind(repo)
            plan = plan_release(repo)
        except SystemExit as exc:
            msg = str(exc) or "abort"
            print(msg, file=sys.stderr if msg.startswith("✗") else sys.stdout)
            return 1 if msg.startswith("✗") else 0
        print("dry-run (no mutations):")
        print(f"  current:  {plan['current']}")
        print(f"  bump:     {plan['bump']}")
        print(f"  new:      {plan['new_version']}")
        print(f"  tag:      {plan['tag']}")
        print(f"  commits:  {plan['commits_considered']} since {plan['last_tag']}")
        print("  next: python scripts/release.py --apply [--push]")
        return 0

    try:
        return apply_release(
            repo, push=args.push, skip_npm_check=args.skip_npm_check
        )
    except SystemExit as exc:
        msg = str(exc) or "abort"
        print(msg, file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
