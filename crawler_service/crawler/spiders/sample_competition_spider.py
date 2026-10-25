"""Production-ready sample competition spider for Indonesian educational portals."""

import logging
from urllib.parse import urljoin
from scrapy import Request
from crawler.spiders.base import BaseCompetitionSpider

logger = logging.getLogger(__name__)


class PuspresnasSampleSpider(BaseCompetitionSpider):
    """Spider for crawling public national competition announcements from Kemendikdasmen."""

    name = "puspresnas_spider"
    allowed_domains = ["pusatprestasinasional.kemendikdasmen.go.id"]
    start_urls = [
        "https://pusatprestasinasional.kemendikdasmen.go.id/",
    ]

    custom_settings = {
        "DOWNLOAD_DELAY": 3.0,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
    }

    def parse(self, response):
        """Discover event detail links and pagination."""
        logger.info(f"Parsing index/catalogue page: {response.url}")

        links = response.xpath(
            "//a[contains(@href, 'lomba') or contains(@href, 'event') or contains(@href, 'olimpiade') or contains(@href, 'kompetisi') or contains(@href, 'ajang')]/@href"
        ).getall()

        for link in set(links):
            full_url = urljoin(response.url, link)
            yield Request(
                url=full_url,
                callback=self.parse_competition_detail,
                errback=self.handle_error,
            )

    def parse_competition_detail(self, response):
        """Parse competition detail page using multi-tier adaptive extractors."""
        item = self.extract_competition_item(response)
        if item:
            yield item

    def handle_error(self, failure):
        logger.error(f"Failed to crawl {failure.request.url}: {failure.value}")


class InformasiLombaSpider(BaseCompetitionSpider):
    """Spider for crawling live, verified student competitions from Info Lomba Indonesia."""

    name = "informasilomba_spider"
    allowed_domains = ["informasilomba.com", "www.informasilomba.com"]
    start_urls = [
        "https://www.informasilomba.com/",
    ]

    custom_settings = {
        "DOWNLOAD_DELAY": 2.0,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
    }

    def parse(self, response):
        """Discover competition article links from homepage catalogue."""
        logger.info(f"Parsing Info Lomba catalogue: {response.url}")

        # Article links on Blogger pattern: /YYYY/MM/title-slug.html
        article_links = response.xpath("//a[contains(@href, '.html')]/@href").getall()

        seen = set()
        for link in article_links:
            full_url = urljoin(response.url, link)
            slug = full_url.split("/")[-1].replace(".html", "").lower()

            # Skip informational tips, how-tos, and guidelines
            if any(ignore in slug for ignore in ["cara-", "tips-", "contoh-", "syarat-", "pengertian-", "panduan-"]):
                continue

            # Target active current/upcoming competition announcements (2025/2026)
            if not ("/2025/" in full_url or "/2026/" in full_url):
                continue

            if full_url not in seen and "/search" not in full_url:
                seen.add(full_url)
                yield Request(
                    url=full_url,
                    callback=self.parse_competition_detail,
                    errback=self.handle_error,
                )

    def parse_competition_detail(self, response):
        """Parse competition detail page using multi-tier adaptive extractors."""
        item = self.extract_competition_item(response)
        if item:
            logger.info(f"[CRAWLED_REAL] Found competition: {item.get('title')} ({item.get('category')})")
            yield item

    def handle_error(self, failure):
        logger.error(f"Failed to crawl {failure.request.url}: {failure.value}")

