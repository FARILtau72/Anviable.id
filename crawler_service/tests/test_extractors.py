"""Automated unit test suite verifying adaptive extractors, regex parsers, and validation rules."""

from pathlib import Path
from parsel import Selector
from crawler.extractors.jsonld import JsonLdExtractor
from crawler.extractors.opengraph import OpenGraphExtractor
from crawler.extractors.regex_parsers import (
    parse_indonesian_date,
    extract_dates_from_text,
    parse_indonesian_fee,
    parse_education_levels,
    infer_competition_category,
)
from crawler.pipelines.deduplication import canonicalize_url, compute_content_fingerprint
from crawler.validators.schemas import CompetitionValidatedModel, ExtractionStatus

FIXTURES_DIR = Path(__file__).parent / "fixtures"


def test_regex_date_parser():
    """Test Indonesian single and range date parsing."""
    d1 = parse_indonesian_date("Batas pendaftaran 25 Oktober 2026")
    assert d1 is not None
    assert d1.year == 2026
    assert d1.month == 10
    assert d1.day == 25

    start, end = extract_dates_from_text("Pendaftaran dibuka mulai 10 s.d. 28 November 2026")
    assert start is not None and end is not None
    assert start.day == 10
    assert end.day == 28
    assert end.month == 11
    assert end.year == 2026


def test_regex_fee_parser():
    """Test Indonesian currency and free fee recognition."""
    assert parse_indonesian_fee("Pendaftaran Gratis!") == 0
    assert parse_indonesian_fee("Biaya pendaftaran: Free untuk siswa SMK") == 0
    assert parse_indonesian_fee("HTM: Rp 50.000 per tim") == 50000
    assert parse_indonesian_fee("Rp. 150.000") == 150000
    assert parse_indonesian_fee("Biaya: 50k") == 50000
    assert parse_indonesian_fee("Belum ada informasi biaya") is None


def test_education_level_and_category_inference():
    """Test level detection and category classifier."""
    levels = parse_education_levels("Terbuka untuk pelajar SMA, SMK, dan MA kelas 10-12")
    assert "SMA" in levels
    assert "SMK" in levels
    assert "MA" in levels

    cat1 = infer_competition_category("Hackathon IoT SMK 2026", "Pemrograman robotik dan web")
    assert cat1 == "TEKNOLOGI_RPL"

    cat2 = infer_competition_category("Olimpiade Matematika Nasional", "Kompetisi sains")
    assert cat2 == "SAINS_MATEMATIKA"


def test_jsonld_extractor():
    """Verify Tier 1 JSON-LD Schema.org extraction with local HTML fixture."""
    fixture_path = FIXTURES_DIR / "jsonld_sample.html"
    html_content = fixture_path.read_text(encoding="utf-8")
    selector = Selector(html_content)

    extractor = JsonLdExtractor()
    data = extractor.extract(selector, "https://sains-nasional.id/event-1")

    assert data is not None
    assert data["title"] == "Olimpiade Sains & Matematika Nasional 2026"
    assert data["organizer"] == "Pusat Riset Sains Indonesia"
    assert data["registration_fee"] == 0
    assert data["extraction_tier"] == "JSON_LD"
    assert data["extraction_score"] >= 0.75
    assert data["poster_url"] == "https://sains-nasional.id/poster.jpg"


def test_opengraph_extractor():
    """Verify Tier 2 OpenGraph extraction with local HTML fixture."""
    fixture_path = FIXTURES_DIR / "opengraph_sample.html"
    html_content = fixture_path.read_text(encoding="utf-8")
    selector = Selector(html_content)

    extractor = OpenGraphExtractor()
    data = extractor.extract(selector, "https://hackathon-smk.id/info")

    assert data is not None
    assert data["title"] == "Hackathon Vokasi SMK Indonesia 2026"
    assert data["organizer"] == "Direktorat Mitras DUDI"
    assert data["registration_fee"] == 50000
    assert "SMK" in data["target_levels"]
    assert data["deadline_date"] is not None
    assert data["deadline_date"].month == 11
    assert data["deadline_date"].day == 28


def test_deduplication_pipeline():
    """Verify canonical URL cleansing and SHA-256 fingerprint generation."""
    dirty_url = "https://example.com/lomba?utm_source=instagram&utm_medium=bio&fbclid=123"
    clean_url = canonicalize_url(dirty_url)
    assert clean_url == "https://example.com/lomba"

    fp1 = compute_content_fingerprint("Lomba Web 2026", "SMK 1", clean_url)
    fp2 = compute_content_fingerprint("lomba web 2026", "smk 1", clean_url)
    assert fp1 == fp2  # Case insensitive fingerprint match


def test_pydantic_validation_rules():
    """Verify Pydantic model validation and sanity flags."""
    # Valid item
    model = CompetitionValidatedModel(
        canonical_url="https://example.com/lomba-1",
        source_url="https://example.com/lomba-1",
        fingerprint="dummy_fp_123",
        title="Olimpiade Komputer Nasional 2026",
        organizer="Kemendikbud",
        domain="example.com",
    )
    # Since deadline_date is None, model should automatically flag for review without throwing
    assert model.status == ExtractionStatus.FLAGGED_FOR_REVIEW
    assert "missing_deadline_date" in model.validation_notes
