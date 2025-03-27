from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from database import SessionLocal, engine
import models

class UserBase(BaseModel):
    email: str
        
    class Config:
        from_attributes = True
    
class UserCreate(UserBase):
    name: str
    position: str
    seniority: str
    
class UserLogin(UserBase):
    password: str
    
db = SessionLocal()

app = FastAPI()

@app.get("/users", response_model=List[UserBase], status_code=200)
def root():
    # email = user.email
    # password = user.password
    users = db.query(models.User).all()
    return users
    

@app.post("/login", status_code=200)
def login(user: UserLogin):
    email = user.email
    password = user.password
    userinfo = db.query(models.User).filter(models.User.email == email).first()
    if userinfo is None:
        raise HTTPException(status_code=404, detail="User not found")
    if userinfo.password != password:
        raise HTTPException(status_code=404, detail="Incorrect password")
    return {"message": "Login successful"}
    

