from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from schemas import UserCreate, UserBase, EmployeeRole
from models import User, Employee, OTP, Developer, TFS, Manager
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

@router.put("/employee/{employee_id}/role", status_code=status.HTTP_200_OK)
def change_employee_role(
    employee_id: int,
    role_change: EmployeeRole,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Verificar que quien hace la petición sea un Manager
    req_user = db.query(User).filter(User.id == current_user.id).first()
    requester = db.query(Employee).filter(Employee.user_id == req_user.id).first()
    
    if not requester or requester.role != EmployeeRole.Manager:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can change roles"
        )

    # 2. Verificar que el empleado exista y sea Developer
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    if employee.role != EmployeeRole.Developer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only change role of Developers"
        )

    # 3. Verificar que el nuevo rol sea válido (Manager o TFS)
    if role_change not in [EmployeeRole.Manager, EmployeeRole.TFS]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New role must be Manager or TFS"
        )

    try:
        # 4. Eliminar de la tabla Developer
        developer = db.query(Developer).filter(Developer.employee_id == employee_id).first()
        if developer:
            db.delete(developer)

        # 5. Crear nueva entrada según el rol
        if role_change == EmployeeRole.Manager:
            new_role_entry = Manager(
                employee_id=employee_id,
                staff_days=0  # Valor inicial
            )
        else:  # TFS
            new_role_entry = TFS(
                employee_id=employee_id,
                speciality_area="General"  # Valor inicial
            )
        
        # 6. Actualizar rol en Employee
        employee.role = role_change
        
        # 7. Guardar cambios
        db.add(new_role_entry)
        db.commit()
        
        return {
            "message": f"Employee role changed successfully to {role_change}",
            "employee_id": employee_id,
            "new_role": role_change
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error changing role: {str(e)}"
        )

@router.delete("/employee/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(
    employee_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Verificar que quien hace la petición sea un Manager
    req_user = db.query(User).filter(User.id == current_user.id).first()
    requester = db.query(Employee).filter(Employee.user_id == req_user.id).first()
    
    if not requester or requester.role != EmployeeRole.Manager:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can delete users"
        )

    # 2. Verificar que el empleado a eliminar exista
    employee_to_delete = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    # 3. Obtener el usuario asociado
    user_to_delete = db.query(User).filter(User.id == employee_to_delete.user_id).first()
    if not user_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated user not found"
        )

    # 4. Verificar que no intente eliminarse a sí mismo
    if employee_to_delete.user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own user"
        )

    # 5. Verificar que no sea manager
    if employee_to_delete.role == EmployeeRole.Manager:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete other managers"
        )

    try:
        # 6. Primero eliminar la entrada específica del rol
        if employee_to_delete.role == EmployeeRole.Developer:
            developer = db.query(Developer).filter(
                Developer.employee_id == employee_id
            ).first()
            if developer:
                db.delete(developer)
                
        elif employee_to_delete.role == EmployeeRole.TFS:
            tfs = db.query(TFS).filter(
                TFS.employee_id == employee_id
            ).first()
            if tfs:
                db.delete(tfs)
                
        elif employee_to_delete.role == EmployeeRole.Manager:
            manager = db.query(Manager).filter(
                Manager.employee_id == employee_id
            ).first()
            if manager:
                db.delete(manager)

        # 7. Luego eliminar el empleado
        db.delete(employee_to_delete)
        
        # 8. Finalmente eliminar el usuario
        db.delete(user_to_delete)
        db.commit()
        
        return Response(status_code=status.HTTP_204_NO_CONTENT)
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting employee: {str(e)}"
        )