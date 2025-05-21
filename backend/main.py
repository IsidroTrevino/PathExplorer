from fastapi import FastAPI
from fastapi_pagination import add_pagination

# Routers
from routers import auth, users, profile, otp, projects, skills, goals, certifications, assigment, projectrole, curriculum, ai

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
app.include_router(assigment.router)
app.include_router(projectrole.router)
app.include_router(curriculum.router)
app.include_router(ai.router)

add_pagination(app)
