# Python Backend Dockerfile
FROM python:3.11-slim

# Install system dependencies for OpenCV and Tesseract
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Expose the Flask port
EXPOSE 5000

# Run the backend
CMD ["python", "app.py"]
