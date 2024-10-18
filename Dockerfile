FROM python:3.9-buster

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN apt-get update --fix-missing && \
    apt-get install -y gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

COPY . /app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
