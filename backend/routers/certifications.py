from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from datetime import date, timedelta
from sqlalchemy import func
from models import Certification, Employee
from schemas import User, CertificationCreate, CertificationResponse
from dependencies import get_db, get_current_user

router = APIRouter(prefix="/certifications", tags=["Certifications"])

@router.post("/add", response_model=CertificationResponse)
def add_certification(cert: CertificationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    new_cert = Certification(
        name=cert.name,
        type=cert.type,
        description=cert.description,
        certification_date=cert.certification_date,
        expiration_date=cert.expiration_date,
        employee_id=employee.employee_id,
        status="active"  # Esto se actualizará luego con la función si aplica
    )
    db.add(new_cert)
    db.commit()
    db.refresh(new_cert)
    return new_cert


@router.get("/my-certifications", response_model=List[CertificationResponse])
def get_my_certifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    certs = db.query(Certification).filter(Certification.employee_id == employee.employee_id).all()
    return certs


@router.put("/update/{certification_id}", response_model=CertificationResponse)
def update_certification(certification_id: int, updated: CertificationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    cert = db.query(Certification).filter(Certification.certification_id == certification_id, Certification.employee_id == employee.employee_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found")

    cert.name = updated.name
    cert.type = updated.type
    cert.description = updated.description
    cert.certification_date = updated.certification_date
    cert.expiration_date = updated.expiration_date
    db.commit()
    db.refresh(cert)
    return cert


@router.delete("/delete/{certification_id}", status_code=204)
def delete_certification(certification_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    cert = db.query(Certification).filter(Certification.certification_id == certification_id, Certification.employee_id == employee.employee_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found")

    db.delete(cert)
    db.commit()
    return


@router.post("/refresh-status")
def refresh_certification_status(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        db.execute(text("SELECT update_certification_status();"))
        db.commit()
        return {"message": "Certification statuses updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/expiring", response_model=List[CertificationResponse])
def get_expiring_certifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    today = date.today()
    upcoming = today + timedelta(days=30)

    certs = db.query(Certification).filter(
        Certification.employee_id == employee.employee_id,
        Certification.expiration_date <= upcoming
    ).all()

    return certs


@router.get("/types/count")
def get_certification_type_count(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    result = db.query(Certification.type, func.count(Certification.type)).filter(
        Certification.employee_id == employee.employee_id
    ).group_by(Certification.type).all()

    return {"counts": [{"type": t, "count": c} for t, c in result]}