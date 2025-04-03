from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from auth import create_access_token
from schemas import UserBase, UserCreate, EmployeeRegistered, UserLogin, User, UserEdit, UserOTP, UserOTPVerify
from database import SessionLocal, engine
from dependencies import get_current_user
import models
import bcrypt
import random
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from config import settings

db = SessionLocal()

app = FastAPI()

def hash_password(password: str) -> bytes:
    bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(bytes, salt)
    return hashed

def verify_password(plain_password: str, hashed_password: bytes) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)


@app.post("/token", status_code=200)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    email = form_data.username
    password = form_data.password
    user = db.query(models.User).filter(models.User.email == email).first()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not verify_password(password, user.hashed_password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    # Aquí, en lugar de pasar "sub": user.email, pasamos el id
    access_token = create_access_token(data={"id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}  

@app.post("/register", status_code=200)
def register(user: UserCreate):
    maybe_user = db.query(models.User).filter(models.User.email == user.email).first()
    if maybe_user is not None:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = hash_password(user.password).decode('utf-8')
    new_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    user_id = db.query(models.User).filter(models.User.email == user.email).first().id
    new_employee = models.Employee(name=user.name, position=user.position, seniority=user.seniority, user_id=user_id, rol=user.rol)
    db.add(new_employee)
    db.commit()
    
    access_token = create_access_token(data={"id": user_id})
    
    return {
        "message": "User registered successfully",
        "user_id": user_id,
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.get("/users/{user_id}", response_model=EmployeeRegistered, status_code=200)
def getUserInfo(user_id: int, current_user: User = Depends(get_current_user)):
    
    userRequest = db.query(models.User).filter(models.User.id == current_user.id).first()
    
    employeeRequest = db.query(models.Employee).filter(models.Employee.user_id == userRequest.id).first()
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if user.id != userRequest.id and employeeRequest.rol != "Manager":
        raise HTTPException(status_code=403, detail="Not enough permissions ")
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    employee = db.query(models.Employee).filter(models.Employee.user_id == user.id).first()
    
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    
    return EmployeeRegistered(id=user.id, email=user.email, name=employee.name, position=employee.position, seniority=employee.seniority, rol=employee.rol)

@app.get("/my-info", response_model=EmployeeRegistered, status_code=200)
def getMyInfo(current_user: User = Depends(get_current_user)):
    
    user= db.query(models.User).filter(models.User.id == current_user.id).first()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    employee = db.query(models.Employee).filter(models.Employee.user_id == user.id).first()
    
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    
    return EmployeeRegistered(id=user.id, email=user.email, name=employee.name, position=employee.position, seniority=employee.seniority, rol=employee.rol)

@app.put("/edit", response_model=UserEdit, status_code=200)
def edit_user(user_edit: UserEdit, current_user: User = Depends(get_current_user)):
    user_db = db.query(models.User).filter(models.User.id== current_user.id).first()
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    employee_db = db.query(models.Employee).filter(models.Employee.user_id == user_db.id).first()
    if not employee_db:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    update_data = user_edit.model_dump(exclude_unset=True)
    
    user_update = {}
    employee_update = {}
    
    if "email" in update_data:
        user_update["email"] = update_data["email"]
    if update_data.get("email") != user_db.email:
        maybe_user = db.query(models.User).filter(models.User.email == update_data["email"]).first()
        if maybe_user:
            raise HTTPException(status_code=400, detail="Email already registered")

    if update_data.get("email") == "" or update_data.get("email") == None or update_data.get("email") == "string":
        raise HTTPException(status_code=400, detail="Email cannot be empty")
        
    if "password" in update_data:
        # Hasheamos la nueva contraseña
        hashed = hash_password(update_data["password"]).decode("utf-8")
        user_update["hashed_password"] = hashed
    if "name" in update_data:
        employee_update["name"] = update_data["name"]
    if "position" in update_data:
        employee_update["position"] = update_data["position"]
    if "seniority" in update_data:
        employee_update["seniority"] = update_data["seniority"]
    
    if user_update:
        db.query(models.User).filter(models.User.id == user_db.id).update(user_update)
    
    if employee_update:
        db.query(models.Employee).filter(models.Employee.user_id == user_db.id).update(employee_update)
    
    db.commit()
    
    return {"message": "User updated successfully"}

@app.post("/send-otp")
def send_otp(input_user: UserBase):
    email = input_user.email
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El campo 'email' es requerido."
        )
    
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado."
        )
    
    # Configuración SMTP
    port = settings.smtp_port
    smtp_server = settings.smtp_server
    smtp_user = settings.smtp_user
    smtp_password = settings.smtp_password
    sender_email = "PathExplorer@test-dnvo4d97kjng5r86.mlsender.net"
    receiver_email = email
    
    otp_code = random.randint(100000, 999999)
    
    user = db.query(models.OTP).filter(models.OTP.email == email)
    if user is not None:
        user.delete()
        
    # Contenido HTML
    html_content = f"""\
<html lang="en">
  <body style="margin:0;padding:0;background-color:#F9F9F9;font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:40px 10px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.05);overflow:hidden;">
            <!-- Header con logo incrustado -->
            <tr>
              <td style="background-color:#8338EC;padding:30px;text-align:center;">
                <img src="cid:logo_image" alt="Logo" style="max-width:180px;">
              </td>
            </tr>
            <!-- Cuerpo del mensaje -->
            <tr>
              <td style="padding:30px;color:#1A1A1A;">
                <p style="font-size:16px;line-height:1.6;">Hello Explorer,</p>
                <p style="font-size:16px;line-height:1.6;">
                  To reset your password, use the 6-digit code below. This code is valid for the next 60 minutes:
                </p>
                <div style="text-align:center;margin:30px 0;">
                  <div style="display:inline-block;padding:12px 24px;font-size:28px;font-weight:bold;letter-spacing:8px;background-color:#F4F1FF;color:#8338EC;border-radius:8px;">
                    {otp_code}
                  </div>
                </div>
                <p style="font-size:14px;line-height:1.6;color:#555;">
                  If you didn’t request a password reset, please ignore this email or contact our support team.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color:#F0F0F0;text-align:center;padding:20px;color:#555;font-size:13px;">
                © 2025 Path Explorer · All rights reserved<br/>
                <a href="https://path-explorer.com" style="color:#8338EC;text-decoration:underline;">Visit our website</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    """

    # Crear objeto del email
    message = MIMEMultipart("alternative")
    message["Subject"] = "OTP code for password reset"
    message["From"] = sender_email
    message["To"] = receiver_email
    html_part = MIMEText(html_content, "html")
    message.attach(html_part)
    
    # Adjuntar la imagen del logo
    with open("logo.png", "rb") as img_file:
            img_data = img_file.read()
    image = MIMEImage(img_data)
    image.add_header("Content-ID", "<logo_image>")
    image.add_header("Content-Disposition", "inline", filename="logo.png")
    message.attach(image)

    # Enviar el email usando smtplib
    try:
        with smtplib.SMTP(smtp_server, port) as server:
            server.starttls()  # Asegura la conexión
            server.login(smtp_user, smtp_password)
            server.sendmail(sender_email, receiver_email, message.as_string())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al enviar el correo: {str(e)}"
        )
    userotp = models.OTP(email = email, otp = otp_code)
    db.add(userotp)
    db.commit()
    # Retornar el OTP 
    return {"message": "OTP sent to the email given."}

@app.post("/verify-otp")
def verify_otp(input_user: UserOTPVerify):
    user = db.query(models.OTP).filter(models.OTP.otp == input_user.otp).first()
    print(user)
    if user is None:
        raise HTTPException(status_code=404, detail="OTP not found")
    user.delete()
    db.commit()
    userUpdate = {}
    userUpdate["email"] = input_user.email
    userUpdate["hashed_password"] = hash_password(input_user.password).decode("utf-8")
    db.query(models.User).filter(models.User.email == input_user.email).update(userUpdate)
    db.commit()
    
    return {"message": "Success on updating password"}
    