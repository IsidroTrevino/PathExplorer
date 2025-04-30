from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import User, OTP
from schemas import UserBase, UserOTPVerify
from config import settings
from dependencies import get_db
import random, smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from utils import hash_password

router = APIRouter(prefix="/otp", tags=["OTP"])

@router.post("/send")
def send_otp(input_user: UserBase, db: Session = Depends(get_db)):
    email = input_user.email
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El campo 'email' es requerido.")

    db_user = db.query(User).filter(User.email == email).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    otp_code = random.randint(100000, 999999)

    # Elimina OTPs anteriores si existen
    db.query(OTP).filter(OTP.email == email).delete()

    # Enviar correo
    sender_email = "PathExplorer@test-dnvo4d97kjng5r86.mlsender.net"
    receiver_email = email
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
                <img src="cid:logo_image" alt="Logo" style="max-width:180px; width: 50%">
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
    message = MIMEMultipart("alternative")
    message["Subject"] = "OTP code for password reset"
    message["From"] = sender_email
    message["To"] = receiver_email
    message.attach(MIMEText(html_content, "html"))

    with open("logo.png", "rb") as img_file:
        img_data = img_file.read()
    image = MIMEImage(img_data)
    image.add_header("Content-ID", "<logo_image>")
    message.attach(image)

    try:
        with smtplib.SMTP(settings.smtp_server, settings.smtp_port) as server:
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(sender_email, receiver_email, message.as_string())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al enviar el correo: {str(e)}")

    db.add(OTP(email=email, otp=otp_code))
    db.commit()

    return {"message": "OTP sent to the email given."}

@router.post("/verify")
def verify_otp(input_user: UserOTPVerify, db: Session = Depends(get_db)):
    user = db.query(OTP).filter(OTP.otp == input_user.otp).first()
    if user is None:
        raise HTTPException(status_code=404, detail="OTP not found")

    db.query(OTP).filter(OTP.otp == input_user.otp).delete()
    db.commit()

    hashed = hash_password(input_user.password).decode("utf-8")
    db.query(User).filter(User.email == input_user.email).update({"hashed_password": hashed})
    db.commit()

    return {"message": "Success on updating password"}
