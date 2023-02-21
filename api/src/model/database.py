import psycopg2
import os
import json

connection = psycopg2.connect(os.environ['DATABASE_URL'])
cursor = connection.cursor()

def subdivide(geometry, params):
    subtasks = params.subTasks

    query = """
WITH geometry AS (
  SELECT ST_GeomFromGeoJSON('{}') AS geom
),
geom_pts AS (
  SELECT (ST_Dump(ST_GeneratePoints(geom, 1000))).geom AS geom
  FROM geometry),
geom_pts_clustered AS (
  SELECT geom, ST_ClusterKMeans(geom, '{}') over () AS cluster
  FROM geom_pts),
geom_centers AS (
  SELECT cluster, ST_Centroid(ST_collect(geom)) AS geom
  FROM geom_pts_clustered
  GROUP BY cluster),
geom_voronoi AS (
  SELECT (ST_Dump(ST_VoronoiPolygons(ST_collect(geom)))).geom AS geom
  FROM geom_centers),
geom_divided AS (
  SELECT ST_Intersection(a.geom, b.geom) AS geom
  FROM geometry a
  CROSS JOIN geom_voronoi b)

SELECT ST_AsGeoJSON(geom)
FROM geom_divided;
    """.format(geometry, subtasks)

    cursor.execute(query)
    return cursor.fetchall()
