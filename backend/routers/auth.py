from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from dependencies import get_db
from schemas import UserCreate, UserBase
from models import User, Employee, OTP
from utils import create_access_token
from utils import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email = form_data.username.strip().lower()
    password = form_data.password
    print(f"Login attempt for email: {email}")
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(password, user.hashed_password.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Incorrect password")
    access_token = create_access_token(data={"id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    email = user.email.strip().lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = hash_password(user.password).decode('utf-8')
    new_user = User(email=email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    print("User created successfully")
    user_id = db.query(User).filter(User.email == email).first().id
    new_employee = Employee(
        user_id=user_id,
        name=user.name,
        last_name_1=user.last_name_1,
        last_name_2=user.last_name_2,
        phone_number=user.phone_number,
        location=user.location,
        capability=user.capability,
        position=user.position,
        seniority=user.seniority,
        role=user.role
    )
    db.add(new_employee)
    db.commit()
    employee_id = db.query(Employee).filter(Employee.user_id == user_id).first().employee_id
    print("User registered successfully")
    access_token = create_access_token(data={"id": user_id})
    return {"message": "User registered successfully", "user_id": user_id, "employee_id":employee_id,"access_token": access_token, "token_type": "bearer"}
