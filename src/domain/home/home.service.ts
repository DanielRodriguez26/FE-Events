import { get } from '../settings/http.service';
import { MICROSERVICES } from '../settings/environment';
import type { IPaginatedEventsResponse } from './home.interface';

// Extracción de la URL del microservicio de eventos desde la configuración
const { event: _event } = MICROSERVICES;
const event = `${_event}`;

// Función para obtener todos los eventos desde la API
// Retorna una promesa con la respuesta paginada de eventos
const getAllEvents = async (page: number = 1, size: number = 6): Promise<IPaginatedEventsResponse> => {
	console.log('🔍 Intentando cargar eventos desde:', event, 'página:', page, 'tamaño:', size);

	try {
		// Realiza la petición GET al endpoint de eventos con parámetros de paginación
		const res = get<IPaginatedEventsResponse>({
			url: `?page=${page}&size=${size}`, // Agregar parámetros de paginación
			baseURL: event, // Usamos la URL completa del backend
		});

		// Espera la respuesta
		const json = await res;
		console.log('✅ Eventos cargados exitosamente:', json);
		return json;
	} catch (error) {
		console.error('❌ Error al cargar eventos:', error);
		throw error;
	}
};

// Objeto que exporta todos los servicios del módulo home
// Centraliza todas las funciones de comunicación con la API
const homeServices = {
	getAllEvents, // Función para obtener todos los eventos
};

export { homeServices };
