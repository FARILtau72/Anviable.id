"""Scrapy settings for Naviable Crawler Engine."""

import os
from dotenv import load_dotenv

load_dotenv()

BOT_NAME = "naviable_crawler"
SPIDER_MODULES = ["crawler.spiders"]
NEWSPIDER_MODULE = "crawler.spiders"

# Politeness and Compliance
USER_AGENT = (
    "NaviableBot/1.0 (+https://naviable.id/bot; media-partner competition indexer; bot@naviable.id)"
)
ROBOTSTXT_OBEY = os.getenv("ROBOTSTXT_OBEY", "true").lower() == "true"

# Rate Limiting & Concurrency
CONCURRENT_REQUESTS = 8
CONCURRENT_REQUESTS_PER_DOMAIN = int(os.getenv("CONCURRENT_REQUESTS_PER_DOMAIN", "2"))
DOWNLOAD_DELAY = float(os.getenv("DOWNLOAD_DELAY", "2.0"))

# AutoThrottle Extension
AUTOTHROTTLE_ENABLED = os.getenv("AUTOTHROTTLE_ENABLED", "true").lower() == "true"
AUTOTHROTTLE_START_DELAY = float(os.getenv("AUTOTHROTTLE_START_DELAY", "2.0"))
AUTOTHROTTLE_MAX_DELAY = float(os.getenv("AUTOTHROTTLE_MAX_DELAY", "15.0"))
AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0

# HTTP Cache (useful for debugging & re-parsing without hitting targets repeatedly)
HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 86400  # 24 hours
HTTPCACHE_DIR = "httpcache"
HTTPCACHE_IGNORE_HTTP_CODES = [403, 404, 429, 500, 502, 503]

# Middlewares
DOWNLOADER_MIDDLEWARES = {
    "crawler.middlewares.rate_limit.DomainPolitenessMiddleware": 540,
    "crawler.middlewares.dynamic_fallback.DynamicRenderFallbackMiddleware": 550,
    "crawler.middlewares.error_classifier.ErrorClassificationMiddleware": 560,
}

# Pipelines
ITEM_PIPELINES = {
    "crawler.pipelines.deduplication.DeduplicationPipeline": 100,
    "crawler.pipelines.validation.PydanticValidationPipeline": 200,
    "crawler.pipelines.storage.TiDBStoragePipeline": 300,
}

# Playwright Configuration (Optional fallback for JS-rendered DOM)
DOWNLOAD_HANDLERS = {
    "file": "scrapy.core.downloader.handlers.file.FileDownloadHandler",
}

# Feed export encoding
FEED_EXPORT_ENCODING = "utf-8"
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
