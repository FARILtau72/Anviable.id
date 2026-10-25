"""Tests for deduplication and validation pipelines."""

import pytest
from datetime import datetime, timezone
from scrapy.exceptions import DropItem
from crawler.items import CompetitionRawItem
from crawler.pipelines.deduplication import DeduplicationPipeline, canonicalize_url, compute_content_fingerprint
from crawler.pipelines.validation import PydanticValidationPipeline


def test_url_canonicalization():
    """Verify UTM parameters, fbclid, and trailing slashes are stripped."""
    dirty_url = "https://pusatprestasinasional.kemdikbud.go.id/event-2026/?utm_source=ig&utm_medium=stories&fbclid=123"
    clean = canonicalize_url(dirty_url)
    assert clean == "https://pusatprestasinasional.kemdikbud.go.id/event-2026"
    assert "utm_" not in clean
    assert "fbclid" not in clean


def test_content_fingerprint_consistency():
    """Verify deterministic SHA-256 fingerprint generation."""
    fp1 = compute_content_fingerprint("Olimpiade Sains 2026", "Kemdikbud", "https://puspresnas.id/osn-2026")
    fp2 = compute_content_fingerprint("olimpiade sains 2026!", "kemdikbud", "https://puspresnas.id/osn-2026?utm_source=twitter")
    assert fp1 == fp2


def test_deduplication_pipeline_drops_duplicate():
    """Verify deduplication pipeline drops consecutive duplicate items."""
    pipeline = DeduplicationPipeline()

    item1 = CompetitionRawItem()
    item1["title"] = "Hackathon Nasional 2026"
    item1["organizer"] = "Naviable"
    item1["canonical_url"] = "https://naviable.id/hackathon-2026"

    item2 = CompetitionRawItem()
    item2["title"] = "Hackathon Nasional 2026"
    item2["organizer"] = "Naviable"
    item2["canonical_url"] = "https://naviable.id/hackathon-2026?utm_source=wa"

    # First item passes
    res1 = pipeline.process_item(item1, None)
    assert res1["fingerprint"] is not None

    # Second item must be dropped
    with pytest.raises(DropItem) as exc_info:
        pipeline.process_item(item2, None)
    assert "duplicate" in str(exc_info.value).lower()


def test_pydantic_validation_pipeline_invalid_item():
    """Verify invalid items (e.g. missing title or invalid dates) are dropped."""
    pipeline = PydanticValidationPipeline()

    # Item with deadline before start date
    invalid_item = CompetitionRawItem()
    invalid_item["title"] = "Lomba Fiktif"
    invalid_item["organizer"] = "Tester"
    invalid_item["canonical_url"] = "https://test.com/lomba"
    invalid_item["source_url"] = "https://test.com/lomba"
    invalid_item["start_date"] = datetime(2026, 12, 1, tzinfo=timezone.utc)
    invalid_item["deadline_date"] = datetime(2026, 1, 1, tzinfo=timezone.utc)  # Before start date!

    with pytest.raises(DropItem):
        pipeline.process_item(invalid_item, None)
