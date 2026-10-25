"""Base spider class implementing multi-tier adaptive extraction."""

import logging
from datetime import datetime, timezone
from urllib.parse import urlparse
import scrapy
from parsel import Selector
from crawler.items import CompetitionRawItem
from crawler.extractors.jsonld import JsonLdExtractor
from crawler.extractors.opengraph import OpenGraphExtractor

logger = logging.getLogger(__name__)


class BaseCompetitionSpider(scrapy.Spider):
    """Abstract base spider providing multi-tier adaptive extraction and politeness checks."""

    name = "base_competition_spider"
    enable_dynamic_fallback = False

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Multi-tier extractors in order of priority
        self.extractors = [
            JsonLdExtractor(),
            OpenGraphExtractor(),
        ]

    async def start(self):
        """Scrapy 2.13+ async start generator bridging start_requests and start_urls."""
        for req in self.start_requests():
            yield req

    def start_requests(self):
        """Backwards-compatible start_requests supporting start_urls."""
        for url in getattr(self, "start_urls", []):
            yield scrapy.Request(url, dont_filter=True)

    def extract_competition_item(self, response) -> CompetitionRawItem:
        """Run adaptive extractor chain across HTML response."""
        selector = Selector(response.text)
        url = response.url
        domain = urlparse(url).netloc

        best_data = None
        best_score = -1.0
        winning_tier = "UNKNOWN"

        for extractor in self.extractors:
            try:
                candidate = extractor.extract(selector, url)
                if candidate:
                    score = candidate.get("extraction_score", 0.0)
                    if score > best_score:
                        best_score = score
                        best_data = candidate
                        winning_tier = extractor.tier_name

                    # Short-circuit if high-confidence JSON-LD was parsed
                    if extractor.tier_name == "JSON_LD" and score >= 0.75:
                        break
            except Exception as e:
                logger.warning(f"Extractor {extractor.tier_name} failed on {url}: {e}")

        if not best_data or not best_data.get("title"):
            return None

        item = CompetitionRawItem()
        item["canonical_url"] = url
        item["source_url"] = url
        item["title"] = best_data.get("title", "")
        item["organizer"] = best_data.get("organizer", "Penyelenggara Terdata")
        item["description"] = best_data.get("description", "")
        item["category"] = best_data.get("category", "UMUM")
        item["target_levels"] = best_data.get("target_levels", ["UMUM"])
        item["start_date"] = best_data.get("start_date")
        item["deadline_date"] = best_data.get("deadline_date")
        item["event_date"] = best_data.get("event_date")
        item["registration_fee"] = best_data.get("registration_fee")
        item["prize_pool"] = best_data.get("prize_pool")
        item["registration_url"] = best_data.get("registration_url") or url
        item["official_guide_url"] = best_data.get("official_guide_url")
        item["poster_url"] = best_data.get("poster_url")
        item["extracted_at"] = datetime.now(timezone.utc)
        item["extraction_tier"] = winning_tier
        item["extraction_score"] = best_score
        item["spider_name"] = self.name
        item["domain"] = domain
        item["raw_html_snippet"] = response.text[:2000]

        return item
