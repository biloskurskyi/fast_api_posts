# Вибір базового образу з Python
FROM python:3.9-slim

# Встановлення робочої директорії в контейнері
WORKDIR /app

# Копіювання requirements файлу в робочу директорію
COPY ./requirements.txt /app/requirements.txt

# Оновлення системи і встановлення залежностей
RUN apt-get update --fix-missing && \
    apt-get install -y gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Встановлення Python-залежностей
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Копіювання всіх файлів проекту в контейнер
COPY . /app

# Відкриття порту для FastAPI (за замовчуванням 8000)
EXPOSE 8000

# Запуск FastAPI додатка з використанням Uvicorn сервера
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
