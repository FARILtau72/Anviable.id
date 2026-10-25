import logging
from pathlib import Path
from scrapy import Request
from crawler.spiders.base import BaseCompetitionSpider

logger = logging.getLogger(__name__)

FIXTURES_DIR = Path(__file__).parent.parent.parent / "tests" / "fixtures"


class LocalFixtureSpider(BaseCompetitionSpider):
    """End-to-end integration spider that crawls HTML fixtures to test full pipeline."""

    name = "fixture_spider"
    custom_settings = {
        "ROBOTSTXT_OBEY": False,
    }

    def start_requests(self):
        logger.warning(f"FIXTURE_SPIDER: start_requests called! FIXTURES_DIR={FIXTURES_DIR}")
        fixture_files = [
            ("jsonld_sample.html", "https://sains-nasional.id/event-2026"),
            ("opengraph_sample.html", "https://hackathon-smk.id/vokasi-2026"),
            ("messy_sample.html", "https://pedulilingkungan.org/poster-2026"),
        ]

        for filename, mock_url in fixture_files:
            file_path = FIXTURES_DIR / filename
            logger.warning(f"Checking {file_path}, exists={file_path.exists()}")
            if file_path.exists():
                file_url = file_path.as_uri()
                print(f"Yielding request for {file_url}")
                yield Request(
                    url=file_url,
                    callback=self.parse_fixture,
                    meta={"mock_canonical_url": mock_url},
                    dont_filter=True,
                )

    def parse_fixture(self, response):
        mock_url = response.meta.get("mock_canonical_url")

        response = response.replace(url=mock_url)

        item = self.extract_competition_item(response)
        if item:
            yield item
