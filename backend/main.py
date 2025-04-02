from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from auth import create_access_token
from schemas import UserBase, UserCreate, EmployeeRegistered, UserLogin, User, UserEdit
from database import SessionLocal, engine
from dependencies import get_current_user
import models
import bcrypt


    
db = SessionLocal()

app = FastAPI()

def hash_password(password: str) -> bytes:
    bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(bytes, salt)
    return hashed

def verify_password(plain_password: str, hashed_password: bytes) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)


@app.post("/token", status_code=200)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    email = form_data.username
    password = form_data.password
    user = db.query(models.User).filter(models.User.email == email).first()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not verify_password(password, user.hashed_password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    # Aquí, en lugar de pasar "sub": user.email, pasamos el id
    access_token = create_access_token(data={"id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}  

@app.post("/register", status_code=200)
def register(user: UserCreate):
    maybe_user = db.query(models.User).filter(models.User.email == user.email).first()
    if maybe_user is not None:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = hash_password(user.password).decode('utf-8')
    new_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    user_id = db.query(models.User).filter(models.User.email == user.email).first().id
    new_employee = models.Employee(name=user.name, position=user.position, seniority=user.seniority, user_id=user_id, rol=user.rol)
    db.add(new_employee)
    db.commit()
    
    access_token = create_access_token(data={"id": user_id})
    
    return {
        "message": "User registered successfully",
        "user_id": user_id,
        "access_token": access_token,
        "token_type": "bearer"
    }
    

@app.get("/users/{user_id}", response_model=EmployeeRegistered, status_code=200)
def getUserInfo(user_id: int, current_user: User = Depends(get_current_user)):
    
    userRequest = db.query(models.User).filter(models.User.id == current_user.id).first()
    
    employeeRequest = db.query(models.Employee).filter(models.Employee.user_id == userRequest.id).first()
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if user.id != userRequest.id and employeeRequest.rol != "Manager":
        raise HTTPException(status_code=403, detail="Not enough permissions ")
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    employee = db.query(models.Employee).filter(models.Employee.user_id == user.id).first()
    
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    
    return EmployeeRegistered(id=user.id, email=user.email, name=employee.name, position=employee.position, seniority=employee.seniority, rol=employee.rol)

@app.get("/my-info", response_model=EmployeeRegistered, status_code=200)
def getMyInfo(current_user: User = Depends(get_current_user)):
    
    user= db.query(models.User).filter(models.User.id == current_user.id).first()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    employee = db.query(models.Employee).filter(models.Employee.user_id == user.id).first()
    
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    
    return EmployeeRegistered(id=user.id, email=user.email, name=employee.name, position=employee.position, seniority=employee.seniority, rol=employee.rol)



@app.put("/edit", response_model=UserEdit, status_code=200)
def edit_user(user_edit: UserEdit, current_user: User = Depends(get_current_user)):

    user_db = db.query(models.User).filter(models.User.id== current_user.id).first()
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    employee_db = db.query(models.Employee).filter(models.Employee.user_id == user_db.id).first()
    if not employee_db:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    update_data = user_edit.model_dump(exclude_unset=True)
    
    user_update = {}
    employee_update = {}
    
    if "email" in update_data:
        user_update["email"] = update_data["email"]
    if update_data.get("email") != user_db.email:
        maybe_user = db.query(models.User).filter(models.User.email == update_data["email"]).first()
        if maybe_user:
            raise HTTPException(status_code=400, detail="Email already registered")

    if update_data.get("email") == "" or update_data.get("email") == None or update_data.get("email") == "string":
        raise HTTPException(status_code=400, detail="Email cannot be empty")
        
    if "password" in update_data:
        # Hasheamos la nueva contraseña
        hashed = hash_password(update_data["password"]).decode("utf-8")
        user_update["hashed_password"] = hashed
    if "name" in update_data:
        employee_update["name"] = update_data["name"]
    if "position" in update_data:
        employee_update["position"] = update_data["position"]
    if "seniority" in update_data:
        employee_update["seniority"] = update_data["seniority"]
    
    if user_update:
        db.query(models.User).filter(models.User.id == user_db.id).update(user_update)
    
    if employee_update:
        db.query(models.Employee).filter(models.Employee.user_id == user_db.id).update(employee_update)
    
    db.commit()
    
    return {"message": "User updated successfully"}