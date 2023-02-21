FROM python:3.10 as builder

RUN pip install -U pdm
COPY pyproject.toml pdm.lock /code/
COPY src/ /code/src
WORKDIR /code
RUN mkdir __pypackages__ && pdm install --prod --no-lock --no-editable

FROM python:3.10-slim

ENV PYTHONPATH=/code/pkgs
COPY --from=builder /code/__pypackages__/3.10/lib /code/pkgs

CMD ["uvicorn", "main:app"]