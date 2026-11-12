import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core import config
from .db import init_db
from .api.routes import auth, accounts, transactions, alerts, dashboard, investigations


def get_application() -> FastAPI:
    app = FastAPI(title="MuleTrace AI Backend", version="0.1.0")

    # CORS configuration
    origins = [config.settings.FRONTEND_URL] if config.settings.FRONTEND_URL else ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
    app.include_router(accounts.router, prefix="/api/v1/accounts", tags=["accounts"])
    app.include_router(transactions.router, prefix="/api/v1/transactions", tags=["transactions"])
    app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["alerts"])
    app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])
    app.include_router(investigations.router, prefix="/api/v1/investigations", tags=["investigations"])

    @app.on_event("startup")
    async def on_startup():
        # Initialize DB tables
        init_db.create_all()

    return app


app = get_application()
