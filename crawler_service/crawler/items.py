"""Data items definition for Scrapy crawling pipeline."""

import scrapy


class CompetitionRawItem(scrapy.Item):
    """Raw scraped competition item before Pydantic validation."""

    # Identifiers & URLs
    canonical_url = scrapy.Field()
    source_url = scrapy.Field()
    registration_url = scrapy.Field()
    official_guide_url = scrapy.Field()
    poster_url = scrapy.Field()

    # Core metadata
    title = scrapy.Field()
    organizer = scrapy.Field()
    description = scrapy.Field()
    category = scrapy.Field()
    target_levels = scrapy.Field()  # e.g. ["SMA", "SMK", "MA", "MAHASISWA"]

    # Financials & Dates
    registration_fee = scrapy.Field()  # int / None
    fee_raw_text = scrapy.Field()
    prize_pool = scrapy.Field()
    start_date = scrapy.Field()
    deadline_date = scrapy.Field()
    event_date = scrapy.Field()

    # Extraction & Diagnostics Metadata
    extracted_at = scrapy.Field()
    extraction_tier = scrapy.Field()  # "JSON_LD", "OPEN_GRAPH", "CSS_SELECTOR", "PLAYWRIGHT"
    extraction_score = scrapy.Field()  # float 0.0 - 1.0
    spider_name = scrapy.Field()
    domain = scrapy.Field()
    fingerprint = scrapy.Field()
    raw_html_snippet = scrapy.Field()
    _validated_model = scrapy.Field()
