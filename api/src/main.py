import json
from fastapi import Body, FastAPI
from pydantic import BaseModel
from model.database import subdivide

app = FastAPI()

class Geometry(BaseModel):
    coordinates: list
    type: str

class Feature(BaseModel):
    type: str
    geometry: Geometry

class Boundary(BaseModel):
    type: str
    features: list[Feature]

class Params(BaseModel):
    subTasks: int
    splitBy: list[str]

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/project")
async def project(boundary: Boundary, params: Params):
    return subdivide(boundary, params)