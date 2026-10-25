"""Link and domain liveness verification for competition crawler."""

import logging
import socket
import urllib.parse
import urllib.request
from typing import Tuple

logger = logging.getLogger(__name__)


def verify_url_liveness(url_str: str, timeout: float = 3.0) -> Tuple[bool, str]:
    """
    Checks if a URL is alive, reachable, and does not return 404/DNS error.
    Returns (is_alive, reason_or_status).
    """
    if not url_str:
        return False, "empty_url"

    try:
        parsed = urllib.parse.urlparse(str(url_str))
        hostname = parsed.hostname
        if not hostname:
            return False, "invalid_hostname"

        # Check for mock / local / fixture domains
        if hostname.endswith(".example") or hostname in ["sains-nasional.id", "hackathon-smk.id", "pedulilingkungan.org"]:
            return False, f"mock_fixture_domain_{hostname}"

        # 1. DNS Resolution check
        try:
            socket.getaddrinfo(hostname, None)
        except socket.gaierror as dns_err:
            return False, f"dns_unresolvable: {dns_err}"

        # 2. HTTP HEAD check with quick timeout and real User-Agent
        req = urllib.request.Request(
            str(url_str),
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
            method="HEAD",
        )

        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                status = resp.status
                if status < 400:
                    return True, f"http_{status}_ok"
                return False, f"http_status_{status}"
        except urllib.error.HTTPError as http_err:
            # Some servers block HEAD, try small GET with range
            if http_err.code in [403, 405]:
                try:
                    get_req = urllib.request.Request(
                        str(url_str),
                        headers={
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                            "Range": "bytes=0-1024",
                        },
                    )
                    with urllib.request.urlopen(get_req, timeout=timeout) as get_resp:
                        if get_resp.status < 400:
                            return True, f"http_{get_resp.status}_get_ok"
                        return False, f"http_{get_resp.status}"
                except Exception as e:
                    return False, f"http_get_fallback_failed: {e}"

            return False, f"http_error_{http_err.code}"

        except urllib.error.URLError as url_err:
            return False, f"url_error: {url_err.reason}"

    except Exception as general_err:
        return False, f"verification_exception: {general_err}"
