from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
from datetime import date

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: int | None = None
    
class EmployeeRole(str, Enum):
    Developer = "Developer"
    TFS = "TFS"
    Manager = "Manager"

class UserBase(BaseModel):
    email: str
        
    class Config:
        from_attributes = True

class User(BaseModel):
    user_id: int
    email: str
    
    class Config:
        from_attributes = True
    
class UserCreate(UserBase):
    password: str
    name: str
    last_name_1: str
    last_name_2: Optional[str]
    phone_number: str
    location: str
    capability: str
    position: str
    seniority: int
    role: EmployeeRole

class EmployeeRegistered(User):
    employee_id: int
    name: str
    last_name_1: str
    last_name_2: Optional[str]
    phone_number: str
    location: str
    capability: str
    position: str
    seniority: int
    role: EmployeeRole
    
    class Config:
        from_attributes = True
    
class EmployeeList(BaseModel):
    name: str
    last_name_1: str
    last_name_2: Optional[str]
    phone_number: str
    location: str
    capability: str
    position: str
    seniority: int
    role: EmployeeRole
    
    class Config:
        from_attributes = True
    
class UserLogin(UserBase):
    password: str
    
class UserEdit(BaseModel):
    email: Optional[str] = Field(default=None, description="El correo del usuario")
    password: Optional[str] = Field(default=None, description="La contraseña en crudo")
    name: Optional[str] = Field(default=None, description="El nombre del usuario")
    last_name_1: Optional[str] = Field(default=None, description="El primer apellido del usuario")
    last_name_2: Optional[str] = Field(default=None, description="El segundo apellido del usuario")
    phone_number: Optional[str] = Field(default=None, description="El número de teléfono del usuario")
    location: Optional[str] = Field(default=None, description="La ubicación del usuario")
    capability: Optional[str] = Field(default=None, description="La capability del usuario")
    position: Optional[str] = Field(default=None, description="El cargo del usuario")
    seniority: Optional[int] = Field(default=0, description="Nivel de antigüedad del empleado")
    role: Optional[EmployeeRole] = Field(default=None, description="El rol del usuario")
    
    class Config:
        from_attributes = True

class UserOTP(UserBase):
    otp: int
    
class UserOTPVerify(UserOTP):
    password: str
    
class ProjectCreate(BaseModel):
    projectName: str
    client: str
    description: str
    startDate: date
    endDate: date
    employees_req: int
    
    class Config:
        from_attributes = True
        
class ProjectRegistered(ProjectCreate):
    project_id: int
    manager_id: int
    manager: str
    
class SkillType(str, Enum):
    hard = "hard"
    soft = "soft"

class SkillCreate(BaseModel):
    name: str
    type: SkillType
    level: int
    
    class Config:
        from_attributes = True
        
class SkillResponse(SkillCreate):
    skill_id: int
    
    class Config:
        from_attributes = True

class GoalCreate(BaseModel):
    title: str
    category: str
    description: str
    term: str

class GoalResponse(GoalCreate):
    goal_id: int

    class Config:
        from_attributes = True

class CertificationCreate(BaseModel):
    name: str
    type: str
    description: Optional[str] = None
    certification_date: date
    expiration_date: date

class CertificationResponse(CertificationCreate):
    certification_id: int
    status: str

    class Config:
        from_attributes = True