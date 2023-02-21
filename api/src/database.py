import psycopg2
import os
import json

db_host = os.environ['DB_HOST']
db_user = os.environ['DB_USER']
db_password = os.environ['DB_PASSWORD']
connection = psycopg2.connect(
    f'dbname=postgres user={db_user} password={db_password} host={db_host}'
)
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