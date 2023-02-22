POC for HOTOSM FMTM project.

- The [`api`](./api) folder has the code for the Python backend.
- The [`ui`](./ui) folder has the code for the React frontend.

## Architecture

<img width="1120" alt="architecture" src="https://user-images.githubusercontent.com/11095038/220077539-059229bf-be86-4e6f-8488-44b0ee610f26.png">

## Running the app

Create a file `.env` in the root directory with the following example content.

``` sh
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=123
DB_HOST=127.0.0.1
```

and then run:

``` sh
$ docker-compose up -d --build
```

This will spawn 3 docker containers:

1. Postgres database with postgis extension installed.
2. FastAPI service with region splitting APIs on port 8000. 
3. React frontend on port 3000.

## How to use the Region Splitting API

Make a post request to `/project` with the schema present in `api/sample-data/request.json`.
[Httpie](https://github.com/httpie/httpie) command:

``` sh
http POST :8000/project @api/sample-data/request.json
```

## Approach

### Phase 1

The user should be able to draw an Area of Interest (AOI) and specify either the number of subtasks they want it divided into, or the maximum area one task should cover. The region is divided into roughly equal portions according to this specification (dividers like roads are ignored, this is left for phase 2).

This information is then transmitted via API to the backend, with the AOI encoded as GeoJSON. This GeoJSON is the converted and projected into a geometry for processing using PostGIS. If a maximum area was specified, the area of the AOI is calculated and divided by this number to obtain the number of subdivisions required.

The algorithm for subdivision is as follows:
1. Random points (default 1000) are generated within the AOI
2. They are then clustered using K means clustering into the desired number of partitions
3. The center of each cluster is determined
4. Voronoi cells are created representing the points closer to each centre than any other
5. These Voronoi polygons are intersected with the original AOI to give the subdivisions

The subdivisions are then converted back into lat-long GeoJSON and transmitted back to the frontend.

![Screenshot_2023-02-22_09-19-09](https://user-images.githubusercontent.com/1161104/220518469-7b56481e-d110-4e62-8157-5372573ad11e.png)

### Phase 2

The user should additionally be able to specify the types of dividers that they want considered e.g. roads, railways, water bodies

Upon such a request, the backend creates a minimum bounding box for the AOI and queries Overpass API to obtain and store the desired geographical entities in the DB as lines. It also clips out any entities which are inside the bounding box but outside the AOI proper.

The algorithm for subdivision is as follows:
1. Using ST_Relate with a DE-9IM of `T********` we determine all the lines that properly intersect the AOI (i.e. not including lines that only touch the AOI)
2. From these lines, we determine which are simple closed loops using ST_IsRing, and ST_Split them from the AOI.
3. We then recursively reduce the polygons and lines by splitting. Only lines which ST_Relate to a polygon with a DE-9IM of `TF*******` (indicating that the line divides the polygon) are used for splitting. Once a polygon falls below the maximum_area specified by the user, it is ignored for further reduction.
4. This reduction continues until all the lines are consumed or all polygons have fallen below the maximum_area. In the case of the former, phase 1's equal area division is used to further subdivide any remaining polygons which are above the area limit.
