"""Data validation models and schema rules using Pydantic v2."""

from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, HttpUrl, field_validator, model_validator


class EducationLevel(str, Enum):
    SD = "SD"
    SMP = "SMP"
    SMA = "SMA"
    SMK = "SMK"
    MA = "MA"
    MAHASISWA = "MAHASISWA"
    UMUM = "UMUM"


class CompetitionCategory(str, Enum):
    TEKNOLOGI_RPL = "TEKNOLOGI_RPL"
    DESAIN_SENI = "DESAIN_SENI"
    SAINS_MATEMATIKA = "SAINS_MATEMATIKA"
    BISNIS_AKUNTANSI = "BISNIS_AKUNTANSI"
    BAHASA_DEBAT = "BAHASA_DEBAT"
    LOKAL_VOKASI = "LOKAL_VOKASI"
    UMUM = "UMUM"


class ExtractionStatus(str, Enum):
    VALIDATED = "VALIDATED"
    FLAGGED_FOR_REVIEW = "FLAGGED_FOR_REVIEW"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"


class CompetitionValidatedModel(BaseModel):
    """Normalized, strictly validated competition schema."""

    # Identifiers
    canonical_url: HttpUrl
    source_url: HttpUrl
    fingerprint: str = Field(description="SHA-256 content deduplication hash")

    # Core attributes
    title: str = Field(min_length=5, max_length=255)
    organizer: str = Field(min_length=3, max_length=255)
    description: str = Field(default="")
    category: CompetitionCategory = Field(default=CompetitionCategory.UMUM)
    target_levels: List[EducationLevel] = Field(default_factory=lambda: [EducationLevel.UMUM])

    # Temporal info (Strict: NO invented dates)
    start_date: Optional[datetime] = None
    deadline_date: Optional[datetime] = None
    event_date: Optional[datetime] = None

    # Financials & URLs
    registration_fee: Optional[int] = Field(default=None, ge=0)
    prize_pool: Optional[str] = None
    registration_url: Optional[HttpUrl] = None
    official_guide_url: Optional[HttpUrl] = None
    poster_url: Optional[HttpUrl] = None

    # Extraction metadata
    extracted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_verified_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    extraction_tier: str = Field(default="UNKNOWN")
    extraction_score: float = Field(default=0.0, ge=0.0, le=1.0)
    domain: str

    # Status flags
    status: ExtractionStatus = Field(default=ExtractionStatus.VALIDATED)
    validation_notes: List[str] = Field(default_factory=list)

    @field_validator("title", "organizer", mode="before")
    @classmethod
    def clean_text_whitespace(cls, v: str) -> str:
        if isinstance(v, str):
            return " ".join(v.split()).strip()
        return v

    @model_validator(mode="after")
    def validate_temporal_sanity(self) -> "CompetitionValidatedModel":
        now = datetime.now(timezone.utc)

        # Flag if deadline is missing
        if self.deadline_date is None:
            self.status = ExtractionStatus.FLAGGED_FOR_REVIEW
            self.validation_notes.append("missing_deadline_date")

        # Flag if deadline is in the past
        if self.deadline_date is not None:
            # Normalize to UTC comparison if aware/naive
            d_utc = self.deadline_date if self.deadline_date.tzinfo else self.deadline_date.replace(tzinfo=timezone.utc)
            if d_utc < now:
                self.status = ExtractionStatus.EXPIRED
                self.validation_notes.append("deadline_already_passed")

        # Sanity check: start_date cannot be later than deadline
        if self.start_date and self.deadline_date:
            if self.start_date > self.deadline_date:
                self.status = ExtractionStatus.FLAGGED_FOR_REVIEW
                self.validation_notes.append("start_date_after_deadline")

        # Sanity check: registration fee negative guard
        if self.registration_fee is not None and self.registration_fee < 0:
            self.registration_fee = None
            self.validation_notes.append("invalid_negative_fee_nulled")

        return self
