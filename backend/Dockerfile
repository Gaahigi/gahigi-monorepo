# Use a base Python image with version 3.11.8
FROM python:3.11.8-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    VIRTUAL_ENV=/home/user/gahigi-monorepo/backend/venv \
    PATH="$VIRTUAL_ENV/bin:$PATH"

# Set the work directory inside the container
WORKDIR /home/user/gahigi-monorepo/backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create a virtual environment
RUN python -m venv $VIRTUAL_ENV

# Copy the backend code and requirements
COPY ./backend/requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy the backend source code
COPY ./backend /home/user/gahigi-monorepo/backend

# Expose the port for FastAPI (default is 8000)
EXPOSE 8000

# Command to run the FastAPI application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
