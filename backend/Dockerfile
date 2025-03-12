# Use official Python image
FROM python:3.11-slim

# Set environment variables for better performance
ENV PYTHONUNBUFFERED=1 \
    PYTHONFAULTHANDLER=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100

# Set working directory
WORKDIR /app

# Install dependencies directly (without virtual environment)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

#Copy data files
COPY gsite/data/Sleep.csv /app/gsite/data/Sleep.csv

# Copy Gunicorn config
COPY gunicorn.conf.py .

# Expose port
EXPOSE 8000

# Start Gunicorn with Uvicorn workers
CMD ["gunicorn", "-c", "gunicorn.conf.py", "backend.asgi:application"]
