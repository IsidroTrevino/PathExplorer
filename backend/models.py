from database import Base
from sqlalchemy import String, Integer, Float, Column, ForeignKey, Enum
from enum import Enum as Enum2

class EmployeeRole(str, Enum2):
    Developer = "Developer"
    TFS = "TFS"
    Manager = "Manager"
    
class User(Base):
    __tablename__ = "User"
    id = Column(Integer, primary_key = True, index = True, nullable=False)
    email = Column(String(100), unique = True, index = True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
class Employee(Base):
    __tablename__ = "Employee"
    employee_id = Column(Integer, primary_key = True, index = True, nullable=False)
    user_id = Column(Integer, ForeignKey("User.id"))
    name = Column(String(100), nullable=False)
    position = Column(String(50), nullable=False)
    seniority = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey("User.id"))
    rol = Column(Enum(EmployeeRole), nullable=False)
    
class OTP(Base):
    __tablename__ = "OTP"
    otp_id = Column(Integer, primary_key=True, nullable=False)
    email = Column(String(100), ForeignKey("User.email"))
    otp = Column(Integer, nullable= False)