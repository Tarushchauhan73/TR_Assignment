import argparse
import os
from pathlib import Path

from .analyzer import analyze
from .parser import parse_report
from .summary import render_summary
from .uploader import upload_ctrf


def main(argv=None):
    parser = argparse.ArgumentParser(
        prog="test-signal",
        description="Summarize Playwright or CTRF reports in plain English.",
    )
    subparsers = parser.add_subparsers(dest="command")

    analyze_parser = subparsers.add_parser("analyze")
    analyze_parser.add_argument("--report", required=True, help="Path to Playwright JSON or CTRF report")
    analyze_parser.add_argument("--out", help="Optional path to write the plain-English summary")
    analyze_parser.add_argument("--upload", action="store_true", help="Upload normalized CTRF results to TestRelic")
    analyze_parser.add_argument("--dry-run", action="store_true", help="Validate upload without sending data")
    analyze_parser.add_argument("--flake-threshold", type=float, default=0.34)

    args = parser.parse_args(argv)
    if args.command != "analyze":
        parser.print_help()
        return 0

    report = parse_report(Path(args.report))
    insight = analyze(report, fail_on_flake_rate=args.flake_threshold)
    summary = render_summary(insight)
    print(summary)

    if args.out:
        Path(args.out).write_text(summary + "\n", encoding="utf-8")

    if args.upload:
        upload_ctrf(
            report["ctrf"],
            api_key=os.environ.get("TESTRELIC_API_KEY"),
            endpoint=os.environ.get("TESTRELIC_API_URL"),
            dry_run=args.dry_run,
        )

    return 0
