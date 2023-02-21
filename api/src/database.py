import psycopg2
import os
import json

connection = psycopg2.connect(os.environ['DATABASE_URL'])
cursor = connection.cursor()


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