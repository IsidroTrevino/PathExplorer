from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import date
from dependencies import get_db, get_current_user
from models import Employee, Skill, Certification
from schemas import SkillType

router = APIRouter(prefix="/stats", tags=["Stats"])

@router.get("/employee/summary")
def employee_summary(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Cantidad de empleados
    total_employees = db.query(Employee).count()

    # Top 5 technical skills
    top_tech_skills = (
        db.query(Skill.skill_name, func.count(Skill.employee_id).label("count"))
        .filter(Skill.type == SkillType.hard)
        .group_by(Skill.skill_name)
        .order_by(desc("count"))
        .limit(5)
        .all()
    )

    # Top 5 soft skills
    top_soft_skills = (
        db.query(Skill.skill_name, func.count(Skill.employee_id).label("count"))
        .filter(Skill.type == SkillType.soft)
        .group_by(Skill.skill_name)
        .order_by(desc("count"))
        .limit(5)
        .all()
    )

    # Top 5 certificaciones
    top_certs = (
        db.query(Certification.name, func.count(Certification.employee_id).label("count"))
        .group_by(Certification.name)
        .order_by(desc("count"))
        .limit(5)
        .all()
    )

    # Datos personales del empleado autenticado
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    today = date.today()
    certs = db.query(Certification).filter(Certification.employee_id == employee.employee_id).all()
    certs_expired = sum(1 for c in certs if c.expiration_date < today)
    certs_active = sum(1 for c in certs if c.expiration_date >= today and c.status == "active")
    certs_expiring = sum(1 for c in certs if today <= c.expiration_date <= (today.replace(year=today.year + 1)))

    certs_by_type = {}
    for c in certs:
        certs_by_type[c.type] = certs_by_type.get(c.type, 0) + 1

    skills = db.query(Skill).filter(Skill.employee_id == employee.employee_id).all()
    skills_by_type = {"hard": 0, "soft": 0}
    for s in skills:
        skills_by_type[s.type.value] += 1

    return {
        "general": {
            "total_employees": total_employees,
            "top_technical_skills": [{"name": n, "count": c} for n, c in top_tech_skills],
            "top_soft_skills": [{"name": n, "count": c} for n, c in top_soft_skills],
            "top_certifications": [{"name": n, "count": c} for n, c in top_certs],
        },
        "personal": {
            "certifications": {
                "expired": certs_expired,
                "active": certs_active,
                "expiring_soon": certs_expiring,
                "by_type": certs_by_type
            },
            "skills": {
                "by_type": skills_by_type
            }
        }
    }
    
from sqlalchemy import or_, and_

@router.get("/manager/summary")
def manager_summary(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from models import Project, Assignment, ProjectRoleSkill, Employee, EmployeeRole

    # Validar rol
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee or employee.role != EmployeeRole.Manager:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    today = date.today()
    year_start = date(today.year, 1, 1)
    year_end = date(today.year, 12, 31)

    # Empleados asignados y no asignados
    subq_assigned = db.query(Assignment.developer_id).filter(Assignment.status == "approved", Assignment.developer_id!=None).distinct().subquery()
    assigned_count = db.query(func.count()).filter(Employee.employee_id.in_(subq_assigned)).scalar()
    total_employees = db.query(func.count()).select_from(Employee).scalar()
    not_assigned_count = total_employees - assigned_count

    # Porcentaje promedio de asignación (optimizado)
    assignment_data = (
        db.query(
            Assignment.developer_id,
            func.sum(
                func.least(func.coalesce(Project.enddate, year_end), year_end) -
                func.greatest(Project.startdate, year_start) + 1
            ).label("assigned_days")
        )
        .join(Project, Project.project_id == Assignment.project_id)
        .filter(
            Assignment.status == "approved",
            Assignment.approval_date >= year_start,
            Assignment.approval_date <= year_end,
            Project.startdate <= year_end,
            or_(Project.enddate == None, Project.enddate >= year_start)
        )
        .group_by(Assignment.developer_id)
        .all()
    )

    assignment_percentages = [
        min(assigned.assigned_days, 365) / 365
        for assigned in assignment_data if assigned.assigned_days
    ]
    avg_assignment_percentage = round(
        100 * sum(assignment_percentages) / total_employees,
        2
    ) if total_employees else 0

    # Proyectos activos
    active_projects = db.query(Project).filter(
        Project.startdate <= today,
        or_(Project.enddate == None, Project.enddate >= today)
    ).count()

    # Empleados por rol
    employees_by_role = {
        role.value: db.query(func.count()).select_from(Employee).filter(Employee.role == role).scalar()
        for role in EmployeeRole
    }

    # Top 5 proyectos con más empleados asignados
    top_projects = (
        db.query(Project.project_id, Project.projectname, func.count(Assignment.developer_id).label("employee_count"))
        .join(Assignment, Assignment.project_id == Project.project_id)
        .filter(Assignment.status == "approved")
        .group_by(Project.project_id)
        .order_by(desc("employee_count"))
        .limit(5)
        .all()
    )

    # Empleados por seniority
    employees_by_seniority = (
        db.query(Employee.seniority, func.count(Employee.employee_id))
        .group_by(Employee.seniority)
        .order_by(Employee.seniority)
        .all()
    )

    # Top 7 skills más requeridos en los proyectos
    top_project_skills = (
        db.query(ProjectRoleSkill.skill_name, func.count(ProjectRoleSkill.role_id).label("count"))
        .group_by(ProjectRoleSkill.skill_name)
        .order_by(desc("count"))
        .limit(7)
        .all()
    )

    return {
        "employees": {
            "total": total_employees,
            "assigned": assigned_count,
            "not_assigned": not_assigned_count,
            "by_role": employees_by_role,
            "by_seniority": [{"seniority": s, "count": c} for s, c in employees_by_seniority]
        },
        "assignment": {
            "average_assignment_percentage": avg_assignment_percentage
        },
        "projects": {
            "active": active_projects,
            "top_5_by_employees": [
                {"project_id": pid, "project_name": pname, "employee_count": count}
                for pid, pname, count in top_projects
            ]
        },
        "skills": {
            "top_7_project_skills": [
                {"skill_name": name, "count": count}
                for name, count in top_project_skills
            ]
        }
    }
@router.get("/tfs/summary")
def tfs_summary(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from models import Project, Assignment, ProjectRoleSkill, EmployeeRole

    # Validar rol
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee or employee.role != EmployeeRole.TFS:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Empleados no asignados
    subq_assigned = db.query(Assignment.developer_id).filter(Assignment.status == "approved", Assignment.developer_id != None).distinct()
    
    not_assigned_count = db.query(Employee).filter(
        Employee.role == EmployeeRole.Developer,
        ~Employee.employee_id.in_(subq_assigned)
    ).count()

    # Requests de asignación pendientes
    requests_count = db.query(Assignment).filter(Assignment.status == "pending").count()

    # Top 5 proyectos con más empleados faltantes
    projects = db.query(
        Project.project_id,
        Project.projectname,
        Project.employees_req,
        func.count(Assignment.assignment_id).label("assigned_count")
    ).outerjoin(
        Assignment, and_(
            Assignment.project_id == Project.project_id,
            Assignment.status == "approved"
        )
    ).group_by(Project.project_id).all()

    projects_missing = [
        {
            "project_id": p.project_id,
            "project_name": p.projectname,
            "missing": max(p.employees_req - p.assigned_count, 0)
        }
        for p in projects if p.employees_req and (p.employees_req - p.assigned_count) > 0
    ]
    top_5_missing = sorted(projects_missing, key=lambda x: x["missing"], reverse=True)[:5]

    # Top 7 skills más requeridos en los proyectos
    top_project_skills = (
        db.query(ProjectRoleSkill.skill_name, func.count(ProjectRoleSkill.role_id).label("count"))
        .group_by(ProjectRoleSkill.skill_name)
        .order_by(desc("count"))
        .limit(7)
        .all()
    )

    return {
        "employees": {
            "not_assigned": not_assigned_count
        },
        "requests": {
            "pending_assignments": requests_count
        },
        "projects": {
            "top_5_missing_employees": top_5_missing
        },
        "skills": {
            "top_7_project_skills": [
                {"skill_name": name, "count": count}
                for name, count in top_project_skills
            ]
        }
    }