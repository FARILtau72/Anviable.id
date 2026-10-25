"""Tier 1 Extractor: Semantic Schema.org / JSON-LD parsing."""

import json
from datetime import datetime
from typing import Any, Dict, Optional
from dateutil import parser as date_parser
from parsel import Selector
from crawler.extractors.base import BaseExtractor
from crawler.extractors.regex_parsers import (
    infer_competition_category,
    parse_education_levels,
)


class JsonLdExtractor(BaseExtractor):
    """Extracts structured Event metadata from <script type='application/ld+json'> tags."""

    tier_name: str = "JSON_LD"

    def extract(self, selector: Selector, url: str) -> Optional[Dict[str, Any]]:
        script_tags = selector.xpath("//script[@type='application/ld+json']/text()").getall()
        if not script_tags:
            return None

        for script_content in script_tags:
            try:
                data = json.loads(script_content)
            except Exception:
                continue

            # Handle @graph wrapper or single object
            items = data.get("@graph", [data]) if isinstance(data, dict) else data if isinstance(data, list) else []

            for item in items:
                if not isinstance(item, dict):
                    continue

                type_val = str(item.get("@type", "")).lower()
                if any(t in type_val for t in ["event", "educationevent", "competition", "hackathon"]):
                    return self._map_event(item, url)

        return None

    def _map_event(self, item: Dict[str, Any], url: str) -> Dict[str, Any]:
        title = item.get("name") or item.get("headline") or ""
        description = item.get("description") or ""

        # Organizer resolution
        organizer = ""
        org_raw = item.get("organizer")
        if isinstance(org_raw, dict):
            organizer = org_raw.get("name", "")
        elif isinstance(org_raw, str):
            organizer = org_raw

        # Dates
        start_date = self._parse_iso(item.get("startDate"))
        deadline_date = self._parse_iso(item.get("endDate"))

        # Offers / Registration Fee
        fee = None
        reg_url = None
        offers = item.get("offers")
        if isinstance(offers, dict):
            try:
                fee = int(float(offers.get("price", 0)))
            except (ValueError, TypeError):
                pass
            reg_url = offers.get("url")

        # Poster image
        image = item.get("image")
        poster_url = image if isinstance(image, str) else image.get("url") if isinstance(image, dict) else None

        combined_text = f"{title} {description}"

        return {
            "title": title.strip(),
            "organizer": organizer.strip() or "Penyelenggara Kompetisi",
            "description": description.strip(),
            "category": infer_competition_category(title, description),
            "target_levels": parse_education_levels(combined_text),
            "start_date": start_date,
            "deadline_date": deadline_date,
            "registration_fee": fee,
            "registration_url": reg_url or url,
            "poster_url": poster_url,
            "extraction_tier": self.tier_name,
            "extraction_score": self.confidence_score({
                "title": title,
                "organizer": organizer,
                "deadline_date": deadline_date,
            }),
        }

    def _parse_iso(self, val: Optional[str]) -> Optional[datetime]:
        if not val or not isinstance(val, str):
            return None
        try:
            return date_parser.parse(val)
        except Exception:
            return None

    def confidence_score(self, data: Dict[str, Any]) -> float:
        score = 0.0
        if data.get("title") and len(data["title"]) > 5:
            score += 0.4
        if data.get("organizer"):
            score += 0.3
        if data.get("deadline_date"):
            score += 0.3
        return min(1.0, score)
