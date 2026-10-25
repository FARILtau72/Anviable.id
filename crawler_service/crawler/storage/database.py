"""Database engine and session management for TiDB Cloud Serverless."""

import os
import ssl
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
from crawler.storage.models import Base

load_dotenv()


def get_database_url() -> str:
    url = os.getenv("DATABASE_URL")
    if not url:
        # Fallback build from individual env vars
        user = os.getenv("TIDB_USER", "root")
        pwd = os.getenv("TIDB_PASSWORD", "")
        host = os.getenv("TIDB_HOST", "localhost")
        port = os.getenv("TIDB_PORT", "4000")
        db = os.getenv("TIDB_DATABASE", "test")
        url = f"mysql+pymysql://{user}:{pwd}@{host}:{port}/{db}"

    # Ensure pymysql dialect
    if url.startswith("mysql://"):
        url = url.replace("mysql://", "mysql+pymysql://", 1)

    return url


# Engine configuration tailored for TiDB Cloud Serverless
engine = create_engine(
    get_database_url(),
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,  # Recycle connections before serverless idle timeout
    pool_pre_ping=True,  # Test connection viability before handing out to worker
    connect_args={
        "ssl": {
            "check_hostname": True,
            "verify_mode": ssl.CERT_REQUIRED,
        } if "tidbcloud.com" in get_database_url() else {}
    },
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db() -> None:
    """Create all required staging tables in TiDB if they do not exist."""
    Base.metadata.create_all(bind=engine)


def get_db_session() -> Generator[Session, None, None]:
    """Yield a database session with automatic commit / rollback."""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
