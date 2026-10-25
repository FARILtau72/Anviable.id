"""Error classification and diagnostic middleware."""

import logging
from urllib.parse import urlparse
from twisted.internet.error import TimeoutError, DNSLookupError, ConnectionRefusedError
from scrapy import Request, Spider
from scrapy.spidermiddlewares.httperror import HttpError

logger = logging.getLogger(__name__)


class ErrorClassificationMiddleware:
    """Classifies network, HTTP, and access control errors with structured logging."""

    def process_exception(self, request: Request, exception: Exception, spider: Spider):
        domain = urlparse(request.url).netloc

        if isinstance(exception, (TimeoutError, TimeoutError)):
            logger.error(
                f"[ERROR_CLASS=NETWORK_TIMEOUT] Request timed out for {request.url} on {domain}: {exception}"
            )
        elif isinstance(exception, DNSLookupError):
            logger.error(
                f"[ERROR_CLASS=DNS_FAILURE] Cannot resolve host for {domain}: {exception}"
            )
        elif isinstance(exception, ConnectionRefusedError):
            logger.error(
                f"[ERROR_CLASS=CONNECTION_REFUSED] Target refused connection on {domain}: {exception}"
            )
        else:
            logger.error(
                f"[ERROR_CLASS=UNHANDLED_EXCEPTION] Error fetching {request.url}: {exception}"
            )

        return None  # Let Scrapy continue default error handling

    def process_response(self, request: Request, response, spider: Spider):
        domain = urlparse(request.url).netloc

        if response.status in (401, 403):
            logger.warning(
                f"[ERROR_CLASS=ACCESS_DENIED] HTTP {response.status} Forbidden on {domain}. "
                "Halting further deep requests on this section per compliance rules."
            )
        elif response.status == 404:
            logger.info(
                f"[ERROR_CLASS=NOT_FOUND] HTTP 404 Competition page removed: {request.url}"
            )

        return response
