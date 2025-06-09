from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, case
from datetime import date
from dependencies import get_db, get_current_user
from schemas import AssignmentCreate, AssignmentResponse
from models import Assignment, Developer, ProjectRole, Project, Manager, Employee, TFS, RoleDeveloper, User, Skill, Certification, Goal, ProjectRoleSkill
from google import genai
from google.genai import types
from config import settings
import json

client = genai.Client(api_key = settings.GENAI_API_KEY)
router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


@router.get("/certifications", status_code=status.HTTP_201_CREATED)
def request_certification(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    employee = db.query(Employee).filter(Employee.user_id == user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    skills = db.query(Skill).filter(Skill.employee_id == employee.employee_id).all()
    if not skills:
        raise HTTPException(status_code=404, detail="No skills found for this employee")
    
    certifications = db.query(Certification).filter(Certification.employee_id == employee.employee_id).all()
    cert_names = [cert.name for cert in certifications] if certifications else ["Ninguna certificación registrada"]
    
    goals = db.query(Goal).filter(Goal.employee_id == employee.employee_id).all()
    if not goals:
        raise HTTPException(status_code=404, detail="No goals found for this employee")

    response = client.models.generate_content( 
        model = "gemini-2.0-flash",
        contents = ["Here is a list of an employee's skills, certifications, and goals. I need you to generate four certification recommendations for this employee in the indicated JSON format. Do not provide any information other than the requested one. Respond ONLY with the JSON, do not add any extra text or markdown.", 
                f"Skills: {', '.join([skill.skill_name for skill in skills])}",
                f"Certifications: {', '.join(cert_names)}",
                f"Goals: {', '.join([goal.title for goal in goals])}",
                """JSON Format:
                {
                "message": "Hello, based on your skills, certifications, and goals, I see that (insert analysis of the employee's skills and goals here), I recommend the following certifications:",
                "certifications": [
                    {
                    "name": "Meta Backend Developer Certificate",
                    "type": "Professional Certification",
                    "description": "Professional program focused on backend development with Python, Django, databases, and API deployment. Includes practical projects.",
                    "url": "https://www.coursera.org/professional-certificates/meta-back-end-developer"
                    },
                ]
                }"""],
        config=types.GenerateContentConfig(
            system_instruction="You are an AI assistant that helps employees get certification recommendations based on their skills.",                                                      
    ))

    # Parsear contenido como JSON válido
    content = response.text.strip().removeprefix("```json").removesuffix("```")
    print(content)
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error al procesar la respuesta del modelo. Asegúrate de que el formato JSON sea correcto.")
    
@router.get("/feedback", status_code=status.HTTP_200_OK)
def request_feedback(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Validación de usuario
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    employee = db.query(Employee).filter(Employee.user_id == user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Obtener roles del empleado
    roles = db.query(RoleDeveloper).filter(RoleDeveloper.developer_id == employee.employee_id).all()
    if not roles:
        raise HTTPException(status_code=404, detail="No roles found for this employee")
    
    # Obtener ProjectRoles relacionados
    project_role_ids = [r.project_role_id for r in roles]
    project_roles = db.query(ProjectRole).filter(ProjectRole.role_id.in_(project_role_ids)).all()
    if not project_roles:
        raise HTTPException(status_code=404, detail="No project roles found")

    # Obtener proyectos relacionados
    project_ids = list(set(pr.project_id for pr in project_roles))
    projects = db.query(Project).filter(Project.project_id.in_(project_ids)).all()
    if not projects:
        raise HTTPException(status_code=404, detail="No projects found")

    # Indexar datos para acceso rápido
    role_map = {pr.role_id: pr for pr in project_roles}
    project_map = {p.project_id: p for p in projects}

    # Armar datos para el modelo
    roles_info = []
    for role in roles:
        pr = role_map.get(role.project_role_id)
        if not pr:
            continue
        project = project_map.get(pr.project_id)
        roles_info.append({
            "role_name": pr.name,
            "role_feedback": pr.feedback,
            "project_name": project.projectname if project else "",
            "project_description": project.description if project else ""
        })

    if not roles_info:
        raise HTTPException(status_code=404, detail="No valid role/project matches found")

    response = client.models.generate_content( 
        model = "gemini-2.0-flash",
        contents = [
        "You are an AI assistant that helps employees get feedback recommendations based on their roles and projects.",
        "Generate feedback recommendations in JSON format. Do not provide any information other than the requested one. Respond ONLY with the JSON, do not add any extra text or markdown.",
        f"These are the employee's roles and projects:\n{json.dumps(roles_info, ensure_ascii=False)}",
        """Expected format:
        {
        "message": "Hello, based on your roles and projects, I see that (insert analysis here...), I recommend the following actions to improve your performance:",
        "feedback": [
            {
            "action": "Action name",
            "description": "Brief description of the recommended action."
            }
        ]
        }"""],
        config=types.GenerateContentConfig(
            system_instruction="You are an AI assistant that helps employees get feedback recommendations based on their roles and projects.",                                                      
    ))

    # Parsear contenido como JSON válido
    content = response.text.strip().removeprefix("```json").removesuffix("```")
    try:
        print(content)
        return json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error al procesar la respuesta del modelo. Asegúrate de que el formato JSON sea correcto.")
    
@router.get("/future-roles", status_code=status.HTTP_200_OK)
def recommend_future_roles(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    import json

    # Obtener usuario y empleado
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    employee = db.query(Employee).filter(Employee.user_id == user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Obtener roles históricos del usuario
    roles = db.query(RoleDeveloper).filter(RoleDeveloper.developer_id == employee.employee_id).all()
    if not roles:
        raise HTTPException(status_code=404, detail="No roles found for this employee")

    # Obtener información de los ProjectRole y sus skills
    project_role_ids = [r.project_role_id for r in roles]
    project_roles = db.query(ProjectRole).filter(ProjectRole.role_id.in_(project_role_ids)).all()
    if not project_roles:
        raise HTTPException(status_code=404, detail="No project roles found")

    # Obtener skills de cada rol
    role_skills_map = {}
    for pr in project_roles:
        skills = db.query(ProjectRoleSkill).filter(ProjectRoleSkill.role_id == pr.role_id).all()
        role_skills_map[pr.role_id] = [
            {"skill_name": s.skill_name, "level": s.level, "type": s.type.value} for s in skills
        ]

    # Armar datos para el prompt
    roles_info = []
    for pr in project_roles:
        roles_info.append({
            "role_name": pr.name,
            "role_description": pr.description,
            "role_skills": role_skills_map.get(pr.role_id, [])
        })

    response = client.models.generate_content( 
        model = "gemini-2.0-flash",
        contents = [
        "Based on the user's previous roles and their associated skills, recommend 3 different future roles that the user could pursue considering current industry trends. For each recommended role, provide the role name, a brief description, a list of key skills (with type and suggested level) and a list of 4 steps to follow to achieve the role. Respond ONLY with the JSON, do not add any extra text or markdown.",
        f"Previous roles and skills:\n{json.dumps(roles_info, ensure_ascii=False)}",
        """Expected format:
        {
        "recommendations": [
            {
            "role_name": "Future Role Name",
            "role_description": "Brief description of the role.",
            "role_skills": [
                {"skill_name": "Skill 1", "type": "hard/soft", "level": 3}
            ],
            "roadmap": [
                {"step": "Step 1", "description": "Description of the step to achieve this role."},
                {"step": "Step 2", "description": "Description of the next step."}
            ]"
            }
        ]
        }"""
        ],
        config=types.GenerateContentConfig(
            system_instruction="You are an AI assistant specialized in career development and industry trends.",                                                      
    ))

    # Parsear contenido como JSON válido
    content = response.text.strip().removeprefix("```json").removesuffix("```")

    # Parsear JSON
    try:
        print(content)
        return json.loads(content)
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error al procesar la respuesta del modelo. Asegúrate de que el formato JSON sea correcto.")
