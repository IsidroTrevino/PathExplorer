from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from schemas import EmployeeRole, EmployeeList, EmployeeRegistered, User
from models import Employee, User as UserModel
from dependencies import get_current_user, get_db
from sqlalchemy import or_, func

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=Page[EmployeeList])
def get_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    role: EmployeeRole = None,
    alphabetical: bool = False,
    search: str = None
):
    # Verificación de permisos
    userRequest = db.query(UserModel).filter(UserModel.id == current_user.id).first()
    employeeRequest = db.query(Employee).filter(Employee.user_id == userRequest.id).first()

    if employeeRequest.role != EmployeeRole.Manager:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Base query
    query = db.query(Employee)

    # Filtro por rol
    if role:
        query = query.filter(Employee.role == role)

    # Filtro por búsqueda
    if search:
        search_term = f"%{search.lower()}%"
        full_name = func.lower(func.concat(Employee.name, ' ', Employee.last_name_1, ' ', Employee.last_name_2))
        query = query.filter(
            or_(
                func.lower(Employee.name).ilike(search_term),
                func.lower(Employee.last_name_1).ilike(search_term),
                func.lower(Employee.last_name_2).ilike(search_term),
                func.lower(Employee.phone_number).ilike(search_term),
                func.lower(Employee.location).ilike(search_term),
                func.lower(Employee.capability).ilike(search_term),
                func.lower(Employee.position).ilike(search_term),
                full_name.ilike(search_term)
            )
        )

    # Orden alfabético
    if alphabetical:
        query = query.order_by(Employee.last_name_1.asc())

    return paginate(query)


@router.get("/{user_id}", response_model=EmployeeRegistered)
def get_user_info(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    userRequest = db.query(UserModel).filter(UserModel.id == current_user.id).first()
    employeeRequest = db.query(Employee).filter(Employee.user_id == userRequest.id).first()
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id != userRequest.id and employeeRequest.role != EmployeeRole.Manager:
        raise HTTPException(status_code=403, detail="Not enough permissions")
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
