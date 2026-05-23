import json
from urllib.error import HTTPError
from urllib.request import Request, urlopen


def upload_ctrf(ctrf, api_key=None, endpoint=None, dry_run=False):
    test_count = ctrf["results"]["summary"]["tests"]

    if dry_run:
        destination = endpoint or "the configured TestRelic CTRF endpoint"
        print(f"Dry run: would upload {test_count} CTRF tests to {destination}.")
        return

    if not api_key:
        raise RuntimeError(
            "TESTRELIC_API_KEY is required for upload. Use --dry-run to verify the payload locally."
        )

    if not endpoint:
        raise RuntimeError(
            "TESTRELIC_API_URL is required for CTRF REST upload. The Playwright reporter uploads automatically when TESTRELIC_API_KEY is set."
        )

    payload = json.dumps(ctrf).encode("utf-8")
    request = Request(
        endpoint,
        data=payload,
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
    )

    try:
        with urlopen(request, timeout=30) as response:
            if response.status >= 400:
                raise RuntimeError(f"TestRelic upload failed with status {response.status}")
    except HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"TestRelic upload failed ({error.code}): {body}") from error

    print("Uploaded CTRF results to TestRelic.")
