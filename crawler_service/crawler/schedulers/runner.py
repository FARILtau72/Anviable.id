"""Periodic crawl scheduler using APScheduler and Scrapy CrawlerProcess."""

import logging
from apscheduler.schedulers.blocking import BlockingScheduler
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from crawler.spiders.sample_competition_spider import PuspresnasSampleSpider

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("anviable.scheduler")


def run_scheduled_crawls():
    """Execute scheduled competition crawler jobs."""
    logger.info("Executing scheduled crawling sweep across curated portals...")
    settings = get_project_settings()
    process = CrawlerProcess(settings)
    process.crawl(PuspresnasSampleSpider)
    process.start()
    logger.info("Crawling sweep completed.")


def start_scheduler():
    """Start blocking periodic scheduler."""
    scheduler = BlockingScheduler()

    # Schedule sweep every 12 hours
    scheduler.add_job(
        run_scheduled_crawls,
        "interval",
        hours=12,
        id="competition_crawler_job",
        replace_existing=True,
    )

    logger.info("Anviable Crawler Scheduler started (interval: 12h). Press Ctrl+C to exit.")
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logger.info("Scheduler stopped.")


if __name__ == "__main__":
    start_scheduler()
