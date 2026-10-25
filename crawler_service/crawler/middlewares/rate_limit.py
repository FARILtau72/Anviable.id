"""Per-domain politeness and rate-limiting middleware."""

import time
import logging
from typing import Dict
from urllib.parse import urlparse
from scrapy import Request, Spider
from scrapy.exceptions import IgnoreRequest

logger = logging.getLogger(__name__)


class DomainPolitenessMiddleware:
    """Enforces strict politeness delays and exponential backoff per host."""

    def __init__(self, default_delay: float = 2.0):
        self.default_delay = default_delay
        self.last_request_time: Dict[str, float] = {}
        self.domain_backoff: Dict[str, float] = {}

    @classmethod
    def from_crawler(cls, crawler):
        delay = crawler.settings.getfloat("DOWNLOAD_DELAY", 2.0)
        return cls(default_delay=delay)

    def process_request(self, request: Request, spider: Spider):
        domain = urlparse(request.url).netloc
        if not domain:
            return None

        now = time.time()
        last_time = self.last_request_time.get(domain, 0.0)
        delay = self.default_delay + self.domain_backoff.get(domain, 0.0)

        elapsed = now - last_time
        if elapsed < delay:
            sleep_duration = delay - elapsed
            logger.debug(f"Politeness throttle: sleeping {sleep_duration:.2f}s for {domain}")
            time.sleep(sleep_duration)

        self.last_request_time[domain] = time.time()
        return None

    def process_response(self, request: Request, response, spider: Spider):
        domain = urlparse(request.url).netloc

        # Exponential backoff on rate-limiting HTTP status
        if response.status in (429, 503):
            current_backoff = self.domain_backoff.get(domain, 0.0)
            new_backoff = min(60.0, max(5.0, (current_backoff + 2.0) * 1.5))
            self.domain_backoff[domain] = new_backoff
            logger.warning(
                f"Rate limit / overload detected on {domain} (HTTP {response.status}). "
                f"Increasing politeness delay to {self.default_delay + new_backoff:.1f}s"
            )
        elif response.status == 200 and domain in self.domain_backoff:
            # Gradually recover
            self.domain_backoff[domain] = max(0.0, self.domain_backoff[domain] - 0.5)

        return response
