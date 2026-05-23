FLAKE_SIGNALS = ("timeout", "timed out", "network", "detached", "waiting for", "locator")


def analyze(report, fail_on_flake_rate=0.34):
    tests = report["tests"]
    failed = [test for test in tests if test["status"] == "failed"]
    passed = [test for test in tests if test["status"] == "passed"]
    skipped = [test for test in tests if test["status"] == "skipped"]
    retry_passes = [test for test in passed if test["attempts"] > 1]
    suspicious_flakes = [
        test for test in passed if test["attempts"] > 1 or _looks_flaky(test)
    ]
    slowest = sorted(tests, key=lambda test: test["duration_ms"], reverse=True)[:3]
    flake_rate = len(suspicious_flakes) / len(tests) if tests else 0

    return {
        "totals": {
            "tests": len(tests),
            "passed": len(passed),
            "failed": len(failed),
            "skipped": len(skipped),
            "flake_rate": flake_rate,
        },
        "failed": failed,
        "retry_passes": retry_passes,
        "suspicious_flakes": suspicious_flakes,
        "slowest": slowest,
        "recommendation": _recommendation(
            failed, suspicious_flakes, retry_passes, flake_rate, fail_on_flake_rate
        ),
        "ctrf": report["ctrf"],
    }


def _looks_flaky(test):
    text = "\n".join(test["errors"]).lower()
    return any(signal in text for signal in FLAKE_SIGNALS)


def _recommendation(failed, suspicious_flakes, retry_passes, flake_rate, threshold):
    if failed:
        suffix = "" if len(failed) == 1 else "s"
        return {
            "level": "act-now",
            "text": f"{len(failed)} test{suffix} failed. Start with the first failure because it is blocking release confidence.",
        }

    if flake_rate >= threshold or retry_passes:
        suffix = "" if len(suspicious_flakes) == 1 else "s"
        return {
            "level": "stabilize",
            "text": f"{len(suspicious_flakes)} test{suffix} look flaky. Stabilize these before trusting this suite as a release gate.",
        }

    return {
        "level": "healthy",
        "text": "No failures or strong flake signals were found. Keep watching the slowest tests because they usually become the next source of noise.",
    }
