from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from schemas import User, UserEdit, EmployeeRegistered, RoleDeveloper, ProfileResponse, ProjectInfo, CertificationResponse, SkillResponse
from models import User as UserModel, Employee, RoleDeveloper, Project, Certification, Skill, Assignment
from dependencies import get_current_user, get_db
from utils import hash_password

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/my-info", response_model=EmployeeRegistered)
def get_my_info(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == current_user.id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    employee = db.query(Employee).filter(Employee.user_id == user.id).first()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return EmployeeRegistered(
        user_id=user.id,
        employee_id=employee.employee_id,
        email=user.email,
        name=employee.name,
        last_name_1=employee.last_name_1,
        last_name_2=employee.last_name_2,
        phone_number=employee.phone_number,
        location=employee.location,
        capability=employee.capability,
        position=employee.position,
        seniority=employee.seniority,
        role=employee.role
    )


@router.put("/edit", response_model=UserEdit)
def edit_user(user_edit: UserEdit, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_db = db.query(UserModel).filter(UserModel.id == current_user.id).first()
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")
    employee_db = db.query(Employee).filter(Employee.user_id == user_db.id).first()
    if not employee_db:
        raise HTTPException(status_code=404, detail="Employee not found")

    update_data = user_edit.model_dump(exclude_unset=True)
    user_update = {}
    employee_update = {}

    if "email" in update_data:
        user_update["email"] = update_data["email"]
        if update_data.get("email") != user_db.email:
            maybe_user = db.query(UserModel).filter(UserModel.email == update_data["email"]).first()
            if maybe_user:
                raise HTTPException(status_code=400, detail="Email already registered")
        if not update_data["email"] or update_data["email"] == "string":
            raise HTTPException(status_code=400, detail="Email cannot be empty")

    if "password" in update_data:
        user_update["hashed_password"] = hash_password(update_data["password"]).decode("utf-8")

    for field in ["name", "last_name_1", "last_name_2", "phone_number", "location", "capability", "role", "position", "seniority"]:
        if field in update_data:
            employee_update[field] = update_data[field]

    if user_update:
        db.query(UserModel).filter(UserModel.id == user_db.id).update(user_update)
    if employee_update:
        db.query(Employee).filter(Employee.user_id == user_db.id).update(employee_update)

    db.commit()
    return {"message": "User updated successfully"}
    
