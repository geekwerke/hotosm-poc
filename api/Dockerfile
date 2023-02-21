FROM python:3.10-slim

SHELL ["/bin/bash", "-c"]
WORKDIR /code

RUN pip install -U pdm
COPY pyproject.toml pdm.lock /code/
RUN pdm install --prod --no-lock --no-editable

COPY src/ /code/src
COPY sample-data/ /code/sample-data

ENV PYTHONPATH="/code/.venv/lib:/code/src"
ENV PATH="/code/.venv/bin:$PATH"

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0"]