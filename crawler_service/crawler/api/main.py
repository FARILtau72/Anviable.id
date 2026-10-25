"""FastAPI service for Naviable Crawler Engine management and Next.js integration."""

import os
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, HttpUrl
from sqlalchemy.orm import Session
from sqlalchemy import desc, text
from crawler.storage.database import get_db_session, init_db
from crawler.storage.models import CrawledCompetitionStaging, DomainCrawlMetrics


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Ensure database tables exist on startup."""
    try:
        init_db()
    except Exception as e:
        print(f"Startup database initialization warning: {e}")
    yield


app = FastAPI(
    title="Naviable.id Crawler Service API",
    version="0.1.0",
    description="REST API for managing crawled competitions staging, moderation approvals, and metrics.",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check(db: Session = Depends(get_db_session)):
    """Healthcheck endpoint verifying service and TiDB connection."""
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"unhealthy: {e}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "service": "naviable-crawler-engine",
        "database": db_status,
    }


class CompetitionStagingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    organizer: str
    category: str
    target_levels: List[str]
    registration_fee: Optional[int]
    deadline_date: Optional[str]
    status: str
    extraction_tier: str
    extraction_score: float
    canonical_url: str
    source_url: str
    validation_notes: Optional[List[str]]


@app.get("/api/competitions/staging", response_model=List[CompetitionStagingResponse])
def get_staging_competitions(
    status: Optional[str] = Query(None, description="Filter by status: VALIDATED, FLAGGED_FOR_REVIEW, EXPIRED"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db_session),
):
    """Retrieve crawled competitions awaiting review or staging."""
    query = db.query(CrawledCompetitionStaging)
    if status and status.upper() != "ALL":
        query = query.filter(CrawledCompetitionStaging.status == status.upper())

    results = query.order_by(desc(CrawledCompetitionStaging.extracted_at)).offset(offset).limit(limit).all()

    # Format dates to ISO strings
    formatted = []
    for r in results:
        formatted.append(
            CompetitionStagingResponse(
                id=r.id,
                title=r.title,
                organizer=r.organizer,
                category=r.category,
                target_levels=r.target_levels if isinstance(r.target_levels, list) else [],
                registration_fee=r.registration_fee,
                deadline_date=r.deadline_date.isoformat() if r.deadline_date else None,
                status=r.status,
                extraction_tier=r.extraction_tier,
                extraction_score=r.extraction_score,
                canonical_url=r.canonical_url,
                source_url=r.source_url,
                validation_notes=r.validation_notes if isinstance(r.validation_notes, list) else [],
            )
        )
    return formatted


@app.post("/api/competitions/{item_id}/approve")
def approve_competition(item_id: str, db: Session = Depends(get_db_session)):
    """Approve a staged competition for publication into Naviable.id core directory."""
    item = db.query(CrawledCompetitionStaging).filter_by(id=item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Staged competition not found")

    item.status = "VERIFIED_ACTIVE"
    db.commit()

    return {
        "success": True,
        "message": f"Competition '{item.title}' marked as VERIFIED_ACTIVE",
        "id": item.id,
    }


@app.get("/api/monitoring/domains")
def get_domain_metrics(db: Session = Depends(get_db_session)):
    """Retrieve extraction health and rate-limiting metrics per target domain."""
    metrics = db.query(DomainCrawlMetrics).order_by(desc(DomainCrawlMetrics.total_crawled)).all()
    return [
        {
            "domain": m.domain,
            "total_crawled": m.total_crawled,
            "total_success": m.total_success,
            "total_failed": m.total_failed,
            "total_rate_limited": m.total_rate_limited,
            "last_crawl_at": m.last_crawl_at.isoformat() if m.last_crawl_at else None,
            "last_status_code": m.last_status_code,
        }
        for m in metrics
    ]
