from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

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
    id: int
    email: str
    
    class Config:
        from_attributes = True
    
class UserCreate(UserBase):
    password: str
    name: str
    position: str
    seniority: int
    rol: EmployeeRole

class EmployeeRegistered(User):
    name: str
    position: str
    seniority: int
    rol: EmployeeRole
    
class UserLogin(UserBase):
    password: str
    
class UserEdit(BaseModel):
    email: Optional[str] = Field(default=None, description="El correo del usuario")
    password: Optional[str] = Field(default=None, description="La contraseña en crudo")
    name: Optional[str] = Field(default=None, description="El nombre del usuario")
    position: Optional[str] = Field(default=None, description="El cargo del usuario")
    seniority: Optional[int] = Field(default=0, description="Nivel de antigüedad del empleado")
    
    class Config:
        from_attributes = True