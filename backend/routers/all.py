from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List
from datetime import date
from dependencies import get_db, get_current_user
from models import (
    Employee, User, Developer, Manager, TFS, Project, ProjectRole, 
    RoleDeveloper, Skill, Certification, Goal, Curriculum, Assignment
)
from schemas import EmployeeFullProfile, SkillResponse, CertificationResponse, ProjectInfo, GoalResponse, EmployeeProjectHistory, EmployeeRole

router = APIRouter(prefix="/all", tags=["All info"])

@router.get("/{employee_id}/full-profile", response_model=EmployeeFullProfile)
def get_employee_full_profile(
    employee_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Obtener información básica del empleado
    employee = (
        db.query(Employee)
        .filter(Employee.employee_id == employee_id)
        .first()
    )
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # 2. Obtener información específica según el rol
    role_specific_info = {}
    if employee.role == EmployeeRole.Developer:
        dev = db.query(Developer).filter(Developer.employee_id == employee_id).first()
        role_specific_info["staff_days"] = dev.staff_days if dev else None
    elif employee.role == EmployeeRole.TFS:
        tfs = db.query(TFS).filter(TFS.employee_id == employee_id).first()
        role_specific_info["speciality_area"] = tfs.speciality_area if tfs else None
    elif employee.role == EmployeeRole.Manager:
        manager = db.query(Manager).filter(Manager.employee_id == employee_id).first()
        role_specific_info["staff_days"] = manager.staff_days if manager else None

    # 3. Obtener proyecto actual y estado
    current_assignment = (
        db.query(Assignment, Project, ProjectRole)
        .join(Project, Assignment.project_id == Project.project_id)
        .join(ProjectRole, Assignment.project_role_id == ProjectRole.role_id)
        .filter(
            Assignment.developer_id == employee_id,
            Assignment.status == "approved"
        )
        .order_by(Assignment.approval_date.desc())
        .first()
    )

    current_project = None
    assignment_status = "Staff"
    if current_assignment:
        assignment, project, role = current_assignment
        if not project.enddate or project.enddate >= date.today():
            current_project = ProjectInfo(
                project_id=project.project_id,
                project_name=project.projectname,
                project_start_date=project.startdate,
                project_end_date=project.enddate
            )
            assignment_status = "Assigned"

    # 4. Obtener historial de proyectos
    project_history = (
        db.query(Project, ProjectRole, RoleDeveloper)
        .join(ProjectRole, ProjectRole.project_id == Project.project_id)
        .join(RoleDeveloper, RoleDeveloper.project_role_id == ProjectRole.role_id)
        .filter(RoleDeveloper.developer_id == employee_id)
        .all()
    )

    # 5. Obtener skills, certificaciones y metas
    skills = db.query(Skill).filter(Skill.employee_id == employee_id).all()
    certifications = db.query(Certification).filter(Certification.employee_id == employee_id).all()
    goals = db.query(Goal).filter(Goal.employee_id == employee_id).all()

    # 6. Obtener CV
    curriculum = db.query(Curriculum).filter(Curriculum.employee_id == employee_id).first()

    # 7. Construir respuesta
    return EmployeeFullProfile(
        # Información personal
        employee_id=employee.employee_id,
        name=employee.name,
        last_name_1=employee.last_name_1,
        last_name_2=employee.last_name_2,
        phone_number=employee.phone_number,
        location=employee.location,
        capability=employee.capability,
        position=employee.position,
        seniority=employee.seniority,
        email=employee.user.email,
        role=employee.role,
        staff_days=role_specific_info.get("staff_days"),
        speciality_area=role_specific_info.get("speciality_area"),

        # Información actual
        current_project=current_project,
        assignment_status=assignment_status,
        curriculum_url=curriculum.file_key if curriculum else None,

        # Historiales
        project_history=[
            EmployeeProjectHistory(
                project_id=p.project_id,
                project_name=p.projectname,
                client=p.client,
                start_date=p.startdate,
                end_date=p.enddate,
                role_name=r.name,
                role_description=r.description,
                feedback=r.feedback
            ) for p, r, _ in project_history
        ],
        skills=[
            SkillResponse(
                skill_id=s.skill_id,
                skill_name=s.skill_name,
                level=s.level,
                type=s.type
            ) for s in skills
        ],
        certifications=[
            CertificationResponse(
                certification_id=c.certification_id,
                name=c.name,
                type=c.type,
                description=c.description,
                certification_date=c.certification_date,
                expiration_date=c.expiration_date,
                status=c.status
            ) for c in certifications
        ],
        goals=[
            GoalResponse(
                goal_id=g.goal_id,
                title=g.title,
                category=g.category,
                description=g.description,
                term=g.term
            ) for g in goals
        ]
    )