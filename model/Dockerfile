FROM python:3.13-slim

WORKDIR /app

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Use uvicorn to run FastAPI, bind to 0.0.0.0 to accept external connections
CMD ["uvicorn", "app.api:app", "--host", "0.0.0.0", "--port", "8000"]