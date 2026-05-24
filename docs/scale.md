# Scale Brief — Deploying to 10,000 Customers

## Deployment Playbook (Next 50 Customers)

**Step 1 — Signup to first insight (target: under 15 minutes)**

1. Customer signs up at platform.testrelic.ai and creates a project.
2. They copy their API key from the onboarding screen.
3. They run: `npm install @testrelic/playwright-analytics`
4. They add four lines to `playwright.config.ts` (SDK reporter config).
5. They set `TESTRELIC_API_KEY` as a GitHub Actions secret.
6. They push — the next CI run uploads results automatically.
7. They open the dashboard and see their first test run within minutes.

**Where customers drop off and mitigations:**

- **Step 4 (config):** Customers with `.js` configs get confused by the TypeScript
  import. Mitigation: provide a `.js` snippet variant in the docs alongside the
  `.ts` one.
- **Step 5 (secret):** Customers forget the GitHub secret step; results appear
  locally but not in CI. Mitigation: the SDK should detect a CI environment with
  no key and log a direct link to the GitHub secrets settings page.
- **Step 7 (dashboard):** Customers don't know where to look first. Mitigation:
  send a single email when a project receives its first upload, with a deep link
  directly to that run.

---

## Top 3 Integration Failure Patterns

**1. `TESTRELIC_API_KEY` not set in CI — silent no-op**

*Symptom:* Tests pass, CI is green, dashboard is empty. No error anywhere.

*Resolution:*
1. Check `Settings → Secrets → Actions` — confirm `TESTRELIC_API_KEY` exists.
2. Add `echo $TESTRELIC_API_KEY | head -c 8` as a debug step in the workflow
   to confirm the secret is being injected.
3. Re-run the workflow. Results will appear in the dashboard immediately.

**2. Two `playwright.config` files conflict (`config.js` and `config.ts`)**

*Symptom:* Playwright picks up the wrong config, reporter is not loaded, no
upload occurs even with the key set.

*Resolution:*
1. Run `npx playwright test --list` and check which config file Playwright
   reports loading at the top of the output.
2. Delete or rename the unused config file.
3. Confirm the active config includes the TestRelic reporter in its `reporter`
   array.

**3. SDK reporter crashes on teardown when `apiKey` is `undefined`**

*Symptom:* `npx playwright test` exits with code 1 even when all tests pass.
Stack trace mentions the TestRelic reporter during teardown.

*Resolution:*
1. Wrap the reporter entry in a conditional:
   `...(process.env.TESTRELIC_API_KEY ? [['@testrelic/playwright-analytics',
   { cloud: { apiKey: process.env.TESTRELIC_API_KEY } }]] : [])`
2. This makes the reporter load only when the key is present, so local runs
   without the key never crash.

---

## Feedback Loop Design

**Events to track:**

| Event | Trigger | Purpose |
|---|---|---|
| `project_created` | Signup complete | Funnel entry |
| `first_upload` | First test run received | SDK working |
| `insight_viewed` | User opens a failure/flake analysis | Product delivering value |
| `action_taken` | Code push within 24h of insight_viewed | Activation confirmed |
| `mcp_query` | Natural language query submitted | MCP adoption |
| `upload_gap_72h` | No upload in 72h after first_upload | Churn risk signal |

**Activation threshold:** A project is "activated" when it hits `insight_viewed`
within 7 days of `first_upload`. Teams that do not reach this within 7 days have
a significantly lower 30-day retention rate — this is the intervention window for
an FDE check-in.

---

## One Product Insight

**Problem:** When `TESTRELIC_API_KEY` is missing or invalid in CI, the SDK
produces no output and the developer has no idea results are not uploading. This
is the single highest-friction point in the integration — it looks like success
(green CI) but is silent failure (empty dashboard).

**Proposed solution:** Add a post-run stdout banner in the SDK that is always
printed regardless of upload success: