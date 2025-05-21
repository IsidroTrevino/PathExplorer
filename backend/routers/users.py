from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import case, func
from sqlalchemy.orm import aliased
from sqlalchemy.sql import over
from fastapi_pagination import Page, create_page
from fastapi_pagination import paginate
from schemas import EmployeeRole, EmployeeList, EmployeeRegistered
from models import Employee, User as UserModel
from dependencies import get_current_user, get_db
from sqlalchemy import or_, func, over
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, aliased
from datetime import date
from dependencies import get_db, get_current_user
from schemas import AssignmentCreate, AssignmentResponse, ProjectInfo, ProfileResponse, CertificationResponse, SkillResponse
from models import Assignment, Developer, ProjectRole, Project, Manager, Employee, TFS, RoleDeveloper, Certification, Skill, User, Curriculum

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=Page[EmployeeList])
def get_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    role: EmployeeRole = None,
    alphabetical: bool = False,
    search: str = None,
    assigned: bool = None
):
    # Verificación de permisos
    userRequest = db.query(UserModel).filter(UserModel.id == current_user.id).first()
    employeeRequest = db.query(Employee).filter(Employee.user_id == userRequest.id).first()

    if employeeRequest.role != EmployeeRole.Manager:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    
    assignment_ranked = (
        db.query(
            Assignment.developer_id,
            Assignment.project_id,
            func.row_number().over(
                partition_by=Assignment.developer_id,
                order_by=[
                    # Changed from list to individual case elements
                    case(
                        (Project.enddate == None, 1),
                        (Project.enddate >= func.current_date(), 1),
                        else_=2
                    ),  # prioriza proyectos vigentes
                    Project.enddate.desc()  # si no hay vigentes, toma el más reciente
                ]
            ).label("rank")
        )
        .join(Project, Assignment.project_id == Project.project_id)
    ).subquery()

    best_assignment = (
        db.query(
            assignment_ranked.c.developer_id,
            assignment_ranked.c.project_id
        )
        .filter(assignment_ranked.c.rank == 1)
    ).subquery()

    # Base query
    query = db.query(
    Employee.employee_id,
    Employee.name,
    Employee.last_name_1,
    Employee.last_name_2,
    Employee.phone_number,
    Employee.location,
    Employee.capability,
    Employee.position,
    Employee.seniority,
    Employee.role,
    Project.project_id,
    Project.projectname.label("project_name"),
    Project.startdate.label("project_start_date"),
    Project.enddate.label("project_end_date"),
    # Changed from list to individual case elements
    case(
        (Project.enddate == None, "Staff"),
        (Project.enddate >= func.current_date(), "Asignado"),
        else_="Staff"
    ).label("assignment_status"),
    # Changed from list to individual case elements
    case(
        (Project.enddate == None, 0),
        (Project.enddate >= func.current_date(), 0),
        else_=(func.current_date() - Project.enddate)
    ).label("days_since_last_project")
).outerjoin(
    best_assignment, best_assignment.c.developer_id == Employee.employee_id
).outerjoin(
    Project, Project.project_id == best_assignment.c.project_id
)

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
        
    # Filtro por asignación
    if assigned is not None:
        if assigned:
            query = query.filter(Employee.role == "Developer", Project.enddate >= func.current_date())
        else:
            query = query.filter(
                Employee.role == "Developer",
                or_(
                    Project.enddate < func.current_date(),
                    Project.enddate == None
                )
            )

    # Orden alfabético
    if alphabetical:
        query = query.order_by(Employee.last_name_1.asc())

    # Ejecutar y formatear resultados
    result = [
        {
            "employee_id": emp.employee_id,
            "name": emp.name,
            "last_name_1": emp.last_name_1,
            "last_name_2": emp.last_name_2,
            "phone_number": emp.phone_number,
            "location": emp.location,
            "capability": emp.capability,
            "position": emp.position,
            "seniority": emp.seniority,
            "role": emp.role,
            "project": {
                "project_id": emp.project_id,
                "project_name": emp.project_name,
                "project_start_date": emp.project_start_date,
                "project_end_date": emp.project_end_date,
            } if emp.project_id else None,
            "assignment_status": emp.assignment_status,
            "days_since_last_project": int(emp.days_since_last_project)
            if emp.assignment_status == "Staff" and emp.days_since_last_project is not None
            else None
        }
        for emp in query.all()
    ]

    return paginate(result)



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
    
@router.get("/profile/{user_id}", response_model=ProfileResponse)
def get_profile(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    employee = db.query(Employee).filter(Employee.user_id == user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    manager = db.query(Manager).filter(Manager.employee_id == employee.employee_id).first()

    if not manager:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    employee = db.query(Employee).filter(Employee.employee_id== user_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    user = db.query(User).filter(User.id == employee.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Proyecto y estado de asignación
    assignment = (
        db.query(Assignment)
        .filter(Assignment.developer_id == employee.employee_id, Assignment.status == "approved")
        .order_by(Assignment.approval_date.desc())
        .first()
    )
    project_info = None
    assignment_status = "Staff"
    if assignment and assignment.status == "approved":
        project = db.query(Project).filter(Project.project_id == assignment.project_id).first()
        if project:
            project_info = ProjectInfo(
                project_id=project.project_id,
                project_name=project.projectname,
                project_start_date=project.startdate,
                project_end_date=project.enddate,
            )
            if not project.enddate or project.enddate >= date.today():
                assignment_status = "Asignado"
            else:
                assignment_status = "Staff"

    # Certificaciones
    certifications = db.query(Certification).filter(Certification.employee_id == employee.employee_id).all()
    certs_response = [
        CertificationResponse(
            certification_id=c.certification_id,
            name=c.name,
            type=c.type,
            description=c.description,
            certification_date=c.certification_date,
            expiration_date=c.expiration_date,
            status=c.status,
        )
        for c in certifications
    ] if certifications else []

    # Skills
    skills = db.query(Skill).filter(Skill.employee_id == employee.employee_id).all()
    skills_response = [
        SkillResponse(
            skill_id=s.skill_id,
            skill_name=s.skill_name,
            type=s.type,
            level=s.level,
        )
        for s in skills
    ] if skills else []
    
    curriculum = db.query(Curriculum).filter(Curriculum.employee_id == employee.employee_id).first()

    return ProfileResponse(
        employee_id=employee.employee_id,
        name=employee.name,
        last_name_1=employee.last_name_1,
        last_name_2=employee.last_name_2,
        phone_number=employee.phone_number,
        location=employee.location,
        capability=employee.capability,
        position=employee.position,
        seniority=employee.seniority,
        email=user.email,
        role=employee.role,
        project=project_info,
        curriculum=curriculum.file_key if curriculum else None,
        assignment_status=assignment_status,
        certifications=certs_response,
        skills=skills_response
    )
