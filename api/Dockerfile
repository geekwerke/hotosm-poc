FROM python:3.10-slim

SHELL ["/bin/bash", "-c"]

RUN pip install -U pdm
COPY pyproject.toml pdm.lock /code/
COPY src/ /code/src
WORKDIR /code
RUN pdm install --prod --no-lock --no-editable
CMD [".venv/bin/uvicorn", "src.main:app"]