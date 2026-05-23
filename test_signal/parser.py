import json


def parse_report(path):
    data = json.loads(path.read_text(encoding="utf-8"))

    if data.get("results", {}).get("tests") is not None:
        tests = [_from_ctrf_test(test) for test in data["results"]["tests"]]
        return {"source": "ctrf", "tests": tests, "ctrf": data}

    tests = []
    for suite in data.get("suites", []):
        _walk_playwright_suite(suite, [], tests)

    return {
        "source": "playwright-json",
        "tests": tests,
        "ctrf": _to_ctrf(tests, data),
    }


def _walk_playwright_suite(suite, parents, tests):
    path = [*parents, suite.get("title") or ""]
    path = [part for part in path if part]

    for spec in suite.get("specs", []):
        for test in spec.get("tests", []):
            attempts = test.get("results", [])
            last_attempt = attempts[-1] if attempts else {}
            errors = [
                error.get("message") or error.get("stack") or str(error)
                for attempt in attempts
                for error in attempt.get("errors", [])
            ]
            title = " > ".join([*path, spec.get("title", "")])
            location = f"{spec.get('file')}:{spec.get('line', 1)}" if spec.get("file") else None

            tests.append(
                {
                    "name": title,
                    "status": _normalize_status(test.get("status") or last_attempt.get("status")),
                    "duration_ms": sum(attempt.get("duration", 0) for attempt in attempts),
                    "attempts": len(attempts),
                    "errors": errors,
                    "location": location,
                }
            )

    for child in suite.get("suites", []):
        _walk_playwright_suite(child, path, tests)


def _from_ctrf_test(test):
    return {
        "name": test.get("name", "Unnamed test"),
        "status": _normalize_status(test.get("status")),
        "duration_ms": test.get("duration", 0),
        "attempts": int(test.get("retries", 0)) + 1,
        "errors": [value for value in [test.get("message"), test.get("trace")] if value],
        "location": test.get("filePath"),
    }


def _normalize_status(status):
    if status in {"passed", "pass"}:
        return "passed"
    if status in {"skipped", "skip"}:
        return "skipped"
    if status in {"failed", "fail", "timedOut", "timedout"}:
        return "failed"
    return "unknown"


def _to_ctrf(tests, raw_report):
    summary = {
        "tests": len(tests),
        "passed": sum(1 for test in tests if test["status"] == "passed"),
        "failed": sum(1 for test in tests if test["status"] == "failed"),
        "skipped": sum(1 for test in tests if test["status"] == "skipped"),
        "pending": 0,
        "other": sum(1 for test in tests if test["status"] == "unknown"),
        "duration": sum(test["duration_ms"] for test in tests),
    }

    return {
        "results": {
            "tool": {"name": "playwright"},
            "summary": summary,
            "tests": [
                {
                    "name": test["name"],
                    "status": test["status"] if test["status"] in {"passed", "skipped"} else "failed",
                    "duration": test["duration_ms"],
                    "message": test["errors"][0] if test["errors"] else None,
                    "filePath": test["location"],
                }
                for test in tests
            ],
            "environment": {
                "appName": raw_report.get("config", {})
                .get("metadata", {})
                .get("projectName", "test-signal")
            },
        }
    }
