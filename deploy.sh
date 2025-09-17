#!/bin/bash

# ===========================================
# SCRIPT DE DESPLIEGUE - MIS EVENTOS
# ===========================================

set -e  # Salir si cualquier comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con colores
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}===========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===========================================${NC}"
}

# Verificar que Docker esté instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker no está instalado. Por favor instala Docker primero."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
        exit 1
    fi
    
    print_message "Docker y Docker Compose están instalados correctamente."
}

# Verificar archivo de entorno
check_env_file() {
    if [ ! -f ".env" ]; then
        print_warning "Archivo .env no encontrado. Creando desde env.example..."
        if [ -f "env.example" ]; then
            cp env.example .env
            print_warning "IMPORTANTE: Edita el archivo .env con tus configuraciones antes de continuar."
            read -p "¿Deseas continuar? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        else
            print_error "No se encontró env.example. Por favor crea un archivo .env manualmente."
            exit 1
        fi
    fi
}

# Limpiar contenedores y volúmenes anteriores
cleanup() {
    print_header "LIMPIANDO CONTENEDORES ANTERIORES"
    
    print_message "Deteniendo contenedores existentes..."
    docker-compose down --remove-orphans || true
    
    print_message "Limpiando imágenes no utilizadas..."
    docker system prune -f || true
    
    print_message "Limpieza completada."
}

# Construir y desplegar
deploy() {
    print_header "CONSTRUYENDO Y DESPLEGANDO APLICACIÓN"
    
    print_message "Construyendo imágenes..."
    docker-compose build --no-cache
    
    print_message "Iniciando servicios..."
    docker-compose up -d
    
    print_message "Esperando a que los servicios estén listos..."
    sleep 30
    
    # Verificar estado de los servicios
    print_message "Verificando estado de los servicios..."
    docker-compose ps
}

# Verificar salud de los servicios
health_check() {
    print_header "VERIFICANDO SALUD DE LOS SERVICIOS"
    
    # Verificar frontend
    print_message "Verificando frontend..."
    if curl -f http://localhost:3000/ > /dev/null 2>&1; then
        print_message "✓ Frontend está funcionando correctamente"
    else
        print_warning "⚠ Frontend no responde en el puerto 3000"
    fi
    
    # Verificar backend
    print_message "Verificando backend..."
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        print_message "✓ Backend está funcionando correctamente"
    else
        print_warning "⚠ Backend no responde en el puerto 8000"
    fi
    
    # Verificar nginx
    print_message "Verificando nginx..."
    if curl -f http://localhost/ > /dev/null 2>&1; then
        print_message "✓ Nginx está funcionando correctamente"
    else
        print_warning "⚠ Nginx no responde en el puerto 80"
    fi
}

# Mostrar logs
show_logs() {
    print_header "LOGS DE LOS SERVICIOS"
    docker-compose logs --tail=50
}

# Función principal
main() {
    print_header "DESPLIEGUE DE MIS EVENTOS"
    
    # Verificaciones previas
    check_docker
    check_env_file
    
    # Preguntar si se desea limpiar
    read -p "¿Deseas limpiar contenedores anteriores? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cleanup
    fi
    
    # Desplegar
    deploy
    
    # Verificar salud
    health_check
    
    # Mostrar información final
    print_header "DESPLIEGUE COMPLETADO"
    print_message "La aplicación está disponible en:"
    print_message "  - Frontend: http://localhost:3000"
    print_message "  - Backend API: http://localhost:8000"
    print_message "  - Nginx Proxy: http://localhost"
    
    print_message "Para ver los logs: ./deploy.sh logs"
    print_message "Para detener: docker-compose down"
    print_message "Para reiniciar: docker-compose restart"
}

# Manejo de argumentos
case "${1:-}" in
    "logs")
        show_logs
        ;;
    "health")
        health_check
        ;;
    "cleanup")
        cleanup
        ;;
    "deploy")
        deploy
        ;;
    *)
        main
        ;;
esac



