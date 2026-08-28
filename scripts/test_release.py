#!/usr/bin/env python3
"""Unit tests for scripts/release.py (no network, no git mutations on real repo)."""
from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

SCRIPTS = Path(__file__).resolve().parent
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

import release  # noqa: E402


@pytest.mark.parametrize(
    ("commits", "expected"),
    [
        (["feat: add thing"], "minor"),
        (["feat(sdk): add thing"], "minor"),
        (["fix: typo"], "patch"),
        (["perf: faster"], "patch"),
        (["refactor: cleanup"], "patch"),
        (["feat!: break api"], "major"),
        (["fix(api)!: break"], "major"),
        (["chore: docs\n\nBREAKING CHANGE: gone"], "major"),
        (["chore: only", "docs: readme"], None),
        (["chore: a", "feat: b", "fix: c"], "minor"),
        (["fix: a", "feat: b"], "minor"),
        (["fix: a", "chore: b"], "patch"),
    ],
)
def test_determine_bump(commits: list[str], expected: str | None) -> None:
    assert release.determine_bump(commits) == expected


@pytest.mark.parametrize(
    ("version", "bump", "expected"),
    [
        ("0.1.0", "patch", "0.1.1"),
        ("0.1.0", "minor", "0.2.0"),
        ("0.1.0", "major", "1.0.0"),
        ("1.2.3-beta", "patch", "1.2.4"),
        ("1.2.3-beta", "minor", "1.3.0"),
        ("1.2.3-beta", "major", "2.0.0"),
    ],
)
def test_apply_bump(version: str, bump: str, expected: str) -> None:
    assert release.apply_bump(version, bump) == expected


def test_assert_tag_version_match_ok() -> None:
    release.assert_tag_version_match("v1.2.3", "1.2.3")


def test_assert_tag_version_mismatch() -> None:
    with pytest.raises(SystemExit, match="!="):
        release.assert_tag_version_match("v1.2.3", "1.2.4")


def test_write_package_version_updates_lock(tmp_path: Path) -> None:
    pkg = {"name": "@guaso-ai/content", "version": "0.1.0"}
    lock = {
        "name": "@guaso-ai/content",
        "version": "0.1.0",
        "lockfileVersion": 3,
        "packages": {"": {"name": "@guaso-ai/content", "version": "0.1.0"}},
    }
    (tmp_path / "package.json").write_text(json.dumps(pkg), encoding="utf-8")
    (tmp_path / "package-lock.json").write_text(json.dumps(lock), encoding="utf-8")

    release.write_package_version(tmp_path, "0.2.0")

    assert release.read_package_version(tmp_path) == "0.2.0"
    locked = json.loads((tmp_path / "package-lock.json").read_text(encoding="utf-8"))
    assert locked["version"] == "0.2.0"
    assert locked["packages"][""]["version"] == "0.2.0"


def test_dry_run_does_not_mutate(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]
) -> None:
    pkg = {"name": "@guaso-ai/content", "version": "0.1.0"}
    (tmp_path / "package.json").write_text(json.dumps(pkg) + "\n", encoding="utf-8")
    before = (tmp_path / "package.json").read_text(encoding="utf-8")

    monkeypatch.setattr(release, "_fetch_and_assert_not_behind", lambda _repo: None)
    monkeypatch.setattr(release, "last_v_tag", lambda _repo: "v0.1.0")
    monkeypatch.setattr(
        release,
        "commits_since",
        lambda _repo, _tag: ["feat: something new"],
    )

    rc = release.main(["--repo", str(tmp_path)])
    assert rc == 0
    out = capsys.readouterr().out
    assert "dry-run" in out
    assert "0.2.0" in out
    assert "DOCS_PIN_REQUIRED=@guaso-ai/content@0.2.0" in out
    assert (tmp_path / "package.json").read_text(encoding="utf-8") == before


def test_chore_only_no_release(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    pkg = {"name": "@guaso-ai/content", "version": "0.1.0"}
    (tmp_path / "package.json").write_text(json.dumps(pkg) + "\n", encoding="utf-8")
    monkeypatch.setattr(release, "_fetch_and_assert_not_behind", lambda _repo: None)
    monkeypatch.setattr(release, "last_v_tag", lambda _repo: "v0.1.0")
    monkeypatch.setattr(
        release,
        "commits_since",
        lambda _repo, _tag: ["chore: housekeeping", "docs: readme"],
    )
    rc = release.main(["--repo", str(tmp_path)])
    assert rc == 0


def test_push_requires_apply() -> None:
    assert release.main(["--push"]) == 2


def test_format_docs_pin_required() -> None:
    assert (
        release.format_docs_pin_required("0.4.0")
        == "DOCS_PIN_REQUIRED=@guaso-ai/content@0.4.0"
    )
