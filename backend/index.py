#index.py
from main import app
from fastapi_pagination import add_pagination

add_pagination(app)

app = app