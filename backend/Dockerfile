# Docker trabaja por capas (cada instrucción es una capa). Si una capa usa archivos que no
# cambiaron, esa capa se reutiliza; si cambian, se rehace esa capa y todas las siguientes.

# Imagen de desarrollo: incluye el SDK completo (no solo el runtime)
# para poder compilar y correr dentro del contenedor.
FROM mcr.microsoft.com/dotnet/sdk:10.0

WORKDIR /app

# Copiamos primero los archivos de proyecto, respetando la estructura de carpetas,
# para aprovechar la cache de Docker: si cambia el código pero no las dependencias,
# no se vuelve a hacer restore.
COPY ./API/API.slnx ./API/
COPY ./API/API/API.csproj ./API/API/
RUN dotnet restore ./API/API/API.csproj

COPY . .

# Esto sive solamente para documentar, no abre el puerto
EXPOSE 8080

# Variables de entorno para que .NET sepa cómo configurar el proyecto.
# Esto es para que la aplicacion escuche en todas sus interfaces de red y en el puerto 8080, por defecto las aplicaciones de .NET escuchan en localhost esto es un problema por que de esa forma no podriamos acceder a la aplicacion ya que solamente permitiria peticiones de su propia maquina
ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Development \
    DOTNET_USE_POLLING_FILE_WATCHER=1 \
    DOTNET_WATCH_SUPPRESS_BROWSER_REFRESH=true

CMD ["dotnet", "watch", "run", "--project", "./API/API/API.csproj", "--no-launch-profile"]
