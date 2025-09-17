# ===========================================
# SCRIPT DE DESPLIEGUE - MIS EVENTOS (PowerShell)
# ===========================================

param(
    [string]$Action = "deploy"
)

# Función para imprimir mensajes con colores
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Header {
    param([string]$Message)
    Write-Host "===========================================" -ForegroundColor Blue
    Write-Host $Message -ForegroundColor Blue
    Write-Host "===========================================" -ForegroundColor Blue
}

# Verificar que Docker esté instalado
function Test-Docker {
    try {
        $dockerVersion = docker --version
        $composeVersion = docker-compose --version
        Write-Info "Docker y Docker Compose están instalados correctamente."
        Write-Info "Docker: $dockerVersion"
        Write-Info "Compose: $composeVersion"
    }
    catch {
        Write-Error "Docker o Docker Compose no están instalados. Por favor instala Docker Desktop primero."
        exit 1
    }
}

# Verificar archivo de entorno
function Test-EnvFile {
    if (-not (Test-Path ".env")) {
        Write-Warning "Archivo .env no encontrado. Creando desde env.example..."
        if (Test-Path "env.example") {
            Copy-Item "env.example" ".env"
            Write-Warning "IMPORTANTE: Edita el archivo .env con tus configuraciones antes de continuar."
            $response = Read-Host "¿Deseas continuar? (y/N)"
            if ($response -notmatch "^[Yy]$") {
                exit 1
            }
        }
        else {
            Write-Error "No se encontró env.example. Por favor crea un archivo .env manualmente."
            exit 1
        }
    }
}

# Limpiar contenedores y volúmenes anteriores
function Invoke-Cleanup {
    Write-Header "LIMPIANDO CONTENEDORES ANTERIORES"
    
    Write-Info "Deteniendo contenedores existentes..."
    docker-compose down --remove-orphans
    
    Write-Info "Limpiando imágenes no utilizadas..."
    docker system prune -f
    
    Write-Info "Limpieza completada."
}

# Construir y desplegar
function Invoke-Deploy {
    Write-Header "CONSTRUYENDO Y DESPLEGANDO APLICACIÓN"
    
    Write-Info "Construyendo imágenes..."
    docker-compose build --no-cache
    
    Write-Info "Iniciando servicios..."
    docker-compose up -d
    
    Write-Info "Esperando a que los servicios estén listos..."
    Start-Sleep -Seconds 30
    
    # Verificar estado de los servicios
    Write-Info "Verificando estado de los servicios..."
    docker-compose ps
}

# Verificar salud de los servicios
function Test-Health {
    Write-Header "VERIFICANDO SALUD DE LOS SERVICIOS"
    
    # Verificar frontend
    Write-Info "Verificando frontend..."
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Info "✓ Frontend está funcionando correctamente"
        }
    }
    catch {
        Write-Warning "⚠ Frontend no responde en el puerto 3000"
    }
    
    # Verificar backend
    Write-Info "Verificando backend..."
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Info "✓ Backend está funcionando correctamente"
        }
    }
    catch {
        Write-Warning "⚠ Backend no responde en el puerto 8000"
    }
    
    # Verificar nginx
    Write-Info "Verificando nginx..."
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Info "✓ Nginx está funcionando correctamente"
        }
    }
    catch {
        Write-Warning "⚠ Nginx no responde en el puerto 80"
    }
}

# Mostrar logs
function Show-Logs {
    Write-Header "LOGS DE LOS SERVICIOS"
    docker-compose logs --tail=50
}

# Función principal
function Main {
    Write-Header "DESPLIEGUE DE MIS EVENTOS"
    
    # Verificaciones previas
    Test-Docker
    Test-EnvFile
    
    # Preguntar si se desea limpiar
    $cleanupResponse = Read-Host "¿Deseas limpiar contenedores anteriores? (y/N)"
    if ($cleanupResponse -match "^[Yy]$") {
        Invoke-Cleanup
    }
    
    # Desplegar
    Invoke-Deploy
    
    # Verificar salud
    Test-Health
    
    # Mostrar información final
    Write-Header "DESPLIEGUE COMPLETADO"
    Write-Info "La aplicación está disponible en:"
    Write-Info "  - Frontend: http://localhost:3000"
    Write-Info "  - Backend API: http://localhost:8000"
    Write-Info "  - Nginx Proxy: http://localhost"
    
    Write-Info "Para ver los logs: .\deploy.ps1 -Action logs"
    Write-Info "Para detener: docker-compose down"
    Write-Info "Para reiniciar: docker-compose restart"
}

# Manejo de acciones
switch ($Action.ToLower()) {
    "logs" {
        Show-Logs
    }
    "health" {
        Test-Health
    }
    "cleanup" {
        Invoke-Cleanup
    }
    "deploy" {
        Invoke-Deploy
    }
    default {
        Main
    }
}



