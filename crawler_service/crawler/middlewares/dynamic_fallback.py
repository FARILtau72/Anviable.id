"""Dynamic JavaScript detection and Playwright fallback middleware."""

import logging
from scrapy import Request, Spider
from scrapy.http import HtmlResponse

logger = logging.getLogger(__name__)

SPA_EMPTY_PATTERNS = [
    '<div id="root"></div>',
    '<div id="__next"></div>',
    '<div id="app"></div>',
    'window.__NUXT__',
    'You need to enable JavaScript to run this app',
]


class DynamicRenderFallbackMiddleware:
    """Detects empty SPA roots in static HTML and schedules a Playwright browser render if needed."""

    def process_response(self, request: Request, response, spider: Spider):
        # Only inspect HTML text responses that have not already passed through Playwright
        if not isinstance(response, HtmlResponse) or request.meta.get("playwright"):
            return response

        # Check for typical empty client-side container
        body_str = response.text[:4000] if hasattr(response, "text") else ""
        is_empty_spa = any(pattern in body_str for pattern in SPA_EMPTY_PATTERNS)

        # If static HTML is empty/SPA skeleton and spider allows dynamic fallback
        if is_empty_spa and getattr(spider, "enable_dynamic_fallback", False):
            logger.info(
                f"[DYNAMIC_FALLBACK] Client-side SPA skeleton detected on {request.url}. "
                "Retrying request with Playwright browser context..."
            )
            dynamic_request = request.copy()
            dynamic_request.meta["playwright"] = True
            dynamic_request.meta["playwright_include_page"] = False
            dynamic_request.dont_filter = True
            return dynamic_request

        return response
