from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func, and_
from models import User, Employee, Project
from schemas import User as UserSchema, ProjectCreate, EmployeeRole, ProjectRegistered
from dependencies import get_current_user, get_db
from typing import Optional
from datetime import date
from fastapi_pagination import Page, paginate

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=Page[ProjectRegistered], status_code=200)
def get_projects(
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db),
    alphabetical: bool = False,
    search: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None)
):
    req_user = db.query(User).filter(User.id == current_user.id).first()
    employeeRequest = db.query(Employee).filter(Employee.user_id == req_user.id).first()

    if employeeRequest.role != EmployeeRole.Manager and employeeRequest.role != EmployeeRole.TFS:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    query = db.query(Project, Employee).join(Employee, Project.manager_id == Employee.employee_id)

    if start_date:
        query = query.filter(Project.startdate >= start_date)
    if end_date:
        query = query.filter(Project.enddate <= end_date)

    if search:
        search_term = f"%{search.lower()}%"
        full_name = func.lower(func.concat(Employee.name, ' ', Employee.last_name_1, ' ', func.coalesce(Employee.last_name_2, '')))
        query = query.filter(
            or_(
                func.lower(Project.projectname).ilike(search_term),
                func.lower(Project.client).ilike(search_term),
                func.lower(Project.description).ilike(search_term),
                full_name.ilike(search_term)
            )
        )

    if alphabetical:
        query = query.order_by(Project.projectname.asc())

    result = [
        ProjectRegistered(
            project_id=p.project_id,
            projectName=p.projectname,
            client=p.client,
            description=p.description,
            startDate=p.startdate,
            endDate=p.enddate,
            employees_req=p.employees_req,
            manager_id=p.manager_id,
            manager=e.name + " " + e.last_name_1
        ) for p, e in query.all()
    ]

    return paginate(result)


@router.post("", status_code=200)
def create_project(
    project: ProjectCreate,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req_user = db.query(User).filter(User.id == current_user.id).first()
    employeeRequest = db.query(Employee).filter(Employee.user_id == req_user.id).first()

    if employeeRequest.role != EmployeeRole.Manager:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    if project.employees_req < 1:
        raise HTTPException(status_code=400, detail="Employees required must be at least 1")
    if project.startDate >= project.endDate:
        raise HTTPException(status_code=400, detail="Start date must be before end date")
    if not all([project.projectName, project.client, project.description]):
        raise HTTPException(status_code=400, detail="Project name, client and description cannot be empty")

    if db.query(Project).filter(Project.projectname == project.projectName).first():
        raise HTTPException(status_code=400, detail="Project name already exists")

    project_db = Project(
        projectname=project.projectName,
        client=project.client,
        description=project.description,
        startdate=project.startDate,
        enddate=project.endDate,
        manager_id=employeeRequest.employee_id,
        employees_req=project.employees_req
    )
    db.add(project_db)
    db.commit()
    db.refresh(project_db)

    project_return = ProjectRegistered(
        project_id=project_db.project_id,
        projectName=project_db.projectname,
        client=project_db.client,
        description=project_db.description,
        startDate=project_db.startdate,
        endDate=project_db.enddate,
        employees_req=project_db.employees_req,
        manager_id=project_db.manager_id,
        manager=employeeRequest.name + " " + employeeRequest.last_name_1
    )
    
    return project_return

@router.put("/{project_id}", response_model=ProjectRegistered)
def update_project(
    project_id: int,
    updated: ProjectCreate,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req_user = db.query(User).filter(User.id == current_user.id).first()
    employee = db.query(Employee).filter(Employee.user_id == req_user.id).first()

    if employee.role != EmployeeRole.Manager:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    project = db.query(Project).filter(Project.project_id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.projectname = updated.projectName
    project.client = updated.client
    project.description = updated.description
    project.startdate = updated.startDate
    project.enddate = updated.endDate
    project.employees_req = updated.employees_req

    db.commit()
    db.refresh(project)

    manager = db.query(Employee).filter(Employee.employee_id == project.manager_id).first()

    return ProjectRegistered(
        project_id=project.project_id,
        projectName=project.projectname,
        client=project.client,
        description=project.description,
        startDate=project.startdate,
        endDate=project.enddate,
        employees_req=project.employees_req,
        manager_id=project.manager_id,
        manager=manager.name + " " + manager.last_name_1
    )

@router.delete("/{project_id}", status_code=204)
def delete_project(
    project_id: int,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req_user = db.query(User).filter(User.id == current_user.id).first()
    employee = db.query(Employee).filter(Employee.user_id == req_user.id).first()

    if employee.role != EmployeeRole.Manager:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    project = db.query(Project).filter(Project.project_id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return