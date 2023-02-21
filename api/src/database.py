import psycopg2
import os
import json

connection = psycopg2.connect(os.environ['DATABASE_URL'])
cursor = connection.cursor()

def subdivide(req: str) -> str:
    geojson = json.dumps(req['boundary'])
    subtasks = json.dumps(req['params']['subTasks'])

    query = """
WITH data AS (SELECT '{}'::json AS fc),
features AS (SELECT json_array_elements(fc->'features') AS feat
  FROM data),
geometry AS
(SELECT ST_GeomFromGeoJSON(feat->>'geometry') AS geom FROM features),
geom_pts AS
(SELECT (ST_Dump(ST_GeneratePoints(geom, 1000))).geom AS geom
FROM geometry),
geom_pts_clustered AS
(SELECT geom, ST_ClusterKMeans(geom, '{}') over () AS cluster
FROM geom_pts),
geom_centers AS
(SELECT cluster, ST_Centroid(ST_collect(geom)) AS geom
FROM geom_pts_clustered
GROUP BY cluster),
geom_voronoi AS
(SELECT (ST_Dump(ST_VoronoiPolygons(ST_collect(geom)))).geom AS geom
FROM geom_centers),
geom_divided AS
(SELECT ST_Intersection(a.geom, b.geom) AS geom
FROM geometry a
CROSS JOIN geom_voronoi b)

SELECT ST_AsGeoJSON(geom)
FROM geom_divided;
    """.format(geojson, subtasks)

    cursor.execute(query)
    return cursor.fetchall()

def geojson_to_geom(req: str) -> str:
    geojson = json.dumps(req['boundary'])

    query = """
WITH data AS (SELECT '{}'::json AS fc)

SELECT
  row_number() OVER () AS gid,
  ST_AsText(ST_GeomFromGeoJSON(feat->>'geometry')) AS geom,
  feat->'properties' AS properties
FROM (
  SELECT json_array_elements(fc->'features') AS feat
  FROM data
) AS f;
    """.format(geojson)

    cursor.execute(query)
    return cursor.fetchone()


with open('./sample-data/request.json', 'r') as file:
    req = json.loads(file.read())
    geom = geojson_to_geom(req)
    print(geom)