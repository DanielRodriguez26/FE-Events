# 🐳 Guía de Despliegue con Docker - Mis Eventos

Esta guía te ayudará a desplegar la aplicación Mis Eventos usando Docker y Docker Compose.

## 📋 Prerrequisitos

- Docker Desktop instalado y funcionando
- Docker Compose v2.0 o superior
- Al menos 4GB de RAM disponible
- Puertos 80, 3000, 5432, 6379, 8000 disponibles

## 🚀 Despliegue Rápido

### 1. Clonar y configurar

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd FE-Events

# Copiar archivo de configuración
cp env.example .env

# Editar configuración (IMPORTANTE)
nano .env
```

### 2. Configurar variables de entorno

Edita el archivo `.env` con tus configuraciones:

```env
# Base de datos
POSTGRES_PASSWORD=tu_password_seguro
POSTGRES_DB=miseventos

# Backend
SECRET_KEY=tu_clave_secreta_muy_segura
VITE_API_URL=http://localhost:8000

# Redis
REDIS_PASSWORD=tu_password_redis
```

### 3. Desplegar

#### En Linux/Mac:
```bash
./deploy.sh
```

#### En Windows (PowerShell):
```powershell
.\deploy.ps1
```

#### Manualmente:
```bash
# Construir y desplegar
docker-compose up -d --build

# Verificar estado
docker-compose ps
```

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │    Frontend     │    │     Backend     │
│   (Puerto 80)   │◄──►│   (Puerto 3000) │◄──►│   (Puerto 8000) │
│   Proxy Reverso │    │     React       │    │     FastAPI     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐    ┌─────────────────┐
                    │   PostgreSQL    │    │      Redis      │
                    │   (Puerto 5432) │    │   (Puerto 6379) │
                    │     Database    │    │      Cache      │
                    └─────────────────┘    └─────────────────┘
```

## 🔧 Servicios Incluidos

### Frontend (React + Vite)
- **Puerto**: 3000
- **URL**: http://localhost:3000
- **Tecnología**: React, TypeScript, Tailwind CSS
- **Build**: Optimizado para producción

### Backend (FastAPI)
- **Puerto**: 8000
- **URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Tecnología**: Python, FastAPI, SQLAlchemy

### Base de Datos (PostgreSQL)
- **Puerto**: 5432
- **Base de datos**: miseventos
- **Persistencia**: Volumen Docker

### Cache (Redis)
- **Puerto**: 6379
- **Uso**: Sesiones y caché
- **Persistencia**: Volumen Docker

### Proxy Reverso (Nginx)
- **Puerto**: 80
- **Funciones**: 
  - Proxy reverso
  - Compresión gzip
  - Caché de archivos estáticos
  - Rate limiting
  - SSL/TLS (opcional)

## 📊 Comandos Útiles

### Gestión de Contenedores

```bash
# Ver estado de los servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f frontend
docker-compose logs -f backend

# Reiniciar un servicio
docker-compose restart frontend

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

### Mantenimiento

```bash
# Limpiar imágenes no utilizadas
docker system prune -f

# Limpiar volúmenes no utilizados
docker volume prune -f

# Reconstruir un servicio específico
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Monitoreo

```bash
# Ver uso de recursos
docker stats

# Verificar salud de los servicios
docker-compose ps

# Probar conectividad
curl http://localhost/health
curl http://localhost:3000/
curl http://localhost:8000/health
```

## 🔒 Configuración de Seguridad

### Variables de Entorno Críticas

```env
# Cambiar en producción
SECRET_KEY=clave_muy_segura_y_larga
POSTGRES_PASSWORD=password_complejo
REDIS_PASSWORD=password_redis_seguro
```

### Configuración de Nginx

- Rate limiting configurado
- Headers de seguridad
- Compresión gzip
- Caché optimizado

### Usuario No-Root

- Los contenedores ejecutan con usuario no-root
- Permisos de archivos restringidos
- Health checks configurados

## 🚨 Solución de Problemas

### Problemas Comunes

#### 1. Puerto ya en uso
```bash
# Verificar qué proceso usa el puerto
netstat -tulpn | grep :80
# o en Windows
netstat -ano | findstr :80

# Cambiar puerto en .env
NGINX_HTTP_PORT=8080
```

#### 2. Error de permisos en Docker
```bash
# En Linux, agregar usuario al grupo docker
sudo usermod -aG docker $USER
# Reiniciar sesión
```

#### 3. Contenedor no inicia
```bash
# Ver logs detallados
docker-compose logs frontend

# Verificar configuración
docker-compose config
```

#### 4. Base de datos no conecta
```bash
# Verificar que PostgreSQL esté listo
docker-compose exec postgres pg_isready

# Ver logs de la base de datos
docker-compose logs postgres
```

### Logs y Debugging

```bash
# Ver todos los logs
docker-compose logs

# Logs con timestamps
docker-compose logs -t

# Logs de los últimos 100 líneas
docker-compose logs --tail=100

# Logs en tiempo real
docker-compose logs -f
```

## 📈 Optimizaciones de Producción

### 1. Configuración de Nginx

- Compresión gzip habilitada
- Caché de archivos estáticos
- Rate limiting configurado
- Headers de seguridad

### 2. Configuración de Docker

- Multi-stage build para optimizar tamaño
- Usuario no-root para seguridad
- Health checks configurados
- Volúmenes persistentes

### 3. Variables de Entorno

- Configuración por entorno
- Valores por defecto seguros
- Documentación clara

## 🔄 Actualizaciones

### Actualizar la Aplicación

```bash
# 1. Hacer pull de los cambios
git pull origin main

# 2. Reconstruir y desplegar
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 3. Verificar que todo funcione
docker-compose ps
```

### Backup de Base de Datos

```bash
# Crear backup
docker-compose exec postgres pg_dump -U postgres miseventos > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U postgres miseventos < backup.sql
```

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs`
2. Verifica la configuración: `docker-compose config`
3. Consulta esta documentación
4. Revisa los issues del repositorio

## 🎯 Próximos Pasos

- [ ] Configurar SSL/TLS
- [ ] Implementar CI/CD
- [ ] Configurar monitoreo (Prometheus/Grafana)
- [ ] Implementar backup automático
- [ ] Configurar load balancing



