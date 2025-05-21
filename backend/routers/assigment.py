from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, case
from datetime import date
from dependencies import get_db, get_current_user
from schemas import AssignmentCreate, AssignmentResponse
from models import Assignment, Developer, ProjectRole, Project, Manager, Employee, TFS, RoleDeveloper

router = APIRouter(
    prefix="/assignments",
    tags=["Assignments"]
)

#Asignar a tfs automaticamente
@router.post("/", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
def request_developer_assignment(
    assignment: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Verificar que el usuario actual es un Manager
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    manager = db.query(Manager).filter(Manager.employee_id == employee.employee_id).first()
    if not manager:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can request assignments."
        )
    
    # Verificar que el rol del proyecto existe
    project_role = db.query(ProjectRole).filter(ProjectRole.role_id == assignment.project_role_id).first()
    if not project_role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project role not found."
        )
    
    # Verificar que el proyecto existe
    project = db.query(Project).filter(Project.project_id == assignment.project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found."
        )
    
    # Crear un nuevo registro de asignación
    new_assignment = Assignment(
        request_date=date.today(),
        approval_date=None,
        status="pending",
        comments=assignment.comments,
        tfs_id=assignment.tfs_id,
        manager_id=manager.employee_id,
        developer_id=assignment.developer_id,
        project_role_id=assignment.project_role_id,
        project_id=assignment.project_id
    )
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    
    return new_assignment

@router.put("/{assignment_id}/approve", status_code=status.HTTP_200_OK)
def approve_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Verificar que el usuario actual es un TFS
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    tfs = db.query(TFS).filter(TFS.employee_id == employee.employee_id).first()
    if not tfs:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only TFS employees can approve assignments."
        )

    # Verificar que el Assignment existe
    assignment = db.query(Assignment).filter(Assignment.assignment_id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found."
        )

    # Verificar que el Assignment está pendiente
    if assignment.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assignment is not in a pending state."
        )

    # Actualizar el estado del Assignment a "approved"
    assignment.status = "approved"
    assignment.tfs_id = tfs.employee_id
    assignment.approval_date = date.today()
    db.commit()
    db.refresh(assignment)

    # Insertar el rol en la tabla RoleDeveloper
    new_role_developer = RoleDeveloper(
        developer_id=assignment.developer_id,
        project_role_id=assignment.project_role_id
    )
    db.add(new_role_developer)
    db.commit()
    db.refresh(new_role_developer)

    return {
        "message": "Assignment approved and role assigned successfully.",
        "assignment": assignment,
        "role_developer": new_role_developer
    }
    
@router.put("/{assignment_id}/reject", status_code=status.HTTP_200_OK)
def reject_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Verificar que el usuario actual es un TFS
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    tfs = db.query(TFS).filter(TFS.employee_id == employee.employee_id).first()
    if not tfs:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only TFS employees can reject assignments."
        )

    # Verificar que el Assignment existe
    assignment = db.query(Assignment).filter(Assignment.assignment_id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found."
        )

    # Verificar que el Assignment está pendiente
    if assignment.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assignment is not in a pending state."
        )

    # Actualizar el estado del Assignment a "rejected"
    assignment.status = "rejected"
    db.commit()
    db.refresh(assignment)

    return {"message": "Assignment rejected successfully."}
@router.get("/pending-assignments", status_code=status.HTTP_200_OK)
def get_pending_assignments_for_tfs(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Verificar que el usuario actual es un TFS
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    tfs = db.query(TFS).filter(TFS.employee_id == employee.employee_id).first()
    if not tfs:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only TFS employees can view pending assignments."
        )

    # Obtener las asignaciones pendientes
    pending_assignments = db.query(Assignment).filter(
        Assignment.status == "pending"
    ).all()

    if not pending_assignments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No pending assignments found for this TFS."
        )

    for assignment in pending_assignments:
        # Obtener el desarrollador asociado a la asignación
        developer = db.query(Employee).filter(Employee.employee_id == assignment.developer_id).first()
        if developer:
            assignment.developer_name = f"{developer.name} {developer.last_name_1}"
        else:
            assignment.developer_name = "Unknown"

        project = db.query(Project).filter(Project.project_id == assignment.project_id).first()
        if project:
            assignment.project_name = project.projectname
        else:
            assignment.project_name = "Unknown"
        
    
    # Formatear la respuesta
    result = [
        {
            "assignment_id": assignment.assignment_id,
            "request_date": assignment.request_date,
            "comments": assignment.comments,
            "developer_id": assignment.developer_id,
            "developer_name": assignment.developer_name,
            "project_role_id": assignment.project_role_id,
            "project_id": assignment.project_id,
            "project_name": assignment.project_name,
        }
        for assignment in pending_assignments
    ]

    return {"tfs_id": tfs.employee_id, "pending_assignments": result}


