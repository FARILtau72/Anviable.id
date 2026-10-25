"""SQLAlchemy models for TiDB Cloud Serverless storage."""

import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    Float,
    DateTime,
    JSON,
    Index,
)
from sqlalchemy.orm import declarative_base

Base = declarative_base()


def generate_uuid() -> str:
    return str(uuid.uuid4())


class CrawledCompetitionStaging(Base):
    """Staging table for extracted competitions before admin verification."""

    __tablename__ = "crawled_competitions_staging"

    id = Column(String(191), primary_key=True, default=generate_uuid)
    canonical_url = Column(String(500), nullable=False, unique=True)
    source_url = Column(String(500), nullable=False)
    fingerprint = Column(String(64), nullable=False, index=True)

    title = Column(String(255), nullable=False)
    organizer = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False, default="UMUM")
    target_levels = Column(JSON, nullable=False)

    start_date = Column(DateTime, nullable=True)
    deadline_date = Column(DateTime, nullable=True, index=True)
    event_date = Column(DateTime, nullable=True)

    registration_fee = Column(Integer, nullable=True)
    prize_pool = Column(String(255), nullable=True)
    registration_url = Column(String(500), nullable=True)
    official_guide_url = Column(String(500), nullable=True)
    poster_url = Column(String(500), nullable=True)

    extraction_tier = Column(String(50), nullable=False, default="UNKNOWN")
    extraction_score = Column(Float, nullable=False, default=0.0)
    domain = Column(String(100), nullable=False, index=True)

    status = Column(String(30), nullable=False, default="VALIDATED", index=True)
    validation_notes = Column(JSON, nullable=True)

    extracted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    last_verified_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        Index("idx_status_deadline", "status", "deadline_date"),
        Index("idx_domain_status", "domain", "status"),
    )


class DomainCrawlMetrics(Base):
    """Aggregated crawl health statistics per target domain."""

    __tablename__ = "domain_crawl_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    domain = Column(String(100), nullable=False, unique=True)
    total_crawled = Column(Integer, default=0, nullable=False)
    total_success = Column(Integer, default=0, nullable=False)
    total_failed = Column(Integer, default=0, nullable=False)
    total_rate_limited = Column(Integer, default=0, nullable=False)
    last_crawl_at = Column(DateTime, nullable=True)
    last_status_code = Column(Integer, nullable=True)
