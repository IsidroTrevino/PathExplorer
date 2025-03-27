from database import Base
from sqlalchemy import String, Integer, Float, Column

class User(Base):
    __tablename__ = "User"
    id = Column(Integer, primary_key = True, index = True, nullable=False)
    email = Column(String(100), unique = True, index = True, nullable=False)
    hashed_password = Column(String, nullable=False)