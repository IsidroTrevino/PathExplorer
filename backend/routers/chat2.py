from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, case
from datetime import date, datetime
from dependencies import get_db, get_current_user
from schemas import AssignmentCreate, AssignmentResponse
from models import Assignment, Developer, ProjectRole, Project, Manager, Employee, TFS, RoleDeveloper, User, Skill, Certification, Goal, ProjectRoleSkill, Session, Message
from google import genai
from google.genai import types
from config import settings
import json
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

client = genai.Client(api_key = settings.GENAI_API_KEY)
router = APIRouter(
    prefix="/chat",
    tags=["ChatBot"]
)

class UserInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = {}
    additional_context: Optional[str] = None

class CreateSessionRequest(BaseModel):
    employee_id: Optional[int] = None
    user_context: Optional[str] = None
    user_info: Optional[Dict[str, Any]] = {}

class ChatMessage(BaseModel):
    message: str
    session_id: int

class ChatResponse(BaseModel):
    message_id: int
    response: str
    session_id: int
    timestamp: datetime

class SessionResponse(BaseModel):
    session_id: int
    employee_id: Optional[int]
    user_context: Optional[str]
    user_info: Optional[str]
    message_count: int
    created_at: datetime
    updated_at: datetime
    is_active: bool

class MessageResponse(BaseModel):
    message_id: int
    role: str
    content: str
    timestamp: datetime
    
@router.post("/sessions", response_model=SessionResponse)
async def create_session(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Crear una nueva sesión de chat"""
    # Verificar que el employee existe si se proporciona
    employee_req = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee_req:
        raise HTTPException(status_code=400, detail="Not authenticated")
    # Consultas
    skills = db.query(Skill).filter(Skill.employee_id == employee_req.employee_id).all()
    goals = db.query(Goal).filter(Goal.employee_id == employee_req.employee_id).all()
    certs = db.query(Certification).filter(Certification.employee_id == employee_req.employee_id).all()
    roles = db.query(ProjectRole).join(RoleDeveloper, RoleDeveloper.project_role_id == ProjectRole.role_id).filter(
        RoleDeveloper.developer_id == employee_req.employee_id).all()

    # Conversión a string legible
    skills_str = "\n".join([f"- {s.skill_name} (Nivel {s.level}, Tipo {s.type.name})" for s in skills])
    goals_str = "\n".join([f"- {g.title} ({g.category}, {g.term}): {g.description}" for g in goals])
    certs_str = "\n".join([f"- {c.name} ({c.type}) - {c.status}, Válida: {c.certification_date} a {c.expiration_date}" for c in certs])
    
    context = {}
    if employee_req.manager:
        context = settings.DEV_INSTR
        projects = db.query(Project).filter(Project.manager_id == employee_req.employee_id).all()
        if projects:
            roles_str = "\n".join([f"- {p.projectname}: {p.description}" for p in projects])
        summary = (
        f"Here is the employee profile summary:\n"
        f"Name: {employee_req.name}\n"
        f"Skills:\n"
        f"{skills_str or '- No registered skills.'}\n\n"
        f"Development Goals:\n"
        f"{goals_str or '- No goals have been set.'}\n\n"
        f"Certifications:\n"
        f"{certs_str or '- No certifications available.'}\n\n"
        f"Projects:\n"
        f"{roles_str or '- Not assigned to any project.'}"
        )
    elif employee_req.tfs:
        context = settings.DEV_INSTR
        summary = (
        f"Here is the employee profile summary:\n"
        f"Name: {employee_req.name}\n"
        f"Skills:\n"
        f"{skills_str or '- No registered skills.'}\n\n"
        f"Development Goals:\n"
        f"{goals_str or '- No goals have been set.'}\n\n"
        f"Certifications:\n"
        f"{certs_str or '- No certifications available.'}\n\n")
    elif employee_req.developer:
        context = settings.DEV_INSTR
        roles_str = "\n".join([f"- {r.name}: {r.description}" for r in roles])
        summary = (
        f"Here is the employee profile summary:\n"
        f"Name: {employee_req.name}\n"
        f"Skills:\n"
        f"{skills_str or '- No registered skills.'}\n\n"
        f"Development Goals:\n"
        f"{goals_str or '- No goals have been set.'}\n\n"
        f"Certifications:\n"
        f"{certs_str or '- No certifications available.'}\n\n"
        f"Assigned Roles in Projects:\n"
        f"{roles_str or '- Not assigned to any project roles.'}"
        )
        
    # Puedes imprimirlo, retornarlo o guardarlo
    print(summary)

    

    
    new_session = Session(
        employee_id=employee_req.employee_id,
        user_context=context,
        user_info=summary
    )
    
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    print(context)
    return SessionResponse(
        session_id=new_session.session_id,
        employee_id=employee_req.employee_id,
        user_context=new_session.user_context,
        user_info=new_session.user_info,
        message_count=0,
        created_at=new_session.created_at,
        updated_at=new_session.updated_at,
        is_active=new_session.is_active
    )
    
@router.post("/chat", response_model=ChatResponse)
async def chat(chat_request: ChatMessage, db: Session = Depends(get_db)):
    """Enviar mensaje a una sesión específica"""
    # Verificar que la sesión existe
    session = db.query(Session).filter(Session.session_id == chat_request.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")
    
    if not session.is_active:
        raise HTTPException(status_code=400, detail="La sesión está inactiva")
    
    # Crear mensaje del usuario
    user_message = Message(
        session_id=chat_request.session_id,
        role="user",
        content=chat_request.message
    )
    
    db.add(user_message)
    db.commit()
    db.refresh(user_message)
    
    # Obtener historial reciente (últimos 10 mensajes)
    recent_messages = db.query(Message)\
        .filter(Message.session_id == chat_request.session_id)\
        .order_by(Message.timestamp.desc())\
        .limit(20)\
        .all()
    
    recent_messages.reverse()  # Ordenar cronológicamente
    
    # Construir contexto para Gemini
    context_parts = []
    
    # Información del usuario/contexto de la sesión
    if session.user_context or session.user_info:
        user_context = "Context:\n"
        if session.user_info:
            user_context += f"- User Info: {session.user_info}\n"
        context_parts.append(user_context)
    
    # Historial de conversación
    if len(recent_messages) > 1:  # Excluir el mensaje actual
        conversation_history = "Recent message history:\n"
        for msg in recent_messages[:-1]:
            conversation_history += f"{msg.role.capitalize()}: {msg.content}\n"
        context_parts.append(conversation_history)
    
    context_parts.append(f"User: {chat_request.message}\nAssistant:")
    full_context = "\n".join(context_parts)
    
    # Generar respuesta con Gemini
    response = client.models.generate_content(model="gemini-2.0-flash", contents=full_context, config=types.GenerateContentConfig(
        system_instruction=session.user_context
    ))
    bot_response = response.text
    
    # Guardar respuesta del asistente
    assistant_message = Message(
        session_id=chat_request.session_id,
        role="assistant",
        content=bot_response
    )
    
    db.add(assistant_message)
    
    # Actualizar timestamp de la sesión
    session.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(assistant_message)
    
    return ChatResponse(
        message_id=assistant_message.message_id,
        response=bot_response,
        session_id=chat_request.session_id,
        timestamp=assistant_message.timestamp
    )
    
@router.get("/sessions/{session_id}/messages", response_model=List[MessageResponse])
async def get_session_messages(
    session_id: int, 
    skip: int = 0, 
    limit: int = 50, 
    db: Session = Depends(get_db)
):
    """Obtener mensajes de una sesión con paginación"""
    session = db.query(Session).filter(Session.session_id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")
    
    messages = db.query(Message)\
        .filter(Message.session_id == session_id)\
        .order_by(Message.timestamp.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    return [
        MessageResponse(
            message_id=msg.message_id,
            role=msg.role,
            content=msg.content,
            timestamp=msg.timestamp
        ) for msg in reversed(messages)
    ]