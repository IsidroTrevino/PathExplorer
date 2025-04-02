from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

try:
<<<<<<< HEAD
    engine = create_engine(settings.DATABASE_URL)
=======
    engine = create_engine("postgresql://adminpathexplorer:amoaleo<3@pathexplorer.postgres.database.azure.com:5432/pathexplorer?sslmode=require")
>>>>>>> parent of cee7673 (API v1)
except Exception as e:
    print(f"Error: {e}")

Base = declarative_base()

SessionLocal = sessionmaker(bind = engine) 


