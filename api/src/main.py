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
    geometry = json.dumps(boundary.features[0].geometry.__dict__)
    polygons = subdivide(geometry, params)
    geometries = [json.loads(x) for (x,) in polygons]
    features = [{"type": "Feature", "properties": {}, "geometry": geo} for geo in geometries]
    return {"split": {"type": "FeatureCollection", "features": features}}