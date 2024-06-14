# Use an official Python image.
FROM python:3.11

# Install poetry.
RUN pip install poetry

# Create and change to the app directory.
WORKDIR /app

# Copy app files.
COPY . .

# Install app dependencies.
RUN poetry install

# Expose the port the app runs on.
EXPOSE 3001

# Run the app.
CMD ["poetry", "run", "python", "api.py"]
