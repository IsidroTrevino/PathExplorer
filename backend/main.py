from fastapi import FastAPI
from fastapi_pagination import add_pagination

# Routers
from routers import auth, users, profile, otp, projects, skills, goals, certifications

app = FastAPI()

# Registro de routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(profile.router)
app.include_router(otp.router)
app.include_router(projects.router)
app.include_router(skills.router)
app.include_router(goals.router)
app.include_router(certifications.router)

add_pagination(app)
