from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from utils import verify_token
from schemas import TokenData
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL 

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autoflush=False, bind=engine)

Base = declarative_base()

# Dependency para usar en endpoints

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    user_id: int = payload.get("id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    return TokenData(id=user_id)