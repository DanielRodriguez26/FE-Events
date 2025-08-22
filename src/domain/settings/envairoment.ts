// import { getEnvironments } from '../../helpers/get-environments.helper';
import { BACKEND_ENDPOINTS } from './backend.config';

// Configuración de variables de entorno y endpoints
// Centraliza todas las URLs y configuraciones de la aplicación

// URL base del servidor de desarrollo
// Punto de entrada principal para las peticiones HTTP
const ENDPOINT = 'http://127.0.0.1:5173/'

// Configuración de microservicios
// Define las rutas específicas para cada servicio de la API
const MICROSERVICES = {
	event: BACKEND_ENDPOINTS.events, // Endpoint para obtener eventos desde el backend
};

export { MICROSERVICES, ENDPOINT };