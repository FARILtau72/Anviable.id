"""Abstract base class for all competition data extractors."""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from parsel import Selector


class BaseExtractor(ABC):
    """Protocol for extraction tiers."""

    tier_name: str = "BASE"

    @abstractmethod
    def extract(self, selector: Selector, url: str) -> Optional[Dict[str, Any]]:
        """Extract competition dictionary from Parsel/Scrapy selector.

        Returns a dictionary matching CompetitionRawItem fields, or None if the tier
        cannot extract meaningful data.
        """
        pass

    @abstractmethod
    def confidence_score(self, extracted_data: Dict[str, Any]) -> float:
        """Calculate confidence score (0.0 to 1.0) based on coverage of essential fields."""
        pass
