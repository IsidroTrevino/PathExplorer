from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

try:
    engine = create_engine("postgresql://adminpathexplorer:amoaleo<3@pathexplorer.postgres.database.azure.com:5432/pathexplorer?sslmode=require")
except Exception as e:
    print(f"Error: {e}")

Base = declarative_base()

SessionLocal = sessionmaker(bind = engine) 


