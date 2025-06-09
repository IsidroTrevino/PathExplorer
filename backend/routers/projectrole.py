from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, case, select
from sqlalchemy.orm import aliased, joinedload
from sqlalchemy import and_, or_
from models import ProjectRole, Project, Employee, User, Developer, RoleDeveloper, Assignment, RoleDeveloper, ProjectRoleSkill, Skill
from schemas import ProjectRoleCreate, ProjectRoleResponse, User as UserSchema, EmployeeRole, ProjectRoleSkillCreate, ProjectRoleSkillResponse, ProjectRoleSkillUpdate
from dependencies import get_db, get_current_user
from typing import Optional, List
from collections import defaultdict

router = APIRouter(prefix="/project-roles", tags=["Project Roles"])

#Obtener roles antiguos de un empleado
@router.get("/roles")
def get_user_roles(
    id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Si no se proporciona un ID, usar el usuario autenticado
    if id is None:
        user = db.query(User).filter(User.id == current_user.id).first()
        if user is None:
            raise HTTPException(status_code=404, detail="Authenticated user not found")
        
        # Buscar el empleado asociado al usuario
        employee = db.query(Employee).filter(Employee.user_id == user.id).first()
        if employee is None:
            raise HTTPException(status_code=404, detail="Employee not found")
    else:

        # Buscar el empleado asociado al usuario
        employee = db.query(Employee).filter(Employee.employee_id == id).first()
        if employee is None:
            raise HTTPException(status_code=404, detail="Employee not found")

    roles = db.query(
        RoleDeveloper.role_log_id,
        RoleDeveloper.developer_id,
        RoleDeveloper.project_role_id,
        Assignment.approval_date,
        ProjectRole.name.label("role_name"),
        ProjectRole.description.label("role_description"),
        ProjectRole.feedback.label("role_feedback"),
        Project.project_id,
        Project.projectname.label("project_name"),
        Project.description.label("project_description")
    ).join(
        ProjectRole, RoleDeveloper.project_role_id == ProjectRole.role_id
    ).join(
        Project, ProjectRole.project_id == Project.project_id
    ).join(
        Assignment,
        and_(
            Assignment.developer_id == RoleDeveloper.developer_id,
            Assignment.project_id == Project.project_id
        )
    ).filter(
        RoleDeveloper.developer_id == employee.employee_id,
        Assignment.approval_date.isnot(None)
    ).all()

    if not roles:
        raise HTTPException(status_code=404, detail="No roles found for this employee")

    # Formatear la respuesta
    result = [
        {
            "role_log_id": role.role_log_id,
            "developer_id": role.developer_id,
            "project_role_id": role.project_role_id,
            "role_name": role.role_name,
            "approval_date": role.approval_date,
            "role_description": role.role_description,
            "role_feedback": role.role_feedback,
            "project_id": role.project_id,
            "project_name": role.project_name,
            "project_description": role.project_description,
        }
        for role in roles
    ]

    return result

@router.get("/{project_id}", response_model=List[ProjectRoleResponse], status_code=status.HTTP_200_OK)
def get_project_roles(
    project_id: int,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar que el usuario actual es un Manager
    req_user = db.query(User).filter(User.id == current_user.id).first()
    employee = db.query(Employee).filter(Employee.user_id == req_user.id).first()

    if employee.role != EmployeeRole.Manager:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Verificar que el proyecto existe
    project = db.query(Project).filter(Project.project_id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Obtener los roles del proyecto
    project_roles = db.query(ProjectRole).filter(ProjectRole.project_id == project_id).all()
    
    if not project_roles:
        raise HTTPException(status_code=404, detail="No roles found for this project")
    
    for role in project_roles:
        # Obtener los skills asociados a cada rol
        skills = db.query(ProjectRoleSkill).filter(ProjectRoleSkill.role_id == role.role_id).all()
        role.skills = skills
        
        assigment = db.query(Assignment).filter(Assignment.project_role_id == role.role_id).first()
        if assigment:
            if assigment.status == "approved":
                role.assigned = True
                developer = db.query(Employee).filter(Employee.employee_id == assigment.developer_id).first()
                role.developer_name = f"{developer.name} {developer.last_name_1}" if developer else None
                role.developer_id = assigment.developer_id
            else:
                role.assigned = False
    

    return project_roles
    
@router.post("/", response_model=ProjectRoleResponse, status_code=status.HTTP_201_CREATED)
def create_project_role(
    project_role: ProjectRoleCreate,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar que el usuario actual es un Manager
    req_user = db.query(User).filter(User.id == current_user.id).first()
    employee = db.query(Employee).filter(Employee.user_id == req_user.id).first()

    if employee.role != EmployeeRole.Manager:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Verificar que el proyecto existe
    project = db.query(Project).filter(Project.project_id == project_role.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Crear el nuevo rol de proyecto
    new_project_role = ProjectRole(
        name=project_role.name,
        description=project_role.description,
        feedback=project_role.feedback,
        project_id=project_role.project_id
    )
    db.add(new_project_role)
    db.commit()
    db.refresh(new_project_role)

    return new_project_role

@router.put("/{role_id}", response_model=ProjectRoleResponse, status_code=status.HTTP_200_OK)
def update_project_role(
    role_id: int,
    updated_role: ProjectRoleCreate,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar que el usuario actual es un Manager
    req_user = db.query(User).filter(User.id == current_user.id).first()
    employee = db.query(Employee).filter(Employee.user_id == req_user.id).first()

    if employee.role != EmployeeRole.Manager:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Verificar que el rol de proyecto existe
    project_role = db.query(ProjectRole).filter(ProjectRole.role_id == role_id).first()
    if not project_role:
        raise HTTPException(status_code=404, detail="Project role not found")

    # Verificar que el proyecto asociado existe
    project = db.query(Project).filter(Project.project_id == updated_role.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Actualizar los campos del rol de proyecto
    project_role.name = updated_role.name
    project_role.description = updated_role.description
    project_role.feedback = updated_role.feedback
    project_role.project_id = updated_role.project_id

    db.commit()
    db.refresh(project_role)

    return project_role

@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_role(
    role_id: int,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar que el usuario actual es un Manager
    req_user = db.query(User).filter(User.id == current_user.id).first()
    employee = db.query(Employee).filter(Employee.user_id == req_user.id).first()

    if employee.role != EmployeeRole.Manager:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Verificar que el rol de proyecto existe
    project_role = db.query(ProjectRole).filter(ProjectRole.role_id == role_id).first()
    if not project_role:
        raise HTTPException(status_code=404, detail="Project role not found")

    db.delete(project_role)
    db.commit()
    return


@router.post("/{role_id}/skills", response_model=ProjectRoleSkillResponse, status_code=status.HTTP_201_CREATED)
def add_skill_to_role(
    role_id: int,
    skill: ProjectRoleSkillCreate,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Solo el manager creador del proyecto puede agregar skills
    req_user = db.query(User).filter(User.id == current_user.id).first()
    employee = db.query(Employee).filter(Employee.user_id == req_user.id).first()
    project_role = db.query(ProjectRole).filter(ProjectRole.role_id == role_id).first()
    if not project_role:
        raise HTTPException(status_code=404, detail="Project role not found")
    project = db.query(Project).filter(Project.project_id == project_role.project_id).first()
    if not project or project.manager_id != employee.employee_id:
        raise HTTPException(status_code=403, detail="Only the project creator can add skills")
    new_skill = ProjectRoleSkill(role_id=role_id, **skill.model_dump())
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    return new_skill

@router.get("/{role_id}/skills", response_model=List[ProjectRoleSkillResponse])
def get_skills_for_role(
    role_id: int,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Cualquier manager puede leer
    skills = db.query(ProjectRoleSkill).filter(ProjectRoleSkill.role_id == role_id).all()
    return skills

@router.put("/{role_id}/skills/", response_model=ProjectRoleSkillResponse)
def update_skill_for_role(
    role_id: int,
    skill_name: str,
    skill_update: ProjectRoleSkillUpdate,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Solo el manager creador del proyecto puede actualizar
    req_user = db.query(User).filter(User.id == current_user.id).first()
    employee = db.query(Employee).filter(Employee.user_id == req_user.id).first()
    project_role = db.query(ProjectRole).filter(ProjectRole.role_id == role_id).first()
    if not project_role:
        raise HTTPException(status_code=404, detail="Project role not found")
    project = db.query(Project).filter(Project.project_id == project_role.project_id).first()
    if not project or project.manager_id != employee.employee_id:
        raise HTTPException(status_code=403, detail="Only the project creator can update skills")
    skill = db.query(ProjectRoleSkill).filter(ProjectRoleSkill.role_id == role_id, ProjectRoleSkill.skill_name == skill_name).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    skill.level = skill_update.level
    skill.type = skill_update.type
    db.commit()
    db.refresh(skill)
    return skill

@router.delete("/{role_id}/skills/{skill_name}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill_for_role(
    role_id: int,
    skill_name: str,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Solo el manager creador del proyecto puede borrar
    req_user = db.query(User).filter(User.id == current_user.id).first()
    employee = db.query(Employee).filter(Employee.user_id == req_user.id).first()
    project_role = db.query(ProjectRole).filter(ProjectRole.role_id == role_id).first()
    if not project_role:
        raise HTTPException(status_code=404, detail="Project role not found")
    project = db.query(Project).filter(Project.project_id == project_role.project_id).first()
    if not project or project.manager_id != employee.employee_id:
        raise HTTPException(status_code=403, detail="Only the project creator can delete skills")
    skill = db.query(ProjectRoleSkill).filter(ProjectRoleSkill.role_id == role_id, ProjectRoleSkill.skill_name == skill_name).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(skill)
    db.commit()
    return

@router.get("/recommendations/{project_id}", status_code=status.HTTP_200_OK)
def get_recommended_roles_optimized(
    project_id: int,
    project_role_id: Optional[int] = None,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    # 1. Obtener roles y sus skills en un solo query
    roles_query = (
        db.query(ProjectRole, ProjectRoleSkill)
        .outerjoin(ProjectRoleSkill, ProjectRole.role_id == ProjectRoleSkill.role_id)
        .filter(ProjectRole.project_id == project_id)
    )
    
    if project_role_id:
        roles_query = roles_query.filter(ProjectRole.role_id == project_role_id)
    
    roles_with_skills = roles_query.all()

    # Agrupar skills por rol
    roles_dict = defaultdict(lambda: {"skills": []})
    for role, skill in roles_with_skills:
        if "role_id" not in roles_dict[role.role_id]:
            roles_dict[role.role_id].update(
                role_id=role.role_id,
                name=role.name,
                description=role.description,
                feedback=role.feedback,
                project_id=role.project_id,
            )
        if skill:
            roles_dict[role.role_id]["skills"].append(skill)

    if not roles_dict:
        return [] if not project_role_id else {}

    # 2. Extraer skills únicas requeridas
    all_required_skills = set()
    for role_data in roles_dict.values():
        for skill in role_data["skills"]:
            all_required_skills.add((skill.skill_name, skill.type))

    if not all_required_skills:
        raise HTTPException(status_code=400, detail="Skills requeridas para mostrar recomendaciones")

    # 3. Obtener developers no asignados
    assigned_dev_ids_query = (
        db.query(Assignment.developer_id)
        .join(ProjectRole, ProjectRole.role_id == Assignment.project_role_id)
        .filter(
            and_(Assignment.developer_id != None,
                Assignment.status == "approved",
                or_(
                    ProjectRole.feedback.is_(None),
                    ProjectRole.feedback == ""
                )
            )
        )
        .distinct()
    )
    
    # 4. Obtener todos los developers disponibles (sin filtrar por skills aún)
    available_developers = (
        db.query(Developer, Employee)
        .join(Employee, Developer.employee_id == Employee.employee_id)
        .filter(~Developer.employee_id.in_(assigned_dev_ids_query))
        .all()
    )
    print(assigned_dev_ids_query.all())
    # 5. Obtener todas las skills de los developers disponibles
    available_dev_ids = [dev.employee_id for dev, emp in available_developers]
    
    developer_skills = (
        db.query(Skill)
        .filter(Skill.employee_id.in_(available_dev_ids))
        .all()
    )
    
    # 6. Crear mapeos
    dev_skills_map = defaultdict(list)
    for skill in developer_skills:
        dev_skills_map[skill.employee_id].append(skill)
    
    dev_info = {}
    for dev, emp in available_developers:
        dev_info[dev.employee_id] = {
            "developer_id": dev.employee_id,
            "name": emp.name,
            "last_name_1": emp.last_name_1,
            "last_name_2": emp.last_name_2,
        }

    # 7. Calcular matches para cada rol
    role_results = []
    for role_data in roles_dict.values():
        role_skills = role_data["skills"]
        required_skills = {
            (skill.skill_name, skill.type): skill.level 
            for skill in role_skills
        }

        candidates = []
        for dev_id in available_dev_ids:
            dev_skills = dev_skills_map.get(dev_id, [])
            dev_skills_map_inner = {
                (skill.skill_name, skill.type): skill.level 
                for skill in dev_skills
            }

            # Calcular match percentage
            if not required_skills:
                match_pct = 0
            else:
                matches_pct = []
                for (skill_name, skill_type), req_level in required_skills.items():
                    dev_level = dev_skills_map_inner.get((skill_name, skill_type), 0)
                    if dev_level > 0:
                        skill_match_pct = min(100, (dev_level * 100) / req_level)
                        matches_pct.append(skill_match_pct)
                    else:
                        matches_pct.append(0)
                
                match_pct = int(sum(matches_pct) / len(required_skills))

            # Solo incluir candidatos que tengan al menos una skill requerida
            if match_pct > 0:
                candidate = {**dev_info[dev_id], "match_percentage": match_pct}
                candidates.append(candidate)

        # Top 10 candidatos por match
        top_candidates = sorted(candidates, key=lambda x: x["match_percentage"], reverse=True)[:10]

        role_results.append({
            "role_id": role_data["role_id"],
            "name": role_data["name"],
            "description": role_data["description"],
            "feedback": role_data["feedback"],
            "project_id": role_data["project_id"],
            "skills": [
                {
                    "skill_name": skill.skill_name,
                    "level": skill.level,
                    "type": skill.type
                } for skill in role_data["skills"]
            ],
            "top_candidates": top_candidates
        })

    if project_role_id:
        return role_results[0] if role_results else {}
    return role_results

def get_developers_without_skill_filter(roles, db):
    """Maneja el caso cuando no hay skills requeridos"""
    assigned_dev_ids = (
        db.query(Assignment.developer_id)
        .join(ProjectRole, ProjectRole.role_id == Assignment.project_role_id)
        .filter(
            and_(
                Assignment.status == "approved",
                or_(
                    ProjectRole.feedback.is_(None),
                    ProjectRole.feedback == ""
                )
            )
        )
        .distinct()
        .subquery()
    )
    
    unassigned_devs = (
        db.query(Developer)
        .join(Employee, Developer.employee_id == Employee.employee_id)
        .filter(~Developer.employee_id.in_(assigned_dev_ids))
        .all()
    )
    
    role_results = []
    for role in roles:
        candidates = []
        for dev in unassigned_devs[:10]:
            employee = db.query(Employee).filter(Employee.employee_id == dev.employee_id).first()
            candidates.append({
                "developer_id": dev.employee_id,
                "name": employee.name,
                "last_name_1": employee.last_name_1,
                "last_name_2": employee.last_name_2,
                "match_percentage": 0,
            })
        
        role_skills = db.query(ProjectRoleSkill).filter(ProjectRoleSkill.role_id == role.role_id).all()
        
        role_results.append({
            "role_id": role.role_id,
            "name": role.name,
            "description": role.description,
            "feedback": role.feedback,
            "project_id": role.project_id,
            "skills": [
                {
                    "skill_name": skill.skill_name,
                    "level": skill.level,
                    "type": skill.type
                }
                for skill in role_skills
            ],
            "top_candidates": candidates
        })
    
    return role_results
    
@router.delete("/employee/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee_from_role(role_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    manager = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not manager.manager:
        raise HTTPException(status_code=400, detail="Manager not found")
    project_role = db.query(ProjectRole).filter(ProjectRole.role_id == role_id).first()
    if not project_role:
        raise HTTPException(status_code=400, detail="Role not found")
    
    
    project_manager = db.query(Project).filter(Project.manager_id == manager.employee_id and project_role.project_id == Project.project_id).first()
    if not project_manager:
        raise HTTPException(status_code=400, detail="Only manager who created project can edit")
    role = db.query(RoleDeveloper).filter(RoleDeveloper.project_role_id == role_id).first()
    db.delete(role)
    assigment = db.query(Assignment).filter(Assignment.project_role_id == project_role.role_id).first()
    db.delete(assigment)
    db.commit()
    return