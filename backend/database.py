from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

try:
    engine = create_engine(settings.DATABASE_URL)
except Exception as e:
    print(f"Error: {e}")

Base = declarative_base()

SessionLocal = sessionmaker(bind = engine) 


