FROM python:3.13-alpine

# Creamos un usuario sin privilegios para ejecutar la aplicación
RUN adduser -D -H -u 10001 appuser

WORKDIR /app

# Copiamos los archivos con el usuario ROOT pero le damos permisos al usuario appuser para que pueda acceder a ellos
COPY --chown=appuser:appuser . .

USER appuser

EXPOSE 8000

CMD ["python", "-u", "-m", "http.server", "8000", "--bind", "0.0.0.0", "--directory", "/app", "--protocol", "HTTP/1.1"]