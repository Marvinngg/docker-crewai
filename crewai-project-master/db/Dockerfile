# Use the official MySQL image.
FROM mysql:latest

# Set the environment variables.
ENV MYSQL_ROOT_PASSWORD=123456
ENV MYSQL_DATABASE=crewai

# Copy the database initialization script.
COPY crewai.sql /docker-entrypoint-initdb.d/

# Expose the port MySQL runs on.
EXPOSE 3306
