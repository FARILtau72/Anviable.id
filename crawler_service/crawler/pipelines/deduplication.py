"""Deduplication and canonicalization pipeline."""

import hashlib
import re
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode
from scrapy.exceptions import DropItem
from crawler.items import CompetitionRawItem

TRACKING_PARAMS = {"utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid", "igshid"}


def canonicalize_url(url: str) -> str:
    """Strip tracking query parameters and normalize URL structure."""
    if not url:
        return ""

    parsed = urlparse(url)
    # Filter out marketing tracking parameters
    filtered_query = [
        (k, v) for k, v in parse_qsl(parsed.query)
        if k.lower() not in TRACKING_PARAMS
    ]
    # Rebuild normalized URL
    clean_url = urlunparse((
        parsed.scheme.lower(),
        parsed.netloc.lower(),
        parsed.path.rstrip("/") if parsed.path != "/" else "/",
        parsed.params,
        urlencode(filtered_query),
        "",  # Strip fragment
    ))
    return clean_url


def compute_content_fingerprint(title: str, organizer: str, canonical_url: str) -> str:
    """Generate SHA-256 content fingerprint for robust multi-source deduplication."""
    norm_title = re.sub(r"[^\w\s]", "", (title or "").lower()).strip()
    norm_org = re.sub(r"[^\w\s]", "", (organizer or "").lower()).strip()
    norm_url = canonicalize_url(canonical_url)

    raw_payload = f"{norm_title}|{norm_org}|{norm_url}".encode("utf-8")
    return hashlib.sha256(raw_payload).hexdigest()


class DeduplicationPipeline:
    """Filters duplicate competitions during spider crawl execution."""

    def __init__(self):
        self.seen_fingerprints = set()

    def process_item(self, item: CompetitionRawItem, spider):
        raw_url = item.get("canonical_url") or item.get("source_url") or ""
        clean_url = canonicalize_url(raw_url)
        item["canonical_url"] = clean_url

        title = item.get("title", "")
        organizer = item.get("organizer", "")
        fingerprint = compute_content_fingerprint(title, organizer, clean_url)
        item["fingerprint"] = fingerprint

        if fingerprint in self.seen_fingerprints:
            raise DropItem(f"Duplicate competition item dropped by fingerprint: {title}")

        self.seen_fingerprints.add(fingerprint)
        return item
