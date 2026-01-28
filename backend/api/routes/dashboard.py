"""Dashboard endpoints for metrics and real-time data."""

from datetime import datetime
from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ChannelStatus(BaseModel):
    """Channel status model."""

    name: str
    status: str  # "online", "offline", "degraded"
    last_sync: str
    metrics: dict[str, Any]


class DashboardMetrics(BaseModel):
    """Dashboard metrics model."""

    total_sales: float
    active_promotions: int
    pending_alerts: int
    channel_status: dict[str, bool]


@router.get("/metrics")
async def get_dashboard_metrics():
    """Get main dashboard metrics."""
    return {
        "timestamp": datetime.now().isoformat(),
        "metrics": {
            "total_sales": {
                "value": 285_000_000,
                "change": 0.12,
                "period": "7d",
            },
            "active_promotions": {
                "value": 4,
                "by_channel": {
                    "oliveyoung": 2,
                    "coupang": 1,
                    "naver": 1,
                    "kakao": 0,
                },
            },
            "pending_alerts": {
                "value": 3,
                "by_severity": {
                    "critical": 1,
                    "warning": 2,
                },
            },
            "channel_health": {
                "oliveyoung": {"status": "online", "sync_status": "current"},
                "coupang": {"status": "online", "sync_status": "current"},
                "naver": {"status": "online", "sync_status": "current"},
                "kakao": {"status": "degraded", "sync_status": "delayed"},
            },
        },
    }


@router.get("/channels")
async def get_channel_overview():
    """Get overview of all channels."""
    return {
        "timestamp": datetime.now().isoformat(),
        "channels": [
            {
                "name": "Oliveyoung",
                "code": "oliveyoung",
                "status": "online",
                "metrics": {
                    "gmv_7d": 95_000_000,
                    "orders_7d": 5200,
                    "active_deals": 2,
                    "ranking_position": 12,
                },
            },
            {
                "name": "Coupang",
                "code": "coupang",
                "status": "online",
                "metrics": {
                    "gmv_7d": 85_000_000,
                    "orders_7d": 5800,
                    "active_deals": 1,
                    "rocket_status": "healthy",
                },
            },
            {
                "name": "Naver",
                "code": "naver",
                "status": "online",
                "metrics": {
                    "gmv_7d": 65_000_000,
                    "orders_7d": 3200,
                    "store_grade": "파워",
                    "live_scheduled": 1,
                },
            },
            {
                "name": "Kakao",
                "code": "kakao",
                "status": "degraded",
                "metrics": {
                    "gmv_7d": 40_000_000,
                    "orders_7d": 1000,
                    "gift_ranking": 45,
                    "channel_friends": 125000,
                },
            },
        ],
    }


@router.get("/alerts")
async def get_active_alerts():
    """Get active alerts."""
    return {
        "timestamp": datetime.now().isoformat(),
        "total": 3,
        "alerts": [
            {
                "id": "alert_001",
                "type": "inventory",
                "severity": "critical",
                "title": "Low Stock Alert",
                "message": "Retinol Night Cream at critical level (3 days supply)",
                "channel": "oliveyoung",
                "created_at": "2026-01-29T08:00:00Z",
                "acknowledged": False,
            },
            {
                "id": "alert_002",
                "type": "price",
                "severity": "warning",
                "title": "MAP Violation Detected",
                "message": "Unauthorized seller on Coupang selling 20% below MAP",
                "channel": "coupang",
                "created_at": "2026-01-28T15:30:00Z",
                "acknowledged": True,
            },
            {
                "id": "alert_003",
                "type": "channel",
                "severity": "warning",
                "title": "Sync Delay",
                "message": "Kakao data sync delayed by 2 hours",
                "channel": "kakao",
                "created_at": "2026-01-29T10:00:00Z",
                "acknowledged": False,
            },
        ],
    }


@router.get("/promotions")
async def get_active_promotions():
    """Get active and upcoming promotions."""
    return {
        "timestamp": datetime.now().isoformat(),
        "active": [
            {
                "id": "promo_001",
                "name": "Winter Skincare Flash Sale",
                "status": "active",
                "channels": ["oliveyoung", "coupang"],
                "start_date": "2026-01-25",
                "end_date": "2026-02-05",
                "discount": "20%",
                "progress": {
                    "gmv": 28_500_000,
                    "target": 50_000_000,
                    "achievement": 0.57,
                },
            },
        ],
        "upcoming": [
            {
                "id": "promo_002",
                "name": "Lunar New Year Gift Set",
                "status": "scheduled",
                "channels": ["kakao", "naver"],
                "start_date": "2026-02-10",
                "end_date": "2026-02-28",
                "discount": "15%",
            },
        ],
    }


@router.get("/calendar")
async def get_promotion_calendar():
    """Get promotion calendar view."""
    return {
        "timestamp": datetime.now().isoformat(),
        "view": "month",
        "current_month": "2026-02",
        "events": [
            {
                "date": "2026-02-05",
                "type": "promotion_end",
                "title": "Winter Flash Sale ends",
            },
            {
                "date": "2026-02-10",
                "type": "promotion_start",
                "title": "Lunar New Year Gift Set",
            },
            {
                "date": "2026-02-15",
                "type": "deadline",
                "title": "Q2 Planning submission",
            },
            {
                "date": "2026-02-20",
                "type": "event",
                "title": "Oliveyoung Festa application deadline",
            },
        ],
    }


@router.post("/alerts/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    """Acknowledge an alert."""
    return {
        "alert_id": alert_id,
        "acknowledged": True,
        "acknowledged_at": datetime.now().isoformat(),
    }
