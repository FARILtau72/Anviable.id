"""TiDB Storage pipeline for persisting validated competition items."""

import json
import logging
import re
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import text
from crawler.storage.database import SessionLocal, init_db
from crawler.storage.models import CrawledCompetitionStaging, DomainCrawlMetrics
from crawler.validators.schemas import CompetitionValidatedModel

logger = logging.getLogger(__name__)


def slugify(text_val: str) -> str:
    """Generate clean URL slug for competitions."""
    text_val = re.sub(r"[^\w\s-]", "", (text_val or "").lower()).strip()
    return re.sub(r"[-\s]+", "-", text_val)[:180]


class TiDBStoragePipeline:
    """Persists validated competitions into TiDB Cloud Serverless staging tables."""

    def __init__(self):
        self.session: Session = None

    def open_spider(self, spider):
        try:
            init_db()
            self.session = SessionLocal()
            logger.info("TiDB Storage pipeline initialized and connected successfully.")
        except Exception as e:
            logger.error(f"Failed to connect to TiDB in storage pipeline: {e}")
            raise

    def close_spider(self, spider):
        if self.session:
            try:
                self.session.commit()
            except Exception as e:
                logger.error(f"Error during final TiDB commit: {e}")
            finally:
                self.session.close()

    def process_item(self, item, spider):
        model: CompetitionValidatedModel = item.get("_validated_model")
        if not model or not self.session:
            return item

        try:
            # Upsert into staging table based on canonical_url
            canonical_str = str(model.canonical_url)
            existing = (
                self.session.query(CrawledCompetitionStaging)
                .filter_by(canonical_url=canonical_str)
                .first()
            )

            target_levels_json = [lvl.value if hasattr(lvl, "value") else str(lvl) for lvl in model.target_levels]

            if existing:
                # Update existing record
                existing.title = model.title
                existing.organizer = model.organizer
                existing.description = model.description
                existing.category = model.category.value
                existing.target_levels = target_levels_json
                existing.start_date = model.start_date
                existing.deadline_date = model.deadline_date
                existing.event_date = model.event_date
                existing.registration_fee = model.registration_fee
                existing.prize_pool = model.prize_pool
                existing.registration_url = str(model.registration_url) if model.registration_url else None
                existing.official_guide_url = str(model.official_guide_url) if model.official_guide_url else None
                existing.poster_url = str(model.poster_url) if model.poster_url else None
                existing.extraction_tier = model.extraction_tier
                existing.extraction_score = model.extraction_score
                existing.status = model.status.value
                existing.validation_notes = model.validation_notes
                existing.last_verified_at = datetime.now(timezone.utc)
            else:
                # Insert fresh record
                new_entry = CrawledCompetitionStaging(
                    canonical_url=canonical_str,
                    source_url=str(model.source_url),
                    fingerprint=model.fingerprint,
                    title=model.title,
                    organizer=model.organizer,
                    description=model.description,
                    category=model.category.value,
                    target_levels=target_levels_json,
                    start_date=model.start_date,
                    deadline_date=model.deadline_date,
                    event_date=model.event_date,
                    registration_fee=model.registration_fee,
                    prize_pool=model.prize_pool,
                    registration_url=str(model.registration_url) if model.registration_url else None,
                    official_guide_url=str(model.official_guide_url) if model.official_guide_url else None,
                    poster_url=str(model.poster_url) if model.poster_url else None,
                    extraction_tier=model.extraction_tier,
                    extraction_score=model.extraction_score,
                    domain=model.domain,
                    status=model.status.value,
                    validation_notes=model.validation_notes,
                    extracted_at=model.extracted_at,
                    last_verified_at=datetime.now(timezone.utc),
                )
                self.session.add(new_entry)

            # Update Domain Metrics
            metric = (
                self.session.query(DomainCrawlMetrics)
                .filter_by(domain=model.domain)
                .first()
            )
            if not metric:
                metric = DomainCrawlMetrics(
                    domain=model.domain,
                    total_crawled=1,
                    total_success=1,
                    last_crawl_at=datetime.now(timezone.utc),
                    last_status_code=200,
                )
                self.session.add(metric)
            else:
                metric.total_crawled += 1
                metric.total_success += 1
                metric.last_crawl_at = datetime.now(timezone.utc)
                metric.last_status_code = 200

            # STRICT POLICY: NO AUTO-PUBLISH TO PUBLIC WEB.
            # All scraped items must remain in 'crawled_competitions_staging' table for human admin review.
            self.session.commit()
            logger.info(f"[STORED_TIDB] Staging competition '{model.title}' ({model.status.value}) - Quarantine only, no auto-publish.")

        except Exception as e:
            self.session.rollback()
            logger.error(f"Error persisting item to TiDB: {e}")

        return item
