from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import User, GoalCreate, GoalResponse
from models import Goal, Employee
from dependencies import get_current_user, get_db
from typing import List

router = APIRouter(prefix="/goals", tags=["Goals"])

@router.post("/add", response_model=GoalResponse)
def add_goal(goal: GoalCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Evitar metas duplicadas con mismo título para el mismo usuario
    existing = db.query(Goal).filter(
        Goal.employee_id == employee.employee_id,
        Goal.title.ilike(goal.title)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Goal with this title already exists")

    new_goal = Goal(
        title=goal.title,
        category=goal.category,
        description=goal.description,
        term=goal.term,
        employee_id=employee.employee_id
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal


@router.get("/my-goals", response_model=List[GoalResponse])
def get_my_goals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    goals = db.query(Goal).filter(Goal.employee_id == employee.employee_id).all()
    return goals


@router.delete("/delete/{goal_id}", status_code=204)
def delete_goal(goal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    goal = db.query(Goal).filter(Goal.goal_id == goal_id, Goal.employee_id == employee.employee_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    db.delete(goal)
    db.commit()
    return


@router.put("/update/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: int, updated_goal: GoalCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    goal = db.query(Goal).filter(Goal.goal_id == goal_id, Goal.employee_id == employee.employee_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    goal.title = updated_goal.title
    goal.category = updated_goal.category
    goal.description = updated_goal.description
    goal.term = updated_goal.term
    db.commit()
    db.refresh(goal)
    return goal
