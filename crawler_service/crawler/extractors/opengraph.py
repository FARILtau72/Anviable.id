"""Tier 2 Extractor: OpenGraph and standard HTML Meta tags parsing."""

from typing import Any, Dict, Optional
from parsel import Selector
from crawler.extractors.base import BaseExtractor
from crawler.extractors.regex_parsers import (
    extract_dates_from_text,
    infer_competition_category,
    parse_education_levels,
    parse_indonesian_fee,
)


class OpenGraphExtractor(BaseExtractor):
    """Extracts metadata from OpenGraph and HTML meta tags with heuristic date/fee enrichment."""

    tier_name: str = "OPEN_GRAPH"

    def extract(self, selector: Selector, url: str) -> Optional[Dict[str, Any]]:
        # Title extraction hierarchy
        title = (
            selector.xpath("//meta[@property='og:title']/@content").get()
            or selector.xpath("//meta[@name='twitter:title']/@content").get()
            or selector.xpath("//h1/text()").get()
            or selector.xpath("//title/text()").get()
            or ""
        ).strip()

        if len(title) < 5:
            return None

        # Description
        description = (
            selector.xpath("//meta[@property='og:description']/@content").get()
            or selector.xpath("//meta[@name='description']/@content").get()
            or selector.xpath("//meta[@name='twitter:description']/@content").get()
            or ""
        ).strip()

        # Organizer / Site name
        organizer = (
            selector.xpath("//meta[@property='og:site_name']/@content").get()
            or selector.xpath("//meta[@name='author']/@content").get()
            or ""
        ).strip()

        # Poster image
        poster_url = (
            selector.xpath("//meta[@property='og:image']/@content").get()
            or selector.xpath("//meta[@name='twitter:image']/@content").get()
            or None
        )

        # Contextual text block: concatenate description and main article body
        body_text = " ".join(selector.xpath("//article//text() | //main//text() | //body//p//text()").getall())
        full_context = f"{title}. {description}. {body_text}"

        start_date, deadline_date = extract_dates_from_text(full_context)
        fee = parse_indonesian_fee(full_context)
        levels = parse_education_levels(full_context)
        category = infer_competition_category(title, description)

        return {
            "title": title,
            "organizer": organizer or "Penyelenggara Terdata",
            "description": description or title,
            "category": category,
            "target_levels": levels,
            "start_date": start_date,
            "deadline_date": deadline_date,
            "registration_fee": fee,
            "registration_url": url,
            "poster_url": poster_url,
            "extraction_tier": self.tier_name,
            "extraction_score": self.confidence_score({
                "title": title,
                "organizer": organizer,
                "deadline_date": deadline_date,
            }),
        }

    def confidence_score(self, data: Dict[str, Any]) -> float:
        score = 0.0
        if data.get("title") and len(data["title"]) > 5:
            score += 0.35
        if data.get("organizer"):
            score += 0.25
        if data.get("deadline_date"):
            score += 0.3
        if data.get("description"):
            score += 0.1
        return min(1.0, score)
