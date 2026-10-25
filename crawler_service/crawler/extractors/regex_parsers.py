"""Deterministic, rule-based Indonesian NLP & regex parsers for dates, fees, and education levels."""

import re
from datetime import datetime, timezone
from typing import List, Optional, Tuple

MONTHS_ID = {
    "januari": 1, "jan": 1,
    "februari": 2, "feb": 2,
    "maret": 3, "mar": 3,
    "april": 4, "apr": 4,
    "mei": 5,
    "juni": 6, "jun": 6,
    "juli": 7, "jul": 7,
    "agustus": 8, "agu": 8, "ags": 8,
    "september": 9, "sep": 9,
    "oktober": 10, "okt": 10,
    "november": 11, "nov": 11,
    "desember": 12, "des": 12,
}

# Regex to match Indonesian date representations: e.g. "25 Oktober 2026" or "15 Nov 2026"
DATE_PATTERN = re.compile(
    r"\b(\d{1,2})\s+([a-zA-Z]{3,9})\s+(\d{4})\b",
    re.IGNORECASE
)

# Regex for date range: e.g. "10 s.d. 25 Oktober 2026" or "10 - 25 Oktober 2026"
DATE_RANGE_PATTERN = re.compile(
    r"\b(\d{1,2})\s*(?:s\.?d\.?|-|sampai|hingga)\s*(\d{1,2})\s+([a-zA-Z]{3,9})\s+(\d{4})\b",
    re.IGNORECASE
)

# Regex to extract deadline contextual strings
DEADLINE_CONTEXT_PATTERN = re.compile(
    r"(?:batas\s+akhir|deadline|penutupan|registrasi\s+sampai|terakhir)\s*[:\-]?\s*(\d{1,2}\s+[a-zA-Z]{3,9}\s+\d{4})",
    re.IGNORECASE
)


def parse_indonesian_date(text: str) -> Optional[datetime]:
    """Parse a single Indonesian date string into UTC datetime."""
    if not text:
        return None

    match = DATE_PATTERN.search(text)
    if not match:
        return None

    day_str, month_str, year_str = match.groups()
    month_val = MONTHS_ID.get(month_str.lower())
    if not month_val:
        return None

    try:
        return datetime(int(year_str), month_val, int(day_str), 23, 59, 59, tzinfo=timezone.utc)
    except ValueError:
        return None


def extract_dates_from_text(text: str) -> Tuple[Optional[datetime], Optional[datetime]]:
    """Extract start date and deadline date heuristically from text block.

    Returns (start_date, deadline_date).
    """
    if not text:
        return None, None

    # Check explicit deadline context first
    deadline_match = DEADLINE_CONTEXT_PATTERN.search(text)
    if deadline_match:
        deadline = parse_indonesian_date(deadline_match.group(1))
        if deadline:
            return None, deadline

    # Check date range pattern (e.g. 10 s.d. 25 Oktober 2026)
    range_match = DATE_RANGE_PATTERN.search(text)
    if range_match:
        start_day, end_day, month_str, year_str = range_match.groups()
        month_val = MONTHS_ID.get(month_str.lower())
        if month_val:
            try:
                start_dt = datetime(int(year_str), month_val, int(start_day), 0, 0, 0, tzinfo=timezone.utc)
                end_dt = datetime(int(year_str), month_val, int(end_day), 23, 59, 59, tzinfo=timezone.utc)
                return start_dt, end_dt
            except ValueError:
                pass

    # Fallback: scan all individual dates
    all_dates = []
    for match in DATE_PATTERN.finditer(text):
        d = parse_indonesian_date(match.group(0))
        if d:
            all_dates.append(d)

    if len(all_dates) == 1:
        return None, all_dates[0]
    elif len(all_dates) >= 2:
        sorted_dates = sorted(all_dates)
        return sorted_dates[0], sorted_dates[-1]

    return None, None


def parse_indonesian_fee(text: str) -> Optional[int]:
    """Extract numeric registration fee from Indonesian fee strings.

    Returns:
        0 for Free / Gratis
        int value in Rupiah
        None if not mentioned
    """
    if not text:
        return None

    text_lower = text.lower()

    # Free indicators
    if any(word in text_lower for word in ["gratis", "free", "tidak dipungut biaya", "tanpa biaya", "0 rupiah", "rp 0", "rp. 0"]):
        return 0

    # Currency regex: Rp 50.000 or Rp. 150.000 or IDR 100,000
    currency_match = re.search(r"(?:rp\.?|idr)\s*([\d\.,]+)", text_lower)
    if currency_match:
        raw_num = currency_match.group(1)
        # Normalize: strip dot and comma
        clean_num = re.sub(r"[^\d]", "", raw_num)
        if clean_num.isdigit():
            val = int(clean_num)
            # Sanity check: registration fees are usually under 50 million rupiah
            if 1000 <= val <= 50_000_000:
                return val

    # Shorthand: 50k, 100rb
    k_match = re.search(r"\b(\d+)\s*(?:k|rb)\b", text_lower)
    if k_match:
        return int(k_match.group(1)) * 1000

    return None


def parse_education_levels(text: str) -> List[str]:
    """Detect targeted Indonesian education levels."""
    if not text:
        return ["UMUM"]

    levels = set()
    text_upper = text.upper()

    if re.search(r"\bSMK\b", text_upper):
        levels.add("SMK")
    if re.search(r"\bSMA\b", text_upper):
        levels.add("SMA")
    if re.search(r"\bMA\b", text_upper):
        levels.add("MA")
    if re.search(r"\b(MAHASISWA|S1|D3|D4|KAMPUS|PERGURUAN TINGGI)\b", text_upper):
        levels.add("MAHASISWA")
    if re.search(r"\bSMP\b", text_upper):
        levels.add("SMP")
    if re.search(r"\bSD\b", text_upper):
        levels.add("SD")

    return sorted(list(levels)) if levels else ["UMUM"]


def infer_competition_category(title: str, description: str) -> str:
    """Classify competition category using deterministic keyword heuristics."""
    combined = f"{title} {description}".lower()

    if any(k in combined for k in ["robot", "hackathon", "coding", "software", "informatika", "iot", "web development", "cyber", "programming", "rpl"]):
        return "TEKNOLOGI_RPL"
    if any(k in combined for k in ["desain", "poster", "lukis", "seni", "fls2n", "fotografi", "cipta lagu", "animasi", "videografi"]):
        return "DESAIN_SENI"
    if any(k in combined for k in ["olimpiade sains", "osn", "matematika", "fisika", "biologi", "kimia", "astronomi", "lkti", "karya tulis", "karya ilmiah", "penelitian ilmiah", "kebumian", "riset"]):
        return "SAINS_MATEMATIKA"
    if any(k in combined for k in ["bisnis", "startup", "akuntansi", "ekonomi", "business plan", "kewirausahaan", "wirausaha", "finance", "syariah"]):
        return "BISNIS_AKUNTANSI"
    if any(k in combined for k in ["debat", "english speech", "nsdc", "storytelling", "esai", "puisi", "bahasa jepang", "kepenulisan"]):
        return "BAHASA_DEBAT"
    if any(k in combined for k in ["lks", "vokasi", "otomotif", "mesin", "tata boga", "kejuruan", "elektronika"]):
        return "LOKAL_VOKASI"

    return "UMUM"
