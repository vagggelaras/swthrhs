"""
Reads the scraped prices.json and produces a structured JSON file
for the frontend at Frontend/public/data/prices.json
"""
import json
from datetime import datetime, timezone
from collections import defaultdict
from pathlib import Path

SRC = Path(__file__).parent / "prices.json"
DEST = Path(__file__).parent / ".." / "Frontend" / "public" / "data" / "prices.json"

with open(SRC, "r", encoding="utf-8") as f:
    raw = json.load(f)

# Group plans by provider
by_provider = defaultdict(list)
for entry in raw:
    by_provider[entry["provider"]].append({
        "plan": entry["plan"],
        "tariff_type": entry["tariff_type"],
        "price_per_kwh": entry["price_per_kwh"],
        "monthly_fee_eur": entry["monthly_fee_eur"],
    })

# Sort providers alphabetically, plans by price (nulls last)
providers = []
for name in sorted(by_provider.keys()):
    plans = sorted(
        by_provider[name],
        key=lambda p: (p["price_per_kwh"] is None, p["price_per_kwh"] or 999),
    )
    providers.append({
        "name": name,
        "plan_count": len(plans),
        "plans": plans,
    })

output = {
    "scraped_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "source": "energycost.gr",
    "total_plans": len(raw),
    "total_providers": len(providers),
    "providers": providers,
}

DEST.parent.mkdir(parents=True, exist_ok=True)
with open(DEST, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Written {len(providers)} providers / {len(raw)} plans to {DEST.resolve()}")
