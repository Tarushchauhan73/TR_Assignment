# Problem Decomposition — Playwright Test Intelligence

## Root Cause Analysis

The customer's surface request is "better test reports," but the real problem is
**test result invisibility** — results exist but are never seen by the people who
can act on them. CI produces XML/JSON artifacts that live in a GitHub Actions
drawer nobody opens. The gap is not tooling capability; it is the absence of a
signal that travels to where developers already are. Developers don't read reports
— they respond to signals. The fix is not a prettier report; it is automatic
surfacing of actionable insight at the moment a test run completes.

## Jobs-to-be-Done

**Functional jobs:**

1. When a CI run completes, I want to know immediately if something real broke,
   so I can fix it before it reaches production.
2. When a test fails repeatedly, I want to know whether it is a real regression
   or a flaky test, so I can decide whether to act or suppress.
3. When I read a failure, I want a plain-English explanation of what went wrong,
   so I can act without reading 800 lines of stack trace.

**Emotional job:**

4. When I own testing without a QA engineer, I want to feel confident that the
   test suite is actually protecting me, so I am not anxious every time I deploy.

## Failure Modes at Scale

**1. Silent upload failures when `TESTRELIC_API_KEY` is unset.**
The SDK swallows the error and the developer assumes results are uploading — they
are not. Mitigation: validate the key at reporter initialisation and emit a
loud, coloured warning to stdout with the exact env var name missing.

**2. Flake misclassification on low-run-count tests.**
A test that has run twice and failed once is flagged as 50% flaky — statistically
meaningless. Mitigation: require a minimum run threshold (≥10) before surfacing a
flakiness signal, and display confidence intervals rather than raw percentages.

**3. Summary fatigue when all tests are summarised equally.**
If every test gets a plain-English summary, the signal-to-noise ratio collapses.
Mitigation: only generate AI summaries for tests that are new failures or have
crossed a flakiness threshold — silence is signal for everything else.

## Success Metric

The customer has gotten real value when **a developer opens a TestRelic insight
and takes an action on their codebase within 24 hours of a test run** — either
fixing a real bug surfaced by a failure analysis, or suppressing a confirmed flaky
test. TestRelic can surface this by tracking the time delta between
`insight_viewed` and `code_push` events on the same project, and flagging
projects where this delta drops below 24 hours as "activated."