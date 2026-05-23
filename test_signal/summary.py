def render_summary(insight):
    totals = insight["totals"]
    lines = [
        "Test Signal Summary",
        "===================",
        f"Ran {totals['tests']} tests: {totals['passed']} passed, {totals['failed']} failed, {totals['skipped']} skipped.",
        f"Recommendation: {insight['recommendation']['text']}",
    ]

    if insight["failed"]:
        lines.extend(["", "What needs attention now:"])
        for test in insight["failed"][:3]:
            lines.append(f"- {test['name']}")
            lines.append(f"  Plain English: {_explain_failure(test)}")
            if test.get("location"):
                lines.append(f"  Where: {test['location']}")

    if insight["suspicious_flakes"]:
        lines.extend(["", "Possible flaky noise:"])
        for test in insight["suspicious_flakes"][:3]:
            attempt_word = "attempt" if test["attempts"] == 1 else "attempts"
            lines.append(f"- {test['name']} ({test['attempts']} {attempt_word})")

    if insight["slowest"]:
        lines.extend(["", "Slowest tests to watch:"])
        for test in insight["slowest"]:
            lines.append(f"- {test['name']}: {_format_ms(test['duration_ms'])}")

    return "\n".join(lines)


def _explain_failure(test):
    error = test["errors"][0] if test["errors"] else "No error message was captured."
    clean = " ".join(error.split())

    if "tohavetext" in clean.lower() or "text" in clean.lower():
        return "The page showed different text than the test expected. Check whether the product copy changed or the UI is rendering the wrong state."
    if "timeout" in clean.lower() or "timed out" in clean.lower() or "waiting for" in clean.lower():
        return "The test waited for something that never became ready. This is often a real loading bug or an unstable selector."
    if "locator" in clean.lower() or "selector" in clean.lower():
        return "The test could not find the expected UI element. Confirm the element still exists and that the selector matches user-visible behavior."
    return clean[:217] + "..." if len(clean) > 220 else clean


def _format_ms(ms):
    return f"{round(ms)} ms" if ms < 1000 else f"{ms / 1000:.1f} s"
