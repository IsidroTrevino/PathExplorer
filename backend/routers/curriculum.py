from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import Curriculum, Employee, User
from schemas import CurriculumCreate, CurriculumResponse
from dependencies import get_db, get_current_user
from typing import List, Optional

router = APIRouter(prefix="/curriculum", tags=["Curriculum"])

@router.post("/", response_model=CurriculumResponse, status_code=status.HTTP_201_CREATED)
def create_curriculum(
    curriculum: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    employee_id: Optional[int] = None
):
    if employee_id == None:
        user = db.query(User).filter(User.id == current_user.id).first()
        employee = db.query(Employee).filter(Employee.user_id == user.id).first()
        employee_id = employee.employee_id
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
    else:
        # Verificar que el empleado existe
        employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
        employee_id = employee.employee_id

    # Crear el registro de Curriculum
    new_curriculum = Curriculum(
        employee_id=employee_id,
        file_key=curriculum
    )
    db.add(new_curriculum)
    db.commit()
    db.refresh(new_curriculum)

    return new_curriculum

@router.get("/", response_model=List[CurriculumResponse], status_code=status.HTTP_200_OK)
def get_curriculum_by_employee( 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    employee_id: Optional[int] = None
):
    if employee_id == None:
        user = db.query(User).filter(User.id == current_user.id).first()
        employee = db.query(Employee).filter(Employee.user_id == user.id).first()
        employee_id = employee.employee_id
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
    else:
        # Verificar que el empleado existe
        employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")

    # Obtener los registros de Curriculum
    curriculum = db.query(Curriculum).filter(Curriculum.employee_id == employee_id).all()
    if not curriculum:
        raise HTTPException(status_code=404, detail="No curriculum found for this employee")

    return curriculum

@router.put("/", response_model=CurriculumResponse, status_code=status.HTTP_200_OK)
def update_curriculum(
    curriculum: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    employee_id: Optional[int] = None
):
    if employee_id == None:
        user = db.query(User).filter(User.id == current_user.id).first()
        employee = db.query(Employee).filter(Employee.user_id == user.id).first()
        employee_id = employee.employee_id
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
    else:
        # Verificar que el empleado existe
        employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")

    # Verificar que el registro de Curriculum existe
    existing_curriculum = db.query(Curriculum).filter(Curriculum.employee_id == employee_id).first()
    if not existing_curriculum:
        raise HTTPException(status_code=404, detail="Curriculum not found for this employee")

    # Actualizar el registro de Curriculum
    existing_curriculum.file_key = curriculum
    db.commit()
    db.refresh(existing_curriculum)

    return existing_curriculum


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def delete_curriculum(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    employee_id: Optional[int] = None
):
    if employee_id == None:
        user = db.query(User).filter(User.id == current_user.id).first()
        employee = db.query(Employee).filter(Employee.user_id == user.id).first()
        employee_id = employee.employee_id
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
    else:
        # Verificar que el empleado existe
        employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")

    # Eliminar los registros de Curriculum
    db.query(Curriculum).filter(Curriculum.employee_id == employee_id).delete()
    db.commit()
    return