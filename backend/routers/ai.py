from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, case
from datetime import date
from dependencies import get_db, get_current_user
from schemas import AssignmentCreate, AssignmentResponse
from models import Assignment, Developer, ProjectRole, Project, Manager, Employee, TFS, RoleDeveloper, User, Skill, Certification, Goal
from openai import OpenAI
from config import settings
import json

client = OpenAI(api_key=settings.OPENAI_API_KEY, base_url="https://api.deepseek.com")
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

    # Prompt del asistente
    messages = [
        {"role": "system", "content": "Eres un asistente de IA que ayuda a los empleados a obtener recomendaciones de certificaciones basadas en sus habilidades."},
        {"role": "user", "content": "Aquí tienes una lista de habilidades, certificaciones y metas de un empleado. Necesito que me ayudes a generar recomendaciones de certificaciones para este empleado, en el formato JSON indicado. No me des más información que la solicitada. Devuelve solamente el JSON, sin texto adicional. No lo envuelvas en Markdown."},
        {"role": "user", "content": f"Habilidades: {', '.join([skill.skill_name for skill in skills])}"},
        {"role": "user", "content": f"Certificaciones: {', '.join(cert_names)}"},
        {"role": "user", "content": f"Metas: {', '.join([goal.title for goal in goals])}"},
        {"role": "user", "content": """Formato JSON:
{
  "message": "Hola, en base a tus habilidades, certificaciones y metas, veo que (aquí hacer un análisis de las habilidades y metas del empleado), te recomiendo las siguientes certificaciones:",
  "certifications": [
    {
      "name": "Meta Backend Developer Certificate",
      "type": "Certificación profesional",
      "description": "Programa profesional enfocado en desarrollo backend con Python, Django, bases de datos y despliegue de APIs. Incluye proyectos prácticos."
    }
  ]
}"""}
    ]

    # Llamada al modelo
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
        temperature=0.7,
        stream=False
    )

    # Parsear contenido como JSON válido
    content = response.choices[0].message.content.strip()
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

    # Construir prompt para el modelo
    messages = [
        {"role": "system", "content": "Eres un asistente de IA que ayuda a los empleados a obtener recomendaciones de feedback basadas en sus roles y proyectos."},
        {"role": "user", "content": "Genera recomendaciones de feedback en formato JSON. No me des más información que la solicitada. Devuelve solamente el JSON, sin texto adicional. No lo envuelvas en Markdown."},
        {"role": "user", "content": f"Estos son los roles y proyectos del empleado:\n{json.dumps(roles_info, ensure_ascii=False)}"},
        {"role": "user", "content": """Formato esperado:
{
  "message": "Hola, en base a tus roles y proyectos, veo que (aquí hacer un análisis...), te recomiendo las siguientes acciones para mejorar tu desempeño:",
  "feedback": [
    {
      "action": "Nombre de la acción",
      "description": "Descripción breve de la acción recomendada."
    }
  ]
}"""}
    ]

    # Llamar al modelo
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
        temperature=0.7
    )

    content = response.choices[0].message.content.strip()

    # Parsear JSON
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error al procesar la respuesta del modelo. Asegúrate de que el formato JSON sea correcto.")
