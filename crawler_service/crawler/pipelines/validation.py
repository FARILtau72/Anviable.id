"""Pydantic and liveness validation pipeline for competition items."""

import logging
from pydantic import ValidationError
from scrapy.exceptions import DropItem
from crawler.items import CompetitionRawItem
from crawler.validators.schemas import CompetitionValidatedModel, ExtractionStatus
from crawler.validators.link_verifier import verify_url_liveness

logger = logging.getLogger(__name__)


class PydanticValidationPipeline:
    """Validates raw scraped items using Pydantic schemas and link liveness check."""

    def process_item(self, item: CompetitionRawItem, spider):
        try:
            validated = CompetitionValidatedModel(
                canonical_url=item.get("canonical_url"),
                source_url=item.get("source_url"),
                fingerprint=item.get("fingerprint"),
                title=item.get("title", ""),
                organizer=item.get("organizer", "Penyelenggara Terdata"),
                description=item.get("description", ""),
                category=item.get("category", "UMUM"),
                target_levels=item.get("target_levels", ["UMUM"]),
                start_date=item.get("start_date"),
                deadline_date=item.get("deadline_date"),
                event_date=item.get("event_date"),
                registration_fee=item.get("registration_fee"),
                prize_pool=item.get("prize_pool"),
                registration_url=item.get("registration_url"),
                official_guide_url=item.get("official_guide_url"),
                poster_url=item.get("poster_url"),
                extracted_at=item.get("extracted_at"),
                extraction_tier=item.get("extraction_tier", "UNKNOWN"),
                extraction_score=item.get("extraction_score", 0.0),
                domain=item.get("domain", ""),
            )

            # Check if this is a local fixture spider test (allow mock without dropping, but mark FLAGGED)
            is_fixture_spider = getattr(spider, "name", "") == "fixture_spider"

            # Active Link Liveness Check for Registration URL & Source URL
            target_check_url = str(validated.registration_url or validated.canonical_url)
            is_alive, check_reason = verify_url_liveness(target_check_url, timeout=3.0)

            if not is_alive:
                if is_fixture_spider:
                    validated.status = ExtractionStatus.FLAGGED_FOR_REVIEW
                    validated.validation_notes.append(f"fixture_mock_url: {check_reason}")
                else:
                    validated.status = ExtractionStatus.REJECTED
                    validated.validation_notes.append(f"dead_link_rejected: {check_reason}")
                    validated.extraction_score = min(validated.extraction_score, 0.2)
                logger.warning(
                    f"[LINK_DEAD] Competition '{validated.title}' target URL {target_check_url} unreachable: {check_reason}"
                )

            # Attach validated model to item for downstream storage pipeline
            item["_validated_model"] = validated
            return item

        except ValidationError as err:
            logger.warning(
                f"[VALIDATION_FAILED] Dropping malformed competition {item.get('title')}: {err}"
            )
            raise DropItem(f"Item failed strict Pydantic validation: {err}")
