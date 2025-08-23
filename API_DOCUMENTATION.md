# API Documentation - Mis Eventos

## 📋 Descripción General

La API de Mis Eventos es una REST API desarrollada con FastAPI que proporciona endpoints para la gestión completa de eventos, usuarios, autenticación y sesiones.

## 🔗 Base URL

```
Development: http://localhost:8000
Production: https://api.miseventos.com
```

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Los tokens deben incluirse en el header `Authorization`:

```
Authorization: Bearer <token>
```

## 📚 Endpoints

### 🔑 Autenticación

#### POST /auth/login
Iniciar sesión de usuario.

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "usuario@ejemplo.com",
    "role": "user"
  }
}
```

#### POST /auth/register
Registrar nuevo usuario.

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "phone": "+573001234567"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "usuario@ejemplo.com",
  "phone": "+573001234567",
  "created_at": "2024-03-15T10:00:00Z"
}
```

#### POST /auth/refresh
Renovar token de acceso.

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 📅 Eventos

#### GET /events
Obtener lista de eventos con paginación.

**Query Parameters:**
- `page` (int, optional): Número de página (default: 1)
- `size` (int, optional): Tamaño de página (default: 10)
- `title` (string, optional): Filtrar por título
- `location` (string, optional): Filtrar por ubicación
- `date_from` (string, optional): Fecha desde (YYYY-MM-DD)
- `date_to` (string, optional): Fecha hasta (YYYY-MM-DD)

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "title": "Conferencia de Tecnología 2024",
      "description": "La mejor conferencia de tecnología del año",
      "start_date": "2024-03-15T10:00:00Z",
      "location": "Centro de Convenciones",
      "organizer": "TechCorp",
      "capacity": 500,
      "price": 150000,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "page": 1,
  "size": 10,
  "total_items": 50,
  "total_pages": 5
}
```

#### GET /events/{event_id}
Obtener detalles de un evento específico.

**Response (200):**
```json
{
  "id": 1,
  "title": "Conferencia de Tecnología 2024",
  "description": "La mejor conferencia de tecnología del año",
  "start_date": "2024-03-15T10:00:00Z",
  "end_date": "2024-03-15T18:00:00Z",
  "location": "Centro de Convenciones",
  "organizer": "TechCorp",
  "capacity": 500,
  "price": 150000,
  "registered_attendees": 350,
  "sessions": [
    {
      "id": 1,
      "title": "Introducción a React",
      "start_time": "2024-03-15T10:00:00Z",
      "end_time": "2024-03-15T11:30:00Z",
      "speaker": "María González",
      "room": "Sala A"
    }
  ],
  "created_at": "2024-01-15T10:00:00Z"
}
```

#### POST /events
Crear nuevo evento (requiere autenticación).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Nuevo Evento",
  "description": "Descripción del evento",
  "start_date": "2024-04-15T10:00:00Z",
  "end_date": "2024-04-15T18:00:00Z",
  "location": "Centro de Convenciones",
  "organizer": "Mi Empresa",
  "capacity": 200,
  "price": 100000
}
```

**Response (201):**
```json
{
  "id": 2,
  "title": "Nuevo Evento",
  "description": "Descripción del evento",
  "start_date": "2024-04-15T10:00:00Z",
  "end_date": "2024-04-15T18:00:00Z",
  "location": "Centro de Convenciones",
  "organizer": "Mi Empresa",
  "capacity": 200,
  "price": 100000,
  "created_at": "2024-03-15T10:00:00Z"
}
```

#### PUT /events/{event_id}
Actualizar evento (requiere autenticación).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Evento Actualizado",
  "description": "Nueva descripción",
  "capacity": 300
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Evento Actualizado",
  "description": "Nueva descripción",
  "capacity": 300,
  "updated_at": "2024-03-15T11:00:00Z"
}
```

#### DELETE /events/{event_id}
Eliminar evento (requiere autenticación).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (204):**
```
No Content
```

### 👥 Usuarios

#### GET /users/profile
Obtener perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "usuario@ejemplo.com",
  "phone": "+573001234567",
  "created_at": "2024-01-01T00:00:00Z",
  "events_registered": [
    {
      "id": 1,
      "title": "Conferencia de Tecnología 2024",
      "status": "registered",
      "registration_date": "2024-02-01T10:00:00Z"
    }
  ]
}
```

#### PUT /users/profile
Actualizar perfil del usuario.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Juan Carlos Pérez",
  "phone": "+573001234568"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Juan Carlos Pérez",
  "email": "usuario@ejemplo.com",
  "phone": "+573001234568",
  "updated_at": "2024-03-15T12:00:00Z"
}
```

### 🎫 Registro a Eventos

#### POST /events/{event_id}/register
Registrarse a un evento.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "attendee_name": "Juan Pérez",
  "attendee_email": "juan@ejemplo.com",
  "attendee_phone": "+573001234567",
  "dietary_restrictions": "Vegetariano",
  "special_requirements": "Acceso para silla de ruedas"
}
```

**Response (201):**
```json
{
  "id": 1,
  "event_id": 1,
  "user_id": 1,
  "status": "registered",
  "registration_date": "2024-03-15T10:00:00Z",
  "confirmation_code": "EVT-2024-001"
}
```

#### GET /events/{event_id}/registrations
Obtener registros de un evento (solo organizador).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "event_id": 1,
  "total_registrations": 350,
  "registrations": [
    {
      "id": 1,
      "attendee_name": "Juan Pérez",
      "attendee_email": "juan@ejemplo.com",
      "status": "registered",
      "registration_date": "2024-03-15T10:00:00Z"
    }
  ]
}
```

### 🎤 Sesiones

#### GET /events/{event_id}/sessions
Obtener sesiones de un evento.

**Response (200):**
```json
{
  "event_id": 1,
  "sessions": [
    {
      "id": 1,
      "title": "Introducción a React",
      "description": "Aprende los fundamentos de React",
      "start_time": "2024-03-15T10:00:00Z",
      "end_time": "2024-03-15T11:30:00Z",
      "speaker": "María González",
      "room": "Sala A",
      "capacity": 50,
      "registered_attendees": 35
    }
  ]
}
```

#### POST /events/{event_id}/sessions
Crear nueva sesión (solo organizador).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Nueva Sesión",
  "description": "Descripción de la sesión",
  "start_time": "2024-03-15T14:00:00Z",
  "end_time": "2024-03-15T15:30:00Z",
  "speaker": "Carlos Rodríguez",
  "room": "Sala B",
  "capacity": 40
}
```

**Response (201):**
```json
{
  "id": 2,
  "title": "Nueva Sesión",
  "description": "Descripción de la sesión",
  "start_time": "2024-03-15T14:00:00Z",
  "end_time": "2024-03-15T15:30:00Z",
  "speaker": "Carlos Rodríguez",
  "room": "Sala B",
  "capacity": 40,
  "created_at": "2024-03-15T10:00:00Z"
}
```

## 📊 Códigos de Estado HTTP

- **200 OK**: Solicitud exitosa
- **201 Created**: Recurso creado exitosamente
- **204 No Content**: Solicitud exitosa sin contenido
- **400 Bad Request**: Datos de entrada inválidos
- **401 Unauthorized**: No autenticado
- **403 Forbidden**: No autorizado
- **404 Not Found**: Recurso no encontrado
- **422 Unprocessable Entity**: Datos de validación incorrectos
- **500 Internal Server Error**: Error interno del servidor

## 🔍 Filtros y Búsqueda

### Filtros de Eventos

Los eventos pueden filtrarse usando los siguientes parámetros:

```bash
GET /events?title=tecnología&location=bogotá&date_from=2024-03-01&date_to=2024-03-31
```

### Ordenamiento

```bash
GET /events?sort_by=start_date&order=asc
GET /events?sort_by=price&order=desc
```

### Paginación

```bash
GET /events?page=2&size=20
```

## 📝 Ejemplos de Uso

### Ejemplo: Crear y Registrar a un Evento

```bash
# 1. Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@ejemplo.com", "password": "contraseña123"}'

# 2. Crear evento
curl -X POST http://localhost:8000/events \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Workshop de React",
    "description": "Aprende React desde cero",
    "start_date": "2024-04-15T10:00:00Z",
    "location": "Universidad Nacional",
    "capacity": 50,
    "price": 50000
  }'

# 3. Registrarse al evento
curl -X POST http://localhost:8000/events/1/register \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "attendee_name": "Juan Pérez",
    "attendee_email": "juan@ejemplo.com",
    "attendee_phone": "+573001234567"
  }'
```

## 🛡️ Seguridad

### Rate Limiting

- **Autenticación**: 5 intentos por minuto
- **API General**: 100 requests por minuto por IP
- **Creación de eventos**: 10 eventos por hora por usuario

### Validación de Datos

Todos los endpoints incluyen validación de datos usando Pydantic:

- Validación de formato de email
- Validación de fechas
- Validación de números de teléfono
- Validación de capacidad y precios

### CORS

La API está configurada para permitir requests desde:

```
http://localhost:3000
https://miseventos.com
```

## 📈 Webhooks

La API soporta webhooks para notificaciones en tiempo real:

### POST /webhooks/event-registration

```json
{
  "event": "registration_created",
  "data": {
    "event_id": 1,
    "user_id": 1,
    "registration_id": 1
  },
  "timestamp": "2024-03-15T10:00:00Z"
}
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno

```env
DATABASE_URL=postgresql://user:password@localhost/miseventos
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### Ejecutar en Desarrollo

```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
alembic upgrade head

# Ejecutar servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 Recursos Adicionales

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`

---

**Documentación generada automáticamente con FastAPI**
