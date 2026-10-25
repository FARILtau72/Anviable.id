"""Tests for FastAPI crawler management service."""

import pytest
from fastapi.testclient import TestClient
from crawler.api.main import app

client = TestClient(app)


def test_health_check():
    """Verify healthcheck endpoint and DB connectivity."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("healthy", "degraded")
    assert data["service"] == "anviable-crawler-engine"


def test_get_staging_competitions():
    """Verify retrieval of staging competitions."""
    response = client.get("/api/competitions/staging?limit=10")
    assert response.status_code == 200
    items = response.json()
    assert isinstance(items, list)
    if items:
        first = items[0]
        assert "title" in first
        assert "canonical_url" in first
        assert "extraction_score" in first
        assert "status" in first


def test_get_domain_metrics():
    """Verify domain metrics reporting."""
    response = client.get("/api/monitoring/domains")
    assert response.status_code == 200
    metrics = response.json()
    assert isinstance(metrics, list)
    for m in metrics:
        assert "domain" in m
        assert "total_crawled" in m
        assert "total_success" in m
