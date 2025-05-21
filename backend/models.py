from dependencies import Base
from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    Text,
    ForeignKey,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from schemas import EmployeeRole, SkillType

# Tabla "User"
class User(Base):
    __tablename__ = "User"
    id = Column(Integer, primary_key=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(Text, nullable=False)
    # Relación uno-a-uno con Employee
    employee = relationship("Employee", back_populates="user", uselist=False)

# Tabla "Employee" (base para la herencia)
class Employee(Base):
    __tablename__ = "Employee"
    employee_id = Column(Integer, primary_key=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("User.id", ondelete="SET NULL"), unique=True)
    name = Column(String(100), nullable=False)
    last_name_1 = Column(String(100), nullable=False)
    last_name_2 = Column(String(100))
    phone_number = Column(String(50), nullable=False)
    location = Column(String(100), nullable=False)
    capability = Column(String(100), nullable=False)
    position = Column(String(50), nullable=False)
    seniority = Column(Integer, nullable=False)
    role = Column(SQLEnum(EmployeeRole), nullable=False)
    
    user = relationship("User", back_populates="employee")
    # Relaciones opcionales con las subtablas (uno a uno)
    manager = relationship("Manager", uselist=False, back_populates="employee")
    developer = relationship("Developer", uselist=False, back_populates="employee")
    tfs = relationship("TFS", uselist=False, back_populates="employee")

# Tabla "Manager"
class Manager(Base):
    __tablename__ = "Manager"
    employee_id = Column(Integer, ForeignKey("Employee.employee_id", ondelete="CASCADE"), primary_key=True)
    staff_days = Column(Integer)
    
    employee = relationship("Employee", back_populates="manager")

# Tabla "Developer"
class Developer(Base):
    __tablename__ = "Developer"
    employee_id = Column(Integer, ForeignKey("Employee.employee_id", ondelete="CASCADE"), primary_key=True)
    staff_days = Column(Integer)
    
    employee = relationship("Employee", back_populates="developer")

# Tabla "TFS"
class TFS(Base):
    __tablename__ = "TFS"
    employee_id = Column(Integer, ForeignKey("Employee.employee_id", ondelete="CASCADE"), primary_key=True)
    speciality_area = Column(String(100), nullable=False)
    
    employee = relationship("Employee", back_populates="tfs")

# Tabla "OTP"
class OTP(Base):
    __tablename__ = "OTP"
    otp_id = Column(Integer, primary_key=True, nullable=False)
    email = Column(String(100), ForeignKey("User.email", ondelete="CASCADE"), nullable=False)
    otp = Column(Integer, nullable=False)

# Tabla "Project"
class Project(Base):
    __tablename__ = "Project"
    project_id = Column(Integer, primary_key=True, index=True, nullable=False)
    projectname = Column(String(100))
    client = Column(String(100))
    description = Column(Text)
    startdate = Column(Date)
    enddate = Column(Date)
    manager_id = Column(Integer, ForeignKey("Manager.employee_id"))
    employees_req = Column(Integer)

# Tabla "ProjectRole" – Roles necesarios para un proyecto
class ProjectRole(Base):
    __tablename__ = "ProjectRole"
    role_id = Column(Integer, primary_key=True, index=True, nullable=False)
    name = Column(String(100))
    description = Column(Text)
    feedback = Column(Text)
    project_id = Column(Integer, ForeignKey("Project.project_id", ondelete="SET NULL"))

# Tabla "RoleDeveloper" – Registra la asignación de un Role (ProjectRole) a un Developer (histórico)
class RoleDeveloper(Base):
    __tablename__ = "RoleDeveloper"
    role_log_id = Column(Integer, primary_key=True, index=True, nullable=False)
    developer_id = Column(Integer, ForeignKey("Developer.employee_id", ondelete="CASCADE"))
    project_role_id = Column(Integer, ForeignKey("ProjectRole.role_id", ondelete="CASCADE"))


class Skill(Base):
    __tablename__ = "Skill"

    skill_id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String(100), nullable=False)
    level = Column(Integer, nullable=False)
    type = Column(SQLEnum(SkillType), nullable=False)
    employee_id = Column(Integer, ForeignKey("Employee.employee_id", ondelete="CASCADE"), nullable=False)
    
class Goal(Base):
    __tablename__ = "Goal"

    goal_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(String(300), nullable=False)
    term = Column(String(50), nullable=False)
    employee_id = Column(Integer, ForeignKey("Employee.employee_id", ondelete="CASCADE"), nullable=False)
    
class Certification(Base):
    __tablename__ = "Certification"

    certification_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(100), nullable=False)
    description = Column(String, nullable=True)
    certification_date = Column(Date, nullable=False)
    expiration_date = Column(Date, nullable=False)
    status = Column(String(50), nullable=False, default="active")
    employee_id = Column(Integer, ForeignKey("Employee.employee_id", ondelete="CASCADE"), nullable=False)
    
class Assignment(Base):
    __tablename__ = "Assignment"

    assignment_id = Column(Integer, primary_key=True, index=True, nullable=False)
    request_date = Column(Date, nullable=False)
    approval_date = Column(Date, nullable=True)
    status = Column(String(50), nullable=False, default="pending")
    comments = Column(Text, nullable=True)
    tfs_id = Column(Integer, ForeignKey("TFS.employee_id", ondelete="SET NULL"), nullable=True)
    manager_id = Column(Integer, ForeignKey("Manager.employee_id", ondelete="SET NULL"), nullable=True)
    developer_id = Column(Integer, ForeignKey("Developer.employee_id", ondelete="SET NULL"), nullable=True)
    project_role_id = Column(Integer, ForeignKey("ProjectRole.role_id", ondelete="SET NULL"), nullable=False)
    project_id = Column(Integer, ForeignKey("Project.project_id", ondelete="SET NULL"), nullable=False)

    # Relaciones
    tfs = relationship("TFS", backref="assignments")
    manager = relationship("Manager", backref="assignments")
    developer = relationship("Developer", backref="assignments")
    project_role = relationship("ProjectRole", backref="assignments")
    project = relationship("Project", backref="assignments")
    
class Curriculum(Base):
    __tablename__ = "Curriculum"

    employee_id = Column(Integer,  ForeignKey("Employee.employee_id", ondelete="SET NULL"), nullable=True, primary_key=True)
    file_key = Column(Text, nullable=False)

    # Relación con Employee
    employee = relationship("Employee", backref="curriculum")
    
class ProjectRoleSkill(Base):
    __tablename__ = "ProjectRoleSkills"

    role_id = Column(Integer, ForeignKey("ProjectRole.role_id", ondelete="CASCADE"), primary_key=True)
    skill_name = Column(String(100), primary_key=True)
    level = Column(Integer, nullable=False)
    type = Column(SQLEnum(SkillType), nullable=False)