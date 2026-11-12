from ..db.database import Base, engine

def create_all():
    """Create all database tables based on SQLAlchemy models."""
    Base.metadata.create_all(bind=engine)
