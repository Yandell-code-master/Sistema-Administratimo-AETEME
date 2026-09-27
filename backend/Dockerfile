# Imagen de desarrollo: incluye el SDK completo (no solo el runtime)
# para poder compilar y correr dentro del contenedor.
FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /app

# Copiamos primero los archivos de proyecto para aprovechar la cache de Docker:
# si el código cambia pero las dependencias no, no vuelve a hacer restore.
COPY *.sln .
COPY **/*.csproj ./
RUN dotnet restore

COPY . .

EXPOSE 8080

# Ajustar "TuProyecto.Api" al nombre real del proyecto principal cuando lo tengan.
CMD ["dotnet", "watch", "run", "--project", "TuProyecto.Api", "--urls", "http://0.0.0.0:8080"]
