from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from schemas import User, SkillCreate, SkillResponse
from models import Skill, SkillType, Employee
from dependencies import get_current_user, get_db
from typing import List, Optional

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.post("/add", response_model=SkillResponse)
def add_skill(skill: SkillCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    new_skill = Skill(skill_name=skill.skill_name, level=skill.level, type=skill.type, employee_id=employee.employee_id)
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    skill_id = db.query(Skill).filter(Skill.skill_name == skill.skill_name, Skill.employee_id == employee.employee_id).first().skill_id
    skill_response = SkillResponse(
        skill_id=skill_id,
        skill_name=new_skill.skill_name,
        level=new_skill.level,
        type=new_skill.type
    )
    return skill_response

@router.get("/my-skills", response_model=List[SkillResponse])
def get_my_skills(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    type: Optional[SkillType] = Query(None)
):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    query = db.query(Skill).filter(Skill.employee_id == employee.employee_id)
    if type:
        query = query.filter(Skill.type == type)

    return query.all()

@router.put("/update/{skill_id}", response_model=SkillResponse)
def update_skill(skill_id: int, skill_update: SkillCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    skill = db.query(Skill).filter(Skill.skill_id == skill_id, Skill.employee_id == employee.employee_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    skill.skill_name = skill_update.skill_name
    skill.level = skill_update.level
    skill.type = skill_update.type
    db.commit()
    db.refresh(skill)
    return skill

@router.delete("/delete/{skill_id}", status_code=204)
def delete_skill(skill_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    skill = db.query(Skill).filter(Skill.skill_id == skill_id, Skill.employee_id == employee.employee_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    db.delete(skill)
    db.commit()
    return